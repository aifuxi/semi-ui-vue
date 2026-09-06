import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import {
  root,
  loadBatches,
  fingerprint,
  validateReport,
  sha256,
  acceptedBatch,
} from './documentation-evidence.mjs';
import { batchInputs, preflightBatch } from './documentation-inputs.mjs';
import { prepareAcceptance, runDocs } from './documentation-pipeline.mjs';

const args = process.argv.slice(2);
const all = await loadBatches();
const ids = args.filter((arg) => !arg.startsWith('--'));
if (
  args.some((arg) => arg.startsWith('--') && !['--affected', '--plan'].includes(arg)) ||
  ids.some((id) => !all.some((batch) => batch.id === id)) ||
  (!ids.length && !args.includes('--affected'))
)
  throw new Error(
    '用法：accept:nuxt:batch <批次...> [--affected] [--plan]。--affected 追加所有证据失效的批次。',
  );
const selected = [];
for (const batch of all) {
  if (!ids.includes(batch.id) && !args.includes('--affected')) continue;
  await preflightBatch(batch);
  if (await acceptedBatch(batch)) {
    console.log(`${batch.id}: 证据有效，跳过构建和浏览器验收。`);
    continue;
  }
  const inputs = await batchInputs(batch);
  console.log(
    `${batch.id}: 待验收，${inputs.files.length} 个源码输入${inputs.fallback.length ? `；保守扩展：${inputs.fallback.join('；')}` : ''}`,
  );
  selected.push(batch);
}
if (args.includes('--plan') || !selected.length) process.exit(0);

// Freeze every build input, including unrelated demos compiled into the static site.
// Source changes during a run must not certify stale generated output.
const buildInputs = {
  inputs: [
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'package.json',
    'tsconfig*.json',
    'packages',
    'scripts',
    'apps/docs/package.json',
    'apps/docs/*.ts',
    'apps/docs/scripts',
    'apps/docs/content',
    'apps/docs/src',
    // Derived registries legitimately change when preparation discovers new demos/pages.
    // Their source content and generators remain frozen above.
    ':(exclude)apps/docs/src/data/demos.json',
    ':(exclude)apps/docs/src/data/pages.json',
    ':(exclude)apps/docs/src/data/tokens.json',
    'apps/docs/public/theme.js',
    'apps/docs/public/demos',
    'apps/docs/tests',
    'apps/reference-react',
    'tests/browser',
    'docs/documentation/batches',
    'docs/documentation/mappings',
  ],
};
const before = new Map(
  await Promise.all(selected.map(async (batch) => [batch.id, await fingerprint(batch)])),
);
const buildBefore = await fingerprint(buildInputs);
const checks = prepareAcceptance();
const completed = [];
for (const batch of selected) {
  if ((await fingerprint(buildInputs)) !== buildBefore)
    throw new Error('构建输入发生变化，停止验收。请稳定源码后重跑。');
  const reportFile = resolve(root, 'apps/docs/test-results', `batch-${batch.id}.json`);
  runDocs(
    [
      'exec',
      'playwright',
      'test',
      '-c',
      'playwright.nuxt.config.ts',
      batch.spec,
      '--reporter=json',
      `--output=${resolve(root, 'apps/docs/test-results', `batch-${batch.id}`)}`,
    ],
    { DOCS_ACCEPTANCE: '1', PLAYWRIGHT_JSON_OUTPUT_NAME: reportFile },
  );
  const report = await readFile(reportFile);
  if (!validateReport(JSON.parse(report), batch))
    throw new Error('报告缺少完整矩阵、附件，或存在重试/跳过/失败；不计入验收。');
  completed.push({ batch, compressed: gzipSync(report) });
}
if ((await fingerprint(buildInputs)) !== buildBefore)
  throw new Error('验收期间构建输入发生变化；不生成新证据。');
for (const { batch } of completed)
  if ((await fingerprint(batch)) !== before.get(batch.id))
    throw new Error(`验收期间 ${batch.id} 源码发生变化。`);

const directory = resolve(root, 'docs/documentation/evidence');
await mkdir(directory, { recursive: true });
for (const { batch, compressed } of completed) {
  await writeFile(resolve(directory, `${batch.id}.report.json.gz`), compressed);
  await writeFile(
    resolve(directory, `${batch.id}.json`),
    JSON.stringify(
      {
        batch: batch.id,
        fingerprint: before.get(batch.id),
        examples: batch.examples,
        checks,
        reportSha256: sha256(compressed),
        completedAt: new Date().toISOString(),
      },
      null,
      2,
    ) + '\n',
  );
}
// Refresh coverage once after the complete stable batch set; never rehash an old browser report.
runDocs(['exec', 'node', 'scripts/prepare-coverage.mjs']);
console.log(
  `已验收 ${completed.map(({ batch }) => batch.id).join('、')}；共享一次公开包、主题、站点构建和类型检查。`,
);
