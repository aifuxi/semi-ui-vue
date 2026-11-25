<script setup lang="ts">
import { IconCopy, IconTick } from '@aifuxi/semi-icons-vue';
import { cloneVNode, computed, inject, isVNode, onBeforeUnmount, shallowRef, unref } from 'vue';

import { configContextKey } from '../config-provider/config-context';
import Tooltip from '../tooltip/Tooltip.vue';
import TypographyNodeRenderer from './TypographyNodeRenderer';
import {
  DEFAULT_TYPOGRAPHY_LOCALE,
  EN_US_TYPOGRAPHY_LOCALE,
  typographyLocaleKey,
} from './typography-locale';
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
const configContext = inject(configContextKey, undefined);
const locale = computed(() => unref(injectedLocale));
const copyResult = shallowRef<boolean | null>(null);
const copied = computed(() => copyResult.value === true);
let resetTimer: ReturnType<typeof setTimeout> | undefined;
let latestAttempt = 0;
let unmounted = false;
const classes = computed(() =>
  copied.value ? 'semi-typography-action-copied' : 'semi-typography-action-copy',
);
const copyTip = computed(() => props.config.copyTip ?? locale.value.copy);
const copyFailedTip = computed(() => {
  const code = configContext?.value.locale.code;
  const fallback =
    code && !code.startsWith('zh') ? EN_US_TYPOGRAPHY_LOCALE : DEFAULT_TYPOGRAPHY_LOCALE;
  return locale.value.copyFailed ?? fallback.copyFailed;
});
const customIcon = computed(() => {
  const icon = props.config.icon;
  if (!isVNode(icon)) return icon;
  return cloneVNode(icon, {
    role: 'button',
    tabindex: 0,
    onClick: copy,
    onKeydown,
  });
});

function copyWithExecCommand(content: string): boolean {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') return false;
  const focusedElement = document.activeElement;
  const textarea = document.createElement('textarea');
  textarea.value = content;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  try {
    textarea.select();
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
    if (focusedElement instanceof HTMLElement && document.activeElement !== focusedElement) {
      focusedElement.focus({ preventScroll: true });
    }
  }
}

async function copyWithClipboard(content: string): Promise<boolean> {
  try {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    return false;
  }
}

async function copy(event: MouseEvent | KeyboardEvent): Promise<void> {
  const attempt = ++latestAttempt;
  const { content } = props;
  const result = copyWithExecCommand(content) || (await copyWithClipboard(content));
  if (unmounted) return;
  props.config.onCopy?.(event, content, result);
  emit('copy', event, content, result);
  // 并发写入仍逐次报告结果，提示只跟随最近一次操作。
  if (unmounted || attempt !== latestAttempt) return;
  copyResult.value = result;
  if (resetTimer) clearTimeout(resetTimer);
  resetTimer = setTimeout(
    () => {
      copyResult.value = null;
      resetTimer = undefined;
    },
    (props.config.duration ?? 3) * 1000,
  );
}

function onKeydown(event: KeyboardEvent): Promise<void> | undefined {
  if (event.key === 'Enter') return copy(event);
}

onBeforeUnmount(() => {
  unmounted = true;
  if (resetTimer) clearTimeout(resetTimer);
});

defineExpose({ copy, copied });
</script>

<template>
  <TypographyNodeRenderer v-if="config.render" :content="config.render(copied, copy, config)" />
  <span v-else :class="classes" style="margin-left: 4px">
    <template v-if="copied">
      <slot name="copied">
        <TypographyNodeRenderer
          v-if="config.successTip !== undefined"
          :content="config.successTip"
        />
        <span v-else><IconTick />{{ locale.copied }}</span>
      </slot>
    </template>
    <Tooltip v-else :content="copyTip">
      <TypographyNodeRenderer v-if="config.icon !== undefined" :content="customIcon" />
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
          <IconCopy role="button" tabindex="0" @click="copy" @keydown="onKeydown" />
        </slot>
      </a>
    </Tooltip>
    <span role="status" :style="copyResult === false ? { marginInlineStart: '4px' } : undefined">
      {{ copyResult === false ? copyFailedTip : '' }}
    </span>
  </span>
</template>
