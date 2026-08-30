import { defineComponent, type PropType } from 'vue';
import type { VNodeChild } from 'vue';

export default defineComponent({
  name: 'FormNodeRenderer',
  props: {
    content: { type: null as unknown as PropType<VNodeChild>, default: undefined },
  },
  setup(props) {
    return () => props.content;
  },
});
