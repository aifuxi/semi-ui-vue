import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SelectFragment',
  inheritAttrs: false,
  setup(_props, { slots }) {
    return () => slots.default?.();
  },
});
