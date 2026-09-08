import { defineComponent, type PropType, type VNodeChild } from 'vue';
// Scoped slots expose ready-made VNodes; preserve their handlers and identity.
export default defineComponent({
  name: 'DemoNodeContent',
  props: { content: { type: null as unknown as PropType<VNodeChild>, default: undefined } },
  setup: (props) => () => props.content,
});
