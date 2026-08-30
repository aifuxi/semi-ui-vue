<script setup lang="ts">
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconDoubleChevronLeft,
  IconDoubleChevronRight,
} from '@aifuxi/semi-icons-vue';
import {
  addMonths,
  addYears,
  format,
  isAfter,
  setMonth,
  setYear,
  subMonths,
  subYears,
} from 'date-fns';
import { computed, ref, watch, type VNodeChild } from 'vue';

import { Button } from '../button';
import { TimePicker } from '../time-picker';
import DatePickerMonth from './DatePickerMonth.vue';
import DatePickerNodeRenderer from './DatePickerNodeRenderer';
import type {
  DatePickerDayStatus,
  DatePickerLocale,
  DatePickerPreset,
  DatePickerProps,
  DatePickerRangeType,
} from './types';

const props = defineProps<{
  bottomContent: VNodeChild;
  cachedValue: Array<Date | null>;
  leftContent: VNodeChild;
  locale: DatePickerLocale;
  localeCode: string;
  props: DatePickerProps;
  rangeFocus: DatePickerRangeType | undefined;
  renderDate: ((dayNumber?: number, fullDate?: string) => VNodeChild) | undefined;
  renderFullDate:
    | ((dayNumber?: number, fullDate?: string, status?: DatePickerDayStatus) => VNodeChild)
    | undefined;
  rightContent: VNodeChild;
  topContent: VNodeChild;
  value: Date[];
}>();

const emit = defineEmits<{
  cancel: [];
  confirm: [];
  maxSelect: [dates: Date[]];
  panelChange: [date: Date | Date[], dateString: string | string[]];
  presetClick: [preset: DatePickerPreset, event: MouseEvent];
  select: [dates: Array<Date | null>];
}>();

const type = computed(() => props.props.type ?? 'date');
const isRange = computed(() => /Range$/.test(type.value));
const isTime = computed(() => type.value.includes('Time'));
const isYearOrMonth = computed(() => ['year', 'month', 'monthRange'].includes(type.value));
const seed = computed(() => {
  const pickerValue = props.props.defaultPickerValue;
  const firstPicker = Array.isArray(pickerValue) ? pickerValue[0] : pickerValue;
  const value = props.cachedValue.find((item): item is Date => item instanceof Date);
  const date = firstPicker instanceof Date ? firstPicker : value;
  return date ?? new Date();
});
const leftMonth = ref(new Date(seed.value.getFullYear(), seed.value.getMonth(), 1));
const hoverDate = ref<Date>();
const timeOpen = ref<'left' | 'right' | false>(false);
const yearMonthOpen = ref<'left' | 'right' | false>(false);
const pendingRange = ref<Array<Date | null>>([]);

watch(
  () => seed.value.getTime(),
  () => {
    leftMonth.value = new Date(seed.value.getFullYear(), seed.value.getMonth(), 1);
  },
);
watch(
  () => props.cachedValue.map((item) => item?.getTime() ?? null),
  () => {
    pendingRange.value = [...props.cachedValue];
  },
  { immediate: true },
);

const rightMonth = computed(() => addMonths(leftMonth.value, 1));
const selected = computed(() =>
  props.cachedValue.filter((item): item is Date => item instanceof Date),
);
const displayRange = computed(() => (isRange.value ? pendingRange.value : props.cachedValue));
const panelClasses = computed(() => [
  'semi-datepicker',
  isYearOrMonth.value ? 'semi-datepicker-panel-yam' : undefined,
  props.props.density === 'compact' ? 'semi-datepicker-compact' : undefined,
  props.props.dropdownClassName,
]);
const presets = computed(() =>
  (props.props.presets ?? []).map((item) => (typeof item === 'function' ? item() : item)),
);

function monthText(month: Date): string {
  return props.locale.monthText
    .replace('${year}', format(month, 'yyyy'))
    .replace('${month}', props.locale.months[month.getMonth() + 1] ?? String(month.getMonth() + 1));
}

function announcePanel(): void {
  if (isRange.value) {
    emit(
      'panelChange',
      [leftMonth.value, rightMonth.value],
      [monthText(leftMonth.value), monthText(rightMonth.value)],
    );
  } else {
    emit('panelChange', leftMonth.value, monthText(leftMonth.value));
  }
}

