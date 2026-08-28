import { TimePickerFoundation, type TimePickerAdapter } from '@workspace/foundation-integration';
import { markRaw, onBeforeUnmount, onMounted, reactive, watch, type ComputedRef } from 'vue';

import type {
  TimePickerChangeValue,
  TimePickerEmits,
  TimePickerFormattedValue,
  TimePickerProps,
  TimePickerState,
  TimePickerValue,
} from './types';

interface UseTimePickerFoundationOptions {
  controlledOpen: ComputedRef<boolean>;
  controlledValue: ComputedRef<boolean>;
  direction: ComputedRef<'ltr' | 'rtl'>;
  emit: <Event extends keyof TimePickerEmits>(
    event: Event,
    ...args: TimePickerEmits[Event]
  ) => void;
  incomingOpen: ComputedRef<boolean | undefined>;
  incomingValue: ComputedRef<TimePickerValue>;
  runtimeProps: ComputedRef<TimePickerProps>;
}

interface TimePickerPanelChange {
  isAM: boolean;
  timeStampValue: number;
  value: string;
}

interface TimePickerFoundationController {
  destroy(): void;
  formatValue(dates: Date[]): string;
  getDefaultFormatIfNeed(): string;
  getPosition(): string;
  handleFocus(event: FocusEvent): void;
  handleInputBlur(event: FocusEvent): void;
  handleInputChange(value: string): void;
  handlePanelChange(value: TimePickerPanelChange, index?: number): void;
  handlePanelClose(clickedOutside: boolean, event: FocusEvent | MouseEvent): void;
  handlePanelOpen(): void;
  init(): void;
  initDataFromDefaultValue(): void;
  refreshProps(props?: Record<string, unknown>): void;
}

function modelValueFromUnknown(value: unknown): TimePickerChangeValue {
  if (value instanceof Date || value === undefined) return value;
  if (Array.isArray(value) && value.every((item) => item instanceof Date)) return value as Date[];
  return undefined;
}

export function useTimePickerFoundation(options: UseTimePickerFoundationOptions): {
  foundation: TimePickerFoundationController;
  state: TimePickerState;
} {
  const props = options.runtimeProps.value;
  const format = props.format ?? (props.use12Hours ? 'a h:mm:ss' : 'HH:mm:ss');
  const state = reactive<TimePickerState>({
    currentSelectPanel: 0,
    inputValue: '',
    invalid: false,
    isAM: [true, false],
    open: options.controlledOpen.value
      ? Boolean(options.incomingOpen.value)
      : Boolean(props.defaultOpen),
    showHour: /HH|hh|H|h/.test(format),
    showMinute: /mm/.test(format),
    showSecond: /ss/.test(format),
    value: [],
  });
  const cache = new Map<string, unknown>();

  function getFoundationProps(): TimePickerProps {
    const output = { ...options.runtimeProps.value };
    if (output.format === undefined) delete output.format;
    if (options.controlledValue.value) output.value = options.incomingValue.value;
    else delete output.value;
    if (options.controlledOpen.value) output.open = Boolean(options.incomingOpen.value);
    else delete output.open;
    return output;
  }

  const adapter: TimePickerAdapter<TimePickerProps, TimePickerState> = {
    getContext: (key) => (key === 'direction' ? options.direction.value : undefined),
    getContexts: () => ({ direction: options.direction.value }),
    getProp: (key) => getFoundationProps()[key as keyof TimePickerProps],
    getProps: getFoundationProps,
    getState: (key) => state[key as keyof TimePickerState],
    getStates: () => state,
    setState: (nextState, callback) => {
      Object.assign(state, nextState);
      callback?.();
    },
    getCache: (key) => cache.get(key),
    getCaches: () => cache,
    setCache: (key, value) => cache.set(String(key), value),
    stopPropagation: (event) => event.stopPropagation?.(),
    persistEvent: () => undefined,
    isRangePicker: () => options.runtimeProps.value.type === 'timeRange',
    notifyBlur: (event) => options.emit('blur', event),
    notifyChange: (first, second) => {
      options.emit(
        'change',
        first as TimePickerChangeValue | TimePickerFormattedValue,
        second as TimePickerFormattedValue | TimePickerChangeValue,
      );
      const value = modelValueFromUnknown(
        options.runtimeProps.value.onChangeWithDateFirst === false ? second : first,
      );
      options.emit('update:modelValue', value);
      options.emit('update:value', value);
    },
    notifyFocus: (event) => options.emit('focus', event),
    notifyOpenChange: (open) => {
      options.emit('openChange', open);
      options.emit('update:open', open);
    },
    registerClickOutSide: () => undefined,
    setInputValue: (inputValue, callback) => {
      state.inputValue = inputValue;
      callback?.();
    },
    togglePanel: (open) => {
      state.open = open;
    },
    unregisterClickOutSide: () => undefined,
  };
  const foundation = markRaw(
    new TimePickerFoundation<TimePickerProps, TimePickerState>(adapter),
  ) as unknown as TimePickerFoundationController;

  foundation.initDataFromDefaultValue();

  watch(options.incomingValue, (value, previous) => {
    if (!options.controlledValue.value || value === previous) return;
    foundation.refreshProps({
      value,
      timeZone: options.runtimeProps.value.timeZone,
      __prevTimeZone: options.runtimeProps.value.timeZone,
    });
  });
  watch(options.incomingOpen, (open) => {
    if (options.controlledOpen.value) state.open = Boolean(open);
  });
  watch(
    () => options.runtimeProps.value.timeZone,
    (timeZone, previousTimeZone) => {
      foundation.refreshProps({
        value: options.controlledValue.value ? options.incomingValue.value : state.value,
        timeZone,
        __prevTimeZone: previousTimeZone,
      });
    },
  );

  onMounted(() => foundation.init());
  onBeforeUnmount(() => foundation.destroy());

  return { foundation, state };
}
