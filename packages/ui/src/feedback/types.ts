import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { ButtonProps } from '../button';
import type { CheckboxGroupProps, CheckboxValue } from '../checkbox';
import type { TextAreaProps } from '../input';
import type { ModalActionHandler, ModalProps } from '../modal';
import type { RadioChangeEvent, RadioGroupProps, RadioValue } from '../radio';
import type { SideSheetProps } from '../side-sheet';

export const FEEDBACK_MODES = ['modal', 'popup'] as const;
export const FEEDBACK_TYPES = ['text', 'emoji', 'radio', 'checkbox', 'custom'] as const;
export const FEEDBACK_EMOJIS = ['😞', '😐', '😃'] as const;

export type FeedbackMode = (typeof FEEDBACK_MODES)[number];
export type FeedbackType = (typeof FEEDBACK_TYPES)[number];
export type FeedbackEmoji = (typeof FEEDBACK_EMOJIS)[number];
export type FeedbackActionResult = void | Promise<unknown>;
export type FeedbackActionHandler = (event: MouseEvent | KeyboardEvent) => FeedbackActionResult;

export interface FeedbackEmojiResult {
  emoji?: FeedbackEmoji | string;
  text?: string;
}

export type FeedbackValue = string | unknown[] | FeedbackEmojiResult | null;

export interface FeedbackTextAreaProps extends TextAreaProps {
  onChange?: (value: string, event: Event) => void;
}

export interface FeedbackRadioGroupProps extends RadioGroupProps {
  onChange?: (event: RadioChangeEvent) => void;
}

export interface FeedbackCheckboxGroupProps extends CheckboxGroupProps {
  onChange?: (value: CheckboxValue[]) => void;
}

export interface FeedbackButtonProps extends ButtonProps {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  onClick?: (event: MouseEvent) => void;
  style?: StyleValue;
  [attribute: `aria-${string}`]: unknown;
  [attribute: `data-${string}`]: unknown;
}

type FeedbackContainerProps = Omit<
  ModalProps & SideSheetProps,
  'cancelButtonProps' | 'class' | 'className' | 'footer' | 'onCancel' | 'onOk' | 'okButtonProps'
>;

export interface FeedbackProps extends FeedbackContainerProps {
  cancelButtonProps?: FeedbackButtonProps;
  checkboxGroupProps?: FeedbackCheckboxGroupProps;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  footer?: VNodeChild;
  mode?: FeedbackMode;
  okButtonProps?: FeedbackButtonProps;
  onCancel?: FeedbackActionHandler;
  onOk?: FeedbackActionHandler;
  onValueChange?: (value: Exclude<FeedbackValue, null>) => void;
  radioGroupProps?: FeedbackRadioGroupProps;
  renderContent?: (content: VNodeChild) => VNodeChild;
  textAreaProps?: FeedbackTextAreaProps;
  type?: FeedbackType;
}

export interface FeedbackEmits {
  'update:visible': [visible: boolean];
}

export interface FeedbackSlots {
  closeIcon?: () => VNodeChild;
  content?: (props: { content: VNodeChild }) => VNodeChild;
  default?: () => VNodeChild;
  footer?: () => VNodeChild;
  header?: () => VNodeChild;
  title?: () => VNodeChild;
}

export interface FeedbackLocale {
  cancel: string;
  submit: string;
}

export type FeedbackRadioValue = RadioValue;
export type FeedbackModalActionHandler = ModalActionHandler;
