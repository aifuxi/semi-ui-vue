import type { CSSProperties, VNodeChild } from 'vue';

import type { TypographyShowTooltip } from '../typography';

export const ANCHOR_SIZES = ['small', 'default'] as const;
export const ANCHOR_RAIL_THEMES = ['primary', 'tertiary', 'muted'] as const;
export const ANCHOR_POSITIONS = [
  'top',
  'topLeft',
  'topRight',
  'left',
  'leftTop',
  'leftBottom',
  'right',
  'rightTop',
  'rightBottom',
  'bottom',
  'bottomLeft',
  'bottomRight',
  'leftTopOver',
  'rightTopOver',
] as const;

export type AnchorSize = (typeof ANCHOR_SIZES)[number];
export type AnchorRailTheme = (typeof ANCHOR_RAIL_THEMES)[number];
export type AnchorPosition = (typeof ANCHOR_POSITIONS)[number];
export type AnchorShowTooltip = boolean | TypographyShowTooltip;

export interface AnchorProps {
  autoCollapse?: boolean;
  className?: string;
  defaultAnchor?: string;
  getContainer?: () => HTMLElement | Window | null | undefined;
  maxHeight?: string | number;
  maxWidth?: string | number;
  offsetTop?: number;
  position?: AnchorPosition;
  railTheme?: AnchorRailTheme;
  scrollMotion?: boolean;
  showTooltip?: AnchorShowTooltip;
  size?: AnchorSize;
  style?: CSSProperties;
  targetOffset?: number;
}

export interface AnchorEmits {
  change: [currentLink: string, previousLink: string];
  click: [event: MouseEvent | KeyboardEvent, currentLink: string];
}

export interface AnchorSlots {
  default?: () => VNodeChild;
}

export interface AnchorLinkProps {
  className?: string;
  disabled?: boolean;
  href?: string;
  style?: CSSProperties;
  title?: VNodeChild;
}

export interface AnchorLinkSlots {
  default?: () => VNodeChild;
  title?: () => VNodeChild;
}
