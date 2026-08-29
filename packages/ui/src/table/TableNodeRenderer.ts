import { Fragment, h, type PropType, type VNodeChild } from 'vue';

export default {
  name: 'TableNodeRenderer',
  props: { content: null as unknown as PropType<VNodeChild> },
  setup(props: { content?: VNodeChild }) {
    return () => h(Fragment, null, props.content == null ? [] : [props.content]);
  },
};
