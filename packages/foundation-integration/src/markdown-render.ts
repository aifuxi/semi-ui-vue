import { compile, evaluate, evaluateSync, type CompileOptions } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';

export type MarkdownRenderFormat = 'md' | 'mdx';
export type MarkdownRenderPluginList = NonNullable<CompileOptions['remarkPlugins']>;

export interface MarkdownRenderRuntime {
  Fragment: unknown;
  jsx: (...arguments_: unknown[]) => unknown;
  jsxs: (...arguments_: unknown[]) => unknown;
}

export interface MarkdownRenderEvaluationOptions {
  format: MarkdownRenderFormat;
  rehypePlugins?: MarkdownRenderPluginList;
  remarkGfm: boolean;
  remarkPlugins?: MarkdownRenderPluginList;
}

export type MarkdownRenderContent = (properties: {
  components?: Record<string, unknown>;
}) => unknown;

function getOptions(options: MarkdownRenderEvaluationOptions): CompileOptions {
  const remarkPlugins = [...(options.remarkPlugins ?? [])];
  if (options.remarkGfm) remarkPlugins.unshift(remarkGfm);
  return {
    format: options.format,
    rehypePlugins: [...(options.rehypePlugins ?? [])],
    remarkPlugins,
  };
}

export async function compileMarkdownRender(
  raw: string,
  options: MarkdownRenderEvaluationOptions,
): Promise<string> {
  return String(await compile(raw, getOptions(options)));
}

export async function evaluateMarkdownRender(
  raw: string,
  runtime: MarkdownRenderRuntime,
  options: MarkdownRenderEvaluationOptions,
): Promise<MarkdownRenderContent> {
  const result = await evaluate(raw, { ...getOptions(options), ...runtime });
  return result.default as MarkdownRenderContent;
}

export function evaluateMarkdownRenderSync(
  raw: string,
  runtime: MarkdownRenderRuntime,
  options: MarkdownRenderEvaluationOptions,
): MarkdownRenderContent {
  return evaluateSync(raw, { ...getOptions(options), ...runtime }).default as MarkdownRenderContent;
}
