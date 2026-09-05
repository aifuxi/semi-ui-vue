import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_ROOT = process.cwd();
const DEFAULT_MANIFEST = path.join(DEFAULT_ROOT, 'scripts/coverage-exemptions.json');
const SOURCE_PATH_PATTERN = /^packages\/[^/]+\/src\/.+/;
const GLOB_CHARACTERS = ['*', '?', '[', ']', '{', '}'];

export async function loadCoverageExemptions({
  workspaceRoot = DEFAULT_ROOT,
  manifestPath = path.join(workspaceRoot, 'scripts/coverage-exemptions.json'),
  readManifest = readFile,
  getFileStat = stat,
} = {}) {
  let manifest;
  try {
    manifest = JSON.parse(await readManifest(manifestPath, 'utf8'));
  } catch (error) {
    throw new Error(
      `无法读取 coverage 豁免清单 ${manifestPath}：${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }

  if (manifest.version !== 1 || !Array.isArray(manifest.exemptions)) {
    throw new Error('coverage 豁免清单必须是 version 1 且包含 exemptions 数组');
  }

  const seen = new Set();
  const files = [];
  for (const [index, exemption] of manifest.exemptions.entries()) {
    const label = `coverage 豁免项 #${index + 1}`;
    if (!exemption || typeof exemption !== 'object') throw new Error(`${label} 必须是对象`);

    const file = typeof exemption.file === 'string' ? exemption.file : '';
    const reason = typeof exemption.reason === 'string' ? exemption.reason.trim() : '';
    if (!SOURCE_PATH_PATTERN.test(file) || path.isAbsolute(file) || file.includes('..')) {
      throw new Error(`${label} 必须位于 packages/<package>/src：${file || '缺少 file'}`);
    }
    if (GLOB_CHARACTERS.some((character) => file.includes(character))) {
      throw new Error(`${label} 不允许使用 glob：${file}`);
    }
    if (!reason) throw new Error(`${label} 缺少非空 reason：${file}`);
    if (seen.has(file)) throw new Error(`coverage 豁免文件重复：${file}`);

    const target = path.join(workspaceRoot, file);
    try {
      const targetStat = await getFileStat(target);
      if (!targetStat.isFile()) throw new Error('不是文件');
    } catch {
      throw new Error(`coverage 豁免文件不存在：${file}`);
    }

    seen.add(file);
    files.push(file);
  }

  return files;
}

async function runCli() {
  const files = await loadCoverageExemptions({ manifestPath: DEFAULT_MANIFEST });
  process.stdout.write(`校验通过：${files.length} 个 coverage 豁免有效。\n`);
}

const entryPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (entryPath === import.meta.url) {
  runCli().catch((error) => {
    process.stderr.write(`ERROR: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
