import type { Component, DefineComponent, HTMLAttributes, StyleValue } from 'vue';

export type MarkdownRenderFormat = 'md' | 'mdx';
export type MarkdownRenderPluginList = unknown[];
export type MarkdownRenderComponents = Record<string, string | Component>;

export interface MarkdownRenderProps {
  raw: string;
  class?: HTMLAttributes['class'];
  className?: string;
  components?: MarkdownRenderComponents;
  format?: MarkdownRenderFormat;
  rehypePlugins?: MarkdownRenderPluginList;
  remarkGfm?: boolean;
  remarkPlugins?: MarkdownRenderPluginList;
  style?: StyleValue;
}

export interface MarkdownRenderState {
  MDXContentComponent: Component | null;
}

export type MarkdownRenderComponent = DefineComponent<MarkdownRenderProps> & {
  defaultComponents: Readonly<MarkdownRenderComponents>;
};
