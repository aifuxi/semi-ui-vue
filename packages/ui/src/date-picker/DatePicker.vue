<script setup lang="ts">
import {
  DatePickerFoundation,
  getDatePickerDefaultFormat,
  type DatePickerAdapter,
  type FoundationDatePickerProps,
  type FoundationDatePickerState,
} from '@workspace/foundation-integration';
import { IconCalendar, IconCalendarClock, IconClear } from '@aifuxi/semi-icons-vue';
import { enUS, zhCN } from 'date-fns/locale';
import {
  computed,
  getCurrentInstance,
  inject,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type VNodeChild,
} from 'vue';

import { configContextKey, semiGlobal, type ConfigContextValue } from '../config-provider';
import { Input, type InputExposed } from '../input';
import { Popover } from '../popover';
import DatePickerNodeRenderer from './DatePickerNodeRenderer';
import DatePickerPanel from './DatePickerPanel.vue';
import type {
  DatePickerEmits,
  DatePickerExposed,
  DatePickerDayStatus,
  DatePickerLocale,
  DatePickerPreset,
  DatePickerProps,
  DatePickerRangeType,
  DatePickerSlots,
  DatePickerTriggerSlotProps,
  DatePickerValue,
} from './types';

const DEFAULT_ZH_CN_LOCALE: Readonly<DatePickerLocale> = Object.freeze({
  placeholder: {
    date: '请选择日期',
    dateTime: '请选择日期及时间',
    dateRange: ['开始日期', '结束日期'],
    dateTimeRange: ['开始日期', '结束日期'],
    monthRange: ['开始月份', '结束月份'],
    month: '请选择月份',
    year: '请选择年份',
  },
  presets: '快捷选择',
  footer: { confirm: '确定', cancel: '取消' },
  selectDate: '返回选择日期',
  selectTime: '选择时间',
  year: '年',
  month: '月',
  day: '日',
  monthText: '${year}年 ${month}',
  months: Object.fromEntries(
    Array.from({ length: 12 }, (_, index) => [index + 1, `${index + 1}月`]),
  ),
  fullMonths: Object.fromEntries(
    Array.from({ length: 12 }, (_, index) => [index + 1, String(index + 1)]),
  ),
  weeks: { Mon: '一', Tue: '二', Wed: '三', Thu: '四', Fri: '五', Sat: '六', Sun: '日' },
  localeFormatToken: { FORMAT_SWITCH_DATE: 'yyyy-MM-dd' },
});
const DEFAULT_EN_US_LOCALE: Readonly<DatePickerLocale> = Object.freeze({
  placeholder: {
    date: 'Select date',
    dateTime: 'Select date and time',
    dateRange: ['Start date', 'End date'],
    dateTimeRange: ['Start date', 'End date'],
    monthRange: ['Start month', 'End month'],
    month: 'Select month',
    year: 'Select year',
  },
  presets: 'Presets',
  footer: { confirm: 'Confirm', cancel: 'Cancel' },
  selectDate: 'Select Date',
  selectTime: 'Select Time',
  year: 'year',
  month: 'month',
  day: 'day',
  monthText: '${month} ${year}',
  months: {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  },
  fullMonths: {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  },
  weeks: { Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Fri: 'Fri', Sat: 'Sat', Sun: 'Sun' },
  localeFormatToken: { FORMAT_SWITCH_DATE: 'MM/dd/yyyy' },
});

defineOptions({ name: 'DatePicker', inheritAttrs: false });
const props = defineProps<DatePickerProps>();
const emit = defineEmits<DatePickerEmits>();
defineSlots<DatePickerSlots>();
const attrs = useAttrs();
const slots = useSlots() as Readonly<DatePickerSlots>;
const instance = getCurrentInstance();
const inputComponent = useTemplateRef<InputExposed>('inputComponent');
const rangeStartComponent = useTemplateRef<InputExposed>('rangeStartComponent');
const rangeEndComponent = useTemplateRef<InputExposed>('rangeEndComponent');
const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', locale: { code: 'zh-CN' } } as ConfigContextValue),
);

function hasRawProp(name: string): boolean {
  const raw = instance?.vnode.props;
  const kebab = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}

