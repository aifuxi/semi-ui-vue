<script setup lang="ts">
import { PinCodeFoundation, type PinCodeAdapter } from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  markRaw,
  nextTick,
  shallowReactive,
  useAttrs,
  watch,
} from 'vue';

import { Input, type InputExposed } from '../input';
import type { PinCodeEmits, PinCodeExposed, PinCodeProps } from './types';

defineOptions({ name: 'PinCode', inheritAttrs: false });

const props = withDefaults(defineProps<PinCodeProps>(), {
  autoFocus: true,
  count: 6,
  disabled: false,
  format: 'number',
  size: 'default',
});
const emit = defineEmits<PinCodeEmits>();

interface PinCodeState {
  valueList: string[];
  currentActiveIndex: number;
}

type FoundationProps = PinCodeProps & {
  onComplete?: (value: string) => void;
};

const attrs = useAttrs();
const instance = getCurrentInstance();
const inputRefs: Array<InputExposed | null> = [];
const cache = new Map<string, unknown>();

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
const initialValue = controlledValue.value || props.defaultValue;
const state = shallowReactive<PinCodeState>({
  valueList: initialValue ? initialValue.split('') : [],
  currentActiveIndex: 0,
});

const rootClasses = computed(() => [attrs.class, props.className, 'semi-pincode-wrapper']);
const rootStyle = computed(() => [props.style, attrs.style]);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
  ),
);

function getFoundationProps(): FoundationProps {
  const output = {
    ...props,
    onComplete: (value: string) => emit('complete', value),
  } as FoundationProps;
  if (controlled.value) output.value = controlledValue.value;
  else delete output.value;
  return output;
}

const adapter: PinCodeAdapter<FoundationProps, PinCodeState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key as keyof FoundationProps],
  getProps: getFoundationProps,
  getState: (key) => state[key as keyof PinCodeState],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(String(key), value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  onCurrentActiveIndexChange: async (index) => {
    state.currentActiveIndex = index;
    await nextTick();
  },
  notifyValueChange: (values) => {
    const value = values.join('');
    emit('change', value);
    emit('update:value', value);
    emit('update:modelValue', value);
  },
  changeSpecificInputFocusState: (index, focusState) => {
    if (focusState === 'focus') inputRefs[index]?.focus();
    else inputRefs[index]?.blur();
  },
  updateValueList: async (valueList) => {
    state.valueList = valueList;
    await nextTick();
  },
};
const foundation = markRaw(new PinCodeFoundation<FoundationProps, PinCodeState>(adapter));

function setInputRef(index: number, value: unknown): void {
  inputRefs[index] = value as InputExposed | null;
}

function focus(index: number): void {
  const inputRef = inputRefs[index];
  inputRef?.focus();
  inputRef?.input?.setSelectionRange(1, 1);
}

function blur(index: number): void {
  inputRefs[index]?.blur();
}

function handleChange(value: string, event: Event, index: number): void {
  if ('isComposing' in event && Boolean((event as InputEvent).isComposing)) return;
  const character = value[value.length - 1];
  if (foundation.validateValue(character)) {
    void foundation.completeSingleInput(index, character as string);
  }
}

const changeHandlers = computed(() =>
  Array.from(
    { length: props.count },
    (_, index) => (value: string, event: Event) => handleChange(value, event, index),
  ),
);

function handlePaste(event: Event, index: number): void {
  void foundation.handlePaste(event as ClipboardEvent, index);
}

function handleKeydown(event: KeyboardEvent, index: number): void {
  foundation.handleKeyDownOnSingleInput(event, index);
}

watch(controlledValue, (value) => {
  if (controlled.value) void foundation.updateValueList((value || '').split(''));
});

defineExpose<PinCodeExposed>({ focus, blur });
</script>

<template>
  <div v-bind="rootAttrs" :class="rootClasses" :style="rootStyle">
    <Input
      v-for="inputIndex in props.count"
      :key="`input-${inputIndex - 1}`"
      :ref="(value) => setInputRef(inputIndex - 1, value)"
      :auto-focus="props.autoFocus && inputIndex === 1"
      :inputmode="props.format === 'number' ? 'numeric' : 'text'"
      :value="state.valueList[inputIndex - 1]"
      :size="props.size"
      :disabled="props.disabled"
      @blur="foundation.handleCurrentActiveIndexChange(inputIndex - 1, 'blur')"
      @focus="foundation.handleCurrentActiveIndexChange(inputIndex - 1, 'focus')"
      @paste="handlePaste($event, inputIndex - 1)"
      @keydown="handleKeydown($event, inputIndex - 1)"
      @change="changeHandlers[inputIndex - 1]"
    />
  </div>
</template>
