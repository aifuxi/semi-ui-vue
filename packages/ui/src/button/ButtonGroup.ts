import {
  cloneVNode,
  defineComponent,
  Fragment,
  h,
  mergeProps,
  type PropType,
  type VNode,
} from 'vue';

import Button from './Button.vue';
import {
  BUTTON_SIZES,
  BUTTON_THEMES,
  BUTTON_TYPES,
  type ButtonSize,
  type ButtonTheme,
  type ButtonType,
} from './types';

function flattenChildren(children: readonly VNode[]): VNode[] {
  return children.flatMap((child) =>
    child.type === Fragment && Array.isArray(child.children)
      ? flattenChildren(child.children as VNode[])
      : [child],
  );
}

export default defineComponent({
  name: 'ButtonGroup',
  inheritAttrs: false,
  props: {
    colorful: {
      type: Boolean,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: undefined,
    },
    prefixCls: {
      type: String,
      default: 'semi-button',
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: 'default',
      validator: (value: string) => BUTTON_SIZES.includes(value as ButtonSize),
    },
    theme: {
      type: String as PropType<ButtonTheme>,
      default: undefined,
      validator: (value: string) => BUTTON_THEMES.includes(value as ButtonTheme),
    },
    type: {
      type: String as PropType<ButtonType>,
      default: undefined,
      validator: (value: string) => BUTTON_TYPES.includes(value as ButtonType),
    },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const {
        'aria-label': ariaLabel,
        class: groupClass,
        style: groupStyle,
        ...childAttrs
      } = attrs;
      const children = flattenChildren(slots.default?.() ?? []);
      const rendered: VNode[] = [];

      children.forEach((child, index) => {
        if (child.type !== Button) {
          rendered.push(child);
          return;
        }

        const groupBaseProps = {
          disabled: props.disabled,
          size: props.size,
          type: props.type,
        };
        const groupOverrides = {
          ...(props.theme === undefined ? {} : { theme: props.theme }),
          ...(props.colorful === undefined ? {} : { colorful: props.colorful }),
        };
        const cloned = cloneVNode(child, {
          ...groupBaseProps,
          ...(child.props ?? {}),
          ...groupOverrides,
          ...childAttrs,
        });
        rendered.push(cloned);

        if (index === children.length - 1) return;
        const clonedProps = cloned.props ?? {};
        const theme = (clonedProps.theme as ButtonTheme | undefined) ?? 'light';
        if (theme === 'outline') return;
        const type = (clonedProps.type as ButtonType | undefined) ?? 'primary';
        rendered.push(
          h('span', {
            class: [
              `${props.prefixCls}-group-line`,
              `${props.prefixCls}-group-line-${theme}`,
              `${props.prefixCls}-group-line-${type}`,
              clonedProps.disabled ? `${props.prefixCls}-group-line-disabled` : null,
            ],
            key: `line-${index}`,
          }),
        );
      });

      return h(
        'div',
        mergeProps(
          { style: groupStyle },
          {
            'aria-label': ariaLabel,
            class: [`${props.prefixCls}-group`, groupClass],
            role: 'group',
          },
        ),
        rendered,
      );
    };
  },
});
