import { Fragment, h, type Component, type VNode, type VNodeChild } from 'vue';

interface MarkdownRenderRuntime {
  Fragment: unknown;
  jsx: (...arguments_: unknown[]) => unknown;
  jsxs: (...arguments_: unknown[]) => unknown;
}

interface AutomaticRuntimeProperties extends Record<string, unknown> {
  children?: unknown;
  className?: unknown;
  htmlFor?: unknown;
}

function normalizeChildren(children: unknown): VNodeChild | VNodeChild[] | undefined {
  if (children === undefined) return undefined;
  return children as VNodeChild | VNodeChild[];
}

function createVNode(type: unknown, input: unknown, key?: unknown): VNode {
  const source = (input ?? {}) as AutomaticRuntimeProperties;
  const properties: Record<string, unknown> = { ...source };
  const children = normalizeChildren(properties.children);
  delete properties.children;
  if (properties.className !== undefined) {
    properties.class = properties.className;
    delete properties.className;
  }
  if (properties.htmlFor !== undefined) {
    properties.for = properties.htmlFor;
    delete properties.htmlFor;
  }
  if (key !== undefined) properties.key = key;

  if (type === Fragment) return h(Fragment as unknown as string, properties, children as never);
  if (typeof type === 'string') return h(type, properties, children as never);
  return h(type as Component, properties, { default: () => children });
}

export const markdownRenderRuntime: MarkdownRenderRuntime = Object.freeze({
  Fragment,
  jsx: createVNode,
  jsxs: createVNode,
});
