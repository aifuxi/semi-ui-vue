import { Comment, Fragment, isVNode, type Component, type VNode, type VNodeChild } from 'vue';

export function isClassComponent(component: unknown): component is Component & {
  __vccOpts: object;
} {
  return (
    typeof component === 'function' &&
    '__vccOpts' in component &&
    typeof component.__vccOpts === 'object'
  );
}

export function isFunctionalComponent(
  component: unknown,
): component is (...args: never[]) => unknown {
  return typeof component === 'function' && !isClassComponent(component);
}

export function isVueComponent(component: unknown): component is Component {
  if (isClassComponent(component) || isFunctionalComponent(component)) return true;
  if (!component || typeof component !== 'object') return false;
  return ['setup', 'render', 'template', '__vccOpts'].some((key) => key in component);
}

export function isElement(element: unknown): element is VNode {
  return isVNode(element);
}

export function isHTMLElement(element: unknown): element is HTMLElement {
  return typeof HTMLElement !== 'undefined' && element instanceof HTMLElement;
}

export function isCompositeTypeElement(element: unknown): element is VNode {
  return isVNode(element) && isVueComponent(element.type);
}

function countChildren(children: VNodeChild): number {
  if (children === null || children === undefined || children === false || children === true)
    return 0;
  if (Array.isArray(children)) {
    let count = 0;
    for (const child of children) count += countChildren(child);
    return count;
  }
  if (isVNode(children) && children.type === Comment) return 0;
  if (isVNode(children) && children.type === Fragment && Array.isArray(children.children)) {
    return countChildren(children.children as VNodeChild);
  }
  return 1;
}

export function isEmptyChildren(children: VNodeChild): boolean {
  return countChildren(children) === 0;
}
