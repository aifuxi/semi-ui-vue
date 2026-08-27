<script setup lang="ts">
import { IconClear } from '@workspace/icons';
import {
  computed,
  getCurrentInstance,
  inject,
  shallowRef,
  useAttrs,
  useId,
  useSlots,
  useTemplateRef,
  type CSSProperties,
  type VNodeChild,
} from 'vue';

import { configContextKey, semiGlobal, type ConfigContextValue } from '../config-provider';
import Tooltip from '../tooltip/Tooltip.vue';
import AutoCompleteNodeRenderer from './AutoCompleteNodeRenderer';
import AutoCompleteOption from './AutoCompleteOption.vue';
import type {
  AutoCompleteEmits,
  AutoCompleteExposed,
  AutoCompleteItem,
  AutoCompleteOptionRuntime,
  AutoCompleteProps,
  AutoCompleteSlots,
} from './types';
import {
  useAutoCompleteFoundation,
  type AutoCompleteRuntimeProps,
} from './use-auto-complete-foundation';

defineOptions({ name: 'AutoComplete', inheritAttrs: false });
const props = defineProps<AutoCompleteProps>();
const emit = defineEmits<AutoCompleteEmits>();
defineSlots<AutoCompleteSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const injectedConfig = inject(configContextKey, undefined);
const triggerElement = useTemplateRef<HTMLDivElement>('triggerElement');
const inputElement = useTemplateRef<HTMLInputElement>('inputElement');
const listElement = useTemplateRef<HTMLDivElement>('listElement');
const focused = shallowRef(false);
const hovered = shallowRef(false);
const composing = shallowRef(false);
const listId = `semi-autocomplete-${useId().replaceAll(':', '')}`;

const config = computed<ConfigContextValue>(
  () =>
    injectedConfig?.value ??
    ({ direction: 'ltr', getPopupContainer: undefined } as ConfigContextValue),
);

function resolveProp<Key extends keyof AutoCompleteProps>(
  key: Key,
  fallback: AutoCompleteProps[Key],
): AutoCompleteProps[Key] {
  const kebabKey = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  const rawProps = instance?.vnode.props;
  const explicit = Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, key) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabKey)),
  );
  if (explicit && props[key] !== undefined) return props[key] as AutoCompleteProps[Key];
  const globalValue = semiGlobal.config.overrideDefaultProps?.AutoComplete?.[key];
  return (globalValue === undefined ? fallback : globalValue) as AutoCompleteProps[Key];
}

const runtimeProps = computed<AutoCompleteRuntimeProps>(
  () =>
    ({
      ...props,
      autoAdjustOverflow: resolveProp('autoAdjustOverflow', true) as boolean,
      autoFocus: resolveProp('autoFocus', false) as boolean,
      data: resolveProp('data', []) as AutoCompleteItem[],
      defaultActiveFirstOption: resolveProp('defaultActiveFirstOption', false) as boolean,
      defaultOpen: resolveProp('defaultOpen', false) as boolean,
      disabled: resolveProp('disabled', false) as boolean,
      dropdownMatchSelectWidth: resolveProp('dropdownMatchSelectWidth', true) as boolean,
      emptyContent: resolveProp('emptyContent', null) as VNodeChild | null,
      loading: resolveProp('loading', false) as boolean,
      maxHeight: resolveProp('maxHeight', 300) as string | number,
      motion: resolveProp('motion', true) as boolean,
      onSelectWithObject: resolveProp('onSelectWithObject', false) as boolean,
      position: resolveProp('position', 'bottomLeft') as AutoCompleteRuntimeProps['position'],
      showClear: resolveProp('showClear', false) as boolean,
      size: resolveProp('size', 'default') as AutoCompleteRuntimeProps['size'],
      stopPropagation: resolveProp('stopPropagation', true) as boolean | string,
      validateStatus: resolveProp(
        'validateStatus',
        'default',
      ) as AutoCompleteRuntimeProps['validateStatus'],
      zIndex: resolveProp('zIndex', 1030) as number,
      style: props.style,
    }) as AutoCompleteRuntimeProps,
);

const controlled = computed(() => {
  const raw = instance?.vnode.props;
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, 'value') ||
      Object.prototype.hasOwnProperty.call(raw, 'modelValue') ||
      Object.prototype.hasOwnProperty.call(raw, 'model-value')),
  );
});

const { foundation, state } = useAutoCompleteFoundation({
  controlled,
  emit,
  listElement,
  runtimeProps,
  triggerElement,
});

