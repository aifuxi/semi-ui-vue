<script setup lang="ts">
import { IconClear, IconEyeClosedSolid, IconEyeOpened } from '@workspace/icons';
import { InputFoundation, type InputAdapter } from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  isVNode,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type VNode,
  type VNodeChild,
} from 'vue';

import InputNodeRenderer from './InputNodeRenderer';
import type { InputEmits, InputExposed, InputProps, InputSlots, InputValue } from './types';

defineOptions({ name: 'Input', inheritAttrs: false });

const props = withDefaults(defineProps<InputProps>(), {
  addonAfter: '',
  addonBefore: '',
  borderless: false,
  composition: false,
  disabled: false,
  hideSuffix: false,
  insetLabel: '',
  placeholder: '',
  prefix: '',
  readonly: false,
  showClear: false,
  size: 'default',
  suffix: '',
  type: 'text',
  validateStatus: 'default',
});
const emit = defineEmits<InputEmits>();
defineSlots<InputSlots>();

interface InputState {
  value: InputValue | undefined;
  cachedValue: InputValue | undefined;
  isFocus: boolean;
  isHovering: boolean;
  eyeClosed: boolean;
  minLength: number | undefined;
}

interface FoundationInputProps extends Record<string, unknown> {
  value?: InputValue | undefined;
  composition: boolean;
  disabled: boolean;
  getValueLength?: ((value: string) => number) | undefined;
  maxLength?: number | undefined;
  minLength?: number | undefined;
  mode?: string | undefined;
  showClear: boolean;
  showClearIgnoreDisabled?: boolean | undefined;
}

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const input = useTemplateRef<HTMLInputElement>('input');
const prefixCls = 'semi-input';

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
const controlledValue = computed<InputValue | undefined>(() =>
  hasValue.value ? props.value : props.modelValue,
);
const state = shallowReactive<InputState>({
  value: controlled.value ? controlledValue.value : props.defaultValue,
  cachedValue: controlledValue.value,
  isFocus: false,
  isHovering: false,
  eyeClosed: props.mode === 'password',
  minLength: props.minLength,
});
const cache = new Map<string, unknown>();

function slotContent(name: keyof InputSlots, propValue: VNodeChild): VNodeChild {
  return slots[name]?.() ?? propValue;
}

function firstVNode(content: VNodeChild): VNode | undefined {
  if (Array.isArray(content)) return content.find((item): item is VNode => isVNode(item));
  return isVNode(content) ? content : undefined;
}

function isIconContent(content: VNodeChild): boolean {
  const node = firstVNode(content);
  if (!node) return false;
  if (typeof node.type === 'object' || typeof node.type === 'function') {
    const component = node.type as { name?: string; __name?: string; elementType?: string };
    return (
      component.elementType === 'Icon' || /Icon/.test(component.name ?? component.__name ?? '')
    );
  }
  return false;
}

