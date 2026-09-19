import assert from 'node:assert/strict';

// 固定的 changesets action 把发布计划上传为 `publish-plan.json`；更早的 run 使用
// `changeset-publish-plan-*` 前缀。两者都接受，恢复才能解析任一发布 run 的产物。
export const recoveryArtifactMatchers = [
  ['pack', (name) => name.startsWith('changeset-pack-')],
  ['evidence', (name) => name.startsWith('release-evidence')],
  ['plan', (name) => name.startsWith('changeset-publish-plan-') || name === 'publish-plan.json'],
];

export function selectRecoveryArtifacts(artifacts) {
  const selection = new Map();
  for (const [key, matches] of recoveryArtifactMatchers) {
    const found = artifacts.filter(
      (artifact) => !artifact.expired && matches(String(artifact.name ?? '')),
    );
    assert.equal(
      found.length,
      1,
      `Expected one unexpired ${key} artifact, found ${found.length} among [${artifacts
        .map((artifact) => artifact.name)
        .join(', ')}]; rerun ambiguity requires explicit investigation`,
    );
    selection.set(key, found[0].id);
  }
  return selection;
}
