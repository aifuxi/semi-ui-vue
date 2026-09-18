import assert from 'node:assert/strict';
import { test } from 'node:test';
import { verifyReleaseMetadata } from './release-metadata.mjs';

test('发布后必须存在指向原候选的实际包级标签与非草稿 Release', async () => {
  const evidence = {
    sha: 'a'.repeat(40),
    packages: [{ name: '@aifuxi/semi-ui-vue', version: '1.0.0-next.0' }],
  };
  const get = async (suffix) => {
    if (suffix.startsWith('git/ref/')) return { object: { type: 'tag', sha: 'b'.repeat(40) } };
    if (suffix.startsWith('git/tags/')) return { object: { type: 'commit', sha: evidence.sha } };
    return {
      tag_name: '@aifuxi/semi-ui-vue@1.0.0-next.0',
      draft: false,
      prerelease: true,
      html_url: 'https://github.com/aifuxi/semi-ui-vue/releases',
    };
  };
  assert.equal((await verifyReleaseMetadata(evidence, get)).length, 1);
  await assert.rejects(
    verifyReleaseMetadata(evidence, async (suffix) =>
      suffix.startsWith('git/tags/')
        ? { object: { type: 'commit', sha: 'c'.repeat(40) } }
        : get(suffix),
    ),
    /wrong candidate/,
  );
  await assert.rejects(
    verifyReleaseMetadata(evidence, async (suffix) => {
      if (suffix.startsWith('releases/')) throw new Error('404');
      return get(suffix);
    }),
    /404/,
  );
  await assert.rejects(
    verifyReleaseMetadata(evidence, async (suffix) =>
      suffix.startsWith('releases/') ? { ...(await get(suffix)), draft: true } : get(suffix),
    ),
  );
});
