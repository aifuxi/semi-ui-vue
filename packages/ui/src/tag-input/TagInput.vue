<script setup lang="ts">
import { IconClear } from '@aifuxi/semi-icons-vue';
import {
  computed,
  getCurrentInstance,
  isVNode,
  nextTick,
  shallowRef,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type VNode,
  type VNodeChild,
} from 'vue';

import Input from '../input/Input.vue';
import type { InputExposed } from '../input/types';
import TagInputNodeRenderer from './TagInputNodeRenderer';
import TagInputRestPopover from './TagInputRestPopover.vue';
import TagInputTag from './TagInputTag.vue';
import type { TagInputEmits, TagInputExposed, TagInputProps, TagInputSlots } from './types';
import { useTagInputFoundation } from './use-tag-input-foundation';

defineOptions({ name: 'TagInput', inheritAttrs: false });
const props = withDefaults(defineProps<TagInputProps>(), {
  addOnBlur: false,
  allowDuplicates: true,
  autoFocus: false,
  disabled: false,
  draggable: false,
  expandRestTagsOnClick: true,
  placeholder: '',
  separator: ',',
  showClear: false,
  showContentTooltip: true,
  showRestTagsPopover: true,
  size: 'default',
  validateStatus: 'default',
});
const emit = defineEmits<TagInputEmits>();
defineSlots<TagInputSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const root = useTemplateRef<HTMLDivElement>('root');
const inputComponent = useTemplateRef<InputExposed>('inputComponent');
const inputMirror = useTemplateRef<HTMLSpanElement>('inputMirror');
const dragIndex = shallowRef<number | null>(null);

function hasRawProp(name: string): boolean {
  const raw = instance?.vnode.props;
  const kebabName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebabName)),
  );
}

const modelControlled = computed(() => hasRawProp('modelValue'));
const valueControlled = computed(() => hasRawProp('value'));
const controlled = computed(() => modelControlled.value || valueControlled.value);
const controlledValue = computed(() =>
  modelControlled.value ? props.modelValue : valueControlled.value ? props.value : undefined,
);
const controlledInput = computed(() => hasRawProp('inputValue'));
const controlledInputValue = computed(() => props.inputValue);
const input = computed(() => inputComponent.value?.input ?? null);

const { foundation, state } = useTagInputFoundation({
  controlled,
  controlledInput,
  controlledInputValue,
  controlledValue,
  emitAdd: (value) => emit('add', value),
  emitBlur: (event) => emit('blur', event),
  emitChange: (value) => {
    emit('change', value);
    emit('update:value', value);
    emit('update:modelValue', value);
  },
  emitExceed: (value) => emit('exceed', value),
  emitFocus: (event) => emit('focus', event),
  emitInputChange: (value, event) => {
    emit('inputChange', value, event);
    emit('update:inputValue', value);
  },
  emitInputExceed: (value) => emit('inputExceed', value),
  emitKeyDown: (event) => emit('keyDown', event),
  emitRemove: (value, index) => emit('remove', value, index),
  input,
  props: props as TagInputProps,
  root,
});

function slotContent(name: keyof Omit<TagInputSlots, 'tag'>, propValue: VNodeChild): VNodeChild {
  return slots[name]?.() ?? propValue;
}

function firstVNode(content: VNodeChild): VNode | undefined {
  if (Array.isArray(content)) return content.find((item): item is VNode => isVNode(item));
  return isVNode(content) ? content : undefined;
}

function isIconContent(content: VNodeChild): boolean {
  const node = firstVNode(content);
  if (!node || (typeof node.type !== 'object' && typeof node.type !== 'function')) return false;
  const component = node.type as { __name?: string; name?: string };
  return /Icon/.test(component.name ?? component.__name ?? '');
}

