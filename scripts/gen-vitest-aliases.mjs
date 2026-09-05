/**
 * Build the Vitest alias table from workspace sources.
 *
 * Usage:
 *   node scripts/gen-vitest-aliases.mjs
 *   node scripts/gen-vitest-aliases.mjs --check
 *   node scripts/gen-vitest-aliases.mjs --out <file>
 */

import { access, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_ROOT = process.cwd();

export const STUB_OVERRIDES = Object.freeze({
  'SemiLocaleEnGBStub.ts': '@semi-v2.102.0/locale-en-gb',
  'SemiLocaleJaJPStub.ts': '@semi-v2.102.0/locale-ja-jp',
  'SemiTextAreaStub.tsx': '@semi-v2.102.0/textarea',
});

function addAlias(aliases, origins, key, target, origin) {
  const previousOrigin = origins.get(key);
  if (previousOrigin) {
    throw new Error(`别名冲突：${key} 同时来自 ${previousOrigin} 和 ${origin}`);
  }
  origins.set(key, origin);
  aliases[key] = target;
}

export function aliasKeyForStub(filename, overrides = STUB_OVERRIDES) {
  const match = filename.match(/^Semi(.+)Stub\.(ts|tsx)$/);
  if (!match) return null;

  const override = overrides[filename];
  if (override) return override;

  const componentName = match[1];
  const subpath = componentName
    .replace(/([A-Z]+)(?=[A-Z][a-z])|([A-Z])(?=[a-z])/g, (value) => `-${value.toLowerCase()}`)
    .replace(/^-/, '');
  return `@semi-v2.102.0/${subpath}`;
}

export function buildStubAliases(filenames, stubDirectory, overrides = STUB_OVERRIDES) {
  const aliases = {};
  const origins = new Map();

  for (const filename of [...filenames].sort()) {
    const key = aliasKeyForStub(filename, overrides);
    if (!key) continue;
    addAlias(aliases, origins, key, path.join(stubDirectory, filename), filename);
  }

  return aliases;
}

function internalAliases(workspaceRoot) {
  const fromRoot = (...segments) => path.join(workspaceRoot, ...segments);
  return {
    '@aifuxi/semi-ui-vue/locale/source/en_GB': fromRoot('packages/ui/src/locale/source/en_GB.ts'),
    '@aifuxi/semi-ui-vue/locale/source/ja_JP': fromRoot('packages/ui/src/locale/source/ja_JP.ts'),
    '@aifuxi/semi-icons-vue': fromRoot('packages/icons/src/index.ts'),
    '@aifuxi/semi-icons-lab-vue': fromRoot('packages/icons-lab/src/index.ts'),
    '@aifuxi/semi-illustrations-vue': fromRoot('packages/illustrations/src/index.ts'),
    '@douyinfe/semi-animation': fromRoot('vendor/semi-design/packages/semi-animation/index.ts'),
    'bezier-easing': fromRoot('packages/ui/node_modules/bezier-easing/src/index.js'),
    'async-validator': fromRoot('packages/ui/node_modules/async-validator/dist-web/index.js'),
    'fast-copy': fromRoot('packages/foundation-integration/src/fast-copy.js'),
    'lottie-web': fromRoot('packages/ui/src/test/lottieWeb.ts'),
  };
}

export async function generateVitestAliases({
  workspaceRoot = DEFAULT_ROOT,
  readDirectory = readdir,
} = {}) {
  const stubDirectory = path.join(workspaceRoot, 'apps/reference-react/src/test');
  const filenames = await readDirectory(stubDirectory);
  const aliases = buildStubAliases(filenames, stubDirectory);
  const origins = new Map(Object.keys(aliases).map((key) => [key, 'React stub']));

  for (const [key, target] of Object.entries(internalAliases(workspaceRoot))) {
    addAlias(aliases, origins, key, target, 'internal alias');
  }

  return aliases;
}

export async function validateVitestAliases(
  aliases,
  { workspaceRoot = DEFAULT_ROOT, checkAccess = access } = {},
) {
  const requiredAliases = internalAliases(workspaceRoot);

  for (const [key, expectedTarget] of Object.entries(requiredAliases)) {
    if (aliases[key] !== expectedTarget) {
      throw new Error(`必需别名不正确：${key} 应指向 ${expectedTarget}`);
    }
  }

  for (const [key, target] of Object.entries(aliases)) {
    if (!path.isAbsolute(target)) throw new Error(`别名目标必须是绝对路径：${key} → ${target}`);
    try {
      await checkAccess(target);
    } catch {
      throw new Error(`别名目标不存在：${key} → ${target}`);
    }
  }
}

export async function checkVitestAliases(options = {}) {
  const aliases = await generateVitestAliases(options);
  await validateVitestAliases(aliases, options);
  return aliases;
}

function renderAliases(aliases, workspaceRoot) {
  const entries = Object.entries(aliases).map(([key, target]) => {
    const relativeTarget = path.relative(workspaceRoot, target).split(path.sep).join('/');
    return `    '${key}': fileURLToPath(new URL('./${relativeTarget}', import.meta.url))`;
  });
  return `  alias: {\n${entries.join(',\n')}\n  },\n`;
}

async function runCli() {
  const args = process.argv.slice(2);
  const checkMode = args.includes('--check');
  const outIndex = args.indexOf('--out');
  const outFile =
    args.find((argument) => argument.startsWith('--out='))?.slice('--out='.length) ??
    (outIndex >= 0 ? args[outIndex + 1] : undefined);
  const aliases = checkMode ? await checkVitestAliases() : await generateVitestAliases();

  if (checkMode) {
    process.stdout.write(`校验通过：${Object.keys(aliases).length} 个别名有效。\n`);
    return;
  }

  if (outFile) {
    await writeFile(outFile, `${JSON.stringify(aliases, null, 2)}\n`, 'utf8');
    process.stderr.write(`已写入 ${outFile}\n`);
    return;
  }

  process.stdout.write(renderAliases(aliases, DEFAULT_ROOT));
}

const entryPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (entryPath === import.meta.url) {
  runCli().catch((error) => {
    process.stderr.write(`ERROR: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
