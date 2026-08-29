import {
  cloneVNode,
  Comment,
  defineComponent,
  Fragment,
  h,
  isVNode,
  Text,
  type PropType,
  type VNode,
  type VNodeArrayChildren,
} from 'vue';

import type { SplitTagGroupProps } from './types';

function flattenVisibleChildren(children: VNodeArrayChildren, output: VNode[]): void {
  for (const child of children) {
    if (Array.isArray(child)) {
      flattenVisibleChildren(child, output);
    } else if (isVNode(child) && child.type === Fragment && Array.isArray(child.children)) {
      flattenVisibleChildren(child.children as VNodeArrayChildren, output);
    } else if (
      isVNode(child) &&
      child.type !== Comment &&
      !(child.type === Text && String(child.children ?? '').trim() === '')
    ) {
      output.push(child);
    }
  }
}

export default defineComponent({
  name: 'SplitTagGroup',
  inheritAttrs: false,
  props: {
    class: { type: null as unknown as PropType<SplitTagGroupProps['class']>, default: undefined },
    className: {
      type: null as unknown as PropType<SplitTagGroupProps['className']>,
      default: undefined,
    },
    style: { type: null as unknown as PropType<SplitTagGroupProps['style']>, default: undefined },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const children: VNode[] = [];
      flattenVisibleChildren(slots.default?.() ?? [], children);
      const elementCount = children.filter((child) => child.type !== Text).length;
      let elementIndex = -1;
      const decorated = children.map((child) => {
        if (child.type === Text) return child;
        elementIndex += 1;
        return cloneVNode(
          child,
          {
            class: [
              child.props?.class,
              child.props?.className,
              child.props?.['class-name'],
              elementIndex === 0 ? 'semi-tag-first' : undefined,
              elementIndex === elementCount - 1 ? 'semi-tag-last' : undefined,
            ],
          },
          true,
        );
      });
      return h(
        'div',
        {
          'aria-label': attrs['aria-label'],
          class: ['semi-tag-split', props.class, props.className, attrs.class],
          role: 'group',
          style: [props.style, attrs.style],
        },
        decorated,
      );
    };
  },
});
