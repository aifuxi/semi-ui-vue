<script setup lang="ts">
import { SwitchFoundation, type SwitchAdapter } from '@workspace/foundation-integration';
import {
  computed,
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

import SwitchSpin from './SwitchSpin.vue';
import SwitchNodeRenderer from './SwitchNodeRenderer';
import type { SwitchEmits, SwitchProps, SwitchSlots } from './types';

defineOptions({ name: 'Switch', inheritAttrs: false });

const props = withDefaults(defineProps<SwitchProps>(), {
  checked: undefined,
  modelValue: undefined,
  defaultChecked: undefined,
  ariaInvalid: undefined,
  disabled: false,
  loading: false,
  size: 'default',
});
const emit = defineEmits<SwitchEmits>();
defineSlots<SwitchSlots>();

interface SwitchState {
  nativeControlChecked: boolean;
  nativeControlDisabled: boolean;
  focusVisible: boolean;
}

interface FoundationSwitchProps {
  checked?: boolean | undefined;
  disabled?: boolean;
}

const attrs = useAttrs();
const slots = useSlots();
const nativeControl = useTemplateRef<HTMLInputElement>('nativeControl');
const controlledChecked = computed(() => props.checked ?? props.modelValue);
const isControlled = computed(() => props.checked !== undefined || props.modelValue !== undefined);
const state = shallowReactive<SwitchState>({
  nativeControlChecked: controlledChecked.value ?? props.defaultChecked ?? false,
  nativeControlDisabled: false,
  focusVisible: false,
});
const cache = new Map<string, unknown>();
const prefixCls = 'semi-switch';

function getFoundationProps(): FoundationSwitchProps {
  return {
    checked: isControlled.value ? controlledChecked.value : undefined,
    disabled: props.disabled,
  };
}

const adapter: SwitchAdapter<FoundationSwitchProps, SwitchState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key as keyof FoundationSwitchProps],
  getProps: getFoundationProps,
  getState: (key) => state[key as keyof SwitchState],
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
  setNativeControlChecked: (checked) => {
    state.nativeControlChecked = checked ?? false;
  },
  setNativeControlDisabled: (disabled) => {
    state.nativeControlDisabled = disabled ?? false;
  },
  setFocusVisible: (focusVisible) => {
    state.focusVisible = focusVisible;
  },
  notifyChange: (checked, event) => {
    emit('change', checked, event);
    emit('update:checked', checked);
    emit('update:modelValue', checked);
  },
};
const foundation = markRaw(new SwitchFoundation<FoundationSwitchProps, SwitchState>(adapter));

const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([name]) =>
        name !== 'class' &&
        name !== 'style' &&
        (name.startsWith('data-') || name.startsWith('onMouse')),
    ),
  ),
);
const wrapperClasses = computed(() => [
  attrs.class,
  prefixCls,
  state.nativeControlChecked ? `${prefixCls}-checked` : undefined,
  state.nativeControlDisabled ? `${prefixCls}-disabled` : undefined,
  props.size === 'large' ? `${prefixCls}-large` : undefined,
  props.size === 'small' ? `${prefixCls}-small` : undefined,
  props.loading ? `${prefixCls}-loading` : undefined,
  state.focusVisible ? `${prefixCls}-focus` : undefined,
]);
const showCheckedText = computed(
  () =>
    props.size !== 'small' &&
    state.nativeControlChecked &&
    (slots.checkedText !== undefined || Boolean(props.checkedText)),
);
const showUncheckedText = computed(
  () =>
    props.size !== 'small' &&
    !state.nativeControlChecked &&
    (slots.uncheckedText !== undefined || Boolean(props.uncheckedText)),
);

function handleChange(event: Event): void {
  const checked = (event.currentTarget as HTMLInputElement).checked;
  foundation.handleChange(checked, event);
  if (isControlled.value) {
    void nextTick(() => {
      if (nativeControl.value) nativeControl.value.checked = controlledChecked.value ?? false;
    });
  }
}

watch(controlledChecked, (checked) => {
  if (isControlled.value) foundation.setChecked(checked);
});
watch(
  () => props.disabled,
  (disabled) => foundation.setDisabled(disabled),
);

onMounted(() => foundation.init());
onBeforeUnmount(() => foundation.destroy());
</script>

<template>
  <div v-bind="rootAttrs" :class="wrapperClasses" :style="attrs.style">
    <SwitchSpin v-if="props.loading" :size="props.size" />
    <div v-else :class="`${prefixCls}-knob`" aria-hidden="true" />
    <div v-if="showCheckedText" :class="`${prefixCls}-checked-text`" x-semi-prop="checkedText">
      <slot name="checkedText"><SwitchNodeRenderer :content="props.checkedText" /></slot>
    </div>
    <div
      v-if="showUncheckedText"
      :class="`${prefixCls}-unchecked-text`"
      x-semi-prop="uncheckedText"
    >
      <slot name="uncheckedText"><SwitchNodeRenderer :content="props.uncheckedText" /></slot>
    </div>
    <input
      :id="props.id"
      ref="nativeControl"
      type="checkbox"
      :class="`${prefixCls}-native-control`"
      :disabled="state.nativeControlDisabled || props.loading"
      :checked="state.nativeControlChecked"
      role="switch"
      :aria-checked="state.nativeControlChecked"
      :aria-invalid="props.ariaInvalid"
      :aria-errormessage="props.ariaErrormessage"
      :aria-label="props.ariaLabel"
      :aria-labelledby="props.ariaLabelledby"
      :aria-describedby="props.ariaDescribedby"
      :aria-disabled="props.disabled"
      @change="handleChange"
      @focus="foundation.handleFocusVisible"
      @blur="foundation.handleBlur"
    />
  </div>
</template>