function resolveProp<Key extends keyof DatePickerProps>(
  key: Key,
  fallback: NonNullable<DatePickerProps[Key]>,
): NonNullable<DatePickerProps[Key]> {
  if (hasRawProp(String(key)) && props[key] !== undefined)
    return props[key] as NonNullable<DatePickerProps[Key]>;
  const globalValue = semiGlobal.config.overrideDefaultProps?.DatePicker?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<DatePickerProps[Key]>;
}

const modelControlled = computed(() => hasRawProp('modelValue'));
const valueControlled = computed(() => hasRawProp('value'));
const controlledValue = computed(() => modelControlled.value || valueControlled.value);
const incomingValue = computed<DatePickerValue | undefined>(() =>
  modelControlled.value ? props.modelValue : props.value,
);
const controlledOpen = computed(() => hasRawProp('open'));
const type = computed(() => props.type ?? 'date');
const isRange = computed(() => type.value.includes('Range') && type.value !== 'monthRange');
const localeCode = computed(() => props.localeCode ?? config.value.locale.code ?? 'zh-CN');
const locale = computed<DatePickerLocale>(() => {
  const fallback = localeCode.value === 'en-US' ? DEFAULT_EN_US_LOCALE : DEFAULT_ZH_CN_LOCALE;
  const provider = config.value.locale.DatePicker as Partial<DatePickerLocale> | undefined;
  const explicit = props.locale;
  const candidate = explicit ?? provider;
  if (!candidate) return fallback;
  return {
    ...fallback,
    ...candidate,
    placeholder: { ...fallback.placeholder, ...candidate.placeholder },
    footer: { ...fallback.footer, ...candidate.footer },
    months: { ...fallback.months, ...candidate.months },
    fullMonths: { ...fallback.fullMonths, ...candidate.fullMonths },
    weeks: { ...fallback.weeks, ...candidate.weeks },
    localeFormatToken: { ...fallback.localeFormatToken, ...candidate.localeFormatToken },
  };
});
const placeholder = computed(() => props.placeholder ?? locale.value.placeholder[type.value] ?? '');
const runtimeProps = computed<DatePickerProps>(
  () =>
    ({
      ...props,
      autoAdjustOverflow: resolveProp('autoAdjustOverflow', true),
      autoFocus: resolveProp('autoFocus', false),
      autoSwitchDate: resolveProp('autoSwitchDate', true),
      borderless: resolveProp('borderless', false),
      dateFnsLocale:
        props.dateFnsLocale ??
        (config.value.locale as { dateFnsLocale?: unknown }).dateFnsLocale ??
        (localeCode.value === 'en-US' ? enUS : zhCN),
      defaultOpen: props.defaultOpen ?? false,
      density: props.density ?? 'default',
      disabled: resolveProp('disabled', false),
      disabledDate: props.disabledDate ?? (() => false),
      disabledTime: props.disabledTime ?? (() => ({})),
      format: props.format ?? getDatePickerDefaultFormat(type.value),
      getPopupContainer: props.getPopupContainer ?? config.value.getPopupContainer,
      hideDisabledOptions: props.hideDisabledOptions ?? false,
      inputReadOnly: resolveProp('inputReadOnly', false),
      locale: locale.value,
      localeCode: localeCode.value,
      motion: resolveProp('motion', true),
      multiple: resolveProp('multiple', false),
      onChangeWithDateFirst: resolveProp('onChangeWithDateFirst', true),
      position: props.position ?? (config.value.direction === 'rtl' ? 'bottomRight' : 'bottomLeft'),
      presetPosition: props.presetPosition ?? 'bottom',
      presets: props.presets ?? [],
      rangeSeparator: props.rangeSeparator ?? ' ~ ',
      showClear: resolveProp('showClear', true),
      size: props.size ?? 'default',
      spacing: props.spacing ?? (props.insetInput ? 1 : 4),
      stopPropagation: resolveProp('stopPropagation', true),
      syncSwitchMonth: props.syncSwitchMonth ?? false,
      timeZone: hasRawProp('timeZone') ? props.timeZone : config.value.timeZone,
      type: type.value,
      validateStatus: props.validateStatus ?? 'default',
      weekStartsOn: props.weekStartsOn ?? 0,
      zIndex: props.zIndex ?? 1030,
    }) as DatePickerProps,
);

