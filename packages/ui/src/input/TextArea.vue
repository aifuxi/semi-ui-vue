<script setup lang="ts">
import { IconClear } from '@aifuxi/semi-icons-vue';
import { TextAreaFoundation, type TextAreaAdapter } from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useAttrs,
  useTemplateRef,
  watch,
  type CSSProperties,
} from 'vue';

import type { TextAreaEmits, TextAreaExposed, TextAreaProps, TextAreaResizeData } from './types';

defineOptions({ name: 'TextArea', inheritAttrs: false });

const props = withDefaults(defineProps<TextAreaProps>(), {
  autosize: false,
  borderless: false,
  cols: 20,
  composition: false,
  disabled: false,
  disabledEnterStartNewLine: false,
  lineNumberStart: 1,
  readonly: false,
  rows: 4,
  showClear: false,
  showCounter: false,
  showLineNumber: false,
  validateStatus: 'default',
});
const emit = defineEmits<TextAreaEmits>();

interface TextAreaState {
  value: string | undefined;
  cachedValue: string | undefined;
  isFocus: boolean;
  isHover: boolean;
  height: number;
  minLength: number | undefined;
  textareaWidth: number;
  textareaHeight: number;
}

interface FoundationTextAreaProps extends Record<string, unknown> {
  value?: string | undefined;
  autosize: boolean | { minRows?: number; maxRows?: number };
  composition: boolean;
  disabled: boolean;
  disabledEnterStartNewLine: boolean;
  getValueLength?: ((value: string) => number) | undefined;
  maxLength?: number | undefined;
  minLength?: number | undefined;
  readonly: boolean;
  rows: number;
  showClear: boolean;
}

const attrs = useAttrs();
const instance = getCurrentInstance();
const textarea = useTemplateRef<HTMLTextAreaElement>('textarea');
const lineNumber = useTemplateRef<HTMLDivElement>('lineNumber');
const prefixCls = 'semi-input';
let observer: ResizeObserver | undefined;
let resizeTimer: ReturnType<typeof setTimeout> | undefined;
let scrollFrame: number | undefined;
let nativeResizeObservedOnce = false;
let lastNativeSize: { width: number; height: number } | undefined;

function hasRawProp(key: string): boolean {
  const kebabKey = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  const raw = instance?.vnode.props;
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, key) ||
      Object.prototype.hasOwnProperty.call(raw, kebabKey)),
  );
}

