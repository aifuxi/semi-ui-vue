<script setup lang="ts">
import { IconCheckboxIndeterminate, IconCheckboxTick } from '@workspace/icons';
import { CheckboxFoundation, type CheckboxAdapter } from '@workspace/foundation-integration';
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
  useId,
  useSlots,
  useTemplateRef,
  watch,
} from 'vue';

import CheckboxNodeRenderer from './CheckboxNodeRenderer';
import { checkboxGroupContextKey } from './checkbox-context';
import type {
  CheckboxChangeEvent,
  CheckboxEmits,
  CheckboxExposed,
  CheckboxProps,
  CheckboxSlots,
} from './types';

defineOptions({ name: 'Checkbox', inheritAttrs: false });

const props = defineProps<CheckboxProps>();
const emit = defineEmits<CheckboxEmits>();
defineSlots<CheckboxSlots>();

interface CheckboxState {
  checked: boolean;
  addonId: string | undefined;
  extraId: string | undefined;
  focusVisible: boolean;
}

interface FoundationCheckboxProps extends Record<string, unknown> {
  checked?: boolean | undefined;
  disabled: boolean;
  children?: boolean | undefined;
  extra?: boolean | undefined;
  addonId?: string | undefined;
  extraId?: string | undefined;
  value?: unknown;
}

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const group = inject(checkboxGroupContextKey, undefined);
const input = useTemplateRef<HTMLInputElement>('input');
const generatedId = useId().replaceAll(':', '');
const prefix = computed(() => props.prefixCls ?? 'semi-checkbox');

function hasRawProp(key: string): boolean {
  const kebabKey = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  const raw = instance?.vnode.props;
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, key) ||
      Object.prototype.hasOwnProperty.call(raw, kebabKey)),
  );
}

const hasChecked = computed(() => hasRawProp('checked'));
const hasModelValue = computed(() => hasRawProp('modelValue'));
const controlled = computed(() => hasChecked.value || hasModelValue.value);
const controlledChecked = computed(() =>
  hasChecked.value ? (props.checked ?? false) : (props.modelValue ?? false),
);
const inGroup = computed(() => Boolean(group && hasRawProp('value')));
const hasAddon = computed(() => slots.default !== undefined);
const hasExtra = computed(() => slots.extra !== undefined || Boolean(props.extra));
const ariaInvalidValue = computed(() =>
  hasRawProp('ariaInvalid') ? props.ariaInvalid : undefined,
);
const ariaRequiredValue = computed(() =>
  hasRawProp('ariaRequired') ? props.ariaRequired : undefined,
);
const initialChecked = controlled.value
  ? (controlledChecked.value ?? props.defaultChecked ?? false)
  : (props.defaultChecked ?? false);
const state = shallowReactive<CheckboxState>({
  checked: initialChecked,
  addonId: props.addonId,
  extraId: props.extraId,
  focusVisible: false,
});
const cache = new Map<string, unknown>();

const effectiveChecked = computed(() =>
  inGroup.value ? group!.value.value.includes(props.value) : state.checked,
);
const effectiveDisabled = computed(() => Boolean(props.disabled || group?.disabled.value));
const isPureCardType = computed(() =>
  inGroup.value ? group!.isPureCardType.value : props.type === 'pureCard',
);
const isCardType = computed(() =>
  inGroup.value ? group!.isCardType.value : props.type === 'card' || isPureCardType.value,
);
const focusOuter = computed(() => isCardType.value || isPureCardType.value);
const rootClasses = computed(() => [
  attrs.class,
  props.className,
  prefix.value,
  effectiveDisabled.value ? `${prefix.value}-disabled` : undefined,
  props.indeterminate ? `${prefix.value}-indeterminate` : undefined,
  effectiveChecked.value ? `${prefix.value}-checked` : `${prefix.value}-unChecked`,
  isCardType.value ? `${prefix.value}-cardType` : undefined,
  effectiveDisabled.value && isCardType.value ? `${prefix.value}-cardType_disabled` : undefined,
  !effectiveDisabled.value && isCardType.value ? `${prefix.value}-cardType_enable` : undefined,
  isCardType.value && effectiveChecked.value && !effectiveDisabled.value
    ? `${prefix.value}-cardType_checked`
    : undefined,
  isCardType.value && effectiveChecked.value && effectiveDisabled.value
    ? `${prefix.value}-cardType_checked_disabled`
    : undefined,
  state.focusVisible && focusOuter.value ? `${prefix.value}-focus` : undefined,
]);
const innerClasses = computed(() => [
  `${prefix.value}-inner`,
  effectiveChecked.value ? `${prefix.value}-inner-checked` : undefined,
  isPureCardType.value ? `${prefix.value}-inner-pureCardType` : undefined,
]);
const displayClasses = computed(() => [
  `${prefix.value}-inner-display`,
  state.focusVisible && !focusOuter.value ? `${prefix.value}-focus` : undefined,
  state.focusVisible && !focusOuter.value && !effectiveChecked.value
    ? `${prefix.value}-focus-border`
    : undefined,
]);
const extraClasses = computed(() => [
  `${prefix.value}-extra`,
  isCardType.value && !hasAddon.value ? `${prefix.value}-cardType_extra_noChildren` : undefined,
]);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([name]) => name.startsWith('data-') || name.toLowerCase().startsWith('onmouse'),
    ),
  ),
);

