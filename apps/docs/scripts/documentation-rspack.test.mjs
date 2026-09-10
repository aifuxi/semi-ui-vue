import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRsbuild } from '@rsbuild/core';
import { nuxtTemplateLoaders } from './nuxt-template-loader.mjs';

test('Rspack 保留编辑器原始源码，并解析 Nuxt 虚拟模板的类型、相对模块与 MDC 依赖', async () => {
  const root = await mkdtemp(join(tmpdir(), 'docs-rspack-'));
  const source =
    '<script setup lang="ts">const value: number = 1;</script><template>{{ value }}</template>';
  const virtual = (name) =>
    `node_modules/.virtual/${encodeURIComponent(`virtual:nuxt:${encodeURIComponent(`.nuxt/${name}`)}`)}`;
  const components = virtual('content/components.ts');
  const mdc = virtual('mdc-imports.mjs');
  async function write(path, content) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), content);
  }
  try {
    await write('src/example.vue', source);
    await write('src/child.ts', 'export default "resolved component";');
    await write(
      'src/contracts.ts',
      'export interface TemplateState { name: string }; throw new Error("type-only import executed");',
    );
    await write(
      components,
      `import type { TemplateState } from "../../src/contracts.ts";
      const identity = <T>(value: T): T => value;
      export const names = [identity("example")] satisfies TemplateState['name'][];
      export { default as directChild } from "../../src/child.ts";
      export const load = () => import("../../src/child.ts");`,
    );
    await write(
      mdc,
      'import emoji from "remark-emoji"; export const ownerDependency = typeof emoji;',
    );
    await write(
      'entry.ts',
      `
      import raw from './src/example.vue?raw';
      import { names, load, directChild } from './${components}';
      import { ownerDependency } from './${mdc}';
      export async function inspect() { return { raw, names, child: (await load()).default, directChild, ownerDependency }; }
    `,
    );
    const rsbuild = await createRsbuild({
      cwd: root,
      config: {
        source: { entry: { index: './entry.ts' } },
        output: { target: 'node', filename: { js: '[name].mjs' }, minify: false },
        tools: {
          htmlPlugin: false,
          rspack: {
            output: { library: { type: 'module' } },
            module: {
              rules: [
                {
                  resourceQuery: /^\?raw$/,
                  enforce: 'post',
                  type: 'javascript/auto',
                  use: [
                    { loader: fileURLToPath(new URL('./raw-source-loader.mjs', import.meta.url)) },
                  ],
                },
                {
                  test: /[\\/]\.virtual[\\/]/,
                  enforce: 'post',
                  use: nuxtTemplateLoaders(root),
                },
              ],
            },
          },
        },
        performance: {
          buildCache: false,
          printFileSize: false,
          chunkSplit: { strategy: 'all-in-one' },
        },
      },
    });
    const build = await rsbuild.build();
    await build.close();
    const result = await (await import(pathToFileURL(join(root, 'dist/index.mjs')).href)).inspect();
    assert.deepEqual(result, {
      raw: source,
      names: ['example'],
      child: 'resolved component',
      directChild: 'resolved component',
      ownerDependency: 'function',
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