const hasValue = computed(() => hasRawProp('value'));
const hasModelValue = computed(() => hasRawProp('modelValue'));
const controlled = computed(() => hasValue.value || hasModelValue.value);
const controlledValue = computed(() => (hasValue.value ? props.value : props.modelValue));
const hasResizeProp = computed(() => hasRawProp('resize'));
const state = shallowReactive<TextAreaState>({
  value: controlled.value ? controlledValue.value : props.defaultValue,
  cachedValue: controlledValue.value,
  isFocus: false,
  isHover: false,
  height: 0,
  minLength: props.minLength,
  textareaWidth: 0,
  textareaHeight: 0,
});
const cache = new Map<string, unknown>();
const value = computed(() => state.value ?? '');
const isResizableX = computed(
  () =>
    !props.autosize &&
    hasResizeProp.value &&
    props.resize !== undefined &&
    ['horizontal', 'both', 'inline'].includes(props.resize),
);
const isResizableY = computed(
  () =>
    !props.autosize &&
    hasResizeProp.value &&
    props.resize !== undefined &&
    ['vertical', 'both', 'block'].includes(props.resize),
);
const shouldObserveNativeResize = computed(
  () =>
    !props.autosize && hasResizeProp.value && props.resize !== undefined && props.resize !== 'none',
);
const wrapperClasses = computed(() => [
  attrs.class,
  props.className,
  `${prefixCls}-textarea-wrapper`,
  props.borderless ? `${prefixCls}-textarea-borderless` : undefined,
  props.disabled ? `${prefixCls}-textarea-wrapper-disabled` : undefined,
  props.readonly ? `${prefixCls}-textarea-wrapper-readonly` : undefined,
  props.validateStatus ? `${prefixCls}-textarea-wrapper-${props.validateStatus}` : undefined,
  state.isFocus ? `${prefixCls}-textarea-wrapper-focus` : undefined,
  props.showLineNumber ? `${prefixCls}-textarea-wrapper-withLineNumber` : undefined,
  isResizableX.value ? `${prefixCls}-textarea-wrapper-resizeX` : undefined,
  isResizableY.value ? `${prefixCls}-textarea-wrapper-resizeY` : undefined,
]);
const textareaClasses = computed(() => [
  `${prefixCls}-textarea`,
  props.disabled ? `${prefixCls}-textarea-disabled` : undefined,
  props.readonly ? `${prefixCls}-textarea-readonly` : undefined,
  props.autosize && (typeof props.autosize !== 'object' || props.autosize.maxRows === undefined)
    ? `${prefixCls}-textarea-autosize`
    : undefined,
  props.showClear ? `${prefixCls}-textarea-showClear` : undefined,
]);
const textareaStyle = computed(() => [
  props.textareaStyle,
  props.autosize
    ? ({ resize: 'none' } satisfies CSSProperties)
    : hasResizeProp.value
      ? ({ resize: props.resize } satisfies CSSProperties)
      : undefined,
]);
const nativeAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
  ),
);
const currentCount = computed(() =>
  value.value ? (props.getValueLength ? props.getValueLength(value.value) : value.value.length) : 0,
);
const showCount = computed(() => props.showCounter || props.maxCount !== undefined);
const allowClear = computed(() => foundation.isAllowClear());
const lines = computed(() => value.value.split('\n'));
const lineHeight = computed(() => {
  const element = textarea.value;
  if (!element || typeof window === 'undefined') return 21;
  const style = window.getComputedStyle(element);
  const parsed = Number.parseFloat(style.lineHeight);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return (Number.parseFloat(style.fontSize) || 14) * 1.5;
});
const lineNumberMergedStyle = computed(() => [
  props.lineNumberStyle,
  state.textareaHeight
    ? { height: `${state.textareaHeight}px`, maxHeight: `${state.textareaHeight}px` }
    : undefined,
]);

function getFoundationProps(): FoundationTextAreaProps {
  const output: FoundationTextAreaProps = {
    autosize: props.autosize,
    composition: props.composition,
    disabled: props.disabled,
    disabledEnterStartNewLine: props.disabledEnterStartNewLine,
    getValueLength: props.getValueLength,
    maxLength: props.maxLength,
    minLength: props.minLength,
    readonly: props.readonly,
    rows: props.rows,
    showClear: props.showClear,
  };
  if (controlled.value) output.value = controlledValue.value;
  return output;
}

const adapter: TextAreaAdapter<FoundationTextAreaProps, TextAreaState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key as keyof FoundationTextAreaProps],
  getProps: getFoundationProps,
  getState: (key) => state[key as keyof TextAreaState],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, nextValue) => cache.set(String(key), nextValue),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  setValue: (nextValue) => {
    state.value = nextValue;
    if (props.autosize) scheduleAutosize();
  },
  setMinLength: (minLength) => {
    state.minLength = minLength;
  },
  notifyChange: (nextValue, event) => {
    emit('change', nextValue, event);
    emit('update:value', nextValue);
    emit('update:modelValue', nextValue);
  },
  notifyClear: (event) => emit('clear', event),
  notifyBlur: (_nextValue, event) => emit('blur', event),
  notifyFocus: (_nextValue, event) => emit('focus', event),
  notifyKeyDown: (event) => emit('keydown', event),
  notifyPressEnter: (event) => emit('enterPress', event),
  notifyCompositionStart: (event) => emit('compositionStart', event),
  notifyCompositionEnd: (event) => emit('compositionEnd', event),
  notifyCompositionUpdate: (event) => emit('compositionUpdate', event),
  notifyHeightUpdate: (height) => {
    state.height = height;
    emit('resize', { height });
  },
  toggleFocusing: (focusing) => {
    state.isFocus = focusing;
  },
  toggleHovering: (hovering) => {
    state.isHover = hovering;
  },
  getRef: () => textarea.value,
  focusInput: () => focus(),
  isEventTarget: (event) => event.target === event.currentTarget,
};
const foundation = markRaw(new TextAreaFoundation<FoundationTextAreaProps, TextAreaState>(adapter));

function focus(): void {
  textarea.value?.focus({ preventScroll: props.preventScroll });
}