function navigate(
  kind: 'prevMonth' | 'nextMonth' | 'prevYear' | 'nextYear',
  panel: 'left' | 'right',
): void {
  const base = panel === 'left' ? leftMonth.value : rightMonth.value;
  const target =
    kind === 'prevMonth'
      ? subMonths(base, 1)
      : kind === 'nextMonth'
        ? addMonths(base, 1)
        : kind === 'prevYear'
          ? subYears(base, 1)
          : addYears(base, 1);
  leftMonth.value = panel === 'left' ? target : subMonths(target, 1);
  announcePanel();
}

function withExistingTime(date: Date, source?: Date | null): Date {
  if (!source) return date;
  date.setHours(
    source.getHours(),
    source.getMinutes(),
    source.getSeconds(),
    source.getMilliseconds(),
  );
  return date;
}

function selectDay(date: Date): void {
  if (props.props.multiple && type.value === 'date') {
    const values = [...selected.value];
    const index = values.findIndex(
      (item) => format(item, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'),
    );
    if (index >= 0) values.splice(index, 1);
    else if (props.props.max == null || values.length < props.props.max) values.push(date);
    else {
      emit('maxSelect', values);
      return;
    }
    emit('select', values);
    return;
  }
  if (!isRange.value) {
    emit('select', [withExistingTime(date, props.cachedValue[0])]);
    return;
  }
  const current = pendingRange.value;
  if (!current[0] || current[1]) {
    pendingRange.value = [date, null];
    emit('select', [date, null]);
    return;
  }
  const start = current[0];
  const pair = isAfter(start, date) ? [date, start] : [start, date];
  pendingRange.value = pair;
  emit('select', pair);
}

function selectYearMonth(year: number, month?: number): void {
  const date =
    month === undefined ? setYear(seed.value, year) : setMonth(setYear(seed.value, year), month);
  if (type.value === 'monthRange') selectDay(date);
  else emit('select', [date]);
}

function choosePreset(preset: DatePickerPreset, event: MouseEvent): void {
  emit('presetClick', preset, event);
}

function updateTime(value: unknown, panel: 'left' | 'right'): void {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!(candidate instanceof Date)) return;
  const index = panel === 'left' ? 0 : 1;
  const dates = [...props.cachedValue];
  const base = dates[index] ?? (panel === 'left' ? leftMonth.value : rightMonth.value);
  const next = new Date(base);
  next.setHours(
    candidate.getHours(),
    candidate.getMinutes(),
    candidate.getSeconds(),
    candidate.getMilliseconds(),
  );
  dates[index] = next;
  emit('select', dates);
}

function isDisabledDate(date: Date, options?: Record<string, unknown>): boolean {
  return props.props.disabledDate?.(date, options) ?? false;
}
</script>

