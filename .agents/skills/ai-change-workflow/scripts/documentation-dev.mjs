import { execFileSync, spawnSync } from 'node:child_process';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  preparationStages,
  runDocs,
  timedRunner,
} from '../../../../apps/docs/scripts/documentation-pipeline.mjs';
import {
  assertPreparationProof,
  cachedPreparationStage,
  contentSnapshot,
} from '../../../../apps/docs/scripts/documentation-preparation-cache.mjs';
import { workspace } from '../../../../apps/docs/scripts/documentation-inputs.mjs';

const cacheDirectory = resolve(workspace, 'apps/docs/.data/documentation-preparation');
const timingFile = resolve(
  workspace,
  'apps/docs/.data/documentation-smoke/development/latest.json',
);

// Keep this byte-for-byte context contract aligned with documentation-pipeline.mjs so
// development and acceptance can safely share the same resources proof.
export async function developmentPreparationContext(root = workspace) {
  const git = (args) =>
    execFileSync('git', ['-C', 'vendor/semi-design', ...args], {
      cwd: root,
      encoding: 'utf8',
    }).trim();
  const baseline = git(['rev-parse', 'HEAD']);
  if (baseline !== 'cdfba6e520fc83ad871b30f51f36d8af3aaa5a21' || git(['status', '--porcelain']))
    throw new Error('开发准备复用要求只读、无修改的 Semi Design v2.102.0 submodule。');
  const envFiles = [];
  for (const directory of ['', 'apps/docs'])
    for (const file of await readdir(resolve(root, directory)))
      if (/^\.env(?:$|\.)/.test(file)) envFiles.push(directory ? `${directory}/${file}` : file);
  return {
    baseline,
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    environment: Object.fromEntries(
      Object.entries(process.env)
        .filter(([key]) =>
          /^(?:NODE_ENV$|NODE_OPTIONS$|NUXT_|NITRO_|VITE_|SOURCE_DATE_EPOCH$|TZ$)/.test(key),
        )
        .sort(),
    ),
    installation: await contentSnapshot(
      ['node_modules/.modules.yaml', 'node_modules/.pnpm/lock.yaml', ...envFiles],
      root,
    ),
  };
}

export async function prepareDocumentationDevelopment(
  run = runDocs,
  {
    root = workspace,
    definitions = preparationStages(root),
    context = () => developmentPreparationContext(root),
    cache = cacheDirectory,
    output = timingFile,
    now = () => performance.now(),
    timestamp = () => new Date().toISOString(),
    log = console.log,
  } = {},
) {
  const resources = definitions.find((stage) => stage.id === 'resources');
  if (!resources) throw new Error('缺少 resources 准备阶段。');
  const commands = [];
  const startedAt = timestamp();
  const started = now();
  const summary = { mode: 'documentation-development', startedAt, status: 'failed', commands };
  const timed = timedRunner(commands, run, now, log);
  try {
    const proofs = {};
    proofs.resources = await cachedPreparationStage(resources, timed, {
      root,
      cacheDirectory: cache,
      context,
      proofs,
      stages: commands,
      log,
    });
    await assertPreparationProof([resources], proofs, { root, context });
    timed(['exec', 'node', 'scripts/prepare-content.mjs']);
    timed(['exec', 'node', 'scripts/prepare-coverage.mjs']);
    summary.status = 'passed';
    return summary;
  } catch (error) {
    summary.error = error instanceof Error ? error.stack || error.message : String(error);
    throw error;
  } finally {
    summary.completedAt = timestamp();
    summary.durationMs = Math.round(now() - started);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, `${JSON.stringify(summary, null, 2)}\n`);
    log(`[开发准备总耗时] ${(summary.durationMs / 1000).toFixed(1)}s (${summary.status})`);
    log(`开发准备计时：${output}`);
  }
}

export function startDocumentationDevelopmentServer({ host = '127.0.0.1', port = '4321' } = {}) {
  const result = spawnSync(
    'pnpm',
    ['--filter', '@workspace/docs', 'exec', 'nuxt', 'dev', '--port', port, '--host', host],
    { cwd: workspace, stdio: 'inherit', env: process.env },
  );
  if (result.error) throw result.error;
  if (result.status !== 0 && !['SIGINT', 'SIGTERM'].includes(result.signal))
    throw new Error(`Nuxt 开发服务退出：${result.status ?? result.signal}`);
}

if (process.argv[1] === import.meta.filename) {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== '--prepare-only'))
    throw new Error('用法：node documentation-dev.mjs [--prepare-only]');
  await prepareDocumentationDevelopment();
  if (!args.includes('--prepare-only')) startDocumentationDevelopmentServer();
}
