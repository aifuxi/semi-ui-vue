import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SliderFragment',
  inheritAttrs: false,
  setup(_props, { slots }) {
    return () => slots.default?.();
  },
});
