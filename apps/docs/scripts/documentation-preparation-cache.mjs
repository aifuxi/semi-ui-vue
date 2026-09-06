import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, readlink, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const digest = (value) => createHash('sha256').update(value).digest('hex');

/** Read bytes, including the complete output file set; timestamps are never freshness evidence. */
export async function contentSnapshot(paths, root, { required = false } = {}) {
  const entries = [];
  const files = [];
  async function visit(path, info) {
    if (!info) {
      try {
        info = await lstat(resolve(root, path));
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        if (required) throw new Error(`准备产物缺失：${path}`, { cause: error });
        entries.push([path, 'missing']);
        return;
      }
    }
    if (info.isDirectory()) {
      entries.push([path, 'directory']);
      for (const entry of await readdir(resolve(root, path), { withFileTypes: true }))
        await visit(`${path}/${entry.name}`, entry);
    } else if (info.isSymbolicLink()) {
      // Generated artifacts must be self-contained; following a directory link could escape
      // the declared artifact roots or hide changes in an untracked dependency.
      if (required) throw new Error(`准备产物包含符号链接：${path}`);
      entries.push([path, `link:${await readlink(resolve(root, path))}`]);
      files.push(path);
    } else if (info.isFile()) {
      files.push(path);
    } else throw new Error(`无法验证准备文件：${path}`);
  }
  const roots = [...new Set(paths)].sort();
  for (let index = 0; index < roots.length; index += 16)
    await Promise.all(roots.slice(index, index + 16).map((path) => visit(path)));
  // Bound open files and memory while hashing large Nuxt output trees.
  for (let index = 0; index < files.length; index += 16)
    await Promise.all(
      files.slice(index, index + 16).map(async (path) => {
        entries.push([path, digest(await readFile(resolve(root, path)))]);
      }),
    );
  return digest(
    JSON.stringify(
      entries.sort(([left, a], [right, b]) => left.localeCompare(right) || a.localeCompare(b)),
    ),
  );
}

/** Persist only completed stages, after checking that their original inputs stayed frozen. */
export async function cachedPreparationStage(stage, run, options) {
  const { root, cacheDirectory, context, proofs, stages = [], log = console.log } = options;
  const started = performance.now();
  const input = digest(
    JSON.stringify({
      context: await context(),
      commands: stage.commands,
      dependencies: proofs,
      source: await contentSnapshot(await stage.inputs(), root),
    }),
  );
  const cacheFile = resolve(cacheDirectory, `${stage.id}.json`);
  let previous;
  try {
    previous = JSON.parse(await readFile(cacheFile, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error;
  }
  let reason = previous ? '输入已变化' : '无成功记录';
  if (previous?.version === 1 && previous.input === input) {
    try {
      if ((await contentSnapshot(stage.outputs, root, { required: true })) === previous.output) {
        const durationMs = Math.round(performance.now() - started);
        stages.push({
          command: `prepare:${stage.id}:freshness`,
          durationMs,
          status: 'passed',
          cache: 'hit',
        });
        log(`[准备复用] ${stage.id}：输入与全部产物内容一致 (${(durationMs / 1000).toFixed(1)}s)`);
        return { input, output: previous.output };
      }
      reason = '产物内容或文件集合已变化';
    } catch (error) {
      if (!error.message.startsWith('准备产物')) throw error;
      reason = error.message;
    }
  }
  stages.push({
    command: `prepare:${stage.id}:freshness`,
    durationMs: Math.round(performance.now() - started),
    status: 'passed',
    cache: 'miss',
    reason,
  });
  log(`[准备重建] ${stage.id}：${reason}`);
  // Invalidate before running: failure, interruption or a restored source tree must not
  // resurrect the successful record from a prior attempt.
  await rm(cacheFile, { force: true });
  // Several upstream preparation scripts copy into existing directories. Clean their
  // owned outputs so deleted source assets and unexpected files cannot survive a rebuild.
  for (const path of stage.outputs) await rm(resolve(root, path), { recursive: true, force: true });
  for (const command of stage.commands) await run(command);
  const output = await contentSnapshot(stage.outputs, root, { required: true });
  const after = digest(
    JSON.stringify({
      context: await context(),
      commands: stage.commands,
      dependencies: proofs,
      source: await contentSnapshot(await stage.inputs(), root),
    }),
  );
  if (after !== input) throw new Error(`准备 ${stage.id} 期间输入发生变化；不保存缓存。`);
  await mkdir(dirname(cacheFile), { recursive: true });
  const temporary = `${cacheFile}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify({ version: 1, input, output }) + '\n');
  await rename(temporary, cacheFile);
  return { input, output };
}

/** Compare against this run's proof, not a newer receipt written by a concurrent command. */
export async function assertPreparationProof(definitions, expected, options) {
  const { root, context } = options;
  const proofs = {};
  for (const stage of definitions) {
    const input = digest(
      JSON.stringify({
        context: await context(),
        commands: stage.commands,
        dependencies: proofs,
        source: await contentSnapshot(await stage.inputs(), root),
      }),
    );
    const output = await contentSnapshot(stage.outputs, root, { required: true });
    if (input !== expected[stage.id]?.input || output !== expected[stage.id]?.output)
      throw new Error(`准备 ${stage.id} 的输入或产物已变化；不能使用本轮浏览器结果。`);
    proofs[stage.id] = { input, output };
  }
}