const state = shallowReactive<FoundationDatePickerState>({
  panelShow: Boolean(props.open ?? props.defaultOpen),
  isRange: isRange.value,
  inputValue: null,
  value: [],
  cachedSelectedValue: [],
  prevTimeZone: null,
  rangeInputFocus: undefined,
  autofocus: Boolean(props.autoFocus || (isRange.value && (props.open || props.defaultOpen))),
  insetInputValue: null,
  triggerDisabled: undefined,
});
const cache = new Map<unknown, unknown>();
const focusRecords = { rangeStart: false, rangeEnd: false };

function foundationProps(): FoundationDatePickerProps {
  const output = { ...runtimeProps.value } as FoundationDatePickerProps;
  if (controlledValue.value && incomingValue.value !== undefined)
    output.value = incomingValue.value;
  else delete output.value;
  if (controlledOpen.value) output.open = props.open;
  else delete output.open;
  return output;
}

function dateFromNotification(first: unknown, second: unknown): Date | Date[] | undefined {
  const candidate = runtimeProps.value.onChangeWithDateFirst ? first : second;
  return candidate instanceof Date ||
    (Array.isArray(candidate) && candidate.every((item) => item instanceof Date))
    ? (candidate as Date | Date[])
    : undefined;
}

const adapter: DatePickerAdapter<FoundationDatePickerProps, FoundationDatePickerState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => foundationProps()[key],
  getProps: foundationProps,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  togglePanel: (show, callback) => {
    state.panelShow = show;
    if (!show) {
      focusRecords.rangeStart = false;
      focusRecords.rangeEnd = false;
    }
    callback?.();
  },
  registerClickOutSide: () => undefined,
  unregisterClickOutSide: () => undefined,
  notifyBlur: (event) => emit('blur', event),
  notifyFocus: (event, range) => emit('focus', event, range as DatePickerRangeType),
  notifyClear: (event) => emit('clear', event),
  notifyChange: (first, second) => {
    emit('change', first as never, second as never);
    const value = dateFromNotification(first, second);
    emit('update:modelValue', value);
    emit('update:value', value);
  },
  notifyCancel: (date, text) => emit('cancel', date as never, text as never),
  notifyConfirm: (date, text) => emit('confirm', date as never, text as never),
  notifyOpenChange: (open) => {
    emit('openChange', open);
    emit('update:open', open);
  },
  notifyPresetsClick: (item, event) =>
    emit('presetClick', item as DatePickerPreset, event as MouseEvent),
  updateValue: (value) => {
    state.value = [...value];
  },
  updatePrevTimezone: (value) => {
    state.prevTimeZone = value;
  },
  updateCachedSelectedValue: (value) => {
    state.cachedSelectedValue = [...value];
  },
  updateInputValue: (value) => {
    state.inputValue = value;
  },
  needConfirm: () =>
    ['dateTime', 'dateTimeRange'].includes(type.value) && props.needConfirm === true,
  typeIsYearOrMonth: () => ['month', 'year', 'monthRange'].includes(type.value),
  setRangeInputFocus: (focus) => {
    state.rangeInputFocus = focus;
    if (focus === 'rangeStart') {
      rangeStartComponent.value?.focus();
      setTimeout(() => {
        focusRecords.rangeStart = true;
      }, 0);
    } else if (focus === 'rangeEnd') {
      rangeEndComponent.value?.focus();
      setTimeout(() => {
        focusRecords.rangeEnd = true;
      }, 0);
    }
  },
  couldPanelClosed: () => focusRecords.rangeStart && focusRecords.rangeEnd,
  isEventTarget: (event) =>
    Boolean(event && (event as Event).target === (event as Event).currentTarget),
  updateInsetInputValue: (value) => {
    state.insetInputValue = value;
  },
  setInsetInputFocus: () =>
    state.rangeInputFocus === 'rangeEnd'
      ? rangeEndComponent.value?.focus()
      : rangeStartComponent.value?.focus(),
  setTriggerDisabled: (disabled) => {
    state.triggerDisabled = disabled;
  },
  setInputFocus: () => inputComponent.value?.focus(),
  setInputBlur: () => inputComponent.value?.blur(),
  setRangeInputBlur: () => {
    rangeStartComponent.value?.blur();
    rangeEndComponent.value?.blur();
  },
};
const foundation = markRaw(new DatePickerFoundation(adapter));
const initialValue = controlledValue.value ? incomingValue.value : props.defaultValue;
if (initialValue !== undefined) {
  foundation.initFromProps({
    value: initialValue,
    ...(runtimeProps.value.timeZone === undefined ? {} : { timeZone: runtimeProps.value.timeZone }),
  });
}

