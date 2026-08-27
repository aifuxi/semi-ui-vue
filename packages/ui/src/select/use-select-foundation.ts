import { SelectFoundation, type SelectAdapter } from '@workspace/foundation-integration';
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
  SelectEmits,
  SelectModelValue,
  SelectOptionProps,
  SelectOptionRuntime,
  SelectProps,
} from './types';

export interface SelectState {
  isOpen: boolean;
  isFocus: boolean;
  options: SelectOptionRuntime[];
  selections: Map<unknown, SelectOptionRuntime>;
  dropdownMinWidth: number | string | undefined;
  optionKey: number;
  inputValue: string;
  showInput: boolean;
  focusIndex: number;
  keyboardEventSet: Record<string, (event: KeyboardEvent) => void>;
  optionGroups: unknown[];
  isHovering: boolean;
  isFocusInContainer: boolean;
  isFullTags: boolean;
  overflowItemCount: number;
}

interface SelectFoundationController {
  _handleKeyDown(event: KeyboardEvent): void;
  clearInput(event?: Event): void;
  clearSelected(): void;
  close(config?: { event?: Event; closeCb?: () => void; notToggleInput?: boolean }): void;
  focus(options?: unknown[], openDropdown?: boolean): void;
  handleClearClick(event: Event): void;
  handleClick(event: Event): void;
  handleContainerKeyDown(event: KeyboardEvent): void;
  handleInputBlur(event: FocusEvent): void;
  handleInputChange(value: string, event?: Event): void;
  handleListScroll(event: Event): void;
  handleMouseEnter(event: MouseEvent): void;
  handleMouseLeave(event: MouseEvent): void;
  handleOptionListChange(): void;
  handleOptionListChangeHadDefaultValue(): void;
  handleOptionMouseEnter(index: number): void;
  handlePopoverClose(): void;
  handleSlotMouseEnter(): void;
  handleTriggerBlur(event: FocusEvent): void;
  handleTriggerFocus(event: FocusEvent): void;
  onSelect(option: SelectOptionRuntime, index: number, event: Event): void;
  open(input?: string): void;
  removeTag(option: SelectOptionRuntime): void;
  selectAll(): void;
}

interface SelectFoundationBinding {
  foundation: SelectFoundationController;
  state: SelectState;
}

interface UseSelectFoundationOptions {
  controlled: ComputedRef<boolean>;
  emit: <K extends keyof SelectEmits>(event: K, ...args: SelectEmits[K]) => void;
  getOptions: () => SelectOptionRuntime[];
  listElement: Ref<HTMLDivElement | null>;
  runtimeProps: ComputedRef<SelectRuntimeProps>;
  triggerElement: Ref<HTMLDivElement | null>;
}

export type SelectRuntimeProps = Omit<
  SelectProps,
  | 'autoAdjustOverflow'
  | 'autoClearSearchValue'
  | 'allowCreate'
  | 'borderless'
  | 'defaultActiveFirstOption'
  | 'defaultOpen'
  | 'disabled'
  | 'dropdownMatchSelectWidth'
  | 'filter'
  | 'maxHeight'
  | 'motion'
  | 'multiple'
  | 'onChangeWithObject'
  | 'placeholder'
  | 'remote'
  | 'searchPosition'
  | 'showArrow'
  | 'showClear'
  | 'showRestTagsPopover'
  | 'size'
  | 'stopPropagation'
  | 'validateStatus'
  | 'zIndex'
> &
  Required<
    Pick<
      SelectProps,
      | 'autoAdjustOverflow'
      | 'autoClearSearchValue'
      | 'allowCreate'
      | 'borderless'
      | 'defaultActiveFirstOption'
      | 'defaultOpen'
      | 'disabled'
      | 'dropdownMatchSelectWidth'
      | 'filter'
      | 'maxHeight'
      | 'motion'
      | 'multiple'
      | 'onChangeWithObject'
      | 'placeholder'
      | 'remote'
      | 'searchPosition'
      | 'showArrow'
      | 'showClear'
      | 'showRestTagsPopover'
      | 'size'
      | 'stopPropagation'
      | 'validateStatus'
      | 'zIndex'
    >
  >;

function publicOption(option: SelectOptionRuntime): SelectOptionProps {
  const copy = { ...option } as Record<string, unknown>;
  for (const key of Object.keys(copy))
    if (key.startsWith('_') || key === 'children') delete copy[key];
  return copy as SelectOptionProps;
}