function blur(): void {
  textarea.value?.blur();
}

function select(): void {
  textarea.value?.select();
}

function scheduleAutosize(): void {
  if (!props.autosize || typeof window === 'undefined') return;
  if (resizeTimer !== undefined) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resizeTimer = undefined;
    foundation.resizeTextarea();
  }, 10);
}

function updateMeasuredSize(rect?: DOMRectReadOnly): void {
  const element = textarea.value;
  if (!element) return;
  state.textareaWidth = rect?.width ?? element.clientWidth;
  state.textareaHeight = rect?.height ?? element.clientHeight;
}

function handleNativeResize(rect: DOMRectReadOnly): void {
  const next = { width: rect.width, height: rect.height };
  if (!nativeResizeObservedOnce) {
    nativeResizeObservedOnce = true;
    lastNativeSize = next;
    return;
  }
  if (lastNativeSize?.width === next.width && lastNativeSize.height === next.height) return;
  lastNativeSize = next;
  emit('resize', next satisfies TextAreaResizeData);
}

function resetObserver(): void {
  observer?.disconnect();
  observer = undefined;
  nativeResizeObservedOnce = false;
  lastNativeSize = undefined;
  const element = textarea.value;
  if (!element || typeof ResizeObserver === 'undefined') return;
  if (!props.showLineNumber && !props.autosize && !shouldObserveNativeResize.value) return;
  observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    if (props.showLineNumber) updateMeasuredSize(entry.contentRect);
    if (props.autosize) scheduleAutosize();
    else if (shouldObserveNativeResize.value) handleNativeResize(entry.contentRect);
  });
  observer.observe(element);
  if (props.showLineNumber) updateMeasuredSize();
}

function restoreControlledValue(): void {
  if (!controlled.value) return;
  void nextTick(() => {
    state.value = controlledValue.value;
    if (textarea.value) textarea.value.value = controlledValue.value ?? '';
  });
}

function handleNativeInput(event: Event): void {
  emit('input', event);
  foundation.handleChange((event.currentTarget as HTMLTextAreaElement).value, event);
  restoreControlledValue();
}

function handleCompositionEnd(event: CompositionEvent): void {
  foundation.handleCompositionEnd(event);
  restoreControlledValue();
}

function handleBlur(event: FocusEvent): void {
  foundation.handleBlur(event);
  restoreControlledValue();
}

function handleKeypress(event: KeyboardEvent): void {
  emit('keypress', event);
}

function handleKeyup(event: KeyboardEvent): void {
  emit('keyup', event);
}

function handleScroll(event: Event): void {
  if (!props.showLineNumber || !lineNumber.value) return;
  const scrollTop = (event.currentTarget as HTMLTextAreaElement).scrollTop;
  if (scrollFrame !== undefined) cancelAnimationFrame(scrollFrame);
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = undefined;
    if (lineNumber.value) {
      lineNumber.value.scrollTop = scrollTop;
    }
  });
}

function wrappedLineCount(line: string): number {
  const element = textarea.value;
  if (!line || !element || typeof document === 'undefined') return 1;
  if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) return 1;
  const style = window.getComputedStyle(element);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 1;
  context.font = `${style.fontSize} ${style.fontFamily}`;
  const width =
    element.clientWidth -
    (Number.parseFloat(style.paddingLeft) || 0) -
    (Number.parseFloat(style.paddingRight) || 0);
  if (width <= 0) return 1;
  return Math.max(1, Math.ceil(context.measureText(line).width / width));
}

watch(controlledValue, (nextValue) => {
  if (controlled.value) {
    state.value = nextValue;
    state.cachedValue = nextValue;
  }
});
watch(
  () => [props.value, props.placeholder, props.autosize] as const,
  () => void nextTick(scheduleAutosize),
);
watch(
  () => [props.showLineNumber, props.autosize, props.resize] as const,
  () => void nextTick(resetObserver),
);

onMounted(() => {
  foundation.init();
  resetObserver();
  scheduleAutosize();
  if (!props.disabled && props.autoFocus) focus();
});
onBeforeUnmount(() => {
  foundation.destroy();
  observer?.disconnect();
  if (resizeTimer !== undefined) clearTimeout(resizeTimer);
  if (scrollFrame !== undefined) cancelAnimationFrame(scrollFrame);
});

