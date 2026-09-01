import { onBeforeUnmount, readonly, shallowRef, type DeepReadonly, type ShallowRef } from 'vue';

import { getActiveElement } from './index';

export type PreviousFocusRef = DeepReadonly<ShallowRef<HTMLElement | null>>;

export function usePrevFocus(): readonly [PreviousFocusRef, (element: HTMLElement | null) => void] {
  const previousFocusElement = shallowRef<HTMLElement | null>(getActiveElement());
  const setPreviousFocus = (element: HTMLElement | null): void => {
    if (previousFocusElement.value !== element) previousFocusElement.value?.blur();
    previousFocusElement.value = element;
  };
  onBeforeUnmount(() => previousFocusElement.value?.blur());
  return [readonly(previousFocusElement), setPreviousFocus] as const;
}

export default usePrevFocus;
