import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { test } from 'node:test';
import { publicPackages } from './public-packages.mjs';
import { inspectPackedRelease } from './packed-release.mjs';
import { prepareRecovery } from './prepare-release-recovery.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
test(
  '真实 CLI 使用原始 tarball 恢复部分发布，重复执行不覆盖版本，补建包级标签',
  { timeout: 120000 },
  async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'semi-registry-'));
    const socket = createServer();
    socket.listen(0, '127.0.0.1');
    await once(socket, 'listening');
    const port = socket.address().port;
    await new Promise((resolve) => socket.close(resolve));
    const registry = `http://127.0.0.1:${port}`;
    const env = {
      ...process.env,
      npm_config_manage_package_manager_versions: 'false',
      npm_config_registry: registry,
      npm_config_userconfig: path.join(cwd, '.npmrc'),
      npm_config_cache: path.join(cwd, 'cache'),
      npm_config_provenance: 'false',
    };
    delete env.NODE_AUTH_TOKEN;
    delete env.NPM_TOKEN;
    let server;
    const cli = (...args) =>
      execFileSync(
        process.execPath,
        [path.join(root, 'node_modules/@changesets/cli/bin.js'), ...args],
        { cwd, env, encoding: 'utf8', stdio: 'pipe' },
      );
    const start = async (denyUi) => {
      await writeFile(
        path.join(cwd, 'registry.yaml'),
        `storage: ${cwd}/storage\nauth:\n  htpasswd:\n    file: ${cwd}/htpasswd\nuplinks: {}\npackages:\n  '@aifuxi/semi-ui-vue':\n    access: $all\n    publish: ${denyUi ? '$authenticated' : '$all'}\n  '**':\n    access: $all\n    publish: $all\nlog: { type: stdout, format: pretty, level: error }\n`,
      );
      server = spawn(
        process.execPath,
        [
          path.join(root, 'node_modules/verdaccio/bin/verdaccio'),
          '-c',
          path.join(cwd, 'registry.yaml'),
          '-l',
          `127.0.0.1:${port}`,
        ],
        { cwd, env, stdio: 'ignore' },
      );
      for (let i = 0; i < 100; i++) {
        try {
          if ((await fetch(`${registry}/-/ping`)).ok) return;
        } catch {
          /* Wait for this isolated registry to listen. */
        }
        if (server.exitCode !== null) throw new Error('Test registry exited before readiness');
        await delay(100);
      }
      throw new Error('Test registry startup timeout');
    };
    const stop = async () => {
      if (server && server.exitCode === null) {
        server.kill('SIGTERM');
        await once(server, 'exit');
      }
    };
    try {
      await mkdir(path.join(cwd, '.changeset'));
      const config = JSON.parse(await readFile(path.join(root, '.changeset/config.json'), 'utf8'));
      config.changelog = false;
      await writeFile(path.join(cwd, '.changeset/config.json'), JSON.stringify(config));
      assert.equal(
        execFileSync('pnpm', ['--version'], { cwd: root, encoding: 'utf8' }).trim(),
        '12.3.4',
      );
      // The pinned binary is checked above. A test registry intentionally cannot serve pnpm itself.
      await writeFile(
        path.join(cwd, 'package.json'),
        JSON.stringify({ name: 'registry-probe', private: true }),
      );
      await writeFile(path.join(cwd, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n');
      await writeFile(
        path.join(cwd, '.npmrc'),
        `registry=${registry}\n//127.0.0.1:${port}/:_authToken=local-test-only\nstore-dir=${cwd}/store\n`,
      );
      for (const { name, directory } of publicPackages) {
        const dir = path.join(cwd, 'packages', directory);
        await mkdir(dir, { recursive: true });
        await writeFile(
          path.join(dir, 'package.json'),
          JSON.stringify({
            name,
            version: '1.0.0-next.0',
            type: 'module',
            exports: './index.js',
            publishConfig: { access: 'public', registry },
            ...(directory === 'ui'
              ? { dependencies: { '@aifuxi/semi-icons-vue': 'workspace:*' } }
              : {}),
          }),
        );
        await writeFile(path.join(dir, 'index.js'), 'export const value = 42;\n');
      }
      await mkdir(path.join(cwd, 'packages/private'));
      await writeFile(
        path.join(cwd, 'packages/private/package.json'),
        JSON.stringify({ name: '@workspace/private', private: true, version: '1.0.0' }),
      );
      execFileSync('git', ['init', '-b', 'master'], { cwd });
      execFileSync('git', ['config', 'user.name', 'Probe'], { cwd });
      execFileSync('git', ['config', 'user.email', 'probe@example.invalid'], { cwd });
      execFileSync('git', ['add', '.'], { cwd });
      execFileSync(
        'git',
        [
          '-c',
          'user.name=Probe',
          '-c',
          'user.email=probe@example.invalid',
          'commit',
          '-m',
          'fixture',
        ],
        { cwd },
      );
      cli('pre', 'enter', 'next');
      await start(true);
      execFileSync('pnpm', ['install', '--ignore-scripts'], { cwd, env, stdio: 'pipe' });
      cli('pack', '--out-dir', 'packed');
      const packed = await inspectPackedRelease(path.join(cwd, 'packed'));
      const capture = () =>
        JSON.parse(
          execFileSync(
            process.execPath,
            [
              '--input-type=module',
              '-e',
              `import { captureEvidence } from ${JSON.stringify(pathToFileURL(path.join(root, 'scripts/release-evidence.mjs')).href)}; console.log(JSON.stringify(await captureEvidence('packed')));`,
            ],
            {
              cwd,
              env: {
                ...env,
                CANDIDATE_SHA: execFileSync('git', ['rev-parse', 'HEAD'], {
                  cwd,
                  encoding: 'utf8',
                }).trim(),
              },
              encoding: 'utf8',
              stdio: 'pipe',
            },
          ),
        );
      assert.equal(capture().tag, 'next');
      const planFile = path.join(cwd, 'packed/publish-plan.json');
      const originalPlan = await readFile(planFile, 'utf8');
      const wrongPlan = JSON.parse(originalPlan);
      wrongPlan.plan[0][0].tag = 'latest';
      await writeFile(planFile, JSON.stringify(wrongPlan));
      assert.throws(capture, 'A plan must never silently change the other channel');
      await writeFile(planFile, originalPlan);
      assert.equal(
        packed.get('@aifuxi/semi-ui-vue').manifest.dependencies['@aifuxi/semi-icons-vue'],
        '1.0.0-next.0',
      );
      assert.throws(() => cli('publish', '--from-pack-dir', 'packed'));
      const existing = await Promise.all(
        publicPackages.map(
          async ({ name }) => (await fetch(`${registry}/${encodeURIComponent(name)}`)).ok,
        ),
      );
      assert.ok(
        existing.some(Boolean) && existing.some((value) => !value),
        'must actually publish only a subset',
      );
      await stop();
      await start(false);
      // Preserve the real incompatibility: unchanged plans are not idempotent with Verdaccio.
      assert.throws(() => cli('publish', '--from-pack-dir', 'packed'));
      const recover = async (directory) => {
        await prepareRecovery(
          path.join(cwd, 'packed'),
          path.join(cwd, directory),
          path.join(root, 'node_modules/@changesets/cli/bin.js'),
          cwd,
          env,
        );
        cli('publish', '--from-pack-dir', directory);
      };
      await recover('recovery');
      await recover('repeat');
      for (const { name } of publicPackages) {
        const data = await (await fetch(`${registry}/${encodeURIComponent(name)}`)).json();
        assert.deepEqual(Object.keys(data.versions), ['1.0.0-next.0']);
        assert.equal(data['dist-tags'].next, '1.0.0-next.0');
        assert.equal(data.versions['1.0.0-next.0'].dist.integrity, packed.get(name).integrity);
      }
      const tags = execFileSync('git', ['tag'], { cwd, encoding: 'utf8' }).trim().split('\n');
      assert.equal(tags.length, 5);
      assert.ok(tags.every((tag) => tag.startsWith('@aifuxi/')));
      execFileSync('git', ['tag', '-d', ...tags], { cwd });
      execFileSync('git', ['config', 'tag.gpgSign', 'true'], { cwd });
      execFileSync('git', ['config', 'gpg.program', 'false'], { cwd });
      // CLI 3.0.2 ignores git.tag's false return: success output is not proof of a ref.
      cli('git-tag');
      assert.equal(execFileSync('git', ['tag'], { cwd, encoding: 'utf8' }).trim(), '');
      execFileSync('git', ['config', 'tag.gpgSign', 'false'], { cwd });
      cli('git-tag');
      assert.deepEqual(
        execFileSync('git', ['tag'], { cwd, encoding: 'utf8' }).trim().split('\n'),
        tags,
      );
    } finally {
      await stop();
      await rm(cwd, { recursive: true, force: true });
    }
  },
);
