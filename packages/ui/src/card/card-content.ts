import { Comment, Text, type VNode, type VNodeChild } from 'vue';

export function hasCardContent(content: VNodeChild): boolean {
  if (Array.isArray(content)) return content.some((item) => hasCardContent(item));
  if (content === null || content === undefined || content === false || content === '')
    return false;
  if (typeof content !== 'object') return true;
  const vnode = content as VNode;
  if (vnode.type === Comment) return false;
  if (vnode.type === Text) return hasCardContent(vnode.children as VNodeChild);
  return true;
}
