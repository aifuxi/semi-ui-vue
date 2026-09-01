import { render as vueRender, type ComponentPublicInstance, type VNode } from 'vue';

export type RenderContainer = Element | ShadowRoot;

export function render(node: VNode, container: RenderContainer): void {
  vueRender(node, container);
}

export function unmount(container: RenderContainer): void {
  vueRender(null, container);
}

export function resolveDOM(instance: unknown): Element | null {
  if (typeof Element === 'undefined' || instance === null || instance === undefined) return null;
  if (instance instanceof Element) return instance;
  if (typeof instance !== 'object' || !('$el' in instance)) return null;
  const element = (instance as ComponentPublicInstance).$el as unknown;
  return element instanceof Element ? element : null;
}

export function getRef(element: VNode | null | undefined): VNode['ref'] {
  return element?.ref ?? null;
}
