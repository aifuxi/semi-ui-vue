import { defineComponent, h, type PropType, type VNodeChild } from 'vue';
import { Tooltip } from '../tooltip';
import { Popover } from '../popover';
import type { TypographyShowTooltip } from './types';

export default defineComponent({
  name: 'TypographyTooltip',
  props: {
    enabled: Boolean,
    options: { type: Object as PropType<TypographyShowTooltip>, required: true },
    content: { type: null as unknown as PropType<VNodeChild>, required: true },
    text: { type: String, required: true },
  },
  setup(props, { slots }) {
    return () => {
      // A template slot creates a Fragment; preserve the original DOM root when no tip is needed.
      if (!props.enabled) return slots.default?.()[0];
      const isPopover = props.options.type?.toLowerCase() === 'popover';
      const { className, ...options } = props.options.opts ?? {};
      return h(
        isPopover ? Popover : Tooltip,
        {
          position: 'top',
          ...(isPopover ? { showArrow: true } : {}),
          ...options,
          class: [
            isPopover ? 'semi-typography-ellipsis-popover' : undefined,
            className,
            options.class,
          ],
        },
        {
          default: slots.default,
          content: () => slots.tooltip?.({ content: props.text }) ?? props.content,
        },
      );
    };
  },
});