export function useSelectFoundation(options: UseSelectFoundationOptions): SelectFoundationBinding {
  const { controlled, emit, getOptions, listElement, runtimeProps, triggerElement } = options;
  const state = shallowReactive<SelectState>({
    isOpen: false,
    isFocus: false,
    options: [],
    selections: new Map(),
    dropdownMinWidth: undefined,
    optionKey: 0,
    inputValue: '',
    showInput: false,
    focusIndex: runtimeProps.value.defaultActiveFirstOption ? 0 : -1,
    keyboardEventSet: {},
    optionGroups: [],
    isHovering: false,
    isFocusInContainer: false,
    isFullTags: false,
    overflowItemCount: 0,
  });
  const cache = new Map<unknown, unknown>();
  const eventHandlers = new Map<string, Set<() => void>>();
  let clickOutsideHandler: ((event: MouseEvent) => void) | undefined;
  let previousSelections: Map<unknown, SelectOptionRuntime> | undefined;

  function getFoundationProps(): Record<string, unknown> {
    const current = { ...runtimeProps.value } as Record<string, unknown>;
    if (!controlled.value) delete current.value;
    else current.value = runtimeProps.value.value ?? runtimeProps.value.modelValue;
    return current;
  }

  const adapter: SelectAdapter<Record<string, unknown>, SelectState> = {
    getContext: () => undefined,
    getContexts: () => undefined,
    getProp: (key) => getFoundationProps()[String(key)],
    getProps: getFoundationProps,
    getState: (key) =>
      key === 'selections' && previousSelections !== undefined ? previousSelections : state[key],
    getStates: () => state,
    setState: (nextState, callback) => {
      Object.assign(state, nextState);
      callback?.();
    },
    getCache: (key) => cache.get(key),
    getCaches: () => cache,
    setCache: (key, value) => cache.set(key, value),
    stopPropagation: (event) => event?.stopPropagation(),
    persistEvent: () => undefined,
    getTriggerWidth: () => triggerElement.value?.getBoundingClientRect().width ?? 0,
    updateFocusState: (focus: boolean) => {
      state.isFocus = focus;
    },
    focusTrigger: () =>
      triggerElement.value?.focus({ preventScroll: runtimeProps.value.preventScroll ?? false }),
    unregisterClickOutsideHandler: () => {
      if (clickOutsideHandler && typeof document !== 'undefined') {
        document.removeEventListener('mousedown', clickOutsideHandler);
      }
      clickOutsideHandler = undefined;
    },
    setOptionWrapperWidth: (width: string | number) => {
      state.dropdownMinWidth = width;
    },
    getOptionsFromChildren: () => getOptions().map((option) => ({ ...option })),
    updateOptions: (nextOptions: SelectOptionRuntime[]) => {
      state.options = nextOptions;
    },
    rePositionDropdown: () => {
      state.optionKey += 1;
    },
    updateFocusIndex: (index: number) => {
      state.focusIndex = index;
    },
    // The pinned Foundation reads the previous selection immediately after
    // requesting an Adapter update to decide whether onChange should fire.
    // Preserve that one React setState observation while updating Vue synchronously.
    updateSelection: (selection: Map<unknown, SelectOptionRuntime>) => {
      previousSelections = state.selections;
      state.selections = selection;
      void nextTick(() => {
        previousSelections = undefined;
      });
    },
    openMenu: (callback?: () => void) => {
      state.isOpen = true;
      void nextTick(() => callback?.());
    },
    notifyDropdownVisibleChange: (visible: boolean) => emit('dropdownVisibleChange', visible),
    registerClickOutsideHandler: (callback: (event: MouseEvent) => void) => {
      if (typeof document === 'undefined') return;
      clickOutsideHandler = (event) => {
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (triggerElement.value?.contains(target) || listElement.value?.contains(target)) return;
        callback(event);
      };
      document.addEventListener('mousedown', clickOutsideHandler);
    },
    toggleInputShow: (show: boolean, callback: () => void) => {
      state.showInput = show;
      void nextTick(callback);
    },
    closeMenu: () => {
      state.isOpen = false;
      if (!runtimeProps.value.motion) {
        void nextTick(() => eventHandlers.get('popoverClose')?.forEach((callback) => callback()));
      }
    },
    notifyCreate: (option: SelectOptionRuntime) => emit('create', publicOption(option)),
    getMaxLimit: () => runtimeProps.value.max,
    getSelections: () => new Map(state.selections),
    notifyMaxLimit: (option: SelectOptionRuntime) => emit('exceed', publicOption(option)),
    notifyClear: () => emit('clear'),
    updateInputValue: (value: string) => {
      state.inputValue = value;
    },
    focusInput: () => {
      void nextTick(() =>
        triggerElement.value?.querySelector<HTMLInputElement>('input')?.focus({
          preventScroll: runtimeProps.value.preventScroll ?? false,
        }),
      );
    },
    focusDropdownInput: () => {
      void nextTick(() =>
        listElement.value?.querySelector<HTMLInputElement>('input')?.focus({
          preventScroll: runtimeProps.value.preventScroll ?? false,
        }),
      );
    },
    notifySearch: (value: string, event?: Event) => emit('search', value, event),
    registerKeyDown: (handler: (event: KeyboardEvent) => void) => {
      state.keyboardEventSet = { keydown: handler };
    },
    unregisterKeyDown: () => {
      state.keyboardEventSet = {};
    },
    notifyChange: (value: SelectModelValue) => {
      emit('change', value);
      emit('update:modelValue', value);
      emit('update:value', value);
    },
    notifySelect: (value: string | number | undefined, option: SelectOptionRuntime) => {
      emit('select', value, publicOption(option));
    },
    notifyDeselect: (value: string | number | undefined, option: SelectOptionRuntime) => {
      emit('deselect', value, publicOption(option));
    },
    notifyBlur: (event: FocusEvent) => emit('blur', event),
    notifyFocus: (event: FocusEvent) => emit('focus', event),
    notifyListScroll: (event: Event) => emit('listScroll', event),
    notifyMouseLeave: () => undefined,
    notifyMouseEnter: () => undefined,
    updateHovering: (hovering: boolean) => {
      state.isHovering = hovering;
    },
    updateScrollTop: (index?: number) => {
      const targetIndex = index ?? [...state.selections.values()][0]?._scrollIndex;
      if (targetIndex === undefined || targetIndex < 0) return;
      const target = listElement.value?.querySelector<HTMLElement>(
        `[data-option-index="${targetIndex}"]`,
      );
      if (target && listElement.value) {
        listElement.value.scrollTop =
          target.offsetTop - listElement.value.clientHeight / 2 + target.clientHeight / 2;
      }
    },
    updateOverflowItemCount: (count: number) => {
      state.overflowItemCount = count;
    },
    getContainer: () => listElement.value,
    getFocusableElements: (node: HTMLElement | null) =>
      node
        ? Array.from(
            node.querySelectorAll<HTMLElement>(
              'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
            ),
          )
        : [],
    getActiveElement: () => (typeof document === 'undefined' ? undefined : document.activeElement),
    setIsFocusInContainer: (value: boolean) => {
      state.isFocusInContainer = value;
    },
    getIsFocusInContainer: () => state.isFocusInContainer,
    on: (name: string, callback: () => void) => {
      const handlers = eventHandlers.get(name) ?? new Set();
      handlers.add(callback);
      eventHandlers.set(name, handlers);
    },
    off: (name: string) => eventHandlers.delete(name),
    once: (name: string, callback: () => void) => {
      const onceCallback = () => {
        callback();
        eventHandlers.get(name)?.delete(onceCallback);
      };
      const handlers = eventHandlers.get(name) ?? new Set();
      handlers.add(onceCallback);
      eventHandlers.set(name, handlers);
    },
    emit: (name: string) => eventHandlers.get(name)?.forEach((callback) => callback()),
  };
  const foundation = markRaw(new SelectFoundation<Record<string, unknown>, SelectState>(adapter));

  watch(
    () => runtimeProps.value.value ?? runtimeProps.value.modelValue,
    (value) => {
      if (controlled.value) foundation.handleValueChange(value);
    },
    { deep: true },
  );
  watch(
    () => runtimeProps.value.optionList,
    () => {
      foundation.handleOptionListChange();
      if (!controlled.value) foundation.handleOptionListChangeHadDefaultValue();
    },
    { deep: true },
  );

  onMounted(() => foundation.init());
  onBeforeUnmount(() => foundation.destroy());

  return { foundation, state };
}
