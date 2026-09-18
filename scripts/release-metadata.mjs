import assert from 'node:assert/strict';

async function getGithub(suffix) {
  const response = await fetch(`https://api.github.com/repos/aifuxi/semi-ui-vue/${suffix}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(process.env.GH_TOKEN ? { Authorization: `Bearer ${process.env.GH_TOKEN}` } : {}),
    },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`Release metadata ${suffix}: ${response.status}`);
  return response.json();
}

// Check actual refs and releases: CLI 3.0.2 can report tag success after git fails.
export async function verifyReleaseMetadata(evidence, get = getGithub) {
  const results = [];
  for (const { name, version } of evidence.packages) {
    const tag = `${name}@${version}`;
    let { object } = await get(`git/ref/tags/${encodeURIComponent(tag)}`);
    if (object.type === 'tag') ({ object } = await get(`git/tags/${object.sha}`));
    assert.equal(object.type, 'commit');
    assert.equal(object.sha, evidence.sha, `${tag}: wrong candidate`);
    const release = await get(`releases/tags/${encodeURIComponent(tag)}`);
    assert.equal(release.tag_name, tag);
    assert.equal(release.draft, false);
    assert.equal(release.prerelease, version.includes('-'));
    results.push({ tag, sha: object.sha, url: release.html_url });
  }
  return results;
}
