import { defineComponent, h, type PropType, type VNodeChild } from 'vue';

export default defineComponent({
  name: 'TransferNodeRenderer',
  inheritAttrs: false,
  props: {
    content: {
      type: null as unknown as PropType<VNodeChild | (() => VNodeChild)>,
      default: undefined,
    },
    sortable: { type: Boolean, default: false },
  },
  emits: ['drop'],
  setup(props, { emit, slots }) {
    return () => {
      const content = slots.default
        ? slots.default()
        : typeof props.content === 'function'
          ? props.content()
          : props.content;
      // The upstream Sortable owns the drop target outside custom item content.
      return props.sortable
        ? h(
            'div',
            {
              class: 'semi-transfer-right-item-sortable-item',
              onDragover: (event: DragEvent) => event.preventDefault(),
              onDrop: (event: DragEvent) => {
                event.preventDefault();
                emit('drop');
              },
            },
            content,
          )
        : content;
    };
  },
});
