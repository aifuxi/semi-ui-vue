import type { Component, CSSProperties, VNodeChild } from 'vue';

export const TYPOGRAPHY_TYPES = [
  'primary',
  'secondary',
  'danger',
  'warning',
  'success',
  'tertiary',
  'quaternary',
] as const;
export const TYPOGRAPHY_SIZES = ['normal', 'small', 'inherit'] as const;
export const TYPOGRAPHY_SPACINGS = ['normal', 'extended'] as const;
export const TYPOGRAPHY_HEADINGS = [1, 2, 3, 4, 5, 6] as const;
export const TYPOGRAPHY_WEIGHTS = [
  'light',
  'regular',
  'medium',
  'semibold',
  'bold',
  'default',
] as const;
export const TYPOGRAPHY_NUMERAL_RULES = [
  'text',
  'numbers',
  'bytes-decimal',
  'bytes-binary',
  'percentages',
  'exponential',
] as const;
export const TYPOGRAPHY_TRUNCATE_MODES = ['ceil', 'floor', 'round'] as const;

export type TypographyType = (typeof TYPOGRAPHY_TYPES)[number];
export type TypographySize = (typeof TYPOGRAPHY_SIZES)[number];
export type TypographySpacing = (typeof TYPOGRAPHY_SPACINGS)[number];
export type TypographyHeading = (typeof TYPOGRAPHY_HEADINGS)[number];
export type TypographyWeight = (typeof TYPOGRAPHY_WEIGHTS)[number] | number;
export type TypographyNumeralRule = (typeof TYPOGRAPHY_NUMERAL_RULES)[number];
export type TypographyTruncate = (typeof TYPOGRAPHY_TRUNCATE_MODES)[number];
export type TypographyComponent = string | Component;
export type TypographyLink = boolean | Record<string, unknown>;

export interface TypographyLocale {
  copy: string;
  copied: string;
  expand: string;
  collapse: string;
}

export interface TypographyTooltipOptions {
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

export interface TypographyShowTooltip {
  type?: 'tooltip' | 'popover' | (string & {});
  opts?: TypographyTooltipOptions;
}

export interface TypographyEllipsis {
  collapseText?: string;
  collapsible?: boolean;
  expandText?: string;
  expandable?: boolean;
  pos?: 'end' | 'middle';
  rows?: number;
  showTooltip?: boolean | TypographyShowTooltip;
  suffix?: string;
  onExpand?: (expanded: boolean, event: MouseEvent | KeyboardEvent) => void;
}

export interface TypographyCopyableConfig {
  content?: string;
  copyTip?: VNodeChild;
  successTip?: VNodeChild;
  icon?: VNodeChild | undefined;
  duration?: number;
  onCopy?: (event: MouseEvent | KeyboardEvent, content: string, result: boolean) => void;
  render?: (
    copied: boolean,
    copy: (event: MouseEvent | KeyboardEvent) => void,
    config: TypographyCopyableConfig,
  ) => VNodeChild;
}

export interface TypographyBaseProps {
  component?: TypographyComponent;
  copyable?: boolean | TypographyCopyableConfig;
  delete?: boolean;
  disabled?: boolean;
  ellipsis?: boolean | TypographyEllipsis;
  icon?: VNodeChild;
  link?: TypographyLink;
  mark?: boolean;
  size?: TypographySize;
  spacing?: TypographySpacing;
  strong?: boolean;
  type?: TypographyType;
  underline?: boolean;
  weight?: TypographyWeight | undefined;
}

export interface TypographyProps {
  component?: TypographyComponent;
}

export interface TypographySlots {
  default?: () => unknown;
}

export interface TypographyActionSlots extends TypographySlots {
  copyIcon?: (props: {
    copied: boolean;
    copy: (event: MouseEvent | KeyboardEvent) => void;
  }) => unknown;
  copied?: () => unknown;
  tooltip?: (props: { content: string }) => unknown;
}

export interface TypographyContentSlots extends TypographyActionSlots {
  icon?: () => unknown;
}

export interface TextProps extends Omit<TypographyBaseProps, 'spacing' | 'weight'> {
  code?: boolean;
  weight?: number;
}

export interface TitleProps extends Omit<TypographyBaseProps, 'icon' | 'size' | 'spacing'> {
  heading?: TypographyHeading;
}

export interface ParagraphProps extends Omit<TypographyBaseProps, 'icon' | 'weight'> {
  spacing?: TypographySpacing;
}

export interface NumeralProps extends Omit<TypographyBaseProps, 'ellipsis' | 'spacing'> {
  code?: boolean;
  rule?: TypographyNumeralRule;
  precision?: number;
  truncate?: TypographyTruncate;
  parser?: (value: string) => string;
}

export interface TypographyEmits {
  copy: [event: MouseEvent | KeyboardEvent, content: string, result: boolean];
  expand: [expanded: boolean, event: MouseEvent | KeyboardEvent];
}