const prefixContent = computed(() => slotContent('prefix', props.prefix));
const insetLabelContent = computed(() => slotContent('insetLabel', props.insetLabel));
const labelContent = computed(() => prefixContent.value || insetLabelContent.value);
const suffixContent = computed(() => slotContent('suffix', props.suffix));
const clearIconContent = computed(() => slotContent('clearIcon', props.clearIcon));
const hasCollapsedTags = computed(
  () =>
    Boolean(props.maxTagCount) &&
    (props.maxTagCount ?? 0) < state.tagsArray.length &&
    (!state.active || !props.expandRestTagsOnClick),
);
const visibleTagEntries = computed(() => {
  const entries = state.tagsArray.map((value, index) => ({ index, value }));
  return hasCollapsedTags.value ? entries.slice(0, props.maxTagCount) : entries;
});
const restTagEntries = computed(() =>
  hasCollapsedTags.value
    ? state.tagsArray.map((value, index) => ({ index, value })).slice(props.maxTagCount)
    : [],
);
const rootClasses = computed(() => [
  'semi-tagInput',
  attrs.class,
  props.className,
  state.focusing || state.active ? 'semi-tagInput-focus' : undefined,
  props.disabled ? 'semi-tagInput-disabled' : undefined,
  state.hovering && !props.disabled ? 'semi-tagInput-hover' : undefined,
  props.validateStatus === 'error' ? 'semi-tagInput-error' : undefined,
  props.validateStatus === 'warning' ? 'semi-tagInput-warning' : undefined,
  props.size === 'small' ? 'semi-tagInput-small' : undefined,
  props.size === 'large' ? 'semi-tagInput-large' : undefined,
  labelContent.value ? 'semi-tagInput-with-prefix' : undefined,
  suffixContent.value ? 'semi-tagInput-with-suffix' : undefined,
]);
const inputClasses = computed(() => [
  'semi-tagInput-wrapper-input',
  `semi-tagInput-wrapper-input-${props.size}`,
]);
const inputWrapperStyle = computed(() =>
  typeof state.inputWidth === 'number' ? { width: `${state.inputWidth}px` } : undefined,
);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);

function updateInputWidth(): void {
  const inputElement = input.value;
  const mirrorElement = inputMirror.value;
  if (!inputElement || !mirrorElement) return;
  if (!state.inputValue) {
    state.inputWidth = undefined;
    return;
  }
  const computedStyle = window.getComputedStyle(inputElement);
  mirrorElement.style.font = computedStyle.font;
  mirrorElement.style.letterSpacing = computedStyle.letterSpacing;
  mirrorElement.style.textTransform = computedStyle.textTransform;
  mirrorElement.style.paddingLeft = computedStyle.paddingLeft;
  mirrorElement.style.paddingRight = computedStyle.paddingRight;
  mirrorElement.style.borderLeftWidth = computedStyle.borderLeftWidth;
  mirrorElement.style.borderRightWidth = computedStyle.borderRightWidth;
  mirrorElement.style.boxSizing = computedStyle.boxSizing;
  mirrorElement.textContent = state.inputValue || ' ';
  const width = Math.ceil(mirrorElement.scrollWidth + 2);
  if (Number.isFinite(width) && width > 0) state.inputWidth = width;
}

function handleInputChange(_value: string, event: Event): void {
  foundation.handleInputChange(event);
}

function handleDrop(newIndex: number): void {
  if (dragIndex.value === null || dragIndex.value === newIndex) {
    dragIndex.value = null;
    return;
  }
  const oldIndex = dragIndex.value;
  foundation.handleSortEnd({ oldIndex, newIndex });
  dragIndex.value = null;
}

function customTag(value: string, index: number): VNodeChild {
  return props.renderTagItem?.(value, index, () => foundation.handleTagClose(index));
}

function focus(): void {
  if (props.disabled) return;
  input.value?.focus({ preventScroll: props.preventScroll ?? false });
  foundation.handleClick();
}

function blur(): void {
  input.value?.blur();
  foundation.clickOutsideCallBack();
}

watch(
  () => [state.inputValue, state.tagsArray.length, props.size, props.placeholder],
  () => void nextTick(updateInputWidth),
  { immediate: true },
);

defineExpose<TagInputExposed>({ blur, focus });
</script>