const displayValue = computed(() =>
  controlled.value
    ? (runtimeProps.value.modelValue ?? runtimeProps.value.value ?? '')
    : state.inputValue,
);
const visibleOptions = computed(() => state.options.filter((option) => option.show !== false));
const popupContainer = computed(
  () => runtimeProps.value.getPopupContainer ?? config.value.getPopupContainer,
);
const activeDescendant = computed(() =>
  state.focusIndex >= 0 ? `${listId}-option-${state.focusIndex}` : undefined,
);
const showClearButton = computed(
  () =>
    runtimeProps.value.showClear &&
    !runtimeProps.value.disabled &&
    String(displayValue.value).length > 0 &&
    (focused.value || hovered.value),
);
const outerClasses = computed(() => [
  attrs.class,
  slots.trigger ? undefined : 'semi-autocomplete',
  !slots.trigger && runtimeProps.value.disabled ? 'semi-autocomplete-disabled' : undefined,
]);
const inputWrapperClasses = computed(() => [
  'semi-input-wrapper',
  `semi-input-wrapper-${runtimeProps.value.size}`,
  focused.value ? 'semi-input-wrapper-focus' : undefined,
  runtimeProps.value.disabled ? 'semi-input-wrapper-disabled' : undefined,
  runtimeProps.value.validateStatus === 'warning' ? 'semi-input-wrapper-warning' : undefined,
  runtimeProps.value.validateStatus === 'error' ? 'semi-input-wrapper-error' : undefined,
  runtimeProps.value.showClear ? 'semi-input-wrapper-clearable' : undefined,
  slots.prefix || runtimeProps.value.prefix || slots.insetLabel || runtimeProps.value.insetLabel
    ? 'semi-input-wrapper__with-prefix'
    : undefined,
  slots.suffix || runtimeProps.value.suffix ? 'semi-input-wrapper__with-suffix' : undefined,
]);
const inputClasses = computed(() => [
  'semi-input',
  `semi-input-${runtimeProps.value.size}`,
  runtimeProps.value.disabled ? 'semi-input-disabled' : undefined,
  showClearButton.value ? 'semi-input-sibling-clearbtn' : undefined,
]);
const listStyle = computed<CSSProperties>(() => ({
  maxHeight:
    typeof runtimeProps.value.maxHeight === 'number'
      ? `${runtimeProps.value.maxHeight}px`
      : runtimeProps.value.maxHeight,
  minWidth:
    typeof state.dropdownMinWidth === 'number'
      ? `${state.dropdownMinWidth}px`
      : state.dropdownMinWidth,
  ...(runtimeProps.value.dropdownStyle &&
  typeof runtimeProps.value.dropdownStyle === 'object' &&
  !Array.isArray(runtimeProps.value.dropdownStyle)
    ? (runtimeProps.value.dropdownStyle as CSSProperties)
    : {}),
}));
const dataAttributes = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('data-'))),
);

function inputChanged(event: Event): void {
  if (composing.value) return;
  foundation.handleSearch((event.target as HTMLInputElement).value);
}
function compositionEnded(event: CompositionEvent): void {
  composing.value = false;
  foundation.handleSearch((event.target as HTMLInputElement).value);
}
function inputFocused(event: FocusEvent): void {
  focused.value = true;
  foundation.handleFocus(event);
}
function inputBlurred(event: FocusEvent): void {
  focused.value = false;
  foundation.handleBlur(event);
}
function keydown(event: KeyboardEvent): void {
  state.keyboardEventSet.onKeyDown?.(event);
}
function toggle(event: MouseEvent): void {
  if ((event.target as HTMLElement | null)?.closest('.semi-input-clearbtn')) return;
  foundation.handleInputClick(event);
}
function clear(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  foundation.handleSearch('');
  foundation.handleClear();
  inputElement.value?.focus();
}
function select(option: AutoCompleteOptionRuntime, index: number): void {
  foundation.handleSelect(option, index);
}
function originalItem(option: AutoCompleteOptionRuntime): AutoCompleteItem {
  const match = runtimeProps.value.data.find((item) => {
    if (typeof item === 'string' || typeof item === 'number') return item === option.value;
    return item.value === option.value;
  });
  return match ?? option;
}
function optionContent(option: AutoCompleteOptionRuntime): VNodeChild {
  return option._renderedLabel ?? option.label ?? option.value;
}
function open(): void {
  foundation.openDropdown();
}
function close(): void {
  foundation.closeDropdown();
}
function focus(): void {
  inputElement.value?.focus();
}
function search(value: string): void {
  foundation.handleSearch(value);
}
defineExpose<AutoCompleteExposed>({ close, focus, open, search });
</script>

