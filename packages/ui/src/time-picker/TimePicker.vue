<script setup lang="ts">
import { IconClock } from '@workspace/icons';
import { enUS, zhCN } from 'date-fns/locale';
import {
  computed,
  getCurrentInstance,
  h,
  inject,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type VNodeChild,
} from 'vue';

import { configContextKey, semiGlobal, type ConfigContextValue } from '../config-provider';
import Input from '../input/Input.vue';
import type { InputExposed } from '../input';
import Tooltip from '../tooltip/Tooltip.vue';
import type { TooltipPosition } from '../tooltip';
import TimePickerNodeRenderer from './TimePickerNodeRenderer';
import TimePickerPanel from './TimePickerPanel.vue';
import type {
  TimePickerDisabledOptions,
  TimePickerEmits,
  TimePickerExposed,
  TimePickerLocale,
  TimePickerPanelType,
  TimePickerProps,
  TimePickerSlots,
  TimePickerTriggerSlotProps,
  TimePickerValue,
} from './types';
import { useTimePickerFoundation } from './use-time-picker-foundation';

const DEFAULT_ZH_CN_LOCALE: Readonly<TimePickerLocale> = Object.freeze({
  AM: '上午',
  PM: '下午',
  begin: '开始时间',
  end: '结束时间',
  hour: '时',
  minute: '分',
  placeholder: { time: '请选择时间', timeRange: '请选择时间范围' },
  second: '秒',
});
const DEFAULT_EN_US_LOCALE: Readonly<TimePickerLocale> = Object.freeze({
  AM: 'AM',
  PM: 'PM',
  begin: 'Start Time',
  end: 'End Time',
  hour: '',
  minute: '',
  placeholder: { time: 'Select time', timeRange: 'Select a time range' },
  second: '',
});

defineOptions({ name: 'TimePicker', inheritAttrs: false });
const props = defineProps<TimePickerProps>();
const emit = defineEmits<TimePickerEmits>();
defineSlots<TimePickerSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const inputComponent = useTemplateRef<InputExposed>('inputComponent');
const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', locale: { code: 'zh-CN' } } as ConfigContextValue),
);

function hasRawProp(name: string): boolean {
  const raw = instance?.vnode.props;
  const kebabName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebabName)),
  );
}