defineExpose<TextAreaExposed>({
  get textarea() {
    return textarea.value;
  },
  focus,
  blur,
  select,
});
</script>

<template>
  <div
    :class="wrapperClasses"
    :style="attrs.style"
    @mouseenter="foundation.handleMouseEnter"
    @mouseleave="foundation.handleMouseLeave"
    @click="foundation.handleClick"
  >
    <div
      v-if="props.showLineNumber"
      ref="lineNumber"
      :class="[`${prefixCls}-textarea-lineNumber`, props.lineNumberClassName]"
      :style="lineNumberMergedStyle"
    >
      <div
        v-for="(line, index) in lines"
        :key="index"
        :class="`${prefixCls}-textarea-lineNumber-item`"
        :style="{
          minHeight: `${wrappedLineCount(line) * lineHeight}px`,
          lineHeight: `${lineHeight}px`,
        }"
      >
        {{ props.lineNumberStart + index }}
      </div>
    </div>
    <div v-if="props.showLineNumber" :class="`${prefixCls}-textarea-content`">
      <textarea
        v-bind="nativeAttrs"
        :id="props.id"
        ref="textarea"
        :class="textareaClasses"
        :style="textareaStyle"
        :autofocus="props.autoFocus"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :placeholder="props.placeholder || undefined"
        :rows="props.rows"
        :cols="props.cols"
        :value="value"
        :maxlength="props.getValueLength ? undefined : props.maxLength"
        :minlength="state.minLength || undefined"
        :aria-label="props.ariaLabel"
        :aria-labelledby="props.ariaLabelledby"
        :aria-describedby="props.ariaDescribedby"
        :aria-errormessage="props.ariaErrormessage"
        :aria-required="props.ariaRequired"
        :aria-invalid="props.validateStatus === 'error' ? 'true' : props.ariaInvalid"
        @input="handleNativeInput"
        @focus="foundation.handleFocus"
        @blur="handleBlur"
        @keydown="foundation.handleKeyDown"
        @keyup="handleKeyup"
        @keypress="handleKeypress"
        @scroll="handleScroll"
        @compositionstart="foundation.handleCompositionStart"
        @compositionend="handleCompositionEnd"
        @compositionupdate="foundation.handleCompositionUpdate"
      />
    </div>
    <textarea
      v-else
      v-bind="nativeAttrs"
      :id="props.id"
      ref="textarea"
      :class="textareaClasses"
      :style="textareaStyle"
      :autofocus="props.autoFocus"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :placeholder="props.placeholder || undefined"
      :rows="props.rows"
      :cols="props.cols"
      :value="value"
      :maxlength="props.getValueLength ? undefined : props.maxLength"
      :minlength="state.minLength || undefined"
      :aria-label="props.ariaLabel"
      :aria-labelledby="props.ariaLabelledby"
      :aria-describedby="props.ariaDescribedby"
      :aria-errormessage="props.ariaErrormessage"
      :aria-required="props.ariaRequired"
      :aria-invalid="props.validateStatus === 'error' ? 'true' : props.ariaInvalid"
      @input="handleNativeInput"
      @focus="foundation.handleFocus"
      @blur="handleBlur"
      @keydown="foundation.handleKeyDown"
      @keyup="handleKeyup"
      @keypress="handleKeypress"
      @scroll="handleScroll"
      @compositionstart="foundation.handleCompositionStart"
      @compositionend="handleCompositionEnd"
      @compositionupdate="foundation.handleCompositionUpdate"
    />
    <div
      v-if="props.showClear"
      :class="[`${prefixCls}-clearbtn`, !allowClear ? `${prefixCls}-clearbtn-hidden` : undefined]"
      @click="foundation.handleClear"
    >
      <IconClear />
    </div>
    <div
      v-if="showCount"
      :class="[
        `${prefixCls}-textarea-counter`,
        props.maxCount !== undefined && currentCount > props.maxCount
          ? `${prefixCls}-textarea-counter-exceed`
          : undefined,
      ]"
      @click="foundation.handleCounterClick"
    >
      {{ currentCount }}<template v-if="props.maxCount">/{{ props.maxCount }}</template>
    </div>
  </div>
</template>
