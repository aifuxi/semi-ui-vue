<script setup lang="ts">
import { IconChevronDown, IconChevronUp } from '@workspace/icons';
import { InputNumberFoundation, type InputNumberAdapter } from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
} from 'vue';

import { configContextKey } from '../config-provider';
import { Input, type InputExposed, type InputProps } from '../input';
import type {
  InputNumberEmits,
  InputNumberExposed,
  InputNumberProps,
  InputNumberSlots,
  InputNumberValue,
} from './types';

defineOptions({ name: 'InputNumber', inheritAttrs: false });

const props = withDefaults(defineProps<InputNumberProps>(), {
  autofocus: false,
  borderless: false,
  composition: false,
  disabled: false,
  hideButtons: false,
  hideSuffix: false,
  innerButtons: false,
  keepFocus: false,
  max: Infinity,
  min: -Infinity,
  readonly: false,
  pressInterval: 250,
  pressTimeout: 250,
  shiftStep: 10,
  showClear: false,
  showCurrencySymbol: true,
  size: 'default',
  step: 1,
  validateStatus: 'default',
});
const emit = defineEmits<InputNumberEmits>();
defineSlots<InputNumberSlots>();

interface InputNumberState {
  value: InputNumberValue;
  number: number | null;
  focusing: boolean;
  hovering: boolean;
}

type FoundationProps = InputNumberProps & {
  defaultCurrency?: string;
  localeCode?: string;
};

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const config = inject(configContextKey, undefined);
const inputComponent = useTemplateRef<InputExposed>('inputComponent');
const prefixCls = 'semi-input';
const state = shallowReactive<InputNumberState>({
  value: '',
  number: null,
  focusing: Boolean(props.autofocus || props.autoFocus),
  hovering: false,
});
const cache = new Map<string, unknown>();
let clickUpOrDown = false;
let cursorAfter: string | undefined;
let lastNotifiedNumber: number | null = null;

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
const controlledValue = computed<InputNumberValue | undefined>(() =>
  hasValue.value ? props.value : props.modelValue,
);
const localeCode = computed(() => props.localeCode ?? config?.value.locale.code ?? 'zh-CN');
const defaultCurrency = computed(
  () => props.defaultCurrency ?? config?.value.locale.currency ?? 'CNY',
);
const inputElement = computed(() => inputComponent.value?.input ?? null);

function getFoundationProps(): FoundationProps {
  const output = {
    ...props,
    defaultCurrency: defaultCurrency.value,
    localeCode: localeCode.value,
  } as FoundationProps;
  if (controlled.value) output.value = controlledValue.value;
  else delete output.value;
  return output;
}

function fixCaret(start: number, end: number): void {
  const input = inputElement.value;
  if (!input?.value) return;
  try {
    if (input.selectionStart !== start || input.selectionEnd !== end) {
      input.setSelectionRange(start, end);
    }
  } catch {
    // Some input types do not expose a writable selection range.
  }
}

function restoreByAfter(value?: string): boolean {
  const input = inputElement.value;
  if (value === undefined || !input) return false;
  const index = input.value.lastIndexOf(value);
  if (index >= 0 && index + value.length === input.value.length) {
    fixCaret(index, index);
    return true;
  }
  return false;
}

function restoreCursor(value = cursorAfter): boolean {
  if (value === undefined) return false;
  return Array.from(value).some((_, start) => restoreByAfter(value.substring(start)));
}

