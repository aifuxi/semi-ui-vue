<script setup lang="ts">
import { IconClose } from '@workspace/icons';
import {
  computed,
  getCurrentInstance,
  shallowRef,
  Text,
  useAttrs,
  useSlots,
  type VNodeChild,
} from 'vue';

import { Avatar } from '../avatar';
import TagNodeRenderer from './TagNodeRenderer';
import type { TagEmits, TagProps, TagSlots } from './types';

defineOptions({ name: 'Tag', inheritAttrs: false });
const props = withDefaults(defineProps<TagProps>(), {
  avatarShape: 'square',
  closable: false,
  color: 'grey',
  colorful: false,
  gradient: false,
  shape: 'square',
  size: 'default',
  type: 'light',
});
const emit = defineEmits<TagEmits>();
defineSlots<TagSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const internalVisible = shallowRef(true);

function hasRawProp(name: string): boolean {
  const raw = instance?.vnode.props;
  const kebabName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebabName)),
  );
}

const controlled = computed(() => hasRawProp('visible'));
const isVisible = computed(() =>
  controlled.value ? props.visible === true : internalVisible.value,
);
const defaultNodes = computed(() => slots.default?.());
const stringContent = computed<string | undefined>(() => {
  if (!slots.default) return typeof props.content === 'string' ? props.content : undefined;
  const nodes = defaultNodes.value ?? [];
  return nodes.length === 1 && nodes[0]?.type === Text
    ? String(nodes[0].children ?? '')
    : undefined;
});
const content = computed<VNodeChild>(() =>
  stringContent.value !== undefined
    ? stringContent.value
    : slots.default
      ? defaultNodes.value
      : props.content,
);
const prefixIcon = computed(() => slots.prefixIcon?.() ?? props.prefixIcon);
const suffixIcon = computed(() => slots.suffixIcon?.() ?? props.suffixIcon);
const clickable = computed(() => props.closable || hasRawProp('onClick'));
const rootClasses = computed(() => [
  'semi-tag',
  `semi-tag-${props.size}`,
  `semi-tag-${props.shape}`,
  `semi-tag-${props.type}`,
  `semi-tag-${props.color}-${props.type}`,
  props.closable ? 'semi-tag-closable' : undefined,
  !isVisible.value ? 'semi-tag-invisible' : undefined,
  props.avatarSrc ? `semi-tag-avatar-${props.avatarShape}` : undefined,
  props.colorful ? 'semi-tag-colorful' : undefined,
  props.gradient ? 'semi-tag-gradient' : undefined,
  props.class,
  props.className,
  attrs.class,
]);
const contentClasses = computed(() => [
  'semi-tag-content',
  `semi-tag-content-${stringContent.value === undefined ? 'center' : 'ellipsis'}`,
]);
const ariaLabel = computed(() => {
  if (!attrs['aria-label'] && stringContent.value === undefined) return '';
  return `${props.closable ? 'Closable ' : ''}Tag: ${stringContent.value ?? String(content.value ?? '')}`;
});
const passthroughAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([name]) => name !== 'class' && name !== 'style' && name !== 'aria-label',
    ),
  ),
);

function close(event: MouseEvent | KeyboardEvent): void {
  event.stopPropagation();
  if ('stopImmediatePropagation' in event) event.stopImmediatePropagation();
  emit('close', content.value, event, props.tagKey);
  if (event.defaultPrevented) return;
  if (!controlled.value) internalVisible.value = false;
  emit('update:visible', false);
}

function handleClick(event: MouseEvent): void {
  emit('click', event);
}

function handleKeydown(event: KeyboardEvent): void {
  if (!clickable.value) return;
  if (event.key === 'Backspace' || event.key === 'Delete') {
    if (props.closable) close(event);
    event.stopPropagation();
    event.preventDefault();
  } else if (event.key === 'Enter') {
    emit('click', event);
    event.stopPropagation();
    event.preventDefault();
  } else if (event.key === 'Escape') {
    (event.target as HTMLElement | null)?.blur();
  }
  emit('keydown', event);
}
</script>

<template>
  <div
    v-bind="passthroughAttrs"
    :aria-label="ariaLabel"
    :class="rootClasses"
    :role="clickable ? 'button' : undefined"
    :style="[props.style, attrs.style]"
    :tabindex="clickable ? props.tabIndex || 0 : props.tabIndex"
    @click="handleClick"
    @keydown="handleKeydown"
    @mouseenter="emit('mouseenter', $event)"
  >
    <div v-if="prefixIcon" class="semi-tag-prefix-icon">
      <TagNodeRenderer :content="prefixIcon" />
    </div>
    <Avatar v-if="props.avatarSrc" :shape="props.avatarShape" :src="props.avatarSrc" />
    <div :class="contentClasses">
      <TagNodeRenderer :content="content" />
    </div>
    <div v-if="suffixIcon" class="semi-tag-suffix-icon">
      <TagNodeRenderer :content="suffixIcon" />
    </div>
    <div v-if="props.closable" class="semi-tag-close" @click="close">
      <IconClose size="small" />
    </div>
  </div>
</template>
