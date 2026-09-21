import { defineComponent, type PropType, type VNodeChild } from 'vue';

// A scoped slot returns the already-built expand icon; render that VNode without an extra DOM wrapper.
export default defineComponent({
  name: 'TreeDemoVNodeContent',
  props: { content: { type: null as unknown as PropType<VNodeChild>, default: undefined } },
  setup(props) {
    return () => props.content;
  },
});
