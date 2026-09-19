import assert from 'node:assert/strict';
import { appendFile } from 'node:fs/promises';

import { selectRecoveryArtifacts } from './release-recovery-artifacts.mjs';

const runId = process.env.RECOVERY_RUN_ID;
const sha = process.env.CANDIDATE_SHA;
assert.match(runId ?? '', /^\d+$/);
assert.match(sha ?? '', /^[a-f0-9]{40}$/);
const get = async (suffix) => {
  const response = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/${suffix}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GH_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    },
  );
  if (!response.ok) throw new Error(`GitHub recovery lookup: ${response.status}`);
  return response.json();
};
const run = await get(`actions/runs/${runId}`);
assert.equal(run.head_sha, sha);
assert.equal(run.head_branch, 'master');
assert.equal(run.path, '.github/workflows/publish.yml');
const { jobs } = await get(`actions/runs/${runId}/jobs?per_page=100`);
for (const name of ['Quality and package verification', 'Pack and verify original tarballs']) {
  assert.ok(
    jobs.some((job) => job.name === name && job.conclusion === 'success'),
    `${name} has no successful evidence`,
  );
}
const { artifacts } = await get(`actions/runs/${runId}/artifacts?per_page=100`);
for (const [key, id] of selectRecoveryArtifacts(artifacts)) {
  await appendFile(process.env.GITHUB_OUTPUT, `${key}=${id}\n`);
}
