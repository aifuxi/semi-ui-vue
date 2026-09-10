// @rstest-environment node
import { mkdtemp, realpath, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRsbuild } from '@rsbuild/core';
import { describe, expect, it } from '@rstest/core';
import { parityBuildProvenance, requestedBuildSources } from './parity-build-provenance.mjs';

describe('built parity source evidence', () => {
  it('only credits chunks actually requested from the expected server', () => {
    const manifest = {
      version: 1,
      chunks: {
        '/assets/used.js': ['packages/ui/src/divider/index.ts'],
        '/assets/unused.js': ['packages/ui/src/index.ts'],
      },
    };
    expect(
      requestedBuildSources(
        [
          'http://localhost:4174/assets/used.js?v=1',
          'http://localhost:4173/assets/unused.js',
          'http://localhost:4174/index.html',
        ],
        'http://localhost:4174',
        manifest,
      ),
    ).toEqual(['packages/ui/src/divider/index.ts']);
    expect(requestedBuildSources([], 'http://localhost:4174', manifest)).toEqual([]);
  });

  it('rejects missing or malformed provenance rather than accepting a fallback', () => {
    for (const manifest of [undefined, {}, { version: 2, chunks: {} }]) {
      expect(() => requestedBuildSources([], 'http://localhost:4174', manifest)).toThrow();
    }
    expect(() =>
      requestedBuildSources(['http://localhost:4174/a.js'], 'http://localhost:4174', {
        version: 1,
        chunks: { '/a.js': [false] },
      }),
    ).toThrow('Invalid parity chunk provenance');
  });

  it('derives module membership from an actual build including a re-export entry', async () => {
    const root = await realpath(await mkdtemp(path.join(tmpdir(), 'semi-provenance-test-')));
    try {
      await writeFile(
        path.join(root, 'entry.js'),
        "export { value } from './public.js'; export const lazy = () => import('./lazy.js');",
      );
      await writeFile(path.join(root, 'public.js'), "export { value } from './implementation.js';");
      await writeFile(path.join(root, 'implementation.js'), 'export const value = 42;');
      await writeFile(path.join(root, 'lazy.js'), 'export const other = 7;');
      const rsbuild = await createRsbuild({
        cwd: root,
        config: {
          plugins: [parityBuildProvenance(root)],
          source: { entry: { index: './entry.js' } },
          tools: { htmlPlugin: false, rspack: { output: { library: { type: 'commonjs2' } } } },
          output: { filename: { js: '[name].js' } },
          performance: { buildCache: false, printFileSize: false },
        },
      });
      const result = await rsbuild.build();
      await result.close();
      const manifest = JSON.parse(
        await readFile(path.join(root, 'dist/parity-provenance.json'), 'utf8'),
      );
      const sources = requestedBuildSources(
        Object.keys(manifest.chunks).map((file) => `http://localhost:4174${file}`),
        'http://localhost:4174',
        manifest,
      );
      expect(sources).toEqual(
        expect.arrayContaining(['entry.js', 'public.js', 'implementation.js']),
      );
      expect(sources.every((source) => !path.isAbsolute(source))).toBe(true);

      expect(
        requestedBuildSources(
          ['http://localhost:4174/static/js/index.js'],
          'http://localhost:4174',
          manifest,
        ),
      ).not.toContain('lazy.js');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