function getFoundationProps(): FoundationCheckboxProps {
  const output: FoundationCheckboxProps = {
    disabled: effectiveDisabled.value,
    children: hasAddon.value || undefined,
    extra: hasExtra.value || undefined,
    addonId: state.addonId,
    extraId: state.extraId,
    value: props.value,
  };
  if (controlled.value) output.checked = controlledChecked.value;
  return output;
}

function generateEvent(checked: boolean, event: Event): CheckboxChangeEvent {
  return {
    target: { ...props, checked, value: props.value },
    stopPropagation: () => event.stopPropagation(),
    preventDefault: () => event.preventDefault(),
    nativeEvent: {
      stopImmediatePropagation: () => event.stopImmediatePropagation?.(),
    },
  };
}

const adapter: CheckboxAdapter<FoundationCheckboxProps, CheckboxState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key as keyof FoundationCheckboxProps],
  getProps: getFoundationProps,
  getState: (key) => state[key as keyof CheckboxState],
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
  getIsInGroup: () => inGroup.value,
  getGroupValue: () => group?.value.value ?? [],
  notifyGroupChange: (event) => group?.onChange(event as CheckboxChangeEvent),
  getGroupDisabled: () => group?.disabled.value ?? false,
  setNativeControlChecked: (checked) => {
    state.checked = checked;
  },
  notifyChange: (event) => {
    const checkboxEvent = event as CheckboxChangeEvent;
    emit('change', checkboxEvent);
    emit('update:checked', checkboxEvent.target.checked);
    emit('update:modelValue', checkboxEvent.target.checked);
  },
  setAddonId: () => {
    state.addonId = props.addonId ?? `addon-${generatedId}`;
  },
  setExtraId: () => {
    state.extraId = props.extraId ?? `extra-${generatedId}`;
  },
  setFocusVisible: (focusVisible) => {
    state.focusVisible = focusVisible;
  },
  focusCheckboxEntity: () => focus(),
  generateEvent,
};
const foundation = markRaw(new CheckboxFoundation<FoundationCheckboxProps, CheckboxState>(adapter));

function focus(): void {
  input.value?.focus({ preventScroll: props.preventScroll });
}

function blur(): void {
  input.value?.blur();
}

function handleChange(event: Event): void {
  foundation.handleChange(event);
  if (controlled.value || inGroup.value) {
    void nextTick(() => {
      if (input.value) input.value.checked = effectiveChecked.value;
    });
  }
}

watch(controlledChecked, (checked) => {
  if (controlled.value && !inGroup.value) foundation.setChecked(checked);
});
watch(
  () => props.addonId,
  (addonId) => {
    if (addonId !== undefined) state.addonId = addonId;
  },
);
watch(
  () => props.extraId,
  (extraId) => {
    if (extraId !== undefined) state.extraId = extraId;
  },
);

onMounted(() => foundation.init());
onBeforeUnmount(() => foundation.destroy());

defineExpose<CheckboxExposed>({
  get input() {
    return input.value;
  },
  focus,
  blur,
});
</script>

<template>
  <span
    v-bind="rootAttrs"
    :id="props.id"
    :role="props.role"
    :tabindex="props.tabIndex"
    :class="rootClasses"
    :style="attrs.style"
    :aria-labelledby="props.ariaLabelledby"
    @click="handleChange"
    @keypress="foundation.handleEnterPress"
  >
    <span :class="innerClasses">
      <input
        ref="input"
        type="checkbox"
        :class="`${prefix}-input`"
        :checked="effectiveChecked"
        :disabled="effectiveDisabled"
        :name="inGroup ? group?.name.value : undefined"
        :aria-label="props.ariaLabel"
        :aria-disabled="effectiveDisabled"
        :aria-checked="effectiveChecked"
        :aria-labelledby="hasAddon ? state.addonId : undefined"
        :aria-describedby="hasExtra ? state.extraId : props.ariaDescribedby"
        :aria-invalid="ariaInvalidValue"
        :aria-errormessage="props.ariaErrormessage"
        :aria-required="ariaRequiredValue"
        @focus="foundation.handleFocusVisible"
        @blur="foundation.handleBlur"
      />
      <span :class="displayClasses">
        <IconCheckboxTick v-if="effectiveChecked" />
        <IconCheckboxIndeterminate v-else-if="props.indeterminate" />
      </span>
    </span>
    <div v-if="hasAddon || hasExtra" :class="`${prefix}-content`">
      <span v-if="hasAddon" :id="state.addonId" :class="`${prefix}-addon`" x-semi-prop="children">
        <slot />
      </span>
      <div v-if="hasExtra" :id="state.extraId" :class="extraClasses" x-semi-prop="extra">
        <slot name="extra"><CheckboxNodeRenderer :content="props.extra" /></slot>
      </div>
    </div>
  </span>
</template>