<template>
  <div ref="panel" :class="panelClasses" :style="props.props.dropdownStyle" :x-type="type">
    <div class="semi-datepicker-container">
      <div v-if="leftContent" class="semi-datepicker-leftSlot" x-semi-prop="leftSlot">
        <DatePickerNodeRenderer :content="leftContent" />
      </div>
      <div>
        <div v-if="topContent" class="semi-datepicker-topSlot" x-semi-prop="topSlot">
          <DatePickerNodeRenderer :content="topContent" />
        </div>
        <div
          v-if="presets.length && props.props.presetPosition === 'top'"
          class="semi-datepicker-quick-control semi-datepicker-quick-control-top"
          :x-insetinput="props.props.insetInput ? 'true' : 'false'"
        >
          <div class="semi-datepicker-quick-control-top-content-wrapper">
            <div class="semi-datepicker-quick-control-top-content">
              <Button
                v-for="(preset, index) in presets"
                :key="index"
                size="small"
                @click="choosePreset(preset, $event)"
              >
                {{ preset.text }}
              </Button>
            </div>
          </div>
        </div>

        <div v-if="isYearOrMonth" class="semi-datepicker-yearmonth-body">
          <div class="semi-datepicker-yam-column">
            <Button
              v-for="year in Array.from(
                {
                  length:
                    (props.props.endYear ?? new Date().getFullYear() + 100) -
                    (props.props.startYear ?? new Date().getFullYear() - 100) +
                    1,
                },
                (_, index) => (props.props.startYear ?? new Date().getFullYear() - 100) + index,
              )"
              :key="year"
              size="small"
              theme="borderless"
              @click="
                type === 'year' ? selectYearMonth(year) : (leftMonth = setYear(leftMonth, year))
              "
              >{{ year }}{{ localeCode.startsWith('zh') ? '年' : '' }}</Button
            >
          </div>
          <div v-if="type !== 'year'" class="semi-datepicker-yam-column">
            <Button
              v-for="month in 12"
              :key="month"
              size="small"
              theme="borderless"
              @click="selectYearMonth(leftMonth.getFullYear(), month - 1)"
              >{{ locale.fullMonths[month] }}</Button
            >
          </div>
        </div>

        <div v-else style="display: flex">
          <div
            v-if="presets.length && props.props.presetPosition === 'left'"
            class="semi-datepicker-quick-control semi-datepicker-quick-control-left"
          >
            <div class="semi-datepicker-quick-control-header">{{ locale.presets }}</div>
            <Button
              v-for="(preset, index) in presets"
              :key="index"
              size="small"
              @click="choosePreset(preset, $event)"
              >{{ preset.text }}</Button
            >
          </div>
          <div>
            <div
              class="semi-datepicker-month-grid"
              :x-type="type"
              x-panel-yearandmonth-open-type="none"
              :x-insetinput="props.props.insetInput ? 'true' : 'false'"
              :x-preset-position="presets.length ? props.props.presetPosition : 'null'"
            >
              <div
                class="semi-datepicker-month-grid-left"
                :x-open-type="
                  timeOpen === 'left' ? 'time' : yearMonthOpen === 'left' ? 'year' : 'date'
                "
              >
                <div v-if="yearMonthOpen === 'left'" class="semi-datepicker-yam">
                  <div class="semi-datepicker-yearmonth-header">
                    <Button theme="borderless" @click="yearMonthOpen = false"
                      ><IconChevronLeft />{{ locale.selectDate }}</Button
                    >
                  </div>
                </div>
                <div v-if="timeOpen === 'left'" class="semi-datepicker-tpk">
                  <TimePicker
                    v-bind="props.props.timePickerOpts"
                    :open="false"
                    :value="props.cachedValue[0] ?? leftMonth"
                    @change="updateTime($event, 'left')"
                  />
                </div>
                <div
                  :style="
                    timeOpen === 'left' || yearMonthOpen === 'left'
                      ? { visibility: 'hidden', position: 'absolute', pointerEvents: 'none' }
                      : undefined
                  "
                >
                  <div class="semi-datepicker-navigation">
                    <Button
                      aria-label="Previous year"
                      theme="borderless"
                      type="tertiary"
                      no-horizontal-padding
                      @click="navigate('prevYear', 'left')"
                      ><template #icon
                        ><IconDoubleChevronLeft
                          :size="
                            props.props.density === 'compact' ? 'default' : 'large'
                          " /></template
                    ></Button>
                    <Button
                      aria-label="Previous month"
                      theme="borderless"
                      type="tertiary"
                      no-horizontal-padding
                      @click="navigate('prevMonth', 'left')"
                      ><template #icon
                        ><IconChevronLeft
                          :size="
                            props.props.density === 'compact' ? 'default' : 'large'
                          " /></template
                    ></Button>
                    <div class="semi-datepicker-navigation-month">
                      <Button theme="borderless" type="tertiary" @click="yearMonthOpen = 'left'"
                        ><span>{{ monthText(leftMonth) }}</span></Button
                      >
                    </div>
                    <Button
                      aria-label="Next month"
                      theme="borderless"
                      type="tertiary"
                      no-horizontal-padding
                      :style="
                        isRange && props.props.syncSwitchMonth
                          ? { visibility: 'hidden' }
                          : undefined
                      "
                      @click="navigate('nextMonth', 'left')"
                      ><template #icon
                        ><IconChevronRight
                          :size="
                            props.props.density === 'compact' ? 'default' : 'large'
                          " /></template
                    ></Button>
                    <Button
                      aria-label="Next year"
                      theme="borderless"
                      type="tertiary"
                      no-horizontal-padding
                      :style="
                        isRange && props.props.syncSwitchMonth
                          ? { visibility: 'hidden' }
                          : undefined
                      "
                      @click="navigate('nextYear', 'left')"
                      ><template #icon
                        ><IconDoubleChevronRight
                          :size="
                            props.props.density === 'compact' ? 'default' : 'large'
                          " /></template
                    ></Button>
                  </div>
                  <DatePickerMonth
                    :disabled-date="isDisabledDate"
                    :hover-date="hoverDate"
                    :is-range="isRange"
                    :locale="locale"
                    :month="leftMonth"
                    :multiple="Boolean(props.props.multiple)"
                    :range-focus="rangeFocus"
                    :range-value="displayRange"
                    :render-date="renderDate"
                    :render-full-date="renderFullDate"
                    :selected="selected"
                    :week-starts-on="props.props.weekStartsOn ?? 0"
                    @day-click="selectDay"
                    @day-hover="hoverDate = $event"
                  />
                </div>
                <div v-if="isTime && !props.props.insetInput" class="semi-datepicker-switch">
                  <div
                    role="button"
                    aria-label="Switch to date panel"
                    :class="[
                      'semi-datepicker-switch-date',
                      timeOpen !== 'left' && 'semi-datepicker-switch-date-active',
                    ]"
                    @click="timeOpen = false"
                  >
                    <IconCalendar /><span class="semi-datepicker-switch-text">{{
                      props.cachedValue[0]
                        ? format(
                            props.cachedValue[0] as Date,
                            locale.localeFormatToken.FORMAT_SWITCH_DATE,
                          )
                        : monthText(leftMonth)
                    }}</span>
                  </div>
                  <div
                    role="button"
                    aria-label="Switch to time panel"
                    :class="[
                      'semi-datepicker-switch-time',
                      props.props.disabledTimePicker && 'semi-datepicker-switch-time-disabled',
                      timeOpen === 'left' && 'semi-datepicker-switch-date-active',
                    ]"
                    @click="!props.props.disabledTimePicker && (timeOpen = 'left')"
                  >
                    <IconClock /><span class="semi-datepicker-switch-text">{{
                      format((props.cachedValue[0] as Date | null) ?? leftMonth, 'HH:mm:ss')
                    }}</span>
                  </div>
                </div>
              </div>

              <div
                v-if="isRange"
                class="semi-datepicker-month-grid-right"
                :x-open-type="timeOpen === 'right' ? 'time' : 'date'"
              >
                <div v-if="timeOpen === 'right'" class="semi-datepicker-tpk">
                  <TimePicker
                    v-bind="props.props.timePickerOpts"
                    :open="false"
                    :value="props.cachedValue[1] ?? rightMonth"
                    @change="updateTime($event, 'right')"
                  />
                </div>
                <div
                  :style="
                    timeOpen === 'right'
                      ? { visibility: 'hidden', position: 'absolute', pointerEvents: 'none' }
                      : undefined
                  "
                >
                  <div class="semi-datepicker-navigation">
                    <Button
                      aria-label="Previous year"
                      theme="borderless"
                      type="tertiary"
                      no-horizontal-padding
                      :style="props.props.syncSwitchMonth ? { visibility: 'hidden' } : undefined"
                      @click="navigate('prevYear', 'right')"
                      ><template #icon
                        ><IconDoubleChevronLeft
                          :size="
                            props.props.density === 'compact' ? 'default' : 'large'
                          " /></template
                    ></Button>
                    <Button
                      aria-label="Previous month"
                      theme="borderless"
                      type="tertiary"
                      no-horizontal-padding
                      :style="props.props.syncSwitchMonth ? { visibility: 'hidden' } : undefined"
                      @click="navigate('prevMonth', 'right')"
                      ><template #icon
                        ><IconChevronLeft
                          :size="
                            props.props.density === 'compact' ? 'default' : 'large'
                          " /></template
                    ></Button>
                    <div class="semi-datepicker-navigation-month">
                      <Button theme="borderless" type="tertiary"
                        ><span>{{ monthText(rightMonth) }}</span></Button
                      >
                    </div>
                    <Button
                      aria-label="Next month"
                      theme="borderless"
                      type="tertiary"
                      no-horizontal-padding
                      @click="navigate('nextMonth', 'right')"
                      ><template #icon
                        ><IconChevronRight
                          :size="
                            props.props.density === 'compact' ? 'default' : 'large'
                          " /></template
                    ></Button>
                    <Button
                      aria-label="Next year"
                      theme="borderless"
                      type="tertiary"
                      no-horizontal-padding
                      @click="navigate('nextYear', 'right')"
                      ><template #icon
                        ><IconDoubleChevronRight
                          :size="
                            props.props.density === 'compact' ? 'default' : 'large'
                          " /></template
                    ></Button>
                  </div>
                  <DatePickerMonth
                    :disabled-date="isDisabledDate"
                    :hover-date="hoverDate"
                    :is-range="isRange"
                    :locale="locale"
                    :month="rightMonth"
                    :multiple="false"
                    :range-focus="rangeFocus"
                    :range-value="displayRange"
                    :render-date="renderDate"
                    :render-full-date="renderFullDate"
                    :selected="selected"
                    :week-starts-on="props.props.weekStartsOn ?? 0"
                    @day-click="selectDay"
                    @day-hover="hoverDate = $event"
                  />
                </div>
                <div v-if="isTime && !props.props.insetInput" class="semi-datepicker-switch">
                  <div
                    role="button"
                    aria-label="Switch to date panel"
                    :class="[
                      'semi-datepicker-switch-date',
                      timeOpen !== 'right' && 'semi-datepicker-switch-date-active',
                    ]"
                    @click="timeOpen = false"
                  >
                    <IconCalendar /><span class="semi-datepicker-switch-text">{{
                      props.cachedValue[1]
                        ? format(
                            props.cachedValue[1] as Date,
                            locale.localeFormatToken.FORMAT_SWITCH_DATE,
                          )
                        : monthText(rightMonth)
                    }}</span>
                  </div>
                  <div
                    role="button"
                    aria-label="Switch to time panel"
                    :class="[
                      'semi-datepicker-switch-time',
                      props.props.disabledTimePicker && 'semi-datepicker-switch-time-disabled',
                      timeOpen === 'right' && 'semi-datepicker-switch-date-active',
                    ]"
                    @click="!props.props.disabledTimePicker && (timeOpen = 'right')"
                  >
                    <IconClock /><span class="semi-datepicker-switch-text">{{
                      format((props.cachedValue[1] as Date | null) ?? rightMonth, 'HH:mm:ss')
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="presets.length && props.props.presetPosition === 'right'"
            class="semi-datepicker-quick-control semi-datepicker-quick-control-right"
          >
            <div class="semi-datepicker-quick-control-header">{{ locale.presets }}</div>
            <Button
              v-for="(preset, index) in presets"
              :key="index"
              size="small"
              @click="choosePreset(preset, $event)"
              >{{ preset.text }}</Button
            >
          </div>
        </div>

        <div
          v-if="presets.length && props.props.presetPosition === 'bottom'"
          class="semi-datepicker-quick-control semi-datepicker-quick-control-bottom"
          :x-insetinput="props.props.insetInput ? 'true' : 'false'"
        >
          <div class="semi-datepicker-quick-control-bottom-content-wrapper">
            <div class="semi-datepicker-quick-control-bottom-content">
              <Button
                v-for="(preset, index) in presets"
                :key="index"
                size="small"
                @click="choosePreset(preset, $event)"
                >{{ preset.text }}</Button
              >
            </div>
          </div>
        </div>
        <div v-if="bottomContent" class="semi-datepicker-bottomSlot" x-semi-prop="bottomSlot">
          <DatePickerNodeRenderer :content="bottomContent" />
        </div>
      </div>
      <div v-if="rightContent" class="semi-datepicker-rightSlot" x-semi-prop="rightSlot">
        <DatePickerNodeRenderer :content="rightContent" />
      </div>
    </div>
    <div v-if="props.props.needConfirm && isTime" class="semi-datepicker-footer">
      <Button theme="borderless" @click="emit('cancel')">{{ locale.footer.cancel }}</Button>
      <Button
        theme="solid"
        :disabled="isRange && cachedValue.filter(Boolean).length !== 2"
        @click="emit('confirm')"
        >{{ locale.footer.confirm }}</Button
      >
    </div>
  </div>
</template>