<template>
  <div
    v-bind="dataAttrs"
    ref="root"
    :aria-disabled="props.disabled"
    :aria-invalid="props.validateStatus === 'error'"
    :aria-label="props.ariaLabel ?? (attrs['aria-label'] as string | undefined)"
    :class="rootClasses"
    :style="[attrs.style, props.style]"
    @click="foundation.handleClick($event)"
    @mouseenter="foundation.handleInputMouseEnter()"
    @mouseleave="foundation.handleInputMouseLeave()"
  >
    <div
      v-if="labelContent"
      :id="props.insetLabelId"
      :class="[
        'semi-tagInput-prefix',
        insetLabelContent ? 'semi-tagInput-inset-label' : undefined,
        typeof labelContent === 'string' ? 'semi-tagInput-prefix-text' : undefined,
        isIconContent(labelContent) ? 'semi-tagInput-prefix-icon' : undefined,
      ]"
      x-semi-prop="prefix"
      @click="foundation.handleClickPrefixOrSuffix($event)"
      @mousedown="foundation.handlePreventMouseDown($event)"
    >
      <slot v-if="prefixContent" name="prefix"
        ><TagInputNodeRenderer :content="props.prefix"
      /></slot>
      <slot v-else name="insetLabel"><TagInputNodeRenderer :content="props.insetLabel" /></slot>
    </div>

    <div class="semi-tagInput-wrapper">
      <template v-for="entry in visibleTagEntries" :key="`${entry.index}-${entry.value}`">
        <slot
          name="tag"
          :close="() => foundation.handleTagClose(entry.index)"
          :index="entry.index"
          :value="entry.value"
        >
          <TagInputNodeRenderer
            v-if="props.renderTagItem"
            :content="customTag(entry.value, entry.index)"
          />
          <TagInputTag
            v-else
            :disabled="props.disabled"
            :draggable="state.active && props.draggable"
            :index="entry.index"
            :show-content-tooltip="props.showContentTooltip"
            :size="props.size"
            :value="entry.value"
            @close="(index) => foundation.handleTagClose(index)"
            @drag-start="dragIndex = $event"
            @dragend="dragIndex = null"
            @drop="handleDrop"
          />
        </slot>
      </template>

      <TagInputRestPopover
        v-if="restTagEntries.length && props.showRestTagsPopover"
        :disabled="props.disabled"
        :popover-props="props.restTagsPopoverProps"
        :rest-count="restTagEntries.length"
      >
        <template v-for="entry in restTagEntries" :key="`rest-${entry.index}-${entry.value}`">
          <slot
            name="tag"
            :close="() => foundation.handleTagClose(entry.index)"
            :index="entry.index"
            :value="entry.value"
          >
            <TagInputNodeRenderer
              v-if="props.renderTagItem"
              :content="customTag(entry.value, entry.index)"
            />
            <TagInputTag
              v-else
              :disabled="props.disabled"
              :index="entry.index"
              :show-content-tooltip="false"
              :size="props.size"
              :value="entry.value"
              @close="(index) => foundation.handleTagClose(index)"
            />
          </slot>
        </template>
      </TagInputRestPopover>
      <span
        v-else-if="restTagEntries.length"
        :class="[
          'semi-tagInput-wrapper-n',
          props.disabled ? 'semi-tagInput-wrapper-n-disabled' : undefined,
        ]"
        >+{{ restTagEntries.length }}</span
      >

      <span ref="inputMirror" class="semi-tagInput-wrapper-inputMirror" />
      <Input
        ref="inputComponent"
        aria-label="input value"
        :class-name="inputClasses"
        :disabled="props.disabled"
        :placeholder="state.tagsArray.length === 0 ? props.placeholder : ''"
        :prevent-scroll="props.preventScroll"
        :size="props.size"
        :style="inputWrapperStyle"
        :value="state.inputValue"
        @blur="(event) => foundation.handleInputBlur(event)"
        @change="handleInputChange"
        @composition-end="(event) => foundation.handleInputCompositionEnd(event)"
        @composition-start="(event) => foundation.handleInputCompositionStart(event)"
        @focus="(event) => foundation.handleInputFocus(event)"
        @keydown="(event) => foundation.handleKeyDown(event)"
      />
    </div>

    <div
      v-if="props.showClear"
      :class="[
        'semi-tagInput-clearBtn',
        !state.hovering || (!state.inputValue && state.tagsArray.length === 0) || props.disabled
          ? 'semi-tagInput-clearBtn-invisible'
          : undefined,
      ]"
      aria-label="Clear TagInput value"
      role="button"
      tabindex="0"
      @click="(event) => foundation.handleClearBtn(event)"
      @keydown="(event) => foundation.handleClearEnterPress(event)"
    >
      <slot name="clearIcon">
        <TagInputNodeRenderer v-if="clearIconContent" :content="clearIconContent" />
        <IconClear v-else />
      </slot>
    </div>

    <div
      v-if="suffixContent"
      :class="[
        'semi-tagInput-suffix',
        typeof suffixContent === 'string' ? 'semi-tagInput-suffix-text' : undefined,
        isIconContent(suffixContent) ? 'semi-tagInput-suffix-icon' : undefined,
      ]"
      x-semi-prop="suffix"
      @click="foundation.handleClickPrefixOrSuffix($event)"
      @mousedown="foundation.handlePreventMouseDown($event)"
    >
      <slot name="suffix"><TagInputNodeRenderer :content="props.suffix" /></slot>
    </div>
  </div>
</template>
