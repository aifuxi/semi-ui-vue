import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { registryState } from './release-evidence.mjs';
import { publicPackages, NPM_REGISTRY } from './public-packages.mjs';
import { verifyReleaseMetadata } from './release-metadata.mjs';

const evidence = JSON.parse(await readFile(process.argv[2] ?? 'release-evidence.json', 'utf8'));
assert.deepEqual(
  evidence.packages.map(({ name }) => name).sort(),
  publicPackages.map(({ name }) => name).sort(),
);
const results = [];
try {
  for (const expected of evidence.packages) {
    let state;
    for (let attempt = 0; attempt < 4; attempt++) {
      state = await registryState(expected.name);
      if (state.versions[expected.version] && state['dist-tags'][evidence.tag] === expected.version)
        break;
      if (attempt < 3) {
        process.stdout.write(
          `${expected.name}: waiting for registry metadata propagation (${attempt + 1}/3)\n`,
        );
        await delay(5000);
      }
    }
    const manifest = state.versions[expected.version];
    assert.ok(manifest, `${expected.name}: version missing`);
    assert.equal(manifest.dist.integrity, expected.integrity);
    assert.equal(state['dist-tags'][evidence.tag], expected.version);
    if (expected.name === '@aifuxi/semi-ui-vue') {
      assert.equal(manifest.dependencies?.['@aifuxi/semi-icons-vue'], expected.version);
    }
    for (const { name } of publicPackages) {
      assert.equal(
        manifest.dependencies?.[name],
        expected.dependencies?.[name],
        `${expected.name}: registry dependencies differ from verified tarball`,
      );
      if (manifest.dependencies?.[name])
        assert.equal(manifest.dependencies[name], expected.version);
    }
    assert.equal(
      manifest.dist.attestations?.provenance?.predicateType,
      'https://slsa.dev/provenance/v1',
    );
    const attestationUrl = new URL(manifest.dist.attestations.url);
    assert.equal(attestationUrl.origin, new URL(NPM_REGISTRY).origin);
    const response = await fetch(attestationUrl, { signal: AbortSignal.timeout(30000) });
    assert.ok(response.ok, 'Unable to read provenance');
    const attestations = await response.json();
    const provenance = attestations.attestations.find(
      (entry) => entry.predicateType === 'https://slsa.dev/provenance/v1',
    );
    const statement = JSON.parse(
      Buffer.from(provenance.bundle.dsseEnvelope.payload, 'base64').toString('utf8'),
    );
    const definition = statement.predicate.buildDefinition;
    assert.equal(
      definition.externalParameters.workflow.repository,
      'https://github.com/aifuxi/semi-ui-vue',
    );
    assert.equal(definition.externalParameters.workflow.path, '.github/workflows/publish.yml');
    assert.ok(
      definition.resolvedDependencies.some(
        (dependency) => dependency.digest.gitCommit === evidence.sha,
      ),
      'Provenance candidate SHA mismatch',
    );
    const digest = Buffer.from(expected.integrity.slice('sha512-'.length), 'base64').toString(
      'hex',
    );
    assert.ok(
      statement.subject.some((subject) => subject.digest.sha512 === digest),
      'Provenance artifact digest mismatch',
    );
    results.push({ ...expected, tag: evidence.tag, attestations: manifest.dist.attestations });
  }
  const metadata = await verifyReleaseMetadata(evidence);
  const cwd = await mkdtemp(path.join(tmpdir(), 'semi-registry-consumer-'));
  try {
    await writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify({
        private: true,
        type: 'module',
        dependencies: Object.fromEntries([
          ...evidence.packages.map(({ name, version }) => [name, version]),
          ['vue', '3.5.41'],
        ]),
      }),
    );
    execFileSync(
      'npm',
      [
        'install',
        '--ignore-scripts',
        '--registry',
        NPM_REGISTRY,
        '--cache',
        path.join(cwd, 'cache'),
      ],
      { cwd, stdio: 'inherit' },
    );
    execFileSync('npm', ['audit', 'signatures', '--registry', NPM_REGISTRY], {
      cwd,
      stdio: 'inherit',
    });
    for (const { name } of publicPackages.filter(({ type }) => type === 'javascript')) {
      execFileSync(
        process.execPath,
        ['--input-type=module', '-e', `await import(${JSON.stringify(name)})`],
        { cwd, stdio: 'inherit' },
      );
    }
    await writeFile(
      process.argv[3] ?? 'release-postcheck.json',
      `${JSON.stringify({ sha: evidence.sha, packages: results, metadata, registryInstall: true, signatures: true, ssrImport: true }, null, 2)}\n`,
    );
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
} catch (error) {
  await writeFile(
    process.argv[3] ?? 'release-postcheck.json',
    `${JSON.stringify({ sha: evidence.sha, complete: false, packages: results, error: error.message }, null, 2)}\n`,
  );
  throw error;
}
