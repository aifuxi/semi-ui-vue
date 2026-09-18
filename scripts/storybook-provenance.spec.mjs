import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { requestedBuildSources } from './parity-build-provenance.mjs';
import { storybookProvenance } from './storybook-provenance';

const workspaceRoot = path.resolve('/workspace/semi-ui-vue');
const baseUrl = 'http://127.0.0.1:4174';
const sourceId = (relative) => path.join(workspaceRoot, relative);
const buttonSource = 'packages/ui/src/button/Button.vue';
const button = sourceId(buttonSource);
const story = sourceId('apps/storybook-vue/src/button.stories.ts');
const barrel = sourceId('packages/ui/src/button/index.ts');
const lazyStory = sourceId('apps/storybook-vue/src/avatar.stories.ts');
const lazyComponent = sourceId('packages/ui/src/avatar/Avatar.vue');

function buildManifest(chunkModules, graph) {
  const emitFile = vi.fn();
  const plugin = storybookProvenance(workspaceRoot);
  plugin.generateBundle.call(
    { emitFile, getModuleInfo: (id) => graph.get(id) ?? null },
    {},
    {
      ...Object.fromEntries(
        Object.entries(chunkModules).map(([fileName, ids]) => [
          fileName,
          { type: 'chunk', fileName, modules: Object.fromEntries(ids.map((id) => [id, {}])) },
        ]),
      ),
      'theme.css': { type: 'asset', fileName: 'theme.css', source: 'body {}' },
    },
  );
  expect(emitFile).toHaveBeenCalledOnce();
  const [asset] = emitFile.mock.calls[0];
  expect(asset).toMatchObject({ type: 'asset', fileName: 'parity-provenance.json' });
  return JSON.parse(asset.source);
}

function devMiddleware(modules) {
  const use = vi.fn();
  storybookProvenance(workspaceRoot).configureServer({
    middlewares: { use },
    environments: { client: { moduleGraph: { urlToModuleMap: modules } } },
  });
  expect(use).toHaveBeenCalledOnce();
  return use.mock.calls[0][0];
}

