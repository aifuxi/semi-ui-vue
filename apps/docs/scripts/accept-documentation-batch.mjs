import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import {
  root,
  loadBatches,
  fingerprint,
  validateReport,
  sha256,
} from './documentation-evidence.mjs';

const id = process.argv[2];
const batch = (await loadBatches()).find((entry) => entry.id === id);
if (!batch) throw new Error(`未知验收批次：${id ?? '(缺少参数)'}。先建立批次矩阵。`);
const before = await fingerprint(batch);
const checks = [];
for (const args of [['build:public-js'], ['--filter', '@aifuxi/semi-theme-default', 'build']]) {
  const result = spawnSync('pnpm', args, { cwd: root, stdio: 'inherit' });
  if (result.error || result.status !== 0) throw new Error('公开包构建失败，停止批次验收。');
}
checks.push('build:public-js', 'build:theme');
function run(args, env = {}) {
  const result = spawnSync('pnpm', ['--filter', '@workspace/docs', ...args], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`批次 ${id} 未通过：pnpm ${args.join(' ')}；不生成新验收记录。`);
}
for (const command of ['build:nuxt', 'typecheck:nuxt', 'check:nuxt:content']) {
  run([command]);
  checks.push(command);
}
const output = resolve(root, 'apps/docs/test-results', `batch-${id}`);
const reportFile = resolve(root, 'apps/docs/test-results', `batch-${id}.json`);
run(
  [
    'exec',
    'playwright',
    'test',
    '-c',
    'playwright.nuxt.config.ts',
    batch.spec,
    '--reporter=json',
    `--output=${output}`,
  ],
  { DOCS_ACCEPTANCE: '1', PLAYWRIGHT_JSON_OUTPUT_NAME: reportFile },
);
const report = await readFile(reportFile);
if (!validateReport(JSON.parse(report), batch))
  throw new Error('报告缺少完整矩阵、附件，或存在重试/跳过/失败；不计入验收。');
const after = await fingerprint(batch);
if (before !== after) throw new Error('验收期间源码发生变化，请重新执行该批次。');
const directory = resolve(root, 'docs/documentation/evidence');
await mkdir(directory, { recursive: true });
const compressed = gzipSync(report);
await writeFile(resolve(directory, `${id}.report.json.gz`), compressed);
await writeFile(
  resolve(directory, `${id}.json`),
  JSON.stringify(
    {
      batch: id,
      fingerprint: after,
      examples: batch.examples,
      checks,
      reportSha256: sha256(compressed),
      completedAt: new Date().toISOString(),
    },
    null,
    2,
  ) + '\n',
);
run(['exec', 'node', 'scripts/prepare-coverage.mjs', `--batch=${id}`]);
console.log(`批次 ${id}：${batch.examples.length} 个上游示例的双语/明暗矩阵已验收。`);
