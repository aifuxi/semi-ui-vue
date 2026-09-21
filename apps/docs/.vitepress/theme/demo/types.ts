import type { Component } from 'vue';
import DividerBasic from './examples/DividerBasic.vue';
import dividerBasicSource from './examples/DividerBasic.vue?raw';

/**
 * 示例清单契约：DemoBlock 只依赖这里的结构与 loader，Markdown 无需知道示例文件位置。
 */
export interface ExampleManifest {
  id: string;
  title: string;
  entry: string;
  files: Record<string, string>;
  dependencies: Record<string, string>;
  cssUrls: string[];
  component: Component;
  preview: {
    minHeight?: number;
    clientOnly?: boolean;
  };
}

export type DemoSourceLoader = (id: string) => ExampleManifest | null;

const dividerBasic: ExampleManifest = {
  id: 'zh-CN-basic-divider-2',
  title: '基本用法',
  entry: 'App.vue',
  files: { 'App.vue': dividerBasicSource },
  dependencies: {},
  cssUrls: [],
  component: DividerBasic,
  preview: { minHeight: 310 },
};

const manifests: Record<string, ExampleManifest> = {
  [dividerBasic.id]: dividerBasic,
};

export const loadExampleManifest: DemoSourceLoader = (id) => manifests[id] ?? null;