const displayText = computed(
  () =>
    state.inputValue ??
    (runtimeProps.value.multiple
      ? foundation.formatMultipleDates(state.value)
      : foundation.formatDates(state.value)),
);
const rangeText = computed(() => {
  const parts = displayText.value.split(runtimeProps.value.rangeSeparator ?? ' ~ ');
  return [parts[0] ?? '', parts[1] ?? ''] as const;
});
const inputDisabled = computed(() =>
  Boolean(runtimeProps.value.disabled || (runtimeProps.value.insetInput && state.triggerDisabled)),
);
const outerClasses = computed(() => ['semi-datepicker', props.class, props.className, attrs.class]);
const inputClasses = computed(() => [
  'semi-datepicker-input',
  isRange.value ? 'semi-datepicker-range-input' : undefined,
  isRange.value ? `semi-datepicker-range-input-${runtimeProps.value.size}` : undefined,
  isRange.value && state.rangeInputFocus && !inputDisabled.value
    ? 'semi-datepicker-range-input-active'
    : undefined,
  isRange.value && inputDisabled.value ? 'semi-datepicker-range-input-disabled' : undefined,
  isRange.value ? `semi-datepicker-range-input-${runtimeProps.value.validateStatus}` : undefined,
  runtimeProps.value.borderless ? 'semi-datepicker-borderless' : undefined,
]);
function rangeInputProps(index: 0 | 1): Record<string, unknown> {
  const value: Record<string, unknown> = {
    borderless: Boolean(runtimeProps.value.borderless),
    size: runtimeProps.value.size === 'large' ? 'default' : 'small',
    disabled: inputDisabled.value,
    readonly: Boolean(runtimeProps.value.inputReadOnly || runtimeProps.value.insetInput),
    placeholder: Array.isArray(placeholder.value)
      ? (placeholder.value[index] ?? '')
      : String(placeholder.value ?? ''),
  };
  if (runtimeProps.value.inputStyle !== undefined) value.inputStyle = runtimeProps.value.inputStyle;
  return value;
}
const singleInputProps = computed<Record<string, unknown>>(() => {
  const value: Record<string, unknown> = {
    borderless: Boolean(runtimeProps.value.borderless),
    size: runtimeProps.value.size ?? 'default',
    validateStatus: runtimeProps.value.validateStatus ?? 'default',
  };
  const optional = {
    ariaDescribedby: props.ariaDescribedby,
    ariaErrormessage: props.ariaErrormessage,
    ariaInvalid: props.ariaInvalid,
    ariaLabelledby: props.ariaLabelledby,
    ariaRequired: props.ariaRequired,
    inputStyle: runtimeProps.value.inputStyle,
    id: props.id,
  };
  for (const [key, item] of Object.entries(optional)) {
    if (item !== undefined) value[key] = item;
  }
  return value;
});
const popoverBindProps = computed<Record<string, unknown>>(() => {
  const value: Record<string, unknown> = {
    autoAdjustOverflow: runtimeProps.value.autoAdjustOverflow ?? true,
    motion: runtimeProps.value.motion ?? true,
    position: runtimeProps.value.position ?? 'bottomLeft',
    spacing: runtimeProps.value.spacing ?? 4,
    stopPropagation: runtimeProps.value.stopPropagation !== false,
    visible: state.panelShow,
    zIndex: runtimeProps.value.zIndex ?? 1030,
    trigger: 'custom',
  };
  if (runtimeProps.value.getPopupContainer)
    value.getPopupContainer = runtimeProps.value.getPopupContainer;
  if (runtimeProps.value.dropdownMargin !== undefined)
    value.margin = runtimeProps.value.dropdownMargin;
  return value;
});
const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => !['class', 'style'].includes(key))),
);
const topContent = computed<VNodeChild>(() => slots.top?.() ?? props.topSlot);
const bottomContent = computed<VNodeChild>(() => slots.bottom?.() ?? props.bottomSlot);
const leftContent = computed<VNodeChild>(() => slots.left?.() ?? props.leftSlot);
const rightContent = computed<VNodeChild>(() => slots.right?.() ?? props.rightSlot);
const renderDate = computed<((dayNumber?: number, fullDate?: string) => VNodeChild) | undefined>(
  () =>
    slots.date || props.renderDate
      ? (dayNumber, fullDate) =>
          slots.date?.({ dayNumber: dayNumber ?? 0, fullDate: fullDate ?? '' }) ??
          props.renderDate?.(dayNumber, fullDate)
      : undefined,
);
const renderFullDate = computed<
  ((dayNumber?: number, fullDate?: string, status?: DatePickerDayStatus) => VNodeChild) | undefined