function readDevManifest(middleware, url = '/parity-provenance.json') {
  const response = { setHeader: vi.fn(), end: vi.fn() };
  const next = vi.fn();
  middleware({ url }, response, next);
  expect(next).not.toHaveBeenCalled();
  expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
  expect(response.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
  expect(response.end).toHaveBeenCalledOnce();
  return JSON.parse(response.end.mock.calls[0][0]);
}

describe('Storybook build provenance', () => {
  it('credits compiled Vue modules and static re-export entries, including cycles', () => {
    const compiled = button + '?vue&type=script&lang.ts';
    const graph = new Map([
      [story, { importedIds: [barrel], dynamicallyImportedIds: [lazyStory] }],
      [barrel, { importedIds: [button] }],
      [button, { importedIds: [barrel] }],
      [compiled, { importedIds: [barrel] }],
      [lazyStory, { importedIds: [lazyComponent] }],
      [lazyComponent, { importedIds: [] }],
    ]);
    const manifest = buildManifest(
      { 'assets/button.js': [story, compiled], 'assets/avatar.js': [lazyStory] },
      graph,
    );
    expect(manifest).toEqual({
      version: 1,
      chunks: {
        '/assets/button.js': [
          'apps/storybook-vue/src/button.stories.ts',
          buttonSource,
          'packages/ui/src/button/index.ts',
        ],
        '/assets/avatar.js': [
          'apps/storybook-vue/src/avatar.stories.ts',
          'packages/ui/src/avatar/Avatar.vue',
        ],
      },
    });
    expect(requestedBuildSources([baseUrl + '/assets/button.js?v=2'], baseUrl, manifest)).toEqual(
      manifest.chunks['/assets/button.js'],
    );
    expect(requestedBuildSources([baseUrl + '/assets/button.js'], baseUrl, manifest)).not.toContain(
      'packages/ui/src/avatar/Avatar.vue',
    );
    expect(requestedBuildSources([baseUrl + '/assets/avatar.js'], baseUrl, manifest)).toContain(
      'packages/ui/src/avatar/Avatar.vue',
    );
  });

  it('does not credit an unrequested dynamic story even when Rollup emits no separate chunk', () => {
    const manifest = buildManifest(
      { 'assets/button.js': [story] },
      new Map([
        [story, { importedIds: [barrel], dynamicallyImportedIds: [lazyStory] }],
        [barrel, { importedIds: [button] }],
        [button, { importedIds: [] }],
        [lazyStory, { importedIds: [lazyComponent] }],
        [lazyComponent, { importedIds: [] }],
      ]),
    );
    const requested = requestedBuildSources([baseUrl + '/assets/button.js'], baseUrl, manifest);
    expect(requested).toContain(buttonSource);
    expect(requested).not.toContain('apps/storybook-vue/src/avatar.stories.ts');
    expect(requested).not.toContain('packages/ui/src/avatar/Avatar.vue');
  });

  it('excludes external, virtual, relative and installed dependency paths from build evidence', () => {
    const external = sourceId('packages/ui/src/external.ts');
    const nonSources = [
      path.resolve(workspaceRoot, '../outside/Other.vue'),
      workspaceRoot + '-other/Other.vue',
      sourceId('node_modules/vue/dist/vue.runtime.esm-bundler.js'),
      sourceId('apps/storybook-vue/node_modules/dependency/index.js'),
      '\0virtual:storybook-entry',
      '@storybook/vue3',
      'https://cdn.example/Other.vue',
      workspaceRoot,
    ];
    const manifest = buildManifest(
      { 'assets/button.js': [button, ...nonSources] },
      new Map([
        [button, { importedIds: [external] }],
        [external, { importedIds: [], isExternal: true }],
        ...nonSources.map((id) => [id, { importedIds: [] }]),
      ]),
    );
    expect(manifest.chunks['/assets/button.js']).toEqual([buttonSource]);
  });

  it('does not turn unrelated graph modules or trace text into compiled source evidence', () => {
    const missingInfo = sourceId('packages/ui/src/unresolved.vue');
    const manifest = buildManifest(
      { 'assets/button.js': [button] },
      new Map([
        [button, { importedIds: [missingInfo], code: 'source-trace: ' + lazyStory }],
        [lazyStory, { importedIds: [lazyComponent] }],
        [lazyComponent, { importedIds: [] }],
      ]),
    );
    expect(manifest.chunks['/assets/button.js']).toEqual([buttonSource]);
    expect(
      requestedBuildSources(
        [baseUrl + '/assets/button.js', baseUrl + '/assets/avatar.js'],
        baseUrl,
        manifest,
      ),
    ).toEqual([buttonSource]);
  });
});

describe('Storybook dev provenance', () => {
  it('maps only transformed local module URLs and refreshes the manifest after a transform', () => {
    const buttonUrl = '/@fs' + button + '?vue&type=script&lang.ts';
    const lazyUrl = '/src/avatar.stories.ts';
    const modules = new Map([
      [buttonUrl, { id: button + '?vue&type=script&lang.ts', url: buttonUrl, transformResult: {} }],
      [lazyUrl, { id: lazyStory, url: lazyUrl, transformResult: null }],
    ]);
    const middleware = devMiddleware(modules);
    const first = readDevManifest(middleware, '/parity-provenance.json?t=1');
    expect(first).toEqual({
      version: 1,
      chunks: { ['/@fs' + button]: [buttonSource] },
    });
    expect(requestedBuildSources([baseUrl + buttonUrl], baseUrl, first)).toEqual([buttonSource]);
    expect(requestedBuildSources([baseUrl + lazyUrl], baseUrl, first)).toEqual([]);

    modules.get(lazyUrl).transformResult = {};
    const afterTransform = readDevManifest(middleware);
    expect(afterTransform.chunks[lazyUrl]).toEqual(['apps/storybook-vue/src/avatar.stories.ts']);
    expect(requestedBuildSources([baseUrl + buttonUrl], baseUrl, afterTransform)).toEqual([
      buttonSource,
    ]);
  });

  it('excludes non-source IDs and remote or virtual module URLs even if transformed', () => {
    const modules = new Map(
      [
        { id: sourceId('node_modules/vue/index.js'), url: '/node_modules/vue/index.js' },
        {
          id: sourceId('apps/storybook-vue/node_modules/vue/index.js'),
          url: '/nested-dependency.js',
        },
        { id: path.resolve(workspaceRoot, '../outside/Other.vue'), url: '/outside.js' },
        { id: '\0virtual:storybook-entry', url: '/@id/virtual-entry' },
        { id: '@storybook/vue3', url: '/@id/storybook-vue3' },
        { id: null, url: '/unknown.js' },
        { id: workspaceRoot, url: '/workspace-directory' },
        { id: button, url: 'https://other.example/src/button.js' },
        { id: button, url: '//other.example/src/button.js' },
        { id: button, url: 'virtual:storybook-button' },
      ].map((module) => [module.url, { ...module, transformResult: {} }]),
    );
    expect(readDevManifest(devMiddleware(modules))).toEqual({ version: 1, chunks: {} });
  });

  it('passes unrelated requests to the next middleware without writing a response', () => {
    const response = { setHeader: vi.fn(), end: vi.fn() };
    const next = vi.fn();
    devMiddleware(new Map())({ url: '/iframe.html?id=button' }, response, next);
    expect(next).toHaveBeenCalledOnce();
    expect(response.setHeader).not.toHaveBeenCalled();
    expect(response.end).not.toHaveBeenCalled();
  });
});

describe('requested Storybook source evidence', () => {
  it('cannot satisfy a component source check from another server or another component chunk', () => {
    const manifest = buildManifest(
      { 'assets/avatar.js': [lazyComponent] },
      new Map([[lazyComponent, { importedIds: [] }]]),
    );
    const requested = requestedBuildSources(
      [
        'http://127.0.0.1:4173/assets/avatar.js',
        baseUrl + '/assets/missing-button.js',
        baseUrl + '/assets/avatar.js',
      ],
      baseUrl,
      manifest,
    );
    expect(requested).toEqual(['packages/ui/src/avatar/Avatar.vue']);
    expect(requested.includes(buttonSource)).toBe(false);
    expect(
      requestedBuildSources(['http://127.0.0.1:4173/assets/avatar.js'], baseUrl, manifest),
    ).toEqual([]);
  });

  it('fails for a missing manifest or malformed requested chunk instead of inventing evidence', () => {
    for (const manifest of [undefined, {}, { version: 2, chunks: {} }, { version: 1 }]) {
      expect(() =>
        requestedBuildSources([baseUrl + '/assets/button.js'], baseUrl, manifest),
      ).toThrow('Invalid parity build provenance');
    }
    for (const badSources of [buttonSource, [false], [null]]) {
      expect(() =>
        requestedBuildSources([baseUrl + '/assets/button.js'], baseUrl, {
          version: 1,
          chunks: { '/assets/button.js': badSources },
        }),
      ).toThrow('Invalid parity chunk provenance');
    }
  });
});
