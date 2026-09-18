import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import semver from 'semver';
import { publicPackages, NPM_REGISTRY } from './public-packages.mjs';
import { inspectPackedRelease, integrity } from './packed-release.mjs';

export async function registryState(name) {
  const response = await fetch(`${NPM_REGISTRY}${encodeURIComponent(name)}`, {
    signal: AbortSignal.timeout(30000),
  });
  if (response.status === 404) return { versions: {}, 'dist-tags': {} };
  if (!response.ok) throw new Error(`${name}: registry returned ${response.status}`);
  return response.json();
}

export async function captureEvidence(packDir) {
  const tarballs = await inspectPackedRelease(packDir);
  const sha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (process.env.CANDIDATE_SHA) assert.equal(sha, process.env.CANDIDATE_SHA);
  const packages = [];
  for (const { name, directory } of publicPackages) {
    const packed = tarballs.get(name);
    const source = JSON.parse(await readFile(`packages/${directory}/package.json`, 'utf8'));
    assert.equal(packed.manifest.version, source.version);
    assert.ok(semver.gte(source.version, '1.0.0-0'), 'Migration baseline must never be published');
    for (const dependency of publicPackages) {
      if (source.dependencies?.[dependency.name])
        assert.equal(packed.manifest.dependencies[dependency.name], source.version);
    }
    packages.push({
      name,
      version: source.version,
      integrity: packed.integrity,
      dependencies: Object.fromEntries(
        publicPackages
          .filter((dependency) => source.dependencies?.[dependency.name])
          .map((dependency) => [dependency.name, source.version]),
      ),
    });
  }
  assert.equal(new Set(packages.map((pkg) => pkg.version)).size, 1);
  const version = packages[0].version;
  const pre = semver.prerelease(version);
  let tag = 'latest';
  if (pre) {
    const state = JSON.parse(await readFile('.changeset/pre.json', 'utf8'));
    assert.equal(state.mode, 'pre');
    assert.equal(state.tag, 'next');
    assert.equal(pre[0], state.tag);
    tag = state.tag;
  }
  // Assert the CLI's policy; never derive or change release selection here.
  const planBytes = await readFile(path.join(packDir, 'publish-plan.json'));
  const plan = JSON.parse(planBytes);
  assert.equal(plan.version, 1);
  const entries = plan.plan.flat();
  assert.deepEqual(entries.map(({ name }) => name).sort(), packages.map(({ name }) => name).sort());
  for (const entry of entries) {
    assert.equal(entry.kind, 'publish');
    assert.equal(entry.version, version);
    assert.equal(entry.tag, tag);
    assert.equal(entry.access, 'public');
    const tarball = tarballs.get(entry.name);
    assert.equal(path.resolve(packDir, entry.tarball.path), tarball.filename);
    assert.equal(
      entry.tarball.integrity,
      `sha256-${createHash('sha256')
        .update(await readFile(tarball.filename))
        .digest('base64')}`,
    );
  }
  return {
    schema: 1,
    sha,
    tag,
    planIntegrity: integrity(planBytes),
    packages,
  };
}

export async function guardRegistry(evidence) {
  for (const expected of evidence.packages) {
    const state = await registryState(expected.name);
    const existing = state.versions[expected.version];
    if (existing)
      assert.equal(
        existing.dist.integrity,
        expected.integrity,
        `${expected.name}: existing version differs from verified tarball`,
      );
    const channelVersion = state['dist-tags'][evidence.tag];
    if (channelVersion)
      assert.ok(
        !semver.gt(channelVersion, expected.version),
        `${expected.name}: refusing to roll back ${evidence.tag}`,
      );
  }
}

if (process.argv[1] && path.basename(process.argv[1]) === 'release-evidence.mjs') {
  const [mode, packDir, evidenceFile] = process.argv.slice(2);
  if (!['capture', 'verify', 'guard'].includes(mode) || !packDir || !evidenceFile)
    throw new Error('Expected capture|verify|guard PACK_DIR EVIDENCE_FILE');
  if (mode === 'capture') {
    const evidence = await captureEvidence(packDir);
    await guardRegistry(evidence);
    await writeFile(evidenceFile, `${JSON.stringify(evidence, null, 2)}\n`);
  } else {
    const evidence = JSON.parse(await readFile(evidenceFile, 'utf8'));
    assert.deepEqual(
      await captureEvidence(packDir),
      evidence,
      'Candidate or artifact identity changed',
    );
    if (mode === 'guard') await guardRegistry(evidence);
  }
}
