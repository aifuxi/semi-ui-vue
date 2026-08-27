import {
  AutoCompleteFoundation,
  type AutoCompleteAdapter,
} from '@workspace/foundation-integration';
import {
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue';

import type {
  AutoCompleteDataItem,
  AutoCompleteEmits,
  AutoCompleteItem,
  AutoCompleteOptionRuntime,
  AutoCompleteProps,
} from './types';

export type AutoCompleteRuntimeProps = Omit<
  AutoCompleteProps,
  | 'autoAdjustOverflow'
  | 'autoFocus'
  | 'data'
  | 'defaultActiveFirstOption'
  | 'defaultOpen'
  | 'disabled'
  | 'dropdownMatchSelectWidth'
  | 'emptyContent'
  | 'loading'
  | 'maxHeight'
  | 'motion'
  | 'onSelectWithObject'
  | 'position'
  | 'showClear'
  | 'size'
  | 'stopPropagation'
  | 'validateStatus'
  | 'zIndex'
> &
  Required<
    Pick<
      AutoCompleteProps,
      | 'autoAdjustOverflow'
      | 'autoFocus'
      | 'data'
      | 'defaultActiveFirstOption'
      | 'defaultOpen'
      | 'disabled'
      | 'dropdownMatchSelectWidth'
      | 'emptyContent'
      | 'loading'
      | 'maxHeight'
      | 'motion'
      | 'onSelectWithObject'
      | 'position'
      | 'showClear'
      | 'size'
      | 'stopPropagation'
      | 'validateStatus'
      | 'zIndex'
    >
  >;

export interface AutoCompleteState {
  dropdownMinWidth: number | string | undefined;
  focusIndex: number;
  inputValue: string | number;
  keyboardEventSet: { onKeyDown?: (event: KeyboardEvent) => void };
  options: AutoCompleteOptionRuntime[];
  rePosKey: number;
  selection: Map<unknown, AutoCompleteOptionRuntime>;
  visible: boolean;
}

interface AutoCompleteFoundationController {
  closeDropdown(event?: Event): void;
  handleBlur(event: FocusEvent): void;
  handleClear(): void;
  handleDataChange(data: AutoCompleteItem[]): void;
  handleFocus(event: FocusEvent): void;
  handleInputClick(event?: MouseEvent): void;
  handleOptionMouseEnter(index: number): void;
  handleSearch(value: string): void;
  handleSelect(option: AutoCompleteOptionRuntime, index?: number): void;
  handleValueChange(value: unknown): void;
  openDropdown(): void;
}

interface UseAutoCompleteFoundationOptions {
  controlled: ComputedRef<boolean>;
  emit: <K extends keyof AutoCompleteEmits>(event: K, ...args: AutoCompleteEmits[K]) => void;
  listElement: Ref<HTMLDivElement | null>;
  runtimeProps: ComputedRef<AutoCompleteRuntimeProps>;
  triggerElement: Ref<HTMLDivElement | null>;
}

function publicOption(option: AutoCompleteOptionRuntime): AutoCompleteDataItem {
  const copy = { ...option } as Record<string, unknown>;
  for (const key of Object.keys(copy)) {
    if (key.startsWith('_') || key === 'show' || key === 'key') delete copy[key];
  }
  return copy as AutoCompleteDataItem;
}

export function useAutoCompleteFoundation(options: UseAutoCompleteFoundationOptions): {
  foundation: AutoCompleteFoundationController;
  state: AutoCompleteState;
} {
  const { controlled, emit, listElement, runtimeProps, triggerElement } = options;
  const initialValue = controlled.value
    ? (runtimeProps.value.modelValue ?? runtimeProps.value.value ?? '')
    : (runtimeProps.value.defaultValue ?? '');
  const state = shallowReactive<AutoCompleteState>({
    dropdownMinWidth: undefined,
    focusIndex: runtimeProps.value.defaultActiveFirstOption ? 0 : -1,
    inputValue: initialValue,
    keyboardEventSet: {},
    options: [],
    rePosKey: 1,
    selection: new Map(),
    visible: false,
  });
  const cache = new Map<unknown, unknown>();
  let clickOutsideHandler: ((event: MouseEvent) => void) | undefined;
  let mounted = false;

  function foundationProps(): Record<string, unknown> {
    const current = { ...runtimeProps.value } as Record<string, unknown>;
    if (controlled.value) current.value = runtimeProps.value.modelValue ?? runtimeProps.value.value;
    else delete current.value;
    return current;
  }

  const adapter: AutoCompleteAdapter<Record<string, unknown>, AutoCompleteState> = {
    getContext: () => undefined,
    getContexts: () => undefined,
    getProp: (key) => foundationProps()[String(key)],
    getProps: foundationProps,
    getState: (key) => state[key],
    getStates: () => state,
    setState: (next, callback) => {
      Object.assign(state, next);
      callback?.();
    },
    getCache: (key) => cache.get(key),
    getCaches: () => cache,
    setCache: (key, value) => cache.set(key, value),
    stopPropagation: (event) => event?.stopPropagation(),
    persistEvent: () => undefined,
    getTriggerWidth: () => triggerElement.value?.getBoundingClientRect().width,
    setOptionWrapperWidth: (width) => {
      state.dropdownMinWidth = width;
    },
    updateInputValue: (value) => {
      state.inputValue = value;
    },
    toggleListVisible: (visible) => {
      state.visible = visible;
    },
    updateOptionList: (items) => {
      state.options = items as AutoCompleteOptionRuntime[];
    },
    updateScrollTop: (index) => {
      void nextTick(() => {
        const target =
          index === undefined
            ? listElement.value?.querySelector<HTMLElement>('.semi-autocomplete-option-selected')
            : listElement.value?.querySelector<HTMLElement>(
                `.semi-autocomplete-option:nth-child(${index + 1})`,
              );
        if (!target || !listElement.value) return;
        listElement.value.scrollTop =
          target.offsetTop -
          listElement.value.offsetTop -
          listElement.value.clientHeight / 2 +
          target.clientHeight / 2;
      });
    },
    updateSelection: (selection) => {
      state.selection = selection as Map<unknown, AutoCompleteOptionRuntime>;
    },
    notifySearch: (value) => emit('search', value),
    notifyChange: (value) => {
      emit('change', value);
      emit('update:modelValue', value);
      emit('update:value', value);
    },
    notifySelect: (value) => {
      emit(
        'select',
        typeof value === 'object' && value !== null
          ? publicOption(value as AutoCompleteOptionRuntime)
          : (value as string | number),
      );
    },
    notifyDropdownVisibleChange: (visible) => emit('dropdownVisibleChange', visible),
    notifyClear: () => emit('clear'),
    notifyFocus: (event) => {
      if (event) emit('focus', event);
    },
    notifyBlur: (event) => {
      if (event) emit('blur', event);
    },
    notifyKeyDown: (event) => emit('keydown', event),
    rePositionDropdown: () => {
      state.rePosKey += 1;
    },
    registerKeyDown: (callback) => {
      state.keyboardEventSet = { onKeyDown: callback };
    },
    unregisterKeyDown: () => {
      state.keyboardEventSet = {};
    },
    updateFocusIndex: (index) => {
      state.focusIndex = index;
    },
    registerClickOutsideHandler: (callback) => {
      if (typeof document === 'undefined') return;
      if (clickOutsideHandler) document.removeEventListener('mousedown', clickOutsideHandler);
      clickOutsideHandler = (event) => {
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (triggerElement.value?.contains(target) || listElement.value?.contains(target)) return;
        callback(event);
      };
      document.addEventListener('mousedown', clickOutsideHandler);
    },
    unregisterClickOutsideHandler: () => {
      if (clickOutsideHandler && typeof document !== 'undefined') {
        document.removeEventListener('mousedown', clickOutsideHandler);
      }
      clickOutsideHandler = undefined;
    },
  };

  const foundation = markRaw(
    new AutoCompleteFoundation(adapter) as unknown as AutoCompleteFoundationController,
  );

  onMounted(() => {
    mounted = true;
    // init owns defaultOpen, width measurement and the first click-outside registration.
    (foundation as unknown as { init(): void }).init();
  });
  onBeforeUnmount(() => {
    mounted = false;
    (foundation as unknown as { destroy(): void }).destroy();
  });
  watch(
    () => runtimeProps.value.data,
    (data) => {
      if (mounted) foundation.handleDataChange(data);
    },
    { deep: true },
  );
  watch(
    () =>
      controlled.value ? (runtimeProps.value.modelValue ?? runtimeProps.value.value) : undefined,
    (value) => {
      if (mounted && controlled.value) foundation.handleValueChange(value);
    },
  );

  return { foundation, state };
}