const addonBeforeContent = computed(() => slotContent('addonBefore', props.addonBefore));
const addonAfterContent = computed(() => slotContent('addonAfter', props.addonAfter));
const insetLabelContent = computed(() => slotContent('insetLabel', props.insetLabel));
const prefixContent = computed(() => slotContent('prefix', props.prefix));
const suffixContent = computed(() => slotContent('suffix', props.suffix));
const labelContent = computed(() => prefixContent.value || insetLabelContent.value);
const clearIconContent = computed(() => slotContent('clearIcon', props.clearIcon));
const allowClear = computed(() => foundation.isAllowClear());
const suffixIsIcon = computed(() => isIconContent(suffixContent.value));
const inputValue = computed(() =>
  state.value === null || state.value === undefined ? '' : state.value,
);
const inputType = computed(() => foundation.handleInputType(props.type));
const wrapperClasses = computed(() => [
  attrs.class,
  props.className,
  `${prefixCls}-wrapper`,
  labelContent.value ? `${prefixCls}-wrapper__with-prefix` : undefined,
  suffixContent.value ? `${prefixCls}-wrapper__with-suffix` : undefined,
  allowClear.value && props.hideSuffix ? `${prefixCls}-wrapper__with-suffix-hidden` : undefined,
  suffixIsIcon.value ? `${prefixCls}-wrapper__with-suffix-icon` : undefined,
  addonBeforeContent.value ? `${prefixCls}-wrapper__with-append` : undefined,
  addonAfterContent.value ? `${prefixCls}-wrapper__with-prepend` : undefined,
  addonBeforeContent.value && !addonAfterContent.value
    ? `${prefixCls}-wrapper__with-append-only`
    : undefined,
  !addonBeforeContent.value && addonAfterContent.value
    ? `${prefixCls}-wrapper__with-prepend-only`
    : undefined,
  props.readonly ? `${prefixCls}-wrapper-readonly` : undefined,
  props.disabled ? `${prefixCls}-wrapper-disabled` : undefined,
  props.validateStatus === 'warning' ? `${prefixCls}-wrapper-warning` : undefined,
  props.validateStatus === 'error' ? `${prefixCls}-wrapper-error` : undefined,
  state.isFocus ? `${prefixCls}-wrapper-focus` : undefined,
  props.showClear ? `${prefixCls}-wrapper-clearable` : undefined,
  props.mode === 'password' ? `${prefixCls}-wrapper-modebtn` : undefined,
  props.type === 'hidden' ? `${prefixCls}-wrapper-hidden` : undefined,
  `${prefixCls}-wrapper-${props.size}`,
  props.borderless ? `${prefixCls}-borderless` : undefined,
  props.onlyBorder !== undefined && props.onlyBorder !== null
    ? `${prefixCls}-only_border`
    : undefined,
]);
const inputClasses = computed(() => [
  prefixCls,
  `${prefixCls}-${props.size}`,
  props.disabled ? `${prefixCls}-disabled` : undefined,
  allowClear.value ? `${prefixCls}-sibling-clearbtn` : undefined,
  props.mode === 'password' ? `${prefixCls}-sibling-modebtn` : undefined,
]);
const wrapperStyle = computed(() => [
  props.onlyBorder !== undefined ? { borderWidth: props.onlyBorder } : undefined,
  attrs.style,
]);
const nativeAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
  ),
);

function getFoundationProps(): FoundationInputProps {
  const output: FoundationInputProps = {
    composition: props.composition,
    disabled: props.disabled,
    getValueLength: props.getValueLength,
    maxLength: props.maxLength,
    minLength: props.minLength,
    mode: props.mode,
    showClear: props.showClear,
    showClearIgnoreDisabled: props.showClearIgnoreDisabled,
  };
  if (controlled.value) output.value = controlledValue.value;
  return output;
}

const adapter: InputAdapter<FoundationInputProps, InputState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key as keyof FoundationInputProps],
  getProps: getFoundationProps,
  getState: (key) => state[key as keyof InputState],
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
  setValue: (value) => {
    state.value = value;
  },
  setMinLength: (minLength) => {
    state.minLength = minLength;
  },
  notifyChange: (value, event) => {
    emit('change', value, event);
    emit('update:value', value);
    emit('update:modelValue', value);
  },
  notifyClear: (event) => emit('clear', event),
  notifyBlur: (_value, event) => emit('blur', event),
  setEyeClosed: (eyeClosed) => {
    state.eyeClosed = eyeClosed;
  },
  toggleFocusing: (focused) => {
    state.isFocus = focused;
  },
  focusInput: () => focus(),
  notifyFocus: (_value, event) => emit('focus', event),
  notifyInput: (event) => emit('input', event),
  notifyKeyDown: (event) => emit('keydown', event),
  notifyKeyUp: (event) => emit('keyup', event),
  notifyKeyPress: (event) => emit('keypress', event),
  notifyEnterPress: (event) => emit('enterPress', event),
  notifyCompositionStart: (event) => emit('compositionStart', event),
  notifyCompositionEnd: (event) => emit('compositionEnd', event),
  notifyCompositionUpdate: (event) => emit('compositionUpdate', event),
  isEventTarget: (event) => event.target === event.currentTarget,
};
const foundation = markRaw(new InputFoundation<FoundationInputProps, InputState>(adapter));

function focus(): void {
  input.value?.focus({ preventScroll: props.preventScroll });
}

function blur(): void {
  input.value?.blur();
}

function select(): void {
  input.value?.select();
}

function restoreControlledValue(): void {
  if (!controlled.value) return;
  void nextTick(() => {
    state.value = controlledValue.value;
    if (input.value) input.value.value = String(controlledValue.value ?? '');
  });
}

function handleNativeInput(event: Event): void {
  foundation.handleInput(event);
  foundation.handleChange((event.currentTarget as HTMLInputElement).value, event);
  restoreControlledValue();
}

function handleCompositionEnd(event: CompositionEvent): void {
  foundation.handleCompositionEnd(event);
  restoreControlledValue();
}

