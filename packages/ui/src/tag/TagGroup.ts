import { computed, defineComponent, h, isVNode, toRaw, type PropType, type VNodeChild } from 'vue';

import { Popover, type PopoverProps } from '../popover';
import Tag from './Tag.vue';
import type { TagData, TagGroupProps, TagSize } from './types';

function tagContent(tag: TagData): VNodeChild {
  return tag.content;
}

export default defineComponent({
  name: 'TagGroup',
  inheritAttrs: false,
  props: {
    avatarShape: { type: String as PropType<TagGroupProps['avatarShape']>, default: 'square' },
    class: { type: null as unknown as PropType<TagGroupProps['class']>, default: undefined },
    className: {
      type: null as unknown as PropType<TagGroupProps['className']>,
      default: undefined,
    },
    maxTagCount: { type: Number, default: undefined },
    mode: { type: String, default: undefined },
    popoverProps: { type: Object as PropType<PopoverProps>, default: undefined },
    restCount: { type: Number, default: undefined },
    showPopover: { type: Boolean, default: false },
    size: { type: String as PropType<TagSize>, default: 'default' },
    style: { type: null as unknown as PropType<TagGroupProps['style']>, default: undefined },
    tagList: {
      type: Array as PropType<NonNullable<TagGroupProps['tagList']>>,
      default: () => [],
    },
  },
  emits: {
    plusNMouseenter: (event: MouseEvent) => Boolean(event) || true,
    tagClose: (
      content: VNodeChild,
      event: MouseEvent | KeyboardEvent,
      tagKey: string | number | undefined,
    ) => {
      void content;
      void event;
      void tagKey;
      return true;
    },
  },
  setup(props, { attrs, emit }) {
    const renderedTags = computed<VNodeChild[]>(() => {
      if (props.mode === 'custom') {
        return (props.tagList as VNodeChild[]).map((entry) =>
          isVNode(entry) ? toRaw(entry) : entry,
        );
      }
      return (props.tagList as TagData[]).map((entry, index) => {
        const tag = { ...entry };
        const content = tagContent(tag);
        const key =
          tag.tagKey ||
          (typeof content === 'string' || typeof content === 'number' ? content : `tag-${index}`);
        return h(
          Tag,
          {
            ...tag,
            avatarShape: tag.avatarShape || props.avatarShape,
            key,
            size: tag.size || props.size,
            onClose: (
              value: VNodeChild,
              event: MouseEvent | KeyboardEvent,
              tagKey: string | number | undefined,
            ) => {
              tag.onClose?.(value, event, tagKey);
              emit('tagClose', value, event, tagKey);
            },
          },
          content === undefined ? undefined : { default: () => content },
        );
      });
    });

    return () => {
      let visibleTags = renderedTags.value;
      if (props.maxTagCount !== undefined) {
        const normalTags = renderedTags.value.slice(0, props.maxTagCount);
        const restTags = renderedTags.value.slice(props.maxTagCount);
        const count = props.restCount ? props.restCount : props.tagList.length - props.maxTagCount;
        if (count > 0) {
          const nTag = h(
            Tag,
            {
              color: 'grey',
              key: '_+n',
              onMouseenter: (event: MouseEvent) => emit('plusNMouseenter', event),
              size: props.size,
              style: { backgroundColor: 'transparent' },
            },
            () => `+${count}`,
          );
          normalTags.push(
            props.showPopover
              ? h(
                  Popover,
                  {
                    autoAdjustOverflow: true,
                    className: 'semi-tag-rest-group-popover',
                    content: restTags,
                    key: '_+n_Popover',
                    position: 'top',
                    showArrow: true,
                    trigger: 'hover',
                    ...props.popoverProps,
                  },
                  () => nTag,
                )
              : nTag,
          );
          visibleTags = normalTags;
        }
      }
      return h(
        'div',
        {
          class: [
            'semi-tag-group',
            props.maxTagCount !== undefined ? 'semi-tag-group-max' : undefined,
            props.size === 'small' ? 'semi-tag-group-small' : undefined,
            props.size === 'large' ? 'semi-tag-group-large' : undefined,
            props.class,
            props.className,
            attrs.class,
          ],
          style: [props.style, attrs.style],
        },
        visibleTags,
      );
    };
  },
});
