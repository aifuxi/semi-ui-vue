import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { createJiti } from 'jiti';
import { createUnplugin } from 'unplugin';
import { createRsbuild } from '@rsbuild/core';
const { pinnedButtonDocumentation } = await createJiti(import.meta.url).import(
  './docs-reference-plugin.ts',
);
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
  const root = await realpath(await mkdtemp(join(tmpdir(), 'docs-reference-hmr-')));
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
    'entry.js': `import registry from 'virtual:pinned-documentation-examples'; globalThis.registry = registry;`,
    'vendor/semi-design/packages/semi-ui/index.ts': '',
    'vendor/semi-design/content/basic/button/index-en-US.md':
      "```jsx live=true\nfunction Example() { return 'TOKEN'; }\n```",
    'vendor/semi-design/content/basic/button/index.md':
      "```jsx live=true\nfunction Example() { return 'TOKEN'; }\n```",
  })) {
    await mkdir(dirname(join(root, file)), { recursive: true });
    await writeFile(join(root, file), source);
  }
  let latestOutput = '';
  const rsbuild = await createRsbuild({
    cwd: root,
    config: {
      plugins: [
        {
          name: 'capture-built-client',
          setup(api) {
            api.processAssets({ stage: 'report' }, ({ assets }) => {
              latestOutput = Object.entries(assets)
                .filter(([name]) => name.endsWith('.js'))
                .map(([, source]) => source.source().toString())
                .join('\n');
            });
          },
        },
      ],
      source: { entry: { index: './entry.js' } },
      tools: {
        htmlPlugin: false,
        rspack: {
          plugins: [
            createUnplugin(() => ({
              ...pinnedButtonDocumentation({ root }),
              loadInclude: (id) => id.startsWith('\0'),
              transformInclude: (id) => id.endsWith('/semi-site-header/dist/index.es.js'),
            })).rspack(),
          ],
        },
      },
      output: { minify: false },
      performance: { buildCache: false, printFileSize: false },
    },
  });
  const build = await rsbuild.build({ watch: true });
  t.after(() => build.close());
  const transformed = async () => latestOutput;
  await eventually(() => transformed(), 'BEFORE_HELPER');
  await writeFile(join(root, nested), `export const replacement = 'AFTER_HELPER';`);
  await eventually(() => transformed(), 'AFTER_HELPER');
  await writeFile(join(root, adapter), adapterSource.replace('replacement)', "'AFTER_ADAPTER')"));
  await eventually(() => transformed(), 'AFTER_ADAPTER');
  assert.ok(!(await transformed()).includes('navigation'));
  const navigation = join(root, 'apps/reference-react/docs-adapters/navigation.mjs');
  await writeFile(navigation, adapterSource);
  await eventually(() => transformed(), 'navigation');
  await rm(navigation);
  await eventually(
    async () => ((await transformed()).includes('navigation') ? 'stale' : 'removed'),
    'removed',
  );
});
