import { Fragment, defineComponent, h, type PropType, type VNodeChild } from 'vue';

export default defineComponent({
  name: 'AIChatInputNodeRenderer',
  props: { content: { type: null as unknown as PropType<VNodeChild>, default: undefined } },
  setup(props) {
    return () => h(Fragment, null, Array.isArray(props.content) ? props.content : [props.content]);
  },
});
