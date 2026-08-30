import {
  defineComponent,
  h,
  type Component,
  type HTMLAttributes,
  type PropType,
  type StyleValue,
} from 'vue';

import { Button } from '../button';
import type {
  ButtonHtmlType,
  ButtonIconPosition,
  ButtonIconSize,
  ButtonNoHorizontalPadding,
  ButtonSize,
  ButtonTheme,
  ButtonType,
} from '../button';

export default defineComponent({
  name: 'IconButton',
  inheritAttrs: false,
  props: {
    block: { type: Boolean, default: false },
    circle: { type: Boolean, default: false },
    colorful: { type: Boolean, default: false },
    contentClass: {
      type: [String, Array, Object] as PropType<HTMLAttributes['class']>,
      default: undefined,
    },
    disabled: { type: Boolean, default: false },
    htmlType: { type: String as PropType<ButtonHtmlType>, default: 'button' },
    iconPosition: { type: String as PropType<ButtonIconPosition>, default: 'left' },
    iconSize: { type: String as PropType<ButtonIconSize>, default: undefined },
    iconStyle: {
      type: [String, Array, Object] as PropType<StyleValue>,
      default: undefined,
    },
    loading: { type: Boolean, default: false },
    noHorizontalPadding: {
      type: [Boolean, String, Array] as PropType<ButtonNoHorizontalPadding>,
      default: false,
    },
    prefixCls: { type: String, default: 'semi-button' },
    size: { type: String as PropType<ButtonSize>, default: 'default' },
    theme: { type: String as PropType<ButtonTheme>, default: 'light' },
    type: { type: String as PropType<ButtonType>, default: 'primary' },
  },
  emits: ['click', 'mousedown', 'mouseenter', 'mouseleave'],
  setup(props, { attrs, emit, slots }) {
    return () => {
      const icon = slots.icon ?? (() => []);
      const forwardedSlots = slots.default ? { default: slots.default, icon } : { icon };

      return h(
        Button as unknown as Component,
        {
          ...attrs,
          ...props,
          onClick: (event: MouseEvent) => emit('click', event),
          onMousedown: (event: MouseEvent) => emit('mousedown', event),
          onMouseenter: (event: MouseEvent) => emit('mouseenter', event),
          onMouseleave: (event: MouseEvent) => emit('mouseleave', event),
        },
        forwardedSlots,
      );
    };
  },
});