>(() =>
  slots.fullDate || props.renderFullDate
    ? (dayNumber, fullDate, status) =>
        slots.fullDate?.({
          dayNumber: dayNumber ?? 0,
          fullDate: fullDate ?? '',
          status: status ?? {},
        }) ?? props.renderFullDate?.(dayNumber, fullDate, status)
    : undefined,
);

const triggerSlotProps = computed<DatePickerTriggerSlotProps>(() => ({
  value: state.value,
  inputValue: displayText.value,
  placeholder: placeholder.value,
  autoFocus: state.autofocus,
  size: runtimeProps.value.size ?? 'default',
  disabled: inputDisabled.value,
  inputReadOnly: Boolean(runtimeProps.value.inputReadOnly || runtimeProps.value.insetInput),
  componentProps: props as DatePickerProps,
  open: state.panelShow,
  openPanel: () => foundation.openPanel(),
  close: () => foundation.closePanel(),
  clear: (event) => clearValue(event),
}));
const customTrigger = computed<VNodeChild>(
  () => slots.trigger?.(triggerSlotProps.value) ?? props.triggerRender?.(triggerSlotProps.value),
);

function clearValue(event?: unknown): void {
  if (isRange.value) foundation.handleRangeInputClear(event);
  else {
    foundation.handleInputChange('', event);
    foundation.handleInputClear(event);
  }
}

function handleSingleChange(value: string, event: Event): void {
  foundation.handleInputChange(value, event);
}
function handleRangeChange(index: 0 | 1, value: string, event: Event): void {
  const next = [...rangeText.value];
  next[index] = value;
  foundation.handleInputChange(next.join(runtimeProps.value.rangeSeparator ?? ' ~ '), event);
}
function handleRangeStartChange(value: string, event: Event): void {
  handleRangeChange(0, value, event);
}
function handleRangeEndChange(value: string, event: Event): void {
  handleRangeChange(1, value, event);
}
function handleSelect(dates: Array<Date | null>): void {
  foundation.handleSelectedChange(dates as Date[], { needCheckFocusRecord: false });
  if (isRange.value && dates.length === 1) foundation.handleSetRangeFocus('rangeEnd');
}
function handleOutside(event: MouseEvent): void {
  emit('clickOutside', event);
  if (!adapter.needConfirm()) foundation.closePanel();
}
function handlePanelVisibleChange(visible: boolean): void {
  foundation.handlePanelVisibleChange(visible);
}
function handleTriggerClick(event: Event): void {
  foundation.handleTriggerWrapperClick(event);
}
function handleCancel(): void {
  foundation.handleCancel();
}
function handleConfirm(): void {
  foundation.handleConfirm();
}
function handleRangeStartFocus(event: Event): void {
  foundation.handleInputFocus(event, 'rangeStart');
}
function handleRangeEndFocus(event: Event): void {
  foundation.handleInputFocus(event, 'rangeEnd');
}
function handleRangeEndKeydown(event: KeyboardEvent): void {
  foundation.handleRangeEndTabPress(event);
}
function handleSingleFocus(event: FocusEvent): void {
  foundation.handleInputFocus(event);
}
function handleSingleClear(event: Event): void {
  foundation.handleInputClear(event);
}
function handleVisibleUpdate(visible: boolean): void {
  if (!visible && state.panelShow) foundation.closePanel();
  else if (visible && !state.panelShow) foundation.openPanel();
}
function handlePreset(preset: DatePickerPreset, event: MouseEvent): void {
  foundation.handlePresetClick(preset as unknown as Record<string, unknown>, event);
}
function handlePanelChange(date: Date | Date[], text: string | string[]): void {
  emit('panelChange', date, text);
}

