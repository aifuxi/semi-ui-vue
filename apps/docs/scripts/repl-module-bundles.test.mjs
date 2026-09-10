import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
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

test('deferred modules remain runnable and a rejected build preserves the previous output', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'repl-deferred-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(join(root, 'package.json'), '{"type":"module"}');
  await writeFile(join(root, 'entry.js'), 'export const load = () => import("./lazy.js");');
  await writeFile(join(root, 'lazy.js'), 'export const value = 42;');
  const options = {
    entryPoints: { 'ui/deferred': join(root, 'entry.js') },
    packageSpecifiers: { ui: '@fixture/ui' },
    outdir: join(root, 'modules'),
  };
  const { graph, outputs } = await buildReplModules(options);
  const entry = join(options.outdir, 'ui/deferred.js');
  const source = await readFile(entry, 'utf8');
  const module = await import(pathToFileURL(entry).href);
  assert.equal((await module.load()).value, 42);
  assert.ok(graph['ui/deferred'].length < Object.keys(outputs).length);
  await assert.rejects(buildReplModules({ ...options, maxStaticRequests: 0 }), /budget 0/);
  assert.equal(await readFile(entry, 'utf8'), source);
  assert.equal((await module.load()).value, 42);
});

test('side-effect-free bare facades do not make a small entry load the full library', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'repl-pure-facades-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(
    join(root, 'package.json'),
    '{"type":"module","sideEffects":["./dist/_runtime/**"]}',
  );
  await mkdir(join(root, 'dist'));
  await writeFile(
    join(root, 'dist/index.js'),
    'export { state } from "./tiny.js"; export { heavy } from "./heavy.js";',
  );
  await writeFile(join(root, 'dist/tiny.js'), 'import "./barrel.js"; export const state = {};');
  await writeFile(join(root, 'dist/barrel.js'), 'import "./heavy.js";');
  await writeFile(
    join(root, 'dist/heavy.js'),
    `export const heavy = ${JSON.stringify('heavy-payload'.repeat(4000))};`,
  );
  const outdir = join(root, 'modules');
  const { graph } = await buildReplModules({
    entryPoints: { 'ui/index': join(root, 'dist/index.js'), 'ui/tiny': join(root, 'dist/tiny.js') },
    packageSpecifiers: { ui: '@fixture/ui' },
    outdir,
  });
  const tinyBytes = (
    await Promise.all(
      graph['ui/tiny'].map(async (file) => (await readFile(join(outdir, file))).length),
    )
  ).reduce((a, b) => a + b, 0);
  assert.ok(tinyBytes < 1000, `Small entry loaded ${tinyBytes} bytes`);
  const tiny = await import(pathToFileURL(join(outdir, 'ui/tiny.js')).href);
  const index = await import(pathToFileURL(join(outdir, 'ui/index.js')).href);
  assert.equal(tiny.state, index.state);
  assert.equal(index.heavy.length, 'heavy-payload'.length * 4000);
});

test('UI infrastructure facades share live bindings with root and component entries', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'repl-ui-infrastructure-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const sources = {
    'package.json': '{"type":"module"}',
    'state.js':
      'export const state = {}; export let count = 0; export function increment() { count++; }',
    'provider.js': 'export { state as context } from "./state.js";',
    'component.js': 'export { state as componentContext } from "./state.js";',
    'index.js':
      'export { state, count, increment } from "./state.js"; export { context } from "./provider.js";',
  };
  for (const [file, source] of Object.entries(sources)) await writeFile(join(root, file), source);
  const outdir = join(root, 'modules');
  const { graph } = await buildReplModules({
    entryPoints: {
      'ui/index': join(root, 'index.js'),
      'ui/_utils': join(root, 'state.js'),
      'ui/config-provider': join(root, 'provider.js'),
      'ui/button': join(root, 'component.js'),
    },
    packageSpecifiers: { ui: '@fixture/ui' },
    outdir,
  });
  const [index, utils, provider, component] = await Promise.all(
    ['index', '_utils', 'config-provider', 'button'].map(
      (name) => import(pathToFileURL(join(outdir, `ui/${name}.js`)).href),
    ),
  );
  assert.equal(index.state, utils.state);
  assert.equal(index.state, provider.context);
  assert.equal(index.state, component.componentContext);
  utils.increment();
  assert.equal(index.count, 1);
  assert.equal(utils.count, 1);
  assert(graph['ui/_utils'].includes('_infrastructure/ui.js'));
  assert(graph['ui/config-provider'].includes('_infrastructure/ui.js'));
});

test('Rslib factory cycles register once and preserve identity across REPL entries', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'repl-factories-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const sources = {
    'package.json': '{"type":"module","sideEffects":["./_runtime/**"]}',
    'runtime.js': `
      const factories = {}, cache = {};
      export const registrations = {};
      export function require(id) {
        if (!cache[id]) { const module = cache[id] = { exports: {} }; factories[id](module, require); }
        return cache[id].exports;
      }
      require.add = (entries) => {
        for (const [id, factory] of Object.entries(entries)) {
          registrations[id] = (registrations[id] ?? 0) + 1;
          factories[id] = factory;
        }
      };
    `,
    '_runtime/a.js': `
      import './b.js'; import { require } from '../runtime.js';
      require.add({ a(module, require) { module.exports = { child: require('b') }; } });
    `,
    '_runtime/b.js': `
      import './a.js'; import { require } from '../runtime.js';
      require.add({ b(module) { module.exports = { value: 42 }; } });
    `,
    'a.js':
      "import './_runtime/a.js'; import { require } from './runtime.js'; export const a = require('a');",
    'b.js':
      "import './_runtime/b.js'; import { require } from './runtime.js'; export const b = require('b');",
    'index.js':
      "export { a } from './a.js'; export { b } from './b.js'; export { registrations } from './runtime.js';",
  };
  for (const [file, source] of Object.entries(sources)) {
    await mkdir(dirname(join(root, file)), { recursive: true });
    await writeFile(join(root, file), source);
  }
  const outdir = join(root, 'modules');
  await buildReplModules({
    entryPoints: Object.fromEntries(
      ['index', 'a', 'b'].map((name) => [`ui/${name}`, join(root, `${name}.js`)]),
    ),
    packageSpecifiers: { ui: '@fixture/ui' },
    outdir,
  });
  const a = await import(pathToFileURL(join(outdir, 'ui/a.js')).href);
  const b = await import(pathToFileURL(join(outdir, 'ui/b.js')).href);
  const index = await import(pathToFileURL(join(outdir, 'ui/index.js')).href);
  assert.equal(a.a.child.value, 42);
  assert.equal(a.a.child, b.b);
  assert.equal(index.a, a.a);
  assert.equal(index.b, b.b);
  assert.deepEqual(index.registrations, { a: 1, b: 1 });
});
