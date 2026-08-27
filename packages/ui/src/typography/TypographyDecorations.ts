import { defineComponent, h, type PropType, type VNodeChild } from 'vue';

import type { TypographyLink } from './types';

export default defineComponent({
  name: 'TypographyDecorations',
  props: {
    mark: Boolean,
    code: Boolean,
    underline: Boolean,
    strong: Boolean,
    delete: Boolean,
    disabled: Boolean,
    link: {
      type: [Boolean, Object] as PropType<TypographyLink>,
      default: false,
    },
  },
  setup(props, { slots }) {
    return () => {
      let content: VNodeChild = slots.default?.() ?? [];
      const wrap = (enabled: boolean | TypographyLink, tag: string) => {
        if (!enabled) return;
        const attributes = typeof enabled === 'object' ? enabled : {};
        const child = content;
        content = h(tag, attributes, Array.isArray(child) ? child : [child]);
      };

      wrap(props.mark, 'mark');
      wrap(props.code, 'code');
      wrap(props.underline && !props.link, 'u');
      wrap(props.strong, 'strong');
      wrap(props.delete, 'del');
      wrap(props.link, props.disabled ? 'span' : 'a');
      return content;
    };
  },
});
