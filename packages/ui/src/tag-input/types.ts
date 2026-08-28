import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { TooltipPosition, TooltipProps } from '../tooltip';

export const TAG_INPUT_SIZES = ['small', 'default', 'large'] as const;
export const TAG_INPUT_VALIDATE_STATUSES = ['default', 'error', 'warning'] as const;

export type TagInputSize = (typeof TAG_INPUT_SIZES)[number];
export type TagInputValidateStatus = (typeof TAG_INPUT_VALIDATE_STATUSES)[number];
export type TagInputSeparator = string | string[] | null;

export interface TagInputTooltipOptions {
  opts?: Omit<TooltipProps, 'condition' | 'content'> & {
    className?: HTMLAttributes['class'];
  };
  type?: string;
}

export interface TagInputRestPopoverProps {
  autoAdjustOverflow?: boolean;
  className?: HTMLAttributes['class'];
  getPopupContainer?: () => HTMLElement;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  position?: TooltipPosition;
  style?: StyleValue;
  zIndex?: number;
}

export interface TagInputProps {
  ariaLabel?: string;
  addOnBlur?: boolean;
  allowDuplicates?: boolean;
  autoFocus?: boolean;
  className?: HTMLAttributes['class'];
  clearIcon?: VNodeChild;
  defaultValue?: string[];
  disabled?: boolean;
  draggable?: boolean;
  expandRestTagsOnClick?: boolean;
  inputValue?: string;
  insetLabel?: VNodeChild;
  insetLabelId?: string;
  max?: number;
  maxLength?: number;
  maxTagCount?: number;
  modelValue?: string[] | undefined;
  placeholder?: string;
  prefix?: VNodeChild;
  preventScroll?: boolean;
  renderTagItem?: (value: string, index: number, close: () => void) => VNodeChild;
  restTagsPopoverProps?: TagInputRestPopoverProps;
  separator?: TagInputSeparator;
  showClear?: boolean;
  showContentTooltip?: boolean | TagInputTooltipOptions;
  showRestTagsPopover?: boolean;
  size?: TagInputSize;
  split?: (originString: string, separators: TagInputSeparator) => string[];
  style?: StyleValue;
  suffix?: VNodeChild;
  validateStatus?: TagInputValidateStatus;
  value?: string[] | undefined;
}

export interface TagInputEmits {
  add: [addedValue: string[]];
  blur: [event: FocusEvent];
  change: [value: string[]];
  exceed: [value: string[]];
  focus: [event: FocusEvent];
  inputChange: [value: string, event: Event];
  inputExceed: [value: string];
  keyDown: [event: KeyboardEvent];
  remove: [removedValue: string, index: number];
  'update:inputValue': [value: string];
  'update:modelValue': [value: string[]];
  'update:value': [value: string[]];
}

export interface TagInputSlots {
  clearIcon?: () => VNodeChild;
  insetLabel?: () => VNodeChild;
  prefix?: () => VNodeChild;
  suffix?: () => VNodeChild;
  tag?: (props: { close: () => void; index: number; value: string }) => VNodeChild;
}

export interface TagInputExposed {
  blur(): void;
  focus(): void;
}

export interface TagInputState {
  active: boolean;
  entering: boolean;
  focusing: boolean;
  hovering: boolean;
  inputValue: string;
  inputWidth: number | undefined;
  tagsArray: string[];
}
