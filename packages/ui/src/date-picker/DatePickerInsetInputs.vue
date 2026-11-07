<script setup lang="ts">
import {
  DateInputFoundation,
  type DateInputAdapter,
  type InsetInputChange,
} from '@workspace/foundation-integration';
import { computed, markRaw, shallowRef, type ComponentPublicInstance } from 'vue';

import { Input, type InputExposed } from '../input';
import type { DatePickerProps } from './types';

const props = defineProps<{ pickerProps: DatePickerProps; value: Date[]; inputValue: unknown }>();
const emit = defineEmits<{
  change: [value: InsetInputChange];
  focus: [kind: 'date' | 'time', index: number, event: FocusEvent];
}>();
const dateInputs = shallowRef<InputExposed[]>([]);
/** Foundation 在弹层定位完成后把焦点交给对应内嵌输入。 */
function setDateInput(index: number, instance: Element | ComponentPublicInstance | null): void {
  if (instance) dateInputs.value[index] = instance as unknown as InputExposed;
}
defineExpose({ focus: (index: number) => dateInputs.value[index]?.focus() });
const cache = new Map<string, unknown>();
/** 输入的拆分、拼接和补时由固定 DateInputFoundation 负责。 */
const adapter: DateInputAdapter = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => props.pickerProps[key as keyof DatePickerProps],
  getProps: () => ({ ...props.pickerProps }),
  getState: () => undefined,
  getStates: () => ({}),
  setState: (_next, callback) => callback?.(),
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(String(key), value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  updateIsFocusing: () => undefined,
  notifyInsetInputChange: (options) => emit('change', options),
};
const foundation = markRaw(new DateInputFoundation(adapter));
const values = computed(() =>
  foundation.getInsetInputValue({ value: props.value, insetInputValue: props.inputValue }),
);
const placeholders = computed(() => foundation.getInsetInputPlaceholder());
const customPlaceholders = computed(() =>
  typeof props.pickerProps.insetInput === 'object' ? props.pickerProps.insetInput.placeholder : {},
);
const indices = computed(() =>
  ['dateRange', 'dateTimeRange'].includes(props.pickerProps.type ?? 'date') ? [0, 1] : [0],
);
/** 把真实输入事件交给固定解析器，并保留未完成输入而不拼造 Date。 */
function change(value: string, index: number, kind: 'dateInput' | 'timeInput', event: Event): void {
  foundation.handleInsetInputChange({
    value,
    valuePath: `${index === 0 ? 'monthLeft' : 'monthRight'}.${kind}`,
    insetInputValue: values.value,
    event,
  });
}
</script>
<template>
  <div class="semi-datepicker-inset-input-wrapper" :x-type="pickerProps.type ?? 'date'">
    <template v-for="index in indices" :key="index">
      <div v-if="index === 1" class="semi-datepicker-inset-input-separator">
        {{ pickerProps.density === 'compact' ? '' : '-' }}
      </div>
      <Input
        :ref="(instance) => setDateInput(index, instance)"
        :value="values[index === 0 ? 'monthLeft' : 'monthRight'].dateInput"
        :placeholder="
          (index === 0 ? customPlaceholders?.dateStart : customPlaceholders?.dateEnd) ??
          placeholders.datePlaceholder ??
          ''
        "
        @change="(value: string, event: Event) => change(value, index, 'dateInput', event)"
        @focus="emit('focus', 'date', index, $event)"
      />
      <Input
        v-if="pickerProps.type?.includes('Time')"
        :value="values[index === 0 ? 'monthLeft' : 'monthRight'].timeInput"
        :disabled="!values[index === 0 ? 'monthLeft' : 'monthRight'].dateInput"
        :placeholder="
          (index === 0 ? customPlaceholders?.timeStart : customPlaceholders?.timeEnd) ??
          placeholders.timePlaceholder ??
          ''
        "
        @change="(value: string, event: Event) => change(value, index, 'timeInput', event)"
        @focus="emit('focus', 'time', index, $event)"
      />
    </template>
  </div>
</template>
