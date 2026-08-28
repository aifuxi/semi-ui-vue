import { TagInputFoundation, type TagInputAdapter } from '@workspace/foundation-integration';
import {
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue';

import type { TagInputProps, TagInputState } from './types';

interface FoundationProps extends Record<string, unknown> {
  addOnBlur: boolean;
  allowDuplicates: boolean;
  disabled: boolean;
  max?: number | undefined;
  maxLength?: number | undefined;
  onExceed(value: string[]): void;
  onInputExceed(value: string): void;
  separator: TagInputProps['separator'];
  split?: TagInputProps['split'] | undefined;
  value?: string[] | undefined;
}

interface UseTagInputFoundationOptions {
  controlled: ComputedRef<boolean>;
  controlledInput: ComputedRef<boolean>;
  controlledInputValue: ComputedRef<string | undefined>;
  controlledValue: ComputedRef<string[] | undefined>;
  emitAdd(value: string[]): void;
  emitBlur(event: FocusEvent): void;
  emitChange(value: string[]): void;
  emitExceed(value: string[]): void;
  emitFocus(event: FocusEvent): void;
  emitInputChange(value: string, event: Event): void;
  emitInputExceed(value: string): void;
  emitKeyDown(event: KeyboardEvent): void;
  emitRemove(value: string, index: number): void;
  props: Readonly<TagInputProps>;
  root: Readonly<Ref<HTMLDivElement | null>>;
  input: Readonly<Ref<HTMLInputElement | null>>;
}

interface TagInputFoundationController {
  clickOutsideCallBack(): void;
  handleClearBtn(event: MouseEvent): void;
  handleClearEnterPress(event: KeyboardEvent): void;
  handleClick(event?: MouseEvent): void;
  handleClickPrefixOrSuffix(event: MouseEvent): void;
  handleInputBlur(event: FocusEvent): void;
  handleInputChange(event: Event): void;
  handleInputCompositionEnd(event: CompositionEvent): void;
  handleInputCompositionStart(event: CompositionEvent): void;
  handleInputFocus(event: FocusEvent): void;
  handleInputMouseEnter(): void;
  handleInputMouseLeave(): void;
  handleKeyDown(event: KeyboardEvent): void;
  handlePreventMouseDown(event: MouseEvent): void;
  handleSortEnd(event: { newIndex: number; oldIndex: number }): void;
  handleTagClose(index: number): void;
}

interface TagInputFoundationBinding {
  foundation: TagInputFoundationController;
  state: TagInputState;
}

export function useTagInputFoundation(
  options: UseTagInputFoundationOptions,
): TagInputFoundationBinding {
  const { props } = options;
  const state = reactive<TagInputState>({
    active: false,
    entering: false,
    focusing: false,
    hovering: false,
    inputValue: options.controlledInput.value ? (options.controlledInputValue.value ?? '') : '',
    inputWidth: undefined,
    tagsArray: options.controlled.value
      ? [...(options.controlledValue.value ?? [])]
      : [...(props.defaultValue ?? [])],
  });
  const cache = new Map<string, unknown>();
  let clickOutsideHandler: ((event: Event) => void) | null = null;

  function getFoundationProps(): FoundationProps {
    const output: FoundationProps = {
      addOnBlur: props.addOnBlur ?? false,
      allowDuplicates: props.allowDuplicates ?? true,
      disabled: props.disabled ?? false,
      max: props.max,
      maxLength: props.maxLength,
      onExceed: options.emitExceed,
      onInputExceed: options.emitInputExceed,
      separator: props.separator ?? ',',
      split: props.split,
    };
    if (options.controlled.value) output.value = options.controlledValue.value;
    return output;
  }

  const adapter: TagInputAdapter<FoundationProps, TagInputState> = {
    getContext: () => undefined,
    getContexts: () => undefined,
    getProp: (key) => getFoundationProps()[key as keyof FoundationProps],
    getProps: getFoundationProps,
    getState: (key) => state[key as keyof TagInputState],
    getStates: () => ({ ...state, isFocus: state.focusing }) as TagInputState,
    setState: (nextState, callback) => {
      Object.assign(state, nextState);
      callback?.();
    },
    getCache: (key) => cache.get(key),
    getCaches: () => cache,
    setCache: (key, value) => cache.set(String(key), value),
    stopPropagation: (event) => event.stopPropagation?.(),
    persistEvent: () => undefined,
    setInputValue: (inputValue) => {
      state.inputValue = inputValue;
    },
    setTagsArray: (tagsArray) => {
      state.tagsArray = [...tagsArray];
    },
    setFocusing: (focusing) => {
      state.focusing = focusing;
    },
    toggleFocusing: (focused) => {
      if (focused) options.input.value?.focus({ preventScroll: props.preventScroll ?? false });
      else options.input.value?.blur();
      state.focusing = focused;
    },
    setHovering: (hovering) => {
      state.hovering = hovering;
    },
    setActive: (active) => {
      state.active = active;
    },
    setEntering: (entering) => {
      state.entering = entering;
    },
    getClickOutsideHandler: () => clickOutsideHandler,
    registerClickOutsideHandler: (callback) => {
      clickOutsideHandler = (event: Event) => {
        const target = event.target;
        const path = event.composedPath?.() ?? [];
        if (
          options.root.value &&
          (!(target instanceof Node) || !options.root.value.contains(target)) &&
          !path.includes(options.root.value)
        ) {
          callback(event);
        }
      };
      document.addEventListener('click', clickOutsideHandler);
    },
    unregisterClickOutsideHandler: () => {
      if (clickOutsideHandler) document.removeEventListener('click', clickOutsideHandler);
      clickOutsideHandler = null;
    },
    notifyBlur: options.emitBlur,
    notifyFocus: options.emitFocus,
    notifyInputChange: (value, event) => {
      options.emitInputChange(value, event);
      if (options.controlledInput.value) {
        void nextTick(() => {
          state.inputValue = options.controlledInputValue.value ?? '';
        });
      }
    },
    notifyTagChange: options.emitChange,
    notifyTagAdd: options.emitAdd,
    notifyTagRemove: options.emitRemove,
    notifyKeyDown: options.emitKeyDown,
  };
  const foundation = markRaw(new TagInputFoundation<FoundationProps, TagInputState>(adapter));

  watch(options.controlledValue, (value) => {
    if (options.controlled.value) state.tagsArray = [...(value ?? [])];
  });
  watch(options.controlledInputValue, (value) => {
    if (options.controlledInput.value) state.inputValue = value ?? '';
  });

  onMounted(() => {
    foundation.init();
    if (!props.disabled && props.autoFocus) {
      options.input.value?.focus({ preventScroll: props.preventScroll ?? false });
      foundation.handleClick();
    }
  });
  onBeforeUnmount(() => {
    adapter.unregisterClickOutsideHandler();
    foundation.destroy();
  });

  return { foundation: foundation as unknown as TagInputFoundationController, state };
}