function open(): void {
  foundation.open();
}
function close(): void {
  foundation.close();
}
function focus(focusType?: 'rangeStart' | 'rangeEnd'): void {
  foundation.focus(focusType);
}
function blur(): void {
  foundation.blur();
}

defineExpose<DatePickerExposed>({
  get input() {
    return inputComponent.value?.input ?? rangeStartComponent.value?.input ?? null;
  },
  open,
  close,
  focus,
  blur,
});

onMounted(() => foundation.init());
onBeforeUnmount(() => foundation.destroy());
watch(
  () => [controlledOpen.value, props.open] as const,
  ([controlled, open]) => {
    if (controlled) state.panelShow = Boolean(open);
  },
);
watch(
  () => [controlledValue.value, incomingValue.value, runtimeProps.value.timeZone] as const,
  ([controlled, value, timeZone], previous) => {
    if (!controlled) return;
    foundation.initFromProps({
      ...(value === undefined ? {} : { value }),
      ...(timeZone === undefined ? {} : { timeZone }),
      ...(previous?.[2] === undefined ? {} : { prevTimeZone: previous[2] }),
    });
  },
  { deep: true },
);
</script>

<template>
  <div v-bind="rootAttrs" :class="outerClasses" :style="[attrs.style, props.style]">
    <Popover
      v-bind="popoverBindProps"
      @click-outside="handleOutside"
      @update:visible="handleVisibleUpdate"
      @visible-change="handlePanelVisibleChange"
    >
      <template #content>
        <DatePickerPanel
          :bottom-content="bottomContent"
          :cached-value="state.cachedSelectedValue"
          :left-content="leftContent"
          :locale="locale"
          :locale-code="localeCode"
          :props="runtimeProps"
          :range-focus="state.rangeInputFocus"
          :render-date="renderDate"
          :render-full-date="renderFullDate"
          :right-content="rightContent"
          :top-content="topContent"
          :value="state.value"
          @cancel="handleCancel"
          @confirm="handleConfirm"
          @max-select="emit('maxSelect', $event)"
          @panel-change="handlePanelChange"
          @preset-click="handlePreset"
          @select="handleSelect"
        />
      </template>
      <div
        role="combobox"
        :aria-label="state.value.length ? 'Change date' : 'Choose date'"
        :aria-disabled="runtimeProps.disabled"
        :class="inputClasses"
        @click="handleTriggerClick"
      >
        <DatePickerNodeRenderer v-if="customTrigger" :content="customTrigger" />
        <template v-else-if="isRange">
          <div
            v-if="$slots.prefix || props.prefix || $slots.insetLabel || props.insetLabel"
            class="semi-datepicker-range-input-prefix"
            x-semi-prop="prefix,insetLabel"
          >
            <slot v-if="$slots.prefix || props.prefix" name="prefix"
              ><DatePickerNodeRenderer :content="props.prefix"
            /></slot>
            <slot v-else name="insetLabel"
              ><DatePickerNodeRenderer :content="props.insetLabel"
            /></slot>
          </div>
          <div
            :class="[
              'semi-datepicker-range-input-wrapper-start',
              'semi-datepicker-range-input-wrapper',
              state.rangeInputFocus === 'rangeStart' &&
                !inputDisabled &&
                'semi-datepicker-range-input-wrapper-active',
              runtimeProps.borderless && 'semi-datepicker-borderless',
            ]"
            @click.stop="handleRangeStartFocus"
          >
            <Input
              v-bind="rangeInputProps(0)"
              ref="rangeStartComponent"
              :value="rangeText[0]"
              :auto-focus="state.autofocus"
              @change="handleRangeStartChange"
              @enter-press="foundation.handleInputComplete(displayText)"
              @focus="handleRangeStartFocus"
            />
          </div>
          <span
            :class="[
              'semi-datepicker-range-input-separator',
              (rangeText[0] || rangeText[1]) &&
                !inputDisabled &&
                'semi-datepicker-range-input-separator-active',
            ]"
            @click.stop="handleRangeStartFocus"
            ><slot name="rangeSeparator"
              ><DatePickerNodeRenderer
                v-if="props.rangeSeparatorNode"
                :content="props.rangeSeparatorNode"
              /><template v-else>{{ runtimeProps.rangeSeparator }}</template></slot
            ></span
          >
          <div
            :class="[
              'semi-datepicker-range-input-wrapper-end',
              'semi-datepicker-range-input-wrapper',
              state.rangeInputFocus === 'rangeEnd' &&
                !inputDisabled &&
                'semi-datepicker-range-input-wrapper-active',
              runtimeProps.borderless && 'semi-datepicker-borderless',
            ]"
            @click.stop="handleRangeEndFocus"
          >
            <Input
              v-bind="rangeInputProps(1)"
              ref="rangeEndComponent"
              :value="rangeText[1]"
              @change="handleRangeEndChange"
              @enter-press="foundation.handleInputComplete(displayText)"
              @focus="handleRangeEndFocus"
              @keydown="handleRangeEndKeydown"
            />
          </div>
          <div
            v-if="runtimeProps.showClear && (rangeText[0] || rangeText[1]) && !inputDisabled"
            role="button"
            tabindex="0"
            aria-label="Clear range input value"
            class="semi-datepicker-range-input-clearbtn"
            @mousedown.stop="clearValue"
          >
            <slot name="clearIcon"
              ><DatePickerNodeRenderer
                v-if="props.clearIcon"
                :content="props.clearIcon" /><IconClear v-else
            /></slot>
          </div>
          <div class="semi-datepicker-range-input-suffix">
            <IconCalendarClock v-if="type.includes('Time')" /><IconCalendar v-else />
          </div>
        </template>
        <Input
          v-else
          v-bind="singleInputProps"
          ref="inputComponent"
          :auto-focus="state.autofocus"
          :class-name="[
            'semi-datepicker-input-readonly',
            type === 'monthRange' && 'semi-datepicker-monthRange-input',
          ]"
          :disabled="inputDisabled"
          :hide-suffix="Boolean(runtimeProps.showClear)"
          :placeholder="
            Array.isArray(placeholder) ? placeholder.join(runtimeProps.rangeSeparator) : placeholder
          "
          :readonly="runtimeProps.inputReadOnly || Boolean(runtimeProps.insetInput)"
          :show-clear="Boolean(runtimeProps.showClear)"
          :show-clear-ignore-disabled="Boolean(runtimeProps.insetInput)"
          :value="displayText"
          @blur="foundation.handleInputBlur(displayText, $event)"
          @change="handleSingleChange"
          @clear="handleSingleClear"
          @enter-press="foundation.handleInputComplete(displayText)"
          @focus="handleSingleFocus"
        >
          <template v-if="$slots.prefix || props.prefix" #prefix
            ><slot name="prefix"><DatePickerNodeRenderer :content="props.prefix" /></slot
          ></template>
          <template v-if="$slots.insetLabel || props.insetLabel" #insetLabel
            ><slot name="insetLabel"><DatePickerNodeRenderer :content="props.insetLabel" /></slot
          ></template>
          <template #clearIcon
            ><slot name="clearIcon"
              ><DatePickerNodeRenderer
                v-if="props.clearIcon"
                :content="props.clearIcon" /><IconClear v-else /></slot
          ></template>
          <template #suffix
            ><IconCalendarClock v-if="type.includes('Time')" /><IconCalendar v-else
          /></template>
        </Input>
      </div>
    </Popover>
  </div>
</template>
