<script setup lang="ts">
import { RadioFoundation, RadioInnerFoundation } from '@workspace/foundation-integration';
import { IconRadio } from '@aifuxi/semi-icons-vue';
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

import RadioNodeRenderer from './RadioNodeRenderer';
import { radioGroupContextKey } from './radio-context';
import type { RadioChangeEvent, RadioEmits, RadioExposed, RadioProps, RadioSlots } from './types';

defineOptions({ name: 'Radio', inheritAttrs: false });

const props = withDefaults(defineProps<RadioProps>(), {
  autoFocus: false,
  defaultChecked: false,
  disabled: false,
  displayMode: '',
  mode: '',
  type: 'default',
});
const emit = defineEmits<RadioEmits>();
defineSlots<RadioSlots>();

interface RadioState {
  hover: boolean;
  addonId: string | undefined;
  extraId: string | undefined;
  focusVisible: boolean;
  checked: boolean;
}

interface RadioInnerState {
  checked: boolean;
}

interface FoundationRadioProps extends Record<string, unknown> {
  checked?: boolean | undefined;
  defaultChecked: boolean;
  disabled: boolean;
  children?: boolean | undefined;
  extra?: boolean | undefined;
  addonId?: string | undefined;
  extraId?: string | undefined;
  value?: string | number | boolean | undefined;
}

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const group = inject(radioGroupContextKey, undefined);
const input = useTemplateRef<HTMLInputElement>('input');
const generatedId = useId().replaceAll(':', '');
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

const hasChecked = computed(() => hasRawProp('checked'));
const hasModelValue = computed(() => hasRawProp('modelValue'));
const controlled = computed(() => hasChecked.value || hasModelValue.value);
const controlledChecked = computed(() =>
  hasChecked.value ? (props.checked ?? false) : (props.modelValue ?? false),
);
const hasAddon = computed(() => slots.default !== undefined);
const hasExtra = computed(() => slots.extra !== undefined || Boolean(props.extra));
const state = shallowReactive<RadioState>({
  hover: false,
  addonId: props.addonId,
  extraId: props.extraId,
  focusVisible: false,
  checked:
    controlled.value && !(hasChecked.value && props.checked === undefined)
      ? controlledChecked.value
      : props.defaultChecked,
});
const realChecked = computed(() => (group ? group.value.value === props.value : state.checked));
const innerState = shallowReactive<RadioInnerState>({ checked: realChecked.value });
const realDisabled = computed(() => Boolean(props.disabled || group?.disabled.value));
const realMode = computed(() => group?.mode.value ?? props.mode);
const isButtonRadioComponent = computed(() => !group && props.type === 'button');
const isButtonRadio = computed(() => group?.isButtonRadio.value ?? isButtonRadioComponent.value);
const isPureCardRadio = computed(() => group?.isPureCardRadio.value ?? props.type === 'pureCard');
const isCardRadio = computed(
  () => group?.isCardRadio.value ?? (props.type === 'card' || isPureCardRadio.value),
);
const buttonSize = computed(() => group?.buttonSize.value);
const prefix = computed(() => props.prefixCls ?? group?.prefixCls.value ?? 'semi-radio');
const focusOuter = computed(
  () => isCardRadio.value || isPureCardRadio.value || isButtonRadio.value,
);
const inputName = computed(() => props.name ?? group?.name.value);

const rootClasses = computed(() => [
  attrs.class,
  props.className,
  prefix.value,
  realDisabled.value ? `${prefix.value}-disabled` : undefined,
  realChecked.value ? `${prefix.value}-checked` : undefined,
  props.displayMode ? `${prefix.value}-${props.displayMode}` : undefined,
  isButtonRadioComponent.value ? `${prefix.value}-buttonRadioComponent` : undefined,
  group?.isButtonRadio.value ? `${prefix.value}-buttonRadioGroup` : undefined,
  group?.isButtonRadio.value && buttonSize.value
    ? `${prefix.value}-buttonRadioGroup-${buttonSize.value}`
    : undefined,
  isCardRadio.value ? `${prefix.value}-cardRadioGroup` : undefined,
  realDisabled.value && isCardRadio.value ? `${prefix.value}-cardRadioGroup_disabled` : undefined,
  isCardRadio.value && realChecked.value && !realDisabled.value
    ? `${prefix.value}-cardRadioGroup_checked`
    : undefined,
  isCardRadio.value && realChecked.value && realDisabled.value
    ? `${prefix.value}-cardRadioGroup_checked_disabled`
    : undefined,
  isCardRadio.value && !realChecked.value && state.hover && !realDisabled.value
    ? `${prefix.value}-cardRadioGroup_hover`
    : undefined,
  state.focusVisible && (isCardRadio.value || isPureCardRadio.value)
    ? `${prefix.value}-focus`
    : undefined,
]);
const innerClasses = computed(() => [
  `${prefix.value}-inner`,
  innerState.checked ? `${prefix.value}-inner-checked` : undefined,
  isButtonRadio.value ? `${prefix.value}-inner-buttonRadio` : undefined,
  isPureCardRadio.value ? `${prefix.value}-inner-pureCardRadio` : undefined,
]);
const displayClasses = computed(() => [
  state.focusVisible && !focusOuter.value ? `${prefix.value}-focus` : undefined,
  state.focusVisible && !focusOuter.value && !innerState.checked
    ? `${prefix.value}-focus-border`
    : undefined,
  !isButtonRadio.value ? `${prefix.value}-inner-display` : undefined,
]);
const addonClasses = computed(() => [
  props.addonClassName,
  !isButtonRadio.value ? `${prefix.value}-addon` : undefined,
  isButtonRadio.value ? `${prefix.value}-addon-buttonRadio` : undefined,
  isButtonRadio.value && realChecked.value
    ? `${prefix.value}-addon-buttonRadio-checked`
    : undefined,
  isButtonRadio.value && realDisabled.value
    ? `${prefix.value}-addon-buttonRadio-disabled`
    : undefined,
  isButtonRadio.value && !realChecked.value && !realDisabled.value && state.hover
    ? `${prefix.value}-addon-buttonRadio-hover`
    : undefined,
  isButtonRadio.value && buttonSize.value
    ? `${prefix.value}-addon-buttonRadio-${buttonSize.value}`
    : undefined,
  state.focusVisible && isButtonRadio.value ? `${prefix.value}-focus` : undefined,
]);
const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);