const adapter: InputNumberAdapter<FoundationProps, InputNumberState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key as keyof FoundationProps],
  getProps: getFoundationProps,
  getState: (key) => state[key as keyof InputNumberState],
  // React setState is batched inside an input event. Foundation compares against that
  // previous committed number before notifying onNumberChange, so keep the same boundary.
  getStates: () => ({ ...state, number: lastNotifiedNumber }),
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(String(key), value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  setValue: (value, callback) => {
    state.value = value;
    callback?.();
  },
  setNumber: (number, callback) => {
    state.number = number;
    callback?.();
  },
  setFocusing: (focusing, callback) => {
    state.focusing = focusing;
    callback?.();
  },
  setHovering: (hovering) => {
    state.hovering = hovering;
  },
  notifyChange: (value, event) => {
    emit('change', value, event);
    emit('update:value', value);
    emit('update:modelValue', value);
  },
  notifyNumberChange: (value, event) => {
    emit('numberChange', value, event);
    lastNotifiedNumber = value;
  },
  notifyBlur: (event) => emit('blur', event),
  notifyFocus: (event) => emit('focus', event),
  notifyUpClick: (value, event) => emit('upClick', value, event),
  notifyDownClick: (value, event) => emit('downClick', value, event),
  notifyKeyDown: (event) => emit('keydown', event),
  registerGlobalEvent: (eventName, handler) => {
    if (typeof document === 'undefined') return;
    adapter.unregisterGlobalEvent(eventName);
    cache.set(eventName, handler);
    document.addEventListener(eventName, handler);
  },
  unregisterGlobalEvent: (eventName) => {
    if (typeof document === 'undefined') return;
    const handler = cache.get(eventName);
    if (typeof handler === 'function')
      document.removeEventListener(eventName, handler as (event: Event) => void);
    cache.delete(eventName);
  },
  getInputCharacter: (index) => inputElement.value?.value[index] ?? '',
  recordCursorPosition: () => {
    const input = inputElement.value;
    if (!input) return;
    try {
      const cursorEnd = input.selectionEnd;
      cursorAfter = input.value.substring(cursorEnd ?? input.value.length);
    } catch {
      cursorAfter = undefined;
    }
  },
  restoreByAfter,
  restoreCursor,
  fixCaret,
  setClickUpOrDown: (value) => {
    clickUpOrDown = value;
  },
  updateStates: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
};
const foundation = markRaw(new InputNumberFoundation<FoundationProps, InputNumberState>(adapter));

function initialState(): Pick<InputNumberState, 'number' | 'value'> {
  const propValue = controlled.value ? controlledValue.value : props.defaultValue;
  if (propValue === null || propValue === undefined || propValue === '') {
    return { number: null, value: '' };
  }
  const currency =
    props.currency === true || (typeof props.currency === 'string' && props.currency.trim());
  if (currency) {
    if (typeof propValue !== 'number') return { number: null, value: String(propValue) };
    const parsed = foundation.doParse(propValue, false, true, true);
    return foundation.isValidNumber(parsed)
      ? { number: parsed, value: foundation.doFormat(parsed, true, false) }
      : { number: null, value: '' };
  }
  const raw = typeof propValue === 'number' ? foundation.doFormat(propValue) : propValue;
  const parsed = foundation.doParse(raw, false, true, true);
  return foundation.isValidNumber(parsed)
    ? { number: parsed, value: foundation.doFormat(parsed, true, true) }
    : { number: null, value: '' };
}

Object.assign(state, initialState());
lastNotifiedNumber = state.number;

