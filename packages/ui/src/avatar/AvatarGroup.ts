import {
  cloneVNode,
  Comment,
  createVNode,
  defineComponent,
  Fragment,
  h,
  isVNode,
  Text,
  type Component,
  type PropType,
  type VNode,
  type VNodeArrayChildren,
} from 'vue';

import Avatar from './Avatar.vue';
import type { AvatarGroupOverlapFrom, AvatarGroupProps, AvatarShape, AvatarSize } from './types';

function flattenChildren(children: VNodeArrayChildren, output: VNode[] = []): VNode[] {
  for (const child of children) {
    if (Array.isArray(child)) {
      flattenChildren(child, output);
    } else if (isVNode(child) && child.type === Fragment && Array.isArray(child.children)) {
      flattenChildren(child.children as VNodeArrayChildren, output);
    } else if (
      isVNode(child) &&
      child.type !== Comment &&
      !(child.type === Text && String(child.children ?? '').trim() === '')
    ) {
      output.push(child);
    }
  }
  return output;
}

function isAvatarVNode(node: VNode): boolean {
  if (node.type === Avatar) return true;
  return typeof node.type === 'object' && 'name' in node.type && node.type.name === 'Avatar';
}

function avatarText(node: VNode): string {
  const alt = node.props?.alt;
  if (typeof alt === 'string') return alt;
  const children =
    typeof node.children === 'object' && node.children && 'default' in node.children
      ? (node.children as { default?: () => unknown }).default?.()
      : node.children;
  const nodes = Array.isArray(children) ? children : [children];
  return nodes
    .map((child) =>
      isVNode(child) && child.type === Text
        ? String(child.children ?? '')
        : typeof child === 'string'
          ? child
          : '',
    )
    .join('');
}

export default defineComponent({
  name: 'AvatarGroup',
  inheritAttrs: false,
  props: {
    maxCount: { type: Number, default: undefined },
    overlapFrom: { type: String as PropType<AvatarGroupOverlapFrom>, default: 'start' },
    renderMore: {
      type: Function as PropType<AvatarGroupProps['renderMore']>,
      default: undefined,
    },
    shape: { type: String as PropType<AvatarShape>, default: 'circle' },
    size: { type: String as PropType<AvatarSize>, default: 'medium' },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const avatars = flattenChildren(slots.default?.() ?? []).filter(isAvatarVNode);
      let visible = avatars;
      if (typeof props.maxCount === 'number') {
        const restNumber = avatars.length - props.maxCount;
        const normal = avatars.slice(0, props.maxCount);
        const rest = avatars.slice(props.maxCount);
        if (restNumber > 0) {
          const slotMore = slots.more?.({ restNumber, restAvatars: rest });
          const customMore = slotMore?.length ? slotMore : props.renderMore?.(restNumber, rest);
          if (customMore !== undefined) {
            normal.push(
              createVNode(
                Fragment as unknown as Component,
                { key: '_+n' },
                Array.isArray(customMore) ? customMore : [customMore],
              ),
            );
          } else {
            const restAlt = rest.map(avatarText).filter(Boolean).join(',');
            normal.push(
              h(
                Avatar,
                {
                  key: '_+n',
                  alt: ` Number of remaining Avatars：${restNumber},${restAlt}`,
                  className: 'semi-avatar-item-more',
                },
                () => `+${restNumber}`,
              ),
            );
          }
          visible = normal;
        }
      }
      const inner = visible.map((node, index) => {
        if (!isAvatarVNode(node)) return node;
        const existingClass =
          node.props?.className ?? node.props?.['class-name'] ?? node.props?.class;
        return cloneVNode(
          node,
          {
            ...attrs,
            className: [existingClass, `semi-avatar-item-${props.overlapFrom}-${index}`],
            shape: props.shape,
            size: props.size,
            key: index,
          },
          true,
        );
      });
      return h('div', { class: 'semi-avatar-group', role: 'list' }, inner);
    };
  },
});
