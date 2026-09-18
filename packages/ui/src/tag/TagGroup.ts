import {
  computed,
  cloneVNode,
  createTextVNode,
  defineComponent,
  h,
  isVNode,
  toRaw,
  type PropType,
  type VNodeChild,
} from 'vue';

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
    function createTags(fresh = false): VNodeChild[] {
      if (props.mode === 'custom') {
        return (props.tagList as VNodeChild[]).map((entry) =>
          isVNode(entry) ? (fresh ? cloneVNode(toRaw(entry)) : toRaw(entry)) : entry,
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
    }
    const renderedTags = computed(() => createTags());

    return () => {
      let visibleTags = renderedTags.value;
      if (props.maxTagCount !== undefined) {
        const normalTags = renderedTags.value.slice(0, props.maxTagCount);
        const count = props.restCount ? props.restCount : props.tagList.length - props.maxTagCount;
        if (count > 0) {
          const nTag = h(Tag, {
            color: 'grey',
            // The pinned +{n} has two text children, so Tag uses its centered content branch.
            content: [createTextVNode('+'), createTextVNode(String(count))],
            key: '_+n',
            onMouseenter: (event: MouseEvent) => emit('plusNMouseenter', event),
            size: props.size,
            style: { backgroundColor: 'transparent' },
          });
          normalTags.push(
            props.showPopover
              ? h(
                  Popover,
                  {
                    autoAdjustOverflow: true,
                    className: 'semi-tag-rest-group-popover',
                    key: '_+n_Popover',
                    position: 'top',
                    showArrow: true,
                    trigger: 'hover',
                    ...props.popoverProps,
                  },
                  {
                    default: () => nTag,
                    // A new portal mount must render new component VNodes instead of reusing
                    // instances from the cached array after their previous portal was removed.
                    ...(!Object.hasOwn(props.popoverProps ?? {}, 'content')
                      ? { content: () => createTags(true).slice(props.maxTagCount) }
                      : {}),
                  },
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
