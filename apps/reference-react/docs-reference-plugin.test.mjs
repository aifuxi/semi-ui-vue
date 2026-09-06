import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL, URL } from 'node:url';
import { Buffer } from 'node:buffer';
import { createRequire } from 'node:module';
import { setTimeout } from 'node:timers/promises';
import ts from 'typescript';
import { createServer } from 'vite';

const require = createRequire(import.meta.url);
const pluginFile = new URL('./docs-reference-plugin.ts', import.meta.url);
async function loadPlugin(root) {
  // Run the real plugin against an isolated pinned-source fixture. Transpile only its
  // TypeScript syntax; no application build or browser is needed for this dev lifecycle.
  const source = (await readFile(pluginFile, 'utf8'))
    .replace(
      "const root = fileURLToPath(new URL('../..', import.meta.url));",
      `const root = ${JSON.stringify(root)};`,
    )
    .replace("from 'vite'", `from ${JSON.stringify(pathToFileURL(require.resolve('vite')).href)}`);
  const code = ts.transpile(source, {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ESNext,
  });
  return (
    await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
  ).pinnedButtonDocumentation();
}
async function eventually(read, expected) {
  const deadline = Date.now() + 5000;
  let actual;
  do {
    actual = await read();
    if (actual.includes(expected)) return actual;
    await setTimeout(25);
  } while (Date.now() < deadline);
  assert.fail(`Expected transformed output to contain ${expected}: ${actual}`);
}

test('dev 重载 adapter、跨目录两跳 helper，并发现新增/删除批次，不复用 Node 模块缓存', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'docs-reference-hmr-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const adapter = 'apps/reference-react/docs-adapters/button.mjs';
  const nested = 'apps/reference-react/docs-shared/nested.mjs';
  const adapterSource = `import { replacement } from '../docs-shared/replace.mjs';
    export const upstream = 'basic/button'; export const exampleCount = { 'zh-cn': 1, 'en-us': 1 };
    export function adapt(code) { return code.replace('TOKEN', replacement) + '\\nexport default Example;'; }`;
  for (const [file, source] of Object.entries({
    [adapter]: adapterSource,
    'apps/reference-react/docs-shared/replace.mjs': `export { replacement } from './nested.mjs';`,
    [nested]: `export const replacement = 'BEFORE_HELPER';`,
    'vendor/semi-design/packages/semi-ui/index.ts': '',
    'vendor/semi-design/content/basic/button/index.md':
      "```jsx live=true\nfunction Example() { return 'TOKEN'; }\n```",
  })) {
    await mkdir(dirname(join(root, file)), { recursive: true });
    await writeFile(join(root, file), source);
  }
  const server = await createServer({
    root: join(root, 'apps/reference-react'),
    configFile: false,
    cacheDir: join(root, '.vite'),
    logLevel: 'silent',
    plugins: [await loadPlugin(root)],
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false },
  });
  t.after(() => server.close());
  const example = 'virtual:pinned-documentation/button/zh-cn/1.jsx';
  const registry = 'virtual:pinned-documentation-examples';
  const transformed = async (id) => (await server.transformRequest(id))?.code ?? '';
  assert.match(await transformed(example), /BEFORE_HELPER/);
  await writeFile(join(root, nested), `export const replacement = 'AFTER_HELPER';`);
  await eventually(() => transformed(example), 'AFTER_HELPER');
  await writeFile(join(root, adapter), adapterSource.replace('replacement)', "'AFTER_ADAPTER')"));
  await eventually(() => transformed(example), 'AFTER_ADAPTER');
  assert.ok(!(await transformed(registry)).includes('navigation'));
  const navigation = join(root, 'apps/reference-react/docs-adapters/navigation.mjs');
  await writeFile(navigation, adapterSource);
  await eventually(() => transformed(registry), 'navigation');
  await rm(navigation);
  await eventually(
    async () => ((await transformed(registry)).includes('navigation') ? 'stale' : 'removed'),
    'removed',
  );
});
