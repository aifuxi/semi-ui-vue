import type { Component } from 'vue';

/**
 * 示例清单契约：DemoBlock 只依赖这里的结构与 loader，Markdown 无需知道示例文件位置。
 */
export interface ExampleManifest {
  id: string;
  title: string;
  dependencies: Record<string, string>;
  cssUrls: string[];
  component: Component;
  loadSource: () => Promise<string>;
  preview: {
    minHeight?: number;
    clientOnly?: boolean;
  };
}

export type DemoSourceLoader = (id: string) => ExampleManifest | null;

const exampleComponents = import.meta.glob<Component>('./examples/t*/**/zh-CN-*.vue', {
  eager: true,
  import: 'default',
});
const exampleSources = import.meta.glob<string>('./examples/t*/**/zh-CN-*.vue', {
  import: 'default',
  query: '?raw',
});

const manifests = Object.fromEntries(
  Object.entries(exampleComponents).map(([path, component]) => {
    const id = path.slice(path.lastIndexOf('/') + 1, -'.vue'.length);
    const loadSource = exampleSources[path];
    if (!loadSource) throw new Error(`示例 ${id} 缺少源码`);

    return [
      id,
      {
        id,
        title: id,
        dependencies: {},
        cssUrls: [],
        component,
        loadSource,
        preview: {},
      } satisfies ExampleManifest,
    ];
  }),
);

export const loadExampleManifest: DemoSourceLoader = (id) => manifests[id] ?? null;
