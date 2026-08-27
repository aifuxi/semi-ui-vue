import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { TooltipPosition } from '../tooltip';

export type AutoCompletePrimitive = string | number;

export interface AutoCompleteDataItem {
  value?: AutoCompletePrimitive;
  label?: VNodeChild;
  disabled?: boolean;
  class?: HTMLAttributes['class'];
  className?: string;
  style?: StyleValue;
  [key: string]: unknown;
}

export type AutoCompleteItem = AutoCompleteDataItem | AutoCompletePrimitive;
export type AutoCompleteModelValue = AutoCompletePrimitive | undefined;
export type AutoCompleteSize = 'small' | 'default' | 'large';
export type AutoCompleteValidateStatus = 'default' | 'warning' | 'error';

export interface AutoCompleteOptionRuntime extends AutoCompleteDataItem {
  _key?: PropertyKey;
  _renderedLabel?: VNodeChild;
  show?: boolean;
  value?: AutoCompletePrimitive;
}

export interface AutoCompleteProps {
  ariaDescribedby?: string;
  ariaErrormessage?: string;
  ariaInvalid?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRequired?: boolean;
  autoAdjustOverflow?: boolean;
  autoFocus?: boolean;
  clearIcon?: VNodeChild;
  data?: AutoCompleteItem[];
  defaultActiveFirstOption?: boolean;
  defaultOpen?: boolean;
  defaultValue?: AutoCompletePrimitive;
  disabled?: boolean;
  dropdownClassName?: HTMLAttributes['class'];
  dropdownMatchSelectWidth?: boolean;
  dropdownStyle?: StyleValue;
  emptyContent?: VNodeChild | null;
  getPopupContainer?: () => HTMLElement;
  id?: string;
  insetLabel?: VNodeChild;
  insetLabelId?: string;
  loading?: boolean;
  maxHeight?: string | number;
  modelValue?: AutoCompleteModelValue;
  motion?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  onChangeWithObject?: boolean;
  onSelectWithObject?: boolean;
  placeholder?: string;
  position?: TooltipPosition;
  prefix?: VNodeChild;
  renderItem?: (item: AutoCompleteItem) => VNodeChild;
  renderSelectedItem?: (option: AutoCompleteOptionRuntime) => string;
  showClear?: boolean;
  size?: AutoCompleteSize;
  style?: StyleValue;
  stopPropagation?: boolean | string;
  suffix?: VNodeChild;
  validateStatus?: AutoCompleteValidateStatus;
  value?: AutoCompleteModelValue;
  zIndex?: number;
}

export interface AutoCompleteEmits {
  blur: [event: FocusEvent];
  change: [value: AutoCompletePrimitive];
  clear: [];
  dropdownVisibleChange: [visible: boolean];
  focus: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
  search: [value: string];
  select: [value: AutoCompletePrimitive | AutoCompleteDataItem];
  'update:modelValue': [value: AutoCompletePrimitive];
  'update:value': [value: AutoCompletePrimitive];
}

export interface AutoCompleteOptionSlotProps {
  focused: boolean;
  inputValue: AutoCompletePrimitive;
  item: AutoCompleteItem;
  onClick: (event: MouseEvent) => void;
  onMouseenter: (event: MouseEvent) => void;
  option: AutoCompleteOptionRuntime;
}

export interface AutoCompleteTriggerSlotProps {
  componentProps: AutoCompleteProps;
  inputValue: AutoCompletePrimitive;
  onClear: (event: MouseEvent) => void;
  onSearch: (value: string) => void;
  value: AutoCompleteOptionRuntime[];
}

export interface AutoCompleteSlots {
  clearIcon?: () => VNodeChild;
  emptyContent?: () => VNodeChild;
  insetLabel?: () => VNodeChild;
  option?: (props: AutoCompleteOptionSlotProps) => VNodeChild;
  prefix?: () => VNodeChild;
  suffix?: () => VNodeChild;
  trigger?: (props: AutoCompleteTriggerSlotProps) => VNodeChild;
}

export interface AutoCompleteExposed {
  close(): void;
  focus(): void;
  open(): void;
  search(value: string): void;
}

export interface AutoCompleteOptionProps extends AutoCompleteDataItem {
  empty?: boolean;
  emptyContent?: VNodeChild | null;
  focused?: boolean;
  inputValue?: string;
  selected?: boolean;
  showTick?: boolean;
}
