import type { HTMLAttributes, InputHTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { TooltipMargin, TooltipPosition, TooltipProps, TooltipSpacing } from '../tooltip';

export type SelectPrimitive = string | number;
export type SelectValue = SelectPrimitive | Record<string, unknown>;
export type SelectModelValue = SelectValue | SelectValue[] | undefined;
export type SelectSize = 'small' | 'default' | 'large';
export type SelectSearchPosition = 'trigger' | 'dropdown';
export type SelectValidateStatus = 'default' | 'warning' | 'error';

export interface SelectOptionProps {
  value?: SelectPrimitive;
  label?: VNodeChild;
  disabled?: boolean;
  showTick?: boolean;
  class?: HTMLAttributes['class'];
  style?: StyleValue;
  [key: string]: unknown;
}

export interface SelectOptionRuntime extends SelectOptionProps {
  _key?: PropertyKey;
  _parentGroup?: SelectOptionGroupRuntime;
  _scrollIndex: number;
  _selected: boolean;
  _show: boolean;
  _inputCreateOnly?: boolean;
  children?: VNodeChild;
}

export interface SelectOptionGroupProps {
  label?: VNodeChild;
  class?: HTMLAttributes['class'];
  style?: StyleValue;
}

export interface SelectOptionGroupRuntime extends SelectOptionGroupProps {
  _key?: PropertyKey;
}

export interface SelectVirtualizeProps {
  itemSize?: number;
  height?: number;
  width?: string | number;
}

export interface SelectInputProps extends Omit<InputHTMLAttributes, 'value' | 'onInput'> {
  class?: HTMLAttributes['class'];
}

export interface SelectProps {
  ariaDescribedby?: string;
  ariaErrormessage?: string;
  ariaInvalid?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
  ariaLabelledby?: string;
  ariaRequired?: boolean;
  id?: string;
  autoFocus?: boolean;
  autoClearSearchValue?: boolean;
  autoAdjustOverflow?: boolean;
  allowCreate?: boolean;
  borderless?: boolean;
  clickToHide?: boolean;
  defaultActiveFirstOption?: boolean;
  defaultOpen?: boolean;
  defaultValue?: SelectModelValue;
  disabled?: boolean;
  dropdownClassName?: HTMLAttributes['class'];
  dropdownMargin?: number | TooltipMargin;
  dropdownMatchSelectWidth?: boolean;
  dropdownStyle?: StyleValue;
  ellipsisTrigger?: boolean;
  emptyContent?: VNodeChild | null;
  expandRestTagsOnClick?: boolean;
  filter?: boolean | ((inputValue: string, option: SelectOptionProps) => boolean);
  getPopupContainer?: () => HTMLElement;
  inputProps?: SelectInputProps;
  insetLabelId?: string;
  loading?: boolean;
  max?: number;
  maxHeight?: string | number;
  maxTagCount?: number;
  modelValue?: SelectModelValue;
  motion?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  multiple?: boolean;
  onChangeWithObject?: boolean;
  optionList?: SelectOptionProps[];
  placeholder?: VNodeChild;
  position?: TooltipPosition;
  preventScroll?: boolean;
  rePosKey?: string | number;
  restTagsPopoverProps?: Partial<TooltipProps>;
  remote?: boolean;
  searchPlaceholder?: string;
  searchPosition?: SelectSearchPosition;
  showArrow?: boolean;
  showClear?: boolean;
  showRestTagsPopover?: boolean;
  size?: SelectSize;
  spacing?: number | TooltipSpacing;
  stopPropagation?: boolean;
  validateStatus?: SelectValidateStatus;
  value?: SelectModelValue;
  virtualize?: SelectVirtualizeProps;
  zIndex?: number;
}

export interface SelectEmits {
  blur: [event: FocusEvent];
  change: [value: SelectModelValue];
  clear: [];
  create: [option: SelectOptionProps];
  deselect: [value: SelectPrimitive | undefined, option: SelectOptionProps];
  dropdownVisibleChange: [visible: boolean];
  exceed: [option: SelectOptionProps];
  focus: [event: FocusEvent];
  listScroll: [event: Event];
  search: [value: string, event?: Event];
  select: [value: SelectPrimitive | undefined, option: SelectOptionProps];
  'update:modelValue': [value: SelectModelValue];
  'update:value': [value: SelectModelValue];
}

export interface SelectSlots {
  default?: () => VNodeChild;
  arrowIcon?: () => VNodeChild;
  clearIcon?: () => VNodeChild;
  createItem?: (props: {
    inputValue: SelectPrimitive;
    focused: boolean;
    style?: StyleValue;
  }) => VNodeChild;
  emptyContent?: () => VNodeChild;
  innerBottom?: () => VNodeChild;
  innerTop?: () => VNodeChild;
  insetLabel?: () => VNodeChild;
  option?: (props: SelectOptionRenderProps) => VNodeChild;
  outerBottom?: () => VNodeChild;
  outerTop?: () => VNodeChild;
  prefix?: () => VNodeChild;
  selectedItem?: (props: { option: SelectOptionRuntime; index: number }) => VNodeChild;
  suffix?: () => VNodeChild;
  trigger?: (props: SelectTriggerSlotProps) => VNodeChild;
}

export interface SelectOptionRenderProps extends SelectOptionRuntime {
  focused: boolean;
  selected: boolean;
  inputValue: string;
  onClick: (event: MouseEvent) => void;
  onMouseenter: (event: MouseEvent) => void;
}

export interface SelectTriggerSlotProps {
  value: SelectOptionRuntime[];
  inputValue: string;
  disabled: boolean;
  placeholder: VNodeChild;
  onSearch: (value: string, event?: Event) => void;
  onClear: (event: MouseEvent) => void;
  onRemove: (option: SelectOptionRuntime) => void;
}

export interface SelectExposed {
  clearInput(): void;
  close(): void;
  deselectAll(): void;
  focus(): void;
  open(): void;
  rePosition(): void;
  search(value: string, event?: Event): void;
  selectAll(): void;
}
