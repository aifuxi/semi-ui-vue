import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { ButtonProps } from '../button';
import type { PopoverPosition } from '../popover';

export const USER_GUIDE_MODES = ['popup', 'modal'] as const;
export const USER_GUIDE_THEMES = ['default', 'primary'] as const;

export type UserGuideMode = (typeof USER_GUIDE_MODES)[number];
export type UserGuideTheme = (typeof USER_GUIDE_THEMES)[number];
export type UserGuideTarget = Element | (() => Element | null | undefined);

export interface UserGuideButtonProps extends ButtonProps {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  content?: VNodeChild;
  onClick?: (event: MouseEvent) => void;
  style?: StyleValue;
  [attribute: `aria-${string}`]: unknown;
  [attribute: `data-${string}`]: unknown;
}

export interface UserGuideStepItem {
  className?: HTMLAttributes['class'];
  cover?: VNodeChild;
  target?: UserGuideTarget;
  title?: VNodeChild;
  description?: VNodeChild;
  mask?: boolean;
  showArrow?: boolean;
  spotlightPadding?: number;
  theme?: UserGuideTheme;
  position?: PopoverPosition;
}

export interface UserGuideProps {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  current?: number;
  finishText?: string;
  getPopupContainer?: () => HTMLElement;
  mask?: boolean;
  mode?: UserGuideMode;
  nextButtonProps?: UserGuideButtonProps;
  position?: PopoverPosition;
  prevButtonProps?: UserGuideButtonProps;
  showPrevButton?: boolean;
  showSkipButton?: boolean;
  spotlightPadding?: number;
  steps?: readonly UserGuideStepItem[];
  style?: StyleValue;
  theme?: UserGuideTheme;
  visible?: boolean;
  zIndex?: number;
}

export interface UserGuideEmits {
  change: [current: number];
  finish: [];
  next: [current: number];
  prev: [current: number];
  skip: [];
  'update:current': [current: number];
}

export interface UserGuideSlotProps {
  current: number;
  index: number;
  step: UserGuideStepItem;
}

export interface UserGuideSlots {
  cover?: (props: UserGuideSlotProps) => VNodeChild;
  description?: (props: UserGuideSlotProps) => VNodeChild;
  title?: (props: UserGuideSlotProps) => VNodeChild;
}

export interface UserGuideLocale {
  skip: string;
  next: string;
  prev: string;
  finish: string;
}