<template>
  <Tooltip
    prefix-cls="semi-popover"
    role="presentation"
    trigger="custom"
    :visible="state.visible"
    :position="runtimeProps.position"
    :show-arrow="false"
    :spacing="4"
    :z-index="runtimeProps.zIndex"
    :motion="runtimeProps.motion"
    :auto-adjust-overflow="runtimeProps.autoAdjustOverflow"
    :mouse-enter-delay="runtimeProps.mouseEnterDelay ?? 0"
    :mouse-leave-delay="runtimeProps.mouseLeaveDelay ?? 0"
    :stop-propagation="Boolean(runtimeProps.stopPropagation)"
    :re-pos-key="state.rePosKey"
    v-bind="popupContainer ? { getPopupContainer: popupContainer } : {}"
    @update:visible="
      (visible) => {
        if (!visible && state.visible) foundation.closeDropdown();
      }
    "
  >
    <template #content>
      <div
        :id="listId"
        ref="listElement"
        :class="['semi-autocomplete-option-list', runtimeProps.dropdownClassName]"
        :style="listStyle"
        role="listbox"
      >
        <div v-if="runtimeProps.loading" class="semi-autocomplete-loading-wrapper">
          <span class="semi-spin semi-spin-middle"
            ><span class="semi-spin-wrapper"><span class="semi-spin-spinIcon" /></span
          ></span>
        </div>
        <template v-else-if="visibleOptions.length">
          <AutoCompleteOption
            v-for="(option, index) in visibleOptions"
            :id="`${listId}-option-${index}`"
            :key="option._key ?? `${String(option.label)}-${String(option.value)}-${index}`"
            :class="option.class"
            :class-name="option.className"
            :disabled="option.disabled"
            :focused="index === state.focusIndex"
            :selected="false"
            :style="option.style"
            :value="option.value"
            @select="select(option, index)"
            @mouseenter="foundation.handleOptionMouseEnter(index)"
          >
            <slot
              v-if="$slots.option"
              name="option"
              :focused="index === state.focusIndex"
              :input-value="displayValue"
              :item="originalItem(option)"
              :on-click="() => select(option, index)"
              :on-mouseenter="() => foundation.handleOptionMouseEnter(index)"
              :option="option"
            />
            <div
              v-else-if="typeof optionContent(option) === 'string'"
              class="semi-autocomplete-option-text"
            >
              {{ optionContent(option) }}
            </div>
            <AutoCompleteNodeRenderer v-else :content="optionContent(option)" />
          </AutoCompleteOption>
        </template>
        <slot v-else-if="$slots.emptyContent" name="emptyContent" />
        <AutoCompleteNodeRenderer
          v-else-if="runtimeProps.emptyContent !== null"
          :content="runtimeProps.emptyContent"
        />
      </div>
    </template>

    <div
      :id="runtimeProps.id"
      ref="triggerElement"
      v-bind="dataAttributes"
      role="combobox"
      aria-haspopup="listbox"
      :aria-controls="listId"
      :aria-expanded="state.visible ? 'true' : 'false'"
      :aria-disabled="runtimeProps.disabled ? 'true' : 'false'"
      :aria-activedescendant="activeDescendant"
      :class="outerClasses"
      :style="runtimeProps.style"
      tabindex="-1"
      @click="toggle"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      @keydown="keydown"
    >
      <slot
        v-if="$slots.trigger"
        name="trigger"
        :component-props="runtimeProps"
        :input-value="displayValue"
        :on-clear="clear"
        :on-search="search"
        :value="Array.from(state.selection.values())"
      />
      <div v-else :class="inputWrapperClasses">
        <div
          v-if="
            $slots.prefix || runtimeProps.prefix || $slots.insetLabel || runtimeProps.insetLabel
          "
          :id="runtimeProps.insetLabelId"
          :class="[
            'semi-input-prefix',
            $slots.insetLabel || runtimeProps.insetLabel
              ? 'semi-input-inset-label'
              : 'semi-input-prefix-icon',
          ]"
          x-semi-prop="prefix,insetLabel"
          @mousedown.prevent
        >
          <slot v-if="$slots.prefix" name="prefix" />
          <slot v-else-if="$slots.insetLabel" name="insetLabel" />
          <AutoCompleteNodeRenderer
            v-else
            :content="runtimeProps.prefix ?? runtimeProps.insetLabel"
          />
        </div>
        <input
          ref="inputElement"
          :class="inputClasses"
          :value="displayValue"
          :disabled="runtimeProps.disabled"
          :placeholder="runtimeProps.placeholder"
          :autofocus="runtimeProps.autoFocus"
          :aria-label="runtimeProps.ariaLabel"
          :aria-labelledby="runtimeProps.ariaLabelledby"
          :aria-invalid="
            runtimeProps.validateStatus === 'error' ? 'true' : runtimeProps.ariaInvalid
          "
          :aria-errormessage="runtimeProps.ariaErrormessage"
          :aria-describedby="runtimeProps.ariaDescribedby"
          :aria-required="runtimeProps.ariaRequired"
          :aria-controls="listId"
          :aria-expanded="state.visible ? 'true' : 'false'"
          :aria-activedescendant="activeDescendant"
          autocomplete="off"
          @input="inputChanged"
          @focus="inputFocused"
          @blur="inputBlurred"
          @compositionstart="composing = true"
          @compositionend="compositionEnded"
        />
        <div v-if="showClearButton" class="semi-input-clearbtn" @mousedown="clear">
          <slot name="clearIcon"
            ><AutoCompleteNodeRenderer
              v-if="runtimeProps.clearIcon"
              :content="runtimeProps.clearIcon" /><IconClear v-else
          /></slot>
        </div>
        <div
          v-if="$slots.suffix || runtimeProps.suffix"
          class="semi-input-suffix semi-input-suffix-icon"
          x-semi-prop="suffix"
          @mousedown.prevent
        >
          <slot name="suffix"><AutoCompleteNodeRenderer :content="runtimeProps.suffix" /></slot>
        </div>
      </div>
    </div>
  </Tooltip>
</template>
