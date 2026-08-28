<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue';

interface TimePickerColumnOption {
  disabled?: boolean;
  text?: string;
  value: string;
}

interface TimePickerWheelEntry {
  copyIndex: number;
  option: TimePickerColumnOption;
  sourceIndex: number;
}

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line vue/require-default-prop
    ariaLabel?: string | undefined;
    className: string;
    cycled?: boolean | undefined;
    mode?: 'normal' | 'wheel' | undefined;
    motion?: boolean | undefined;
    options: TimePickerColumnOption[];
    selectedIndex: number;
    // eslint-disable-next-line vue/require-default-prop
    style?: unknown | undefined;
    type: string;
    unit?: string | undefined;
  }>(),
  { cycled: false, mode: 'wheel', motion: true, unit: '' },
);
const emit = defineEmits<{ select: [value: string] }>();
const wrapper = useTemplateRef<HTMLDivElement>('wrapper');
let scrollTimer: ReturnType<typeof setTimeout> | undefined;

const wheelOptions = computed<TimePickerWheelEntry[]>(() => {
  if (!props.cycled || props.options.length === 0) {
    return props.options.map((option, sourceIndex) => ({ copyIndex: 0, option, sourceIndex }));
  }
  return Array.from({ length: 3 }, (_, copyIndex) =>
    props.options.map((option, sourceIndex) => ({ copyIndex, option, sourceIndex })),
  ).flat();
});

function displayText(option: TimePickerColumnOption, index: number): string {
  const text = option.text ?? option.value;
  return index === props.selectedIndex ? `${text}${props.unit}` : text;
}

function select(index: number): void {
  const option = props.options[index];
  if (!option || option.disabled) return;
  emit('select', option.value);
}

function scrollSelectedIntoView(): void {
  const selected = wrapper.value?.querySelector<HTMLElement>(
    props.mode === 'normal' ? '.semi-scrolllist-item-sel' : '[data-selected="true"]',
  );
  selected?.scrollIntoView?.({
    behavior: props.motion ? 'smooth' : 'auto',
    block: 'center',
  });
}

function nearestWheelIndex(outer: HTMLDivElement): number {
  const options = [...outer.querySelectorAll<HTMLElement>('li')];
  if (options.length === 0) return -1;
  const outerRect = outer.getBoundingClientRect();
  const center = outerRect.top + outerRect.height / 2;
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;
  options.forEach((option, index) => {
    const rect = option.getBoundingClientRect();
    const optionCenter = rect.top + rect.height / 2;
    const distance = Math.abs(optionCenter - center);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });
  if (nearestDistance > 0 || outerRect.height > 0) return nearestIndex;

  const itemHeight = options[0]?.offsetHeight || 36;
  return Math.round((outer.scrollTop + outer.clientHeight / 2 - itemHeight / 2) / itemHeight);
}

function handleWheelScroll(event: Event): void {
  if (scrollTimer !== undefined) clearTimeout(scrollTimer);
  const outer = event.currentTarget as HTMLDivElement;
  scrollTimer = setTimeout(() => {
    const renderedIndex = nearestWheelIndex(outer);
    if (renderedIndex < 0 || props.options.length === 0) return;
    const sourceIndex = renderedIndex % props.options.length;
    if (sourceIndex !== props.selectedIndex) select(sourceIndex);
  }, 1000 / 30);
}

watch(
  () => props.selectedIndex,
  () => void nextTick(scrollSelectedIntoView),
);
onMounted(scrollSelectedIntoView);
onBeforeUnmount(() => {
  if (scrollTimer !== undefined) clearTimeout(scrollTimer);
});
</script>

<template>
  <div
    v-if="props.mode === 'normal'"
    ref="wrapper"
    :class="['semi-scrolllist-item', props.className]"
    :style="props.style as never"
  >
    <ul role="listbox" :aria-label="props.ariaLabel" aria-multiselectable="false">
      <li
        v-for="(option, index) in props.options"
        :key="`${props.type}-${option.value}`"
        :class="[
          index === props.selectedIndex ? 'semi-scrolllist-item-sel' : undefined,
          option.disabled ? 'semi-scrolllist-item-disabled' : undefined,
        ]"
        role="option"
        :aria-disabled="option.disabled || undefined"
        @click="select(index)"
      >
        {{ displayText(option, index) }}
      </li>
    </ul>
  </div>
  <div
    v-else
    :class="['semi-scrolllist-item-wheel', props.className]"
    :style="props.style as never"
  >
    <div class="semi-scrolllist-shade semi-scrolllist-shade-pre" />
    <div class="semi-scrolllist-selector" />
    <div class="semi-scrolllist-shade semi-scrolllist-shade-post" />
    <div
      ref="wrapper"
      :class="[
        'semi-scrolllist-list-outer',
        props.cycled ? undefined : 'semi-scrolllist-list-outer-nocycle',
      ]"
      @scroll="handleWheelScroll"
    >
      <ul role="listbox" :aria-label="props.ariaLabel" aria-multiselectable="false">
        <li
          v-for="entry in wheelOptions"
          :key="`${props.type}-${entry.option.value}-${entry.copyIndex}`"
          :class="[
            entry.sourceIndex === props.selectedIndex && (!props.cycled || entry.copyIndex === 1)
              ? 'semi-scrolllist-item-selected'
              : undefined,
            entry.option.disabled ? 'semi-scrolllist-item-disabled' : undefined,
          ]"
          :data-selected="
            entry.sourceIndex === props.selectedIndex && (!props.cycled || entry.copyIndex === 1)
              ? 'true'
              : undefined
          "
          role="option"
          :aria-disabled="entry.option.disabled || undefined"
          @click="select(entry.sourceIndex)"
        >
          {{ displayText(entry.option, entry.sourceIndex) }}
        </li>
      </ul>
    </div>
  </div>
</template>
