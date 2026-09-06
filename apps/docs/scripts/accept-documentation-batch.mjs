import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import {
  root,
  loadBatches,
  fingerprint,
  splitBatchReport,
  reportCases,
  sha256,
  acceptedBatch,
} from './documentation-evidence.mjs';
import { batchInputs, preflightBatch } from './documentation-inputs.mjs';
import {
  prepareAcceptance,
  assertPreparationCurrent,
  timedRunner,
  runBrowserMatrices,
} from './documentation-pipeline.mjs';

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
const timingFile = resolve(root, 'apps/docs/test-results/acceptance-timing.json');
const reportFile = resolve(root, 'apps/docs/test-results/batches.json');
const stages = [];
const run = timedRunner(stages);
const startedAt = new Date().toISOString();
const started = performance.now();
let status = 'failed';
let browserReport;
try {
  const before = new Map(
    await Promise.all(selected.map(async (batch) => [batch.id, await fingerprint(batch)])),
  );
  const buildBefore = await fingerprint(buildInputs);
  const preparation = {};
  const checks = await prepareAcceptance(run, { stages, preparation });
  if ((await fingerprint(buildInputs)) !== buildBefore)
    throw new Error('构建输入发生变化，停止验收。请稳定源码后重跑。');
  await rm(reportFile, { force: true });
  runBrowserMatrices(selected, reportFile, resolve(root, 'apps/docs/test-results/batches'), run);
  await assertPreparationCurrent(preparation);
  browserReport = JSON.parse(await readFile(reportFile, 'utf8'));
  const completed = splitBatchReport(browserReport, selected).map(({ batch, report }) => ({
    batch,
    compressed: gzipSync(JSON.stringify(report)),
  }));
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
  run(['exec', 'node', 'scripts/prepare-coverage.mjs']);
  console.log(
    `已验收 ${completed.map(({ batch }) => batch.id).join('、')}；共享一次公开包、主题、站点构建、类型检查与浏览器运行。`,
  );

  status = 'passed';
} finally {
  let slowestTests = [];
  let browserSummary;
  // A failed Playwright run can still provide useful diagnostic timings.
  try {
    // Successful reports contain hundreds of MB of image/style attachments. Reuse
    // the parsed report instead of loading and parsing the same bytes a second time.
    const report = browserReport ?? JSON.parse(await readFile(reportFile, 'utf8'));
    if (report.stats?.startTime >= startedAt) {
      const cases = reportCases(report);
      browserSummary = {
        workers: report.config?.workers,
        cases: cases.length,
        caseFingerprint: sha256(
          JSON.stringify(cases.map(({ file, title }) => [file, title]).sort()),
        ),
        stats: report.stats,
      };
      slowestTests = cases
        .flatMap((test) =>
          test.results.map((result) => ({
            title: test.title,
            file: test.file,
            retry: result.retry,
            status: result.status,
            durationMs: result.duration,
          })),
        )
        .sort((a, b) => b.durationMs - a.durationMs)
        .slice(0, 10);
    }
  } catch (error) {
    if (error.code !== 'ENOENT' && !(error instanceof SyntaxError))
      console.warn('无法读取诊断报告：', error.message);
  }
  await mkdir(resolve(root, 'apps/docs/test-results'), { recursive: true });
  await writeFile(
    timingFile,
    JSON.stringify(
      {
        startedAt,
        status,
        durationMs: Math.round(performance.now() - started),
        batches: selected.map((batch) => batch.id),
        stages,
        browser: browserSummary,
        slowestTests,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(`阶段耗时与最慢用例：${timingFile}`);
}
