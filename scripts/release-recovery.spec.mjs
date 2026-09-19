import { describe, expect, it } from 'vitest';

import { selectRecoveryArtifacts } from './release-recovery-artifacts.mjs';

const artifact = (name, id, expired = false) => ({ name, id, expired });

describe('release recovery artifacts', () => {
  it('解析当前 changesets action 的产物名（计划为 publish-plan.json）', () => {
    const selection = selectRecoveryArtifacts([
      artifact('publish-plan.json', 11),
      artifact('release-evidence', 22),
      artifact('changeset-pack-1789780903962', 33),
      artifact('public-dist', 44),
    ]);

    expect([...selection]).toEqual([
      ['pack', 33],
      ['evidence', 22],
      ['plan', 11],
    ]);
  });

  it('兼容历史计划前缀并忽略已过期产物', () => {
    const selection = selectRecoveryArtifacts([
      artifact('changeset-publish-plan-42', 7),
      artifact('release-evidence', 8, true),
      artifact('release-evidence', 9),
      artifact('changeset-pack-1', 10),
    ]);

    expect(selection.get('plan')).toBe(7);
    expect(selection.get('evidence')).toBe(9);
    expect(selection.get('pack')).toBe(10);
  });

  it('缺失或重复时给出可排查的报错', () => {
    expect(() =>
      selectRecoveryArtifacts([artifact('release-evidence', 1), artifact('changeset-pack-1', 2)]),
    ).toThrow(/Expected one unexpired plan artifact, found 0/);
    expect(() =>
      selectRecoveryArtifacts([
        artifact('publish-plan.json', 1),
        artifact('publish-plan.json', 2),
        artifact('release-evidence', 3),
        artifact('changeset-pack-1', 4),
      ]),
    ).toThrow(/rerun ambiguity/);
  });
});
