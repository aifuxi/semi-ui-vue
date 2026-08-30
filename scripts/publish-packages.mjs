import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { distTagForVersion, NPM_REGISTRY, publicPackages } from './release-packages.mjs';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const pnpmExecPath = process.env.npm_execpath;

if (!pnpmExecPath) {
  throw new Error('release:publish 必须通过 pnpm script 运行，以固定包管理器版本');
}

await import('./verify-release.mjs');
await import('./release-preflight.mjs');

const artifactsRoot = await mkdtemp(path.join(tmpdir(), 'semi-ui-vue-publish-'));

try {
  const artifacts = [];

  for (const packageInfo of publicPackages) {
    const packageRoot = path.join(workspaceRoot, 'packages', packageInfo.directory);
    const manifest = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
    const packOutput = execFileSync(
      process.execPath,
      [pnpmExecPath, 'pack', '--json', `--pack-destination=${artifactsRoot}`],
      { cwd: packageRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] },
    ).trim();
    const parsedPackOutput = JSON.parse(packOutput);
    const packResult = Array.isArray(parsedPackOutput) ? parsedPackOutput[0] : parsedPackOutput;

    if (!packResult?.filename) {
      throw new Error(`${manifest.name} 的 pnpm pack 输出无效`);
    }

    artifacts.push({
      manifest,
      tag: distTagForVersion(manifest.version),
      tarballPath: path.resolve(artifactsRoot, packResult.filename),
    });
  }

  for (const { manifest, tag, tarballPath } of artifacts) {
    process.stdout.write(`发布 ${manifest.name}@${manifest.version} -> ${tag}\n`);
    execFileSync(
      'npm',
      ['publish', tarballPath, '--access=public', `--tag=${tag}`, `--registry=${NPM_REGISTRY}`],
      { cwd: workspaceRoot, stdio: 'inherit' },
    );
  }
} finally {
  await rm(artifactsRoot, { force: true, recursive: true });
}
