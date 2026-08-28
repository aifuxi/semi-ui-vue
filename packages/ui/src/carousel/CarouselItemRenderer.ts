import {
  cloneVNode,
  defineComponent,
  type HTMLAttributes,
  type PropType,
  type StyleValue,
  type VNode,
} from 'vue';

export default defineComponent({
  name: 'CarouselItemRenderer',
  props: {
    itemClass: {
      type: null as unknown as PropType<HTMLAttributes['class']>,
      default: undefined,
    },
    itemStyle: { type: null as unknown as PropType<StyleValue>, default: undefined },
    node: { type: Object as PropType<VNode>, required: true },
  },
  setup: (props) => () =>
    cloneVNode(props.node, {
      class: props.itemClass,
      style: props.itemStyle,
    }),
});
