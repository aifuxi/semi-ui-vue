import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildReplModules, staticModuleRequests } from './repl-module-bundles.mjs';

test('grouped asset roots and subpaths preserve live bindings, default exports and shared identity', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'repl-bundles-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const sources = {
    'package.json': '{"type":"module"}',
    'src/shared.js': 'export const state = { count: 0 };',
    'src/a.js':
      'import { state } from "./shared.js"; import { marker } from "vue"; export { marker }; export default state; export let value = 0; export function increment() { value++; state.count++; }',
    'src/b.js': 'import { state } from "./shared.js"; export default state;',
    'src/index.js':
      'export { default as A, value, increment } from "./a.js"; export { default as B } from "./b.js";',
    'src/ui.js':
      'import { A } from "@fixture/icons"; import Leaf, { marker } from "@fixture/icons/A"; import { state } from "./shared.js"; export { A as Icon, Leaf, marker, state };',
    'node_modules/@fixture/icons/package.json':
      '{"type":"module","exports":{".":"./index.js","./A":"./A.js"}}',
    'node_modules/@fixture/icons/index.js': 'export * from "../../../modules/icons/index.js";',
    'node_modules/@fixture/icons/A.js':
      'export { default, marker } from "../../../modules/icons/A.js";',
    'node_modules/vue/package.json': '{"type":"module","exports":"./index.js"}',
    'node_modules/vue/index.js': 'export const marker = {};',
  };
  for (const [file, source] of Object.entries(sources)) {
    await mkdir(dirname(join(root, file)), { recursive: true });
    await writeFile(join(root, file), source);
  }
  const outdir = join(root, 'modules');
  const { graph } = await buildReplModules({
    entryPoints: {
      'icons/index': join(root, 'src/index.js'),
      'icons/A': join(root, 'src/a.js'),
      'icons/B': join(root, 'src/b.js'),
      'ui/button': join(root, 'src/ui.js'),
    },
    packageSpecifiers: { icons: '@fixture/icons', ui: '@fixture/ui' },
    outdir,
    assetGroupSize: 1,
  });
  const [index, a, b] = await Promise.all(
    ['index', 'A', 'B'].map((name) => import(pathToFileURL(join(outdir, `icons/${name}.js`)).href)),
  );
  assert.deepEqual(Object.keys(index), ['A', 'B', 'increment', 'value']);
  assert.deepEqual(Object.keys(a), ['default', 'increment', 'marker', 'value']);
  const ui = await import(pathToFileURL(join(outdir, 'ui/button.js')).href);
  const vue = await import(pathToFileURL(join(root, 'node_modules/vue/index.js')).href);
  assert.equal(index.A, a.default);
  assert.equal(index.B, b.default);
  assert.equal(a.default, b.default);
  assert.equal(ui.Icon, index.A);
  assert.equal(ui.Leaf, a.default);
  assert.equal(ui.state, a.default);
  assert.equal(ui.marker, vue.marker);
  assert.equal(a.marker, vue.marker);
  a.increment();
  assert.equal(index.value, 1);
  assert.equal(index.A.count, 1);
  assert.ok(graph['icons/A'].length < graph['icons/index'].length);
  await assert.rejects(
    buildReplModules({
      entryPoints: { 'icons/index': join(root, 'src/index.js') },
      packageSpecifiers: { icons: '@fixture/icons' },
      outdir,
      maxStaticRequests: 1,
    }),
    /budget 1/,
  );
});

test('static request budget follows public external facades, shares Vue and excludes deferred imports', () => {
  const outputs = {
    '/out/ui/button.js': {
      imports: [
        { path: '@fixture/icons', external: true },
        { path: 'vue', external: true },
        { path: '/out/lazy.js', kind: 'dynamic-import' },
      ],
    },
    '/out/icons/index.js': { imports: [{ path: '/out/shared.js' }] },
    '/out/shared.js': { imports: [{ path: 'vue', external: true }] },
  };
  assert.deepEqual(
    staticModuleRequests(outputs, '/out/ui/button.js', { '@fixture/icons': '/out/icons/index.js' }),
    ['/out/icons/index.js', '/out/shared.js', '/out/ui/button.js', 'vue'],
  );
  assert.throws(
    () => staticModuleRequests(outputs, '/out/ui/button.js', {}),
    /Unmapped REPL external/,
  );
});