function getFoundationProps(): FoundationRadioProps {
  const output: FoundationRadioProps = {
    defaultChecked: props.defaultChecked,
    disabled: realDisabled.value,
    children: hasAddon.value || undefined,
    extra: hasExtra.value || undefined,
    addonId: state.addonId,
    extraId: state.extraId,
    value: props.value,
  };
  if (controlled.value) output.checked = controlledChecked.value;
  return output;
}

const adapter = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key: string) => getFoundationProps()[key as keyof FoundationRadioProps],
  getProps: getFoundationProps,
  getState: (key: string) => state[key as keyof RadioState],
  getStates: () => state,
  setState: (nextState: Partial<RadioState>, callback?: () => void) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key: string) => cache.get(key),
  getCaches: () => cache,
  setCache: (key: unknown, value: unknown) => cache.set(String(key), value),
  stopPropagation: (event: { stopPropagation?: () => void }) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  setHover: (hover: boolean) => {
    state.hover = hover;
  },
  setChecked: (checked: boolean) => {
    state.checked = checked;
  },
  setAddonId: () => {
    state.addonId = props.addonId ?? `addon-${generatedId}`;
  },
  setExtraId: () => {
    state.extraId = props.extraId ?? `extra-${generatedId}`;
  },
  setFocusVisible: (focusVisible: boolean) => {
    state.focusVisible = focusVisible;
  },
};
const foundation = markRaw(new RadioFoundation(adapter));

const innerAdapter = {
  ...adapter,
  getProp: (key: string) =>
    ({
      ...props,
      checked: realChecked.value,
      disabled: realDisabled.value,
      mode: realMode.value,
      name: inputName.value,
    })[key as keyof RadioProps],
  getProps: () => ({
    ...props,
    checked: realChecked.value,
    disabled: realDisabled.value,
    mode: realMode.value,
    name: inputName.value,
  }),
  getState: (key: string) => innerState[key as keyof RadioInnerState],
  getStates: () => innerState,
  setState: (nextState: Partial<RadioInnerState>, callback?: () => void) => {
    Object.assign(innerState, nextState);
    callback?.();
  },
  setNativeControlChecked: (checked: boolean) => {
    innerState.checked = checked;
  },
  notifyChange: (event: unknown) => handleRadioChange(event as RadioChangeEvent),
};
const innerFoundation = markRaw(new RadioInnerFoundation(innerAdapter));

function handleRadioChange(event: RadioChangeEvent): void {
  group?.onChange(event);
  if (!group && !controlled.value) foundation.setChecked(event.target.checked);
  emit('change', event);
  emit('update:checked', event.target.checked);
  emit('update:modelValue', event.target.checked);
  if (controlled.value || group) {
    void nextTick(() => {
      if (input.value) input.value.checked = realChecked.value;
    });
  }
}

function handleMouseEnter(event: MouseEvent): void {
  emit('mouseenter', event);
  foundation.setHover(true);
}

function handleMouseLeave(event: MouseEvent): void {
  emit('mouseleave', event);
  foundation.setHover(false);
}

function focus(): void {
  input.value?.focus({ preventScroll: props.preventScroll });
}

function blur(): void {
  input.value?.blur();
}

watch(controlledChecked, (checked) => {
  if (controlled.value && !group) foundation.setChecked(checked);
});
watch(realChecked, (checked) => innerFoundation.setChecked(checked));
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

onMounted(() => {
  foundation.init();
  innerFoundation.init();
});
onBeforeUnmount(() => {
  foundation.destroy();
  innerFoundation.destroy();
});

defineExpose<RadioExposed>({
  get input() {
    return input.value;
  },
  focus,
  blur,
});
</script>

<template>
  <label
    v-bind="rootAttrs"
    :class="rootClasses"
    :style="props.style ?? attrs.style"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span :class="innerClasses">
      <input
        ref="input"
        :autofocus="props.autoFocus"
        :type="realMode === 'advanced' ? 'checkbox' : 'radio'"
        :checked="innerState.checked"
        :disabled="realDisabled"
        :name="inputName"
        :aria-label="props.ariaLabel"
        :aria-labelledby="hasAddon ? state.addonId : undefined"
        :aria-describedby="hasExtra ? state.extraId : undefined"
        @change="innerFoundation.handleChange"
        @focus="foundation.handleFocusVisible"
        @blur="foundation.handleBlur"
      />
      <span :class="displayClasses"><IconRadio v-if="innerState.checked" /></span>
    </span>
    <div
      v-if="hasAddon || hasExtra"
      :class="[`${prefix}-content`, isCardRadio ? `${prefix}-isCardRadioGroup_content` : undefined]"
    >
      <span
        v-if="hasAddon"
        :id="state.addonId"
        :class="addonClasses"
        :style="props.addonStyle"
        x-semi-prop="children"
      >
        <slot />
      </span>
      <div
        v-if="hasExtra && !isButtonRadio"
        :id="state.extraId"
        :class="`${prefix}-extra`"
        x-semi-prop="extra"
      >
        <slot name="extra"><RadioNodeRenderer :content="props.extra" /></slot>
      </div>
    </div>
  </label>
</template>
