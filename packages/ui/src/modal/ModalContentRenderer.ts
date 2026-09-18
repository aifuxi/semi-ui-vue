import { defineComponent, type PropType, type VNodeChild } from 'vue';

/** Keep modalRender inside the positioning shell and expose the actual dialog VNode. */
export default defineComponent({
  name: 'ModalContentRenderer',
  inheritAttrs: false,
  props: {
    render: {
      type: Function as PropType<((dialog: VNodeChild) => VNodeChild) | undefined>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    return () => {
      const dialog = slots.default?.()[0];
      return props.render ? props.render(dialog) : dialog;
    };
  },
});
