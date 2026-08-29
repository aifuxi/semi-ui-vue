import { defineComponent, h } from 'vue';

/**
 * Keeps the native table element out of Vue's component-name resolution.
 * A dynamic `is="table"` inside the Table SFC can otherwise resolve back to
 * the current component because HTML tag names are case-insensitive.
 */
export default defineComponent({
  name: 'TableNativeElement',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h('table', attrs, slots.default?.());
  },
});
