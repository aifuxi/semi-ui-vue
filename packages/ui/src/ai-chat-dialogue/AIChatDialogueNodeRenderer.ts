import { defineComponent, type PropType, type VNodeChild } from 'vue';

export default defineComponent({
  name: 'AIChatDialogueNodeRenderer',
  props: { content: { type: null as unknown as PropType<VNodeChild>, default: undefined } },
  setup(properties) {
    return () => properties.content;
  },
});
