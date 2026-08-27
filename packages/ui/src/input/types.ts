import type { CSSProperties, HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export type InputValue = string | number;
export type InputSize = 'small' | 'default' | 'large';
export type InputMode = 'password';
export type InputValidateStatus = 'default' | 'error' | 'warning' | 'success';
export type TextAreaResize = 'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline';

export interface AutosizeRows {
  minRows?: number;
  maxRows?: number;
}

interface CommonAriaProps {
  ariaDescribedby?: string;
  ariaErrormessage?: string;
  ariaInvalid?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRequired?: boolean | 'false' | 'true';
}

export interface InputProps extends CommonAriaProps {
  addonAfter?: VNodeChild;
  addonBefore?: VNodeChild;
  autoFocus?: boolean;
  borderless?: boolean;
  className?: HTMLAttributes['class'];
  clearIcon?: VNodeChild;
  composition?: boolean;
  defaultValue?: InputValue;
  disabled?: boolean;
  getValueLength?: (value: string) => number;
  hideSuffix?: boolean;
  id?: string;
  inputStyle?: StyleValue;
  insetLabel?: VNodeChild;
  insetLabelId?: string;
  maxLength?: number;
  minLength?: number;
  mode?: InputMode;
  modelValue?: InputValue | undefined;
  onlyBorder?: number;
  placeholder?: InputValue;
  prefix?: VNodeChild;
  preventScroll?: boolean;
  readonly?: boolean;
  showClear?: boolean;
  showClearIgnoreDisabled?: boolean;
  size?: InputSize;
  suffix?: VNodeChild;
  type?: string;
  validateStatus?: InputValidateStatus;
  value?: InputValue | undefined;
}

export interface InputEmits {
  blur: [event: FocusEvent];
  change: [value: string, event: Event];
  clear: [event: Event];
  compositionEnd: [event: CompositionEvent];
  compositionStart: [event: CompositionEvent];
  compositionUpdate: [event: CompositionEvent];
  enterPress: [event: KeyboardEvent];
  focus: [event: FocusEvent];
  input: [event: Event];
  keydown: [event: KeyboardEvent];
  keypress: [event: KeyboardEvent];
  keyup: [event: KeyboardEvent];
  'update:modelValue': [value: string];
  'update:value': [value: string];
}

export interface InputSlots {
  addonAfter?: () => VNodeChild;
  addonBefore?: () => VNodeChild;
  clearIcon?: () => VNodeChild;
  insetLabel?: () => VNodeChild;
  prefix?: () => VNodeChild;
  suffix?: () => VNodeChild;
}

export interface InputExposed {
  readonly input: HTMLInputElement | null;
  blur(): void;
  focus(): void;
  select(): void;
}

export interface TextAreaProps extends CommonAriaProps {
  autoFocus?: boolean;
  autosize?: boolean | AutosizeRows;
  borderless?: boolean;
  className?: HTMLAttributes['class'];
  cols?: number;
  composition?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  disabledEnterStartNewLine?: boolean;
  getValueLength?: (value: string) => number;
  id?: string;
  lineNumberClassName?: HTMLAttributes['class'];
  lineNumberStart?: number;
  lineNumberStyle?: StyleValue;
  maxCount?: number;
  maxLength?: number;
  minLength?: number;
  modelValue?: string | undefined;
  placeholder?: string;
  preventScroll?: boolean;
  readonly?: boolean;
  resize?: TextAreaResize;
  rows?: number;
  showClear?: boolean;
  showCounter?: boolean;
  showLineNumber?: boolean;
  textareaStyle?: StyleValue;
  validateStatus?: InputValidateStatus;
  value?: string | undefined;
}

export interface TextAreaResizeData {
  height: number;
  width?: number;
}

export interface TextAreaEmits {
  blur: [event: FocusEvent];
  change: [value: string, event: Event];
  clear: [event: Event];
  compositionEnd: [event: CompositionEvent];
  compositionStart: [event: CompositionEvent];
  compositionUpdate: [event: CompositionEvent];
  enterPress: [event: KeyboardEvent];
  focus: [event: FocusEvent];
  input: [event: Event];
  keydown: [event: KeyboardEvent];
  keypress: [event: KeyboardEvent];
  keyup: [event: KeyboardEvent];
  resize: [data: TextAreaResizeData];
  'update:modelValue': [value: string];
  'update:value': [value: string];
}

export interface TextAreaExposed {
  readonly textarea: HTMLTextAreaElement | null;
  blur(): void;
  focus(): void;
  select(): void;
}

export interface InputGroupLabelProps {
  align?: 'left' | 'right' | string;
  className?: HTMLAttributes['class'];
  disabled?: boolean;
  extra?: VNodeChild;
  id?: string;
  name?: string;
  optional?: boolean;
  required?: boolean;
  style?: CSSProperties;
  text?: VNodeChild;
  width?: number | string;
}

export interface InputGroupProps {
  className?: HTMLAttributes['class'];
  disabled?: boolean;
  label?: InputGroupLabelProps;
  labelPosition?: 'top' | 'left' | string;
  size?: InputSize;
  style?: StyleValue;
}

export interface InputGroupEmits {
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}

export interface InputGroupSlots {
  default?: () => VNodeChild;
}