function resolveProp<Key extends keyof TimePickerProps>(
  key: Key,
  fallback: NonNullable<TimePickerProps[Key]>,
): NonNullable<TimePickerProps[Key]> {
  if (hasRawProp(String(key)) && props[key] !== undefined) {
    return props[key] as NonNullable<TimePickerProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.TimePicker?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<TimePickerProps[Key]>;
}

const modelControlled = computed(() => hasRawProp('modelValue'));
const valueControlled = computed(() => hasRawProp('value'));
const controlledValue = computed(() => modelControlled.value || valueControlled.value);
const incomingValue = computed<TimePickerValue>(() =>
  modelControlled.value ? props.modelValue : props.value,
);
const controlledOpen = computed(() => hasRawProp('open'));
const incomingOpen = computed(() => props.open);
const type = computed(() => props.type ?? 'time');
const locale = computed<TimePickerLocale>(() => {
  const providerLocale = config.value.locale.TimePicker as TimePickerLocale | undefined;
  const code = props.localeCode ?? config.value.locale.code ?? 'zh-CN';
  return (
    props.locale ??
    providerLocale ??
    (code === 'en-US' ? DEFAULT_EN_US_LOCALE : DEFAULT_ZH_CN_LOCALE)
  );
});
const runtimeProps = computed<TimePickerProps>(
  () =>
    ({
      ...props,
      autoAdjustOverflow: resolveProp('autoAdjustOverflow', true),
      borderless: resolveProp('borderless', false),
      clearText: props.clearText ?? 'clear',
      dateFnsLocale:
        props.dateFnsLocale ??
        ((props.localeCode ?? config.value.locale.code) === 'en-US' ? enUS : zhCN),
      disabled: resolveProp('disabled', false),
      disabledHours: props.disabledHours ?? (() => []),
      disabledMinutes: props.disabledMinutes ?? (() => []),
      disabledSeconds: props.disabledSeconds ?? (() => []),
      focusOnOpen: resolveProp('focusOnOpen', false),
      getPopupContainer: props.getPopupContainer,
      hideDisabledOptions: resolveProp('hideDisabledOptions', false),
      inputReadOnly: resolveProp('inputReadOnly', false),
      locale: locale.value,
      localeCode: props.localeCode ?? config.value.locale.code ?? 'zh-CN',
      motion: resolveProp('motion', true),
      onChangeWithDateFirst: resolveProp('onChangeWithDateFirst', true),
      position: props.position ?? (config.value.direction === 'rtl' ? 'bottomRight' : 'bottomLeft'),
      preventScroll: resolveProp('preventScroll', false),
      rangeSeparator: props.rangeSeparator ?? ' ~ ',
      showClear: resolveProp('showClear', true),
      size: props.size ?? 'default',
      stopPropagation: resolveProp('stopPropagation', true),
      timeZone: hasRawProp('timeZone') ? props.timeZone : config.value.timeZone,
      type: type.value,
      use12Hours: resolveProp('use12Hours', false),
      validateStatus: props.validateStatus ?? 'default',
      zIndex: props.zIndex ?? 1030,
    }) as TimePickerProps,
);

const { foundation, state } = useTimePickerFoundation({
  controlledOpen,
  controlledValue,
  direction: computed(() => config.value.direction),
  emit,
  incomingOpen,
  incomingValue,
  runtimeProps,
});

const format = computed(
  () => runtimeProps.value.format ?? (runtimeProps.value.use12Hours ? 'a h:mm:ss' : 'HH:mm:ss'),
);
const placeholder = computed(
  () => runtimeProps.value.placeholder ?? locale.value.placeholder[type.value],
);
const inputValidateStatus = computed(() =>
  state.invalid ? 'error' : (runtimeProps.value.validateStatus ?? 'default'),
);
const popupClass = computed(() => {
  let count = 0;
  if (/HH|hh|H|h/.test(format.value)) count += 1;
  if (/mm/.test(format.value)) count += 1;
  if (/ss/.test(format.value)) count += 1;
  if (runtimeProps.value.use12Hours) count += 1;
  return [
    'semi-timepicker-panel',
    runtimeProps.value.popupClassName,
    (!/HH|hh|H|h/.test(format.value) || !/mm/.test(format.value) || !/ss/.test(format.value)) &&
    !runtimeProps.value.use12Hours
      ? 'semi-timepicker-panel-narrow'
      : undefined,
    type.value === 'timeRange' ? 'semi-timepicker-range-panel' : undefined,
    `semi-timepicker-panel-column-${count}`,
    `semi-timepicker-panel-${runtimeProps.value.size}`,
    config.value.direction === 'rtl' ? 'semi-popover-rtl' : undefined,
  ];
});
const rootClasses = computed(() => ['semi-timepicker', attrs.class, props.className]);
const nativeInputAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([name]) => !['class', 'style'].includes(name) && !name.startsWith('data-'),
    ),
  ),
);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const tooltipOptionalProps = computed<Record<string, unknown>>(() =>
  Object.fromEntries(
    [
      ['getPopupContainer', runtimeProps.value.getPopupContainer],
      ['margin', runtimeProps.value.dropdownMargin],
    ].filter((entry) => entry[1] !== undefined),
  ),
);
const inputBindProps = computed<Record<string, unknown>>(() => ({
  ...dataAttrs.value,
  ...nativeInputAttrs.value,
  ...Object.fromEntries(
    [
      ['id', runtimeProps.value.id],
      ['ariaDescribedby', runtimeProps.value.ariaDescribedby],
      ['ariaErrormessage', runtimeProps.value.ariaErrormessage],
      ['ariaInvalid', runtimeProps.value.ariaInvalid],
      ['ariaLabel', runtimeProps.value.ariaLabel],
      ['ariaLabelledby', runtimeProps.value.ariaLabelledby],
      ['ariaRequired', runtimeProps.value.ariaRequired],
      ['insetLabel', runtimeProps.value.insetLabel],
      ['insetLabelId', runtimeProps.value.insetLabelId],
      ['inputStyle', runtimeProps.value.inputStyle],
    ].filter((entry) => entry[1] !== undefined),
  ),
}));
const clockIcon = computed(() => h(IconClock, { onClick: open }));

function panelType(index: number): TimePickerPanelType {
  return index === 0 ? 'left' : 'right';
}

function disabledOptions(index: number): TimePickerDisabledOptions {
  const fallback: TimePickerDisabledOptions = {
    disabledHours: runtimeProps.value.disabledHours ?? (() => []),
    disabledMinutes: runtimeProps.value.disabledMinutes ?? (() => []),
    disabledSeconds: runtimeProps.value.disabledSeconds ?? (() => []),
  };
  if (type.value !== 'timeRange' || !runtimeProps.value.disabledTime) return fallback;
  return { ...fallback, ...runtimeProps.value.disabledTime(state.value, panelType(index)) };
}

function panelContent(kind: 'panelHeader' | 'panelFooter', index: number): VNodeChild {
  const panel = runtimeProps.value.panels?.[index]?.[kind];
  if (panel !== undefined) return panel;
  const slot = kind === 'panelHeader' ? slots.panelHeader : slots.panelFooter;
  if (slot) return slot({ index, panelType: panelType(index) });
  const value = runtimeProps.value[kind];
  if (Array.isArray(value)) return value[index];
  if (hasRawProp(kind)) return value;
  if (kind === 'panelHeader' && type.value === 'timeRange') {
    return index === 0 ? locale.value.begin : locale.value.end;
  }
  return undefined;
}

function open(): void {
  if (!runtimeProps.value.disabled) foundation.handlePanelOpen();
}

function close(event: FocusEvent | MouseEvent = new MouseEvent('mousedown')): void {
  if (state.open || controlledOpen.value) foundation.handlePanelClose(false, event);
}

function clear(): void {
  foundation.handleInputChange('');
}

function focus(): void {
  if (runtimeProps.value.disabled) return;
  inputComponent.value?.focus();
}

