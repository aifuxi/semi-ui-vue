import { mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadBatches, root, fingerprint } from './documentation-evidence.mjs';
import { preflightBatch } from './documentation-inputs.mjs';
import {
  diagnosticArguments,
  diagnosticSelection,
  exactTitlePattern,
} from './documentation-diagnostics.mjs';
import {
  prepareAcceptance,
  assertPreparationCurrent,
  timedRunner,
} from './documentation-pipeline.mjs';

const options = diagnosticArguments(process.argv.slice(2), await loadBatches());
for (const batch of options.batches) await preflightBatch(batch);
const titles = diagnosticSelection(options.batches, options.grep);
console.log(
  options.prepareOnly
    ? `准备并校验 ${options.batches.map((batch) => batch.id).join('、')} 的构建产物。`
    : `诊断 ${titles.length} 项（不生成 accepted）：\n${titles.join('\n')}`,
);
if (options.plan) process.exit(0);

const stages = [];
const startedAt = new Date().toISOString();
const started = performance.now();
const run = timedRunner(stages);
let status = 'failed';
try {
  const before = await Promise.all(options.batches.map((batch) => fingerprint(batch)));
  const preparation = {};
  await prepareAcceptance(run, { stages, preparation });
  if (!options.prepareOnly) {
    const report = resolve(root, 'apps/docs/test-results/diagnostic.json');
    await rm(report, { force: true });
    run(
      [
        'exec',
        'playwright',
        'test',
        '-c',
        'playwright.nuxt.config.ts',
        ...options.batches.map((batch) => batch.spec),
        '--grep',
        exactTitlePattern(titles),
        '--retries=0',
        '--max-failures=1',
        '--reporter=list,json',
        `--output=${resolve(root, 'apps/docs/test-results/diagnostic')}`,
      ],
      { DOCS_ACCEPTANCE: '1', PLAYWRIGHT_JSON_OUTPUT_NAME: report },
    );
  }
  await assertPreparationCurrent(preparation);
  for (const [i, batch] of options.batches.entries())
    if ((await fingerprint(batch)) !== before[i])
      throw new Error(`${batch.id} 在诊断期间源码发生变化。`);
  status = 'passed';
} finally {
  const directory = resolve(root, 'apps/docs/test-results');
  await mkdir(directory, { recursive: true });
  await writeFile(
    resolve(directory, 'diagnostic-timing.json'),
    JSON.stringify(
      {
        startedAt,
        status,
        durationMs: Math.round(performance.now() - started),
        batches: options.batches.map((batch) => batch.id),
        prepareOnly: options.prepareOnly,
        tests: options.prepareOnly ? [] : titles,
        stages,
      },
      null,
      2,
    ) + '\n',
  );
}
