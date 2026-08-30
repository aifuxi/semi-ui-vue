<script setup lang="ts">
import { IconClose, IconHandle } from '@aifuxi/semi-icons-vue';
import { computed, nextTick, onMounted, shallowRef, useTemplateRef, watch } from 'vue';

import Tooltip from '../tooltip/Tooltip.vue';
import type { TooltipProps } from '../tooltip/types';
import type { TagInputSize, TagInputTooltipOptions } from './types';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    draggable?: boolean;
    index: number;
    showContentTooltip?: boolean | TagInputTooltipOptions;
    size?: TagInputSize;
    value: string;
  }>(),
  { disabled: false, draggable: false, showContentTooltip: true, size: 'default' },
);
const emit = defineEmits<{
  close: [index: number];
  dragEnd: [];
  dragStart: [index: number];
  drop: [index: number];
}>();
const contentElement = useTemplateRef<HTMLElement>('content');
const overflowing = shallowRef(false);

const tagClasses = computed(() => [
  'semi-tag',
  props.size === 'small' ? 'semi-tag-small' : 'semi-tag-large',
  'semi-tag-square',
  'semi-tag-light',
  'semi-tag-white-light',
  !props.disabled ? 'semi-tag-closable' : undefined,
  'semi-tagInput-wrapper-tag',
  `semi-tagInput-wrapper-tag-size-${props.size}`,
  props.draggable ? 'semi-tagInput-wrapper-tag-icon semi-tagInput-sortable-item' : undefined,
]);
const tooltipProps = computed<TooltipProps>(() => {
  const config =
    typeof props.showContentTooltip === 'object' ? props.showContentTooltip : undefined;
  const { className, ...options } = config?.opts ?? {};
  const popover = config?.type?.toLowerCase() === 'popover';
  return {
    ...(popover
      ? { prefixCls: 'semi-popover', role: 'dialog', showArrow: true, zIndex: 1030 }
      : {}),
    ...options,
    class: options.class ?? className,
    condition: overflowing.value,
    content: props.value,
    mouseEnterDelay: options.mouseEnterDelay ?? 0,
    mouseLeaveDelay: options.mouseLeaveDelay ?? 0,
  };
});

function updateOverflow(): void {
  const element = contentElement.value;
  overflowing.value = Boolean(element && element.scrollWidth > element.clientWidth);
}

onMounted(() => void nextTick(updateOverflow));
watch(
  () => props.value,
  () => void nextTick(updateOverflow),
);

function close(event: MouseEvent | KeyboardEvent): void {
  event.stopPropagation();
  if (!props.disabled) emit('close', props.index);
}

function handleKeydown(event: KeyboardEvent): void {
  if ((event.key === 'Backspace' || event.key === 'Delete') && !props.disabled) {
    event.preventDefault();
    emit('close', props.index);
  } else if (event.key === 'Escape') {
    (event.currentTarget as HTMLElement).blur();
  }
}
</script>

<template>
  <Tooltip v-if="props.showContentTooltip" v-bind="tooltipProps">
    <div
      :aria-label="`${props.disabled ? '' : 'Closable '}Tag: ${props.value}`"
      :class="tagClasses"
      :draggable="props.draggable"
      role="button"
      :tabindex="props.disabled ? undefined : 0"
      @dragend="emit('dragEnd')"
      @dragstart="emit('dragStart', props.index)"
      @dragover.prevent
      @drop.prevent="emit('drop', props.index)"
      @keydown="handleKeydown"
      @mouseenter="updateOverflow"
    >
      <IconHandle v-if="props.draggable" class="semi-tagInput-drag-handler" />
      <div class="semi-tag-content semi-tag-content-center">
        <span
          ref="content"
          :class="[
            'semi-typography',
            'semi-typography-primary',
            'semi-typography-ellipsis-single-line',
            'semi-tagInput-wrapper-typo',
            props.disabled ? 'semi-tagInput-wrapper-typo-disabled' : undefined,
          ]"
          >{{ props.value }}</span
        >
      </div>
      <div v-if="!props.disabled" class="semi-tag-close" @click="close">
        <IconClose size="small" />
      </div>
    </div>
  </Tooltip>

  <div
    v-else
    :aria-label="`${props.disabled ? '' : 'Closable '}Tag: ${props.value}`"
    :class="tagClasses"
    :draggable="props.draggable"
    role="button"
    :tabindex="props.disabled ? undefined : 0"
    @dragend="emit('dragEnd')"
    @dragstart="emit('dragStart', props.index)"
    @dragover.prevent
    @drop.prevent="emit('drop', props.index)"
    @keydown="handleKeydown"
  >
    <IconHandle v-if="props.draggable" class="semi-tagInput-drag-handler" />
    <div class="semi-tag-content semi-tag-content-center">
      <span
        :class="[
          'semi-typography',
          'semi-typography-primary',
          'semi-typography-ellipsis-single-line',
          'semi-tagInput-wrapper-typo',
          props.disabled ? 'semi-tagInput-wrapper-typo-disabled' : undefined,
        ]"
        >{{ props.value }}</span
      >
    </div>
    <div v-if="!props.disabled" class="semi-tag-close" @click="close">
      <IconClose size="small" />
    </div>
  </div>
</template>