watch(controlledValue, (value) => {
  if (controlled.value) {
    state.value = value;
    state.cachedValue = value;
  }
});
watch(
  () => props.mode,
  (mode) => foundation.handleModeChange(mode),
);

onMounted(() => {
  foundation.init();
  if (!props.disabled && props.autoFocus) focus();
});
onBeforeUnmount(() => foundation.destroy());

defineExpose<InputExposed>({
  get input() {
    return input.value;
  },
  focus,
  blur,
  select,
});
</script>

<template>
  <div
    :class="wrapperClasses"
    :style="wrapperStyle"
    @mouseenter="state.isHovering = true"
    @mouseleave="state.isHovering = false"
    @click="foundation.handleClick"
  >
    <div
      v-if="addonBeforeContent"
      :class="[
        `${prefixCls}-prepend`,
        typeof addonBeforeContent === 'string' ? `${prefixCls}-prepend-text` : undefined,
        isIconContent(addonBeforeContent) ? `${prefixCls}-prepend-icon` : undefined,
      ]"
      x-semi-prop="addonBefore"
    >
      <slot name="addonBefore"><InputNodeRenderer :content="props.addonBefore" /></slot>
    </div>
    <div
      v-if="labelContent"
      :id="props.insetLabelId"
      :class="[
        `${prefixCls}-prefix`,
        insetLabelContent ? `${prefixCls}-inset-label` : undefined,
        typeof labelContent === 'string' ? `${prefixCls}-prefix-text` : undefined,
        isIconContent(labelContent) ? `${prefixCls}-prefix-icon` : undefined,
      ]"
      x-semi-prop="prefix,insetLabel"
      @mousedown="foundation.handlePreventMouseDown"
      @click="foundation.handleClickPrefixOrSuffix"
    >
      <slot v-if="prefixContent" name="prefix"><InputNodeRenderer :content="props.prefix" /></slot>
      <slot v-else name="insetLabel"><InputNodeRenderer :content="props.insetLabel" /></slot>
    </div>
    <input
      v-bind="nativeAttrs"
      :id="props.id"
      ref="input"
      :class="inputClasses"
      :style="props.inputStyle"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :type="inputType"
      :placeholder="String(props.placeholder ?? '')"
      :value="inputValue"
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
      @blur="foundation.handleBlur"
      @keydown="foundation.handleKeyDown"
      @keyup="foundation.handleKeyUp"
      @keypress="foundation.handleKeyPress"
      @compositionstart="foundation.handleCompositionStart"
      @compositionend="handleCompositionEnd"
      @compositionupdate="foundation.handleCompositionUpdate"
    />
    <div v-if="allowClear" :class="`${prefixCls}-clearbtn`" @mousedown="foundation.handleClear">
      <slot name="clearIcon"
        ><InputNodeRenderer v-if="clearIconContent" :content="props.clearIcon" /><IconClear v-else
      /></slot>
    </div>
    <div
      v-if="suffixContent"
      :class="[
        `${prefixCls}-suffix`,
        typeof suffixContent === 'string' ? `${prefixCls}-suffix-text` : undefined,
        suffixIsIcon ? `${prefixCls}-suffix-icon` : undefined,
        allowClear && props.hideSuffix ? `${prefixCls}-suffix-hidden` : undefined,
      ]"
      x-semi-prop="suffix"
      @mousedown="foundation.handlePreventMouseDown"
      @click="foundation.handleClickPrefixOrSuffix"
    >
      <slot name="suffix"><InputNodeRenderer :content="props.suffix" /></slot>
    </div>
    <div
      v-if="props.mode === 'password' && !props.disabled"
      role="button"
      tabindex="0"
      :aria-label="state.eyeClosed ? 'Show password' : 'Hidden password'"
      :class="`${prefixCls}-modebtn`"
      @click="foundation.handleClickEye"
      @mousedown="foundation.handleMouseDown"
      @mouseup="foundation.handleMouseUp"
      @keypress="foundation.handleModeEnterPress"
    >
      <IconEyeClosedSolid v-if="state.eyeClosed" />
      <IconEyeOpened v-else />
    </div>
    <div
      v-if="addonAfterContent"
      :class="[
        `${prefixCls}-append`,
        typeof addonAfterContent === 'string' ? `${prefixCls}-append-text` : undefined,
        isIconContent(addonAfterContent) ? `${prefixCls}-append-icon` : undefined,
      ]"
      x-semi-prop="addonAfter"
    >
      <slot name="addonAfter"><InputNodeRenderer :content="props.addonAfter" /></slot>
    </div>
  </div>
</template>