const rootClasses = computed(() => [
  attrs.class,
  props.className,
  `${prefixCls}-number`,
  `${prefixCls}-number-size-${props.size}`,
]);
const rootStyle = computed(() => attrs.style);
const nativeAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
  ),
);
const inputProps = computed<Partial<InputProps>>(() => {
  const output: Partial<InputProps> = {
    borderless: props.borderless,
    composition: props.composition,
    disabled: props.disabled,
    readonly: props.readonly,
    showClear: props.showClear,
    size: props.size,
    validateStatus: props.validateStatus,
    value: state.value,
  };
  if (props.id !== undefined) output.id = props.id;
  if (props.addonAfter !== undefined) output.addonAfter = props.addonAfter;
  if (props.addonBefore !== undefined) output.addonBefore = props.addonBefore;
  if (props.clearIcon !== undefined) output.clearIcon = props.clearIcon;
  if (props.inputStyle !== undefined) output.inputStyle = props.inputStyle;
  if (props.insetLabelId !== undefined) output.insetLabelId = props.insetLabelId;
  if (props.maxLength !== undefined) output.maxLength = props.maxLength;
  if (props.minLength !== undefined) output.minLength = props.minLength;
  if (props.onlyBorder !== undefined) output.onlyBorder = props.onlyBorder;
  if (props.placeholder !== undefined) output.placeholder = props.placeholder;
  if (props.prefix !== undefined) output.prefix = props.prefix;
  if (props.preventScroll !== undefined) output.preventScroll = props.preventScroll;
  if (props.showClearIgnoreDisabled !== undefined) {
    output.showClearIgnoreDisabled = props.showClearIgnoreDisabled;
  }
  if (props.insetLabel !== undefined) output.insetLabel = props.insetLabel;
  if (!(props.innerButtons && (state.hovering || state.focusing)) && props.suffix !== undefined) {
    output.suffix = props.suffix;
  }
  if (props.ariaLabel !== undefined) output.ariaLabel = props.ariaLabel;
  if (props.ariaLabelledby !== undefined) output.ariaLabelledby = props.ariaLabelledby;
  if (props.ariaDescribedby !== undefined) output.ariaDescribedby = props.ariaDescribedby;
  if (props.ariaErrormessage !== undefined) output.ariaErrormessage = props.ariaErrormessage;
  if (props.ariaRequired !== undefined) output.ariaRequired = props.ariaRequired;
  if (props.ariaInvalid !== undefined) output.ariaInvalid = props.ariaInvalid;
  return output;
});
const spinbuttonAttrs = computed<Record<string, unknown>>(() => {
  const output: Record<string, unknown> = {
    role: 'spinbutton',
    'aria-disabled': props.disabled,
    step: props.step,
  };
  if (state.number) output['aria-valuenow'] = state.number;
  if (props.max !== Infinity) output['aria-valuemax'] = props.max;
  if (props.min !== -Infinity) output['aria-valuemin'] = props.min;
  return output;
});
const inputBindings = computed(() => ({
  ...nativeAttrs.value,
  ...inputProps.value,
  ...spinbuttonAttrs.value,
}));
const showInnerButtons = computed(() => props.innerButtons && (state.hovering || state.focusing));
const notAllowedUp = computed(() => props.disabled || state.number === props.max);
const notAllowedDown = computed(() => props.disabled || state.number === props.min);
const buttonsClasses = computed(() => [
  `${prefixCls}-number-suffix-btns`,
  props.innerButtons ? `${prefixCls}-number-suffix-btns-inner` : undefined,
  props.innerButtons && state.hovering && !state.focusing
    ? `${prefixCls}-number-suffix-btns-inner-hover`
    : undefined,
]);
const upClasses = computed(() => [
  `${prefixCls}-number-button`,
  `${prefixCls}-number-button-up`,
  props.disabled ? `${prefixCls}-number-button-up-disabled` : undefined,
  notAllowedUp.value ? `${prefixCls}-number-button-up-not-allowed` : undefined,
]);
const downClasses = computed(() => [
  `${prefixCls}-number-button`,
  `${prefixCls}-number-button-down`,
  props.disabled ? `${prefixCls}-number-button-down-disabled` : undefined,
  notAllowedDown.value ? `${prefixCls}-number-button-down-not-allowed` : undefined,
]);

function focus(): void {
  inputComponent.value?.focus();
}

function blur(): void {
  inputComponent.value?.blur();
}

function select(): void {
  inputComponent.value?.select();
}

function handleChange(value: string, event: Event): void {
  foundation.handleInputChange(value, event);
}

function handleUpMouseDown(event: MouseEvent): void {
  if (!notAllowedUp.value) foundation.handleUpClick(event);
}

function handleDownMouseDown(event: MouseEvent): void {
  if (!notAllowedDown.value) foundation.handleDownClick(event);
}

