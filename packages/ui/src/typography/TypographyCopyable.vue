<script setup lang="ts">
import { IconCopy, IconTick } from '@aifuxi/semi-icons-vue';
import { cloneVNode, computed, inject, isVNode, onBeforeUnmount, shallowRef, unref } from 'vue';

import TypographyNodeRenderer from './TypographyNodeRenderer';
import { DEFAULT_TYPOGRAPHY_LOCALE, typographyLocaleKey } from './typography-locale';
import type { TypographyCopyableConfig } from './types';

const props = defineProps<{ config: TypographyCopyableConfig; content: string }>();
const emit = defineEmits<{
  copy: [event: MouseEvent | KeyboardEvent, content: string, result: boolean];
}>();
defineSlots<{
  icon?: (props: { copied: boolean; copy: (event: MouseEvent | KeyboardEvent) => void }) => unknown;
  copied?: () => unknown;
}>();

const injectedLocale = inject(typographyLocaleKey, DEFAULT_TYPOGRAPHY_LOCALE);
const locale = computed(() => unref(injectedLocale));
const copied = shallowRef(false);
let resetTimer: ReturnType<typeof setTimeout> | undefined;
const classes = computed(() =>
  copied.value ? 'semi-typography-action-copied' : 'semi-typography-action-copy',
);
const copyTip = computed(() => props.config.copyTip ?? locale.value.copy);
const customIcon = computed(() => {
  const icon = props.config.icon;
  if (!isVNode(icon)) return icon;
  return cloneVNode(icon, {
    role: 'button',
    tabindex: 0,
    'aria-label': String(copyTip.value),
    onClick: copy,
    onKeydown,
  });
});

function writeToClipboard(content: string): boolean {
  if (typeof document === 'undefined') return false;
  const textarea = document.createElement('textarea');
  textarea.value = content;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  let result: boolean;
  try {
    result = typeof document.execCommand === 'function' && document.execCommand('copy');
  } catch {
    result = false;
  }
  textarea.remove();
  if (!result && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(content);
    result = true;
  }
  return result;
}

function copy(event: MouseEvent | KeyboardEvent): void {
  const result = writeToClipboard(props.content);
  props.config.onCopy?.(event, props.content, result);
  emit('copy', event, props.content, result);
  copied.value = true;
  if (resetTimer) clearTimeout(resetTimer);
  resetTimer = setTimeout(
    () => {
      copied.value = false;
      resetTimer = undefined;
    },
    (props.config.duration ?? 3) * 1000,
  );
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') copy(event);
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer);
});

defineExpose({ copy, copied });
</script>

<template>
  <TypographyNodeRenderer v-if="config.render" :content="config.render(copied, copy, config)" />
  <span
    v-else
    :class="classes"
    :title="copied ? undefined : String(copyTip)"
    style="margin-left: 4px"
  >
    <template v-if="copied">
      <slot name="copied">
        <TypographyNodeRenderer
          v-if="config.successTip !== undefined"
          :content="config.successTip"
        />
        <span v-else><IconTick />{{ locale.copied }}</span>
      </slot>
    </template>
    <TypographyNodeRenderer v-else-if="config.icon !== undefined" :content="customIcon" />
    <a
      v-else
      class="semi-typography-action-copy-icon"
      :role="$slots.icon ? 'button' : undefined"
      :tabindex="$slots.icon ? 0 : undefined"
      :aria-label="$slots.icon ? String(copyTip) : undefined"
      @click="$slots.icon ? copy($event) : undefined"
      @keydown="$slots.icon ? onKeydown($event) : undefined"
    >
      <slot name="icon" :copied="copied" :copy="copy">
        <IconCopy
          role="button"
          tabindex="0"
          :aria-label="String(copyTip)"
          @click="copy"
          @keydown="onKeydown"
        />
      </slot>
    </a>
  </span>
</template>
