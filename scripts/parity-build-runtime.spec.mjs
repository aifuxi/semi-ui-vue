import { mkdir, mkdtemp, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { createRsbuild } from '@rsbuild/core';
import { describe, expect, it } from 'vitest';
import { parityPrismOrder, parityWorkerEntry } from './parity-build-runtime.mjs';

async function withFixture(files, run) {
  const root = await mkdtemp(path.join(tmpdir(), 'semi-build-runtime-'));
  try {
    for (const [file, code] of Object.entries(files)) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await writeFile(path.join(root, file), code);
    }
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function compile(root, plugins) {
  const rsbuild = await createRsbuild({
    cwd: root,
    config: {
      plugins,
      source: { entry: { index: './entry.js' } },
      tools: { htmlPlugin: false },
      output: { filename: { js: '[name].js' }, minify: false },
      performance: {
        buildCache: false,
        printFileSize: false,
        chunkSplit: { strategy: 'all-in-one' },
      },
    },
  });
  const result = await rsbuild.build();
  await result.close();
  return readFile(path.join(root, 'dist/static/js/index.js'), 'utf8');
}

describe('prebuilt parity runtime compatibility', () => {
  it('retains an import-only Worker handler excluded by package sideEffects', async () => {
    await withFixture(
      {
        'entry.js': "import './semi-json-viewer-core/src/worker/json.worker.ts';",
        'semi-json-viewer-core/package.json': JSON.stringify({ sideEffects: false }),
        'semi-json-viewer-core/src/worker/json.worker.ts':
          'self.onmessage = event => self.postMessage(event.data + 1);',
      },
      async (root) => {
        const messages = [];
        const self = { postMessage: (value) => messages.push(value) };
        runInNewContext(await compile(root, []), { self });
        expect(self.onmessage).toBeUndefined();
        runInNewContext(await compile(root, [parityWorkerEntry()]), { self });
        self.onmessage({ data: 41 });
        expect(messages).toEqual([42]);
      },
    );
  });

  it('runs core then JSX before a legacy TSX script reads the shared language registry', async () => {
    await withFixture(
      {
        'entry.js': "import './prismjs/components/prism-tsx.js';",
        'prismjs/prism.js': 'export default { languages: {} };',
        'prismjs/components/prism-jsx.js': 'Prism.languages.jsx = 41;',
        'prismjs/components/prism-tsx.js': 'globalThis.result = Prism.languages.jsx + 1;',
      },
      async (root) => {
        const globals = {};
        runInNewContext(await compile(root, [parityPrismOrder()]), { globalThis: globals });
        expect(globals.result).toBe(42);
      },
    );
  });
});