function syncControlledValue(value: InputNumberValue | undefined): void {
  if (!controlled.value) return;
  if (value === null || value === undefined || value === '' || Number.isNaN(value)) {
    foundation.updateStates({ value: '', number: null });
    lastNotifiedNumber = null;
    return;
  }
  const valueString = typeof value === 'number' ? foundation.doFormat(value) : value;
  const parsed = foundation.doParse(valueString, false, true, true);
  const rawParsed =
    typeof value === 'number' ? value : foundation.doParse(valueString, false, false, false);
  if (state.focusing) {
    if (foundation.isValidNumber(parsed) && parsed !== state.number) {
      const nextState: Partial<InputNumberState> = { number: parsed };
      if (clickUpOrDown) nextState.value = foundation.doFormat(parsed, true);
      foundation.updateStates(nextState, () => restoreCursor());
    } else if (!Number.isNaN(rawParsed)) {
      foundation.updateStates({ value: foundation.doFormat(rawParsed, false) });
    } else {
      foundation.updateStates({ value: valueString });
    }
  } else if (foundation.isValidNumber(parsed)) {
    foundation.updateStates({ number: parsed, value: foundation.doFormat(parsed, true, true) });
  } else {
    foundation.updateStates({ number: null, value: '' });
  }
  lastNotifiedNumber = state.number;
  void nextTick(() => {
    if (
      clickUpOrDown &&
      props.keepFocus &&
      state.focusing &&
      inputElement.value !== document.activeElement
    ) {
      inputElement.value?.focus({ preventScroll: props.preventScroll });
    }
  });
}

watch(controlledValue, syncControlledValue);

onMounted(() => {
  foundation.init();
  if (!props.disabled && (props.autofocus || props.autoFocus)) focus();
});
onBeforeUnmount(() => foundation.destroy());

defineExpose<InputNumberExposed>({
  get input() {
    return inputElement.value;
  },
  focus,
  blur,
  select,
});
</script>

<template>
  <div
    :class="rootClasses"
    :style="rootStyle"
    @mousemove="foundation.handleInputMouseMove($event)"
    @mouseenter="foundation.handleInputMouseEnter($event)"
    @mouseleave="foundation.handleInputMouseLeave($event)"
  >
    <Input
      v-bind="inputBindings"
      ref="inputComponent"
      @change="handleChange"
      @focus="foundation.handleInputFocus($event)"
      @blur="foundation.handleInputBlur($event)"
      @keydown="foundation.handleInputKeyDown($event)"
    >
      <template v-if="slots.addonBefore" #addonBefore>
        <slot name="addonBefore" />
      </template>
      <template v-if="slots.addonAfter" #addonAfter>
        <slot name="addonAfter" />
      </template>
      <template v-if="slots.prefix" #prefix>
        <slot name="prefix" />
      </template>
      <template v-if="slots.insetLabel" #insetLabel>
        <slot name="insetLabel" />
      </template>
      <template v-if="slots.clearIcon" #clearIcon>
        <slot name="clearIcon" />
      </template>
      <template v-if="showInnerButtons || slots.suffix" #suffix>
        <div v-if="showInnerButtons" :class="buttonsClasses">
          <span
            :class="upClasses"
            @mousedown="handleUpMouseDown"
            @mouseup="foundation.handleMouseUp($event)"
            @mouseleave="foundation.handleMouseLeave($event)"
            ><IconChevronUp size="extra-small"
          /></span>
          <span
            :class="downClasses"
            @mousedown="handleDownMouseDown"
            @mouseup="foundation.handleMouseUp($event)"
            @mouseleave="foundation.handleMouseLeave($event)"
            ><IconChevronDown size="extra-small"
          /></span>
        </div>
        <slot v-else name="suffix" />
      </template>
    </Input>
    <div v-if="!props.hideButtons && !props.innerButtons" :class="buttonsClasses">
      <span
        :class="upClasses"
        @mousedown="handleUpMouseDown"
        @mouseup="foundation.handleMouseUp($event)"
        @mouseleave="foundation.handleMouseLeave($event)"
        ><IconChevronUp size="extra-small"
      /></span>
      <span
        :class="downClasses"
        @mousedown="handleDownMouseDown"
        @mouseup="foundation.handleMouseUp($event)"
        @mouseleave="foundation.handleMouseLeave($event)"
        ><IconChevronDown size="extra-small"
      /></span>
    </div>
  </div>
</template>
