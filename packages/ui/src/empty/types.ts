import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const EMPTY_LAYOUTS = ['vertical', 'horizontal'] as const;

export type EmptyLayout = (typeof EMPTY_LAYOUTS)[number];

export interface EmptySvgNode {
  id?: string;
  viewBox?: string;
  url?: string;
}

export type EmptyImage = VNodeChild | EmptySvgNode;

export interface EmptyProps {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  darkModeImage?: EmptyImage;
  description?: VNodeChild;
  image?: EmptyImage;
  imageStyle?: StyleValue;
  layout?: EmptyLayout;
  style?: StyleValue;
  title?: VNodeChild;
}

export interface EmptySlots {
  default?: () => VNodeChild;
  darkModeImage?: () => VNodeChild;
  description?: () => VNodeChild;
  image?: () => VNodeChild;
  title?: () => VNodeChild;
}