function blur(): void {
  inputComponent.value?.blur();
}

function handleFocus(event: FocusEvent): void {
  foundation.handleFocus(event);
}

function handleInput(value: string): void {
  foundation.handleInputChange(value);
}

function handlePanelChange(
  value: { isAM: boolean; timeStampValue: number; value: string },
  index: number,
): void {
  foundation.handlePanelChange(value, index);
}

function triggerSlotProps(): TimePickerTriggerSlotProps {
  return {
    clear,
    close: () => close(),
    inputValue: state.inputValue,
    open: state.open,
    openPanel: open,
    placeholder: placeholder.value,
    value: [...state.value],
  };
}

watch(
  () => state.open,
  (opened) => {
    if (!opened || !runtimeProps.value.focusOnOpen || !inputComponent.value) return;
    requestAnimationFrame(() => {
      inputComponent.value?.focus();
      inputComponent.value?.select();
    });
  },
);
watch(format, (value) => {
  state.showHour = /HH|hh|H|h/.test(value);
  state.showMinute = /mm/.test(value);
  state.showSecond = /ss/.test(value);
  foundation.refreshProps({ value: controlledValue.value ? incomingValue.value : state.value });
});

defineExpose<TimePickerExposed>({ blur, close: () => close(), focus, open });
</script>

<template>
  <Tooltip
    v-bind="tooltipOptionalProps"
    :auto-adjust-overflow="Boolean(runtimeProps.autoAdjustOverflow)"
    :motion="runtimeProps.motion !== false"
    :position="(runtimeProps.position ?? 'bottomLeft') as TooltipPosition"
    prefix-cls="semi-popover"
    role="dialog"
    :show-arrow="false"
    :spacing="4"
    :stop-propagation="runtimeProps.stopPropagation !== false"
    trigger="custom"
    :visible="!runtimeProps.disabled && state.open"
    :z-index="Number(runtimeProps.zIndex)"
    @click-outside="(event) => foundation.handlePanelClose(true, event)"
  >
    <template #content>
      <div :class="popupClass" :style="runtimeProps.popupStyle">
        <div class="semi-popover-content">
          <div :class="type === 'timeRange' ? 'semi-timepicker-lists' : undefined">
            <TimePickerPanel
              v-for="index in type === 'timeRange' ? 2 : 1"
              :key="index - 1"
              :disabled-options="disabledOptions(index - 1)"
              :format="format"
              :hide-disabled-options="Boolean(runtimeProps.hideDisabledOptions)"
              :hour-step="runtimeProps.hourStep"
              :index="index - 1"
              :is-a-m="state.isAM[index - 1] ?? true"
              :locale="locale"
              :minute-step="runtimeProps.minuteStep"
              :panel-footer="panelContent('panelFooter', index - 1)"
              :panel-header="panelContent('panelHeader', index - 1)"
              :panel-type="panelType(index - 1)"
              :scroll-item-props="runtimeProps.scrollItemProps"
              :second-step="runtimeProps.secondStep"
              :show-footer="Boolean(panelContent('panelFooter', index - 1))"
              :show-header="type === 'timeRange' || Boolean(panelContent('panelHeader', index - 1))"
              :time-stamp-value="state.value[index - 1]"
              :use12-hours="Boolean(runtimeProps.use12Hours)"
              @change="handlePanelChange"
            />
          </div>
        </div>
      </div>
    </template>

    <div
      :class="rootClasses"
      :style="[attrs.style, props.style]"
      @click="slots.trigger || runtimeProps.triggerRender ? open() : undefined"
    >
      <slot v-if="slots.trigger" name="trigger" v-bind="triggerSlotProps()" />
      <TimePickerNodeRenderer
        v-else-if="runtimeProps.triggerRender"
        :content="runtimeProps.triggerRender(triggerSlotProps())"
      />
      <span v-else class="semi-timepicker-header">
        <div class="semi-timepicker-input-wrap">
          <Input
            v-bind="inputBindProps"
            ref="inputComponent"
            :auto-focus="Boolean(runtimeProps.autoFocus)"
            :borderless="Boolean(runtimeProps.borderless)"
            class-name="semi-timepicker-input"
            :disabled="Boolean(runtimeProps.disabled)"
            hide-suffix
            :placeholder="placeholder"
            :prevent-scroll="Boolean(runtimeProps.preventScroll)"
            :readonly="Boolean(runtimeProps.inputReadOnly)"
            :show-clear="runtimeProps.disabled ? false : Boolean(runtimeProps.showClear)"
            :size="runtimeProps.size ?? 'default'"
            :suffix="clockIcon"
            :validate-status="inputValidateStatus"
            :value="state.inputValue"
            @blur="(event) => foundation.handleInputBlur(event)"
            @change="handleInput"
            @focus="handleFocus"
          >
            <template v-if="slots.insetLabel" #insetLabel><slot name="insetLabel" /></template>
            <template v-if="slots.clearIcon" #clearIcon><slot name="clearIcon" /></template>
          </Input>
        </div>
      </span>
    </div>
  </Tooltip>
</template>
