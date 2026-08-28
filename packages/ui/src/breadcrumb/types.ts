import type { CSSProperties, HTMLAttributes, VNodeChild } from 'vue';

import type { TypographyTooltipOptions } from '../typography';

export const BREADCRUMB_MORE_TYPES = ['default', 'popover'] as const;

export type BreadcrumbMoreType = (typeof BREADCRUMB_MORE_TYPES)[number];

export interface BreadcrumbRoute {
  [key: string]: unknown;
  href?: string;
  icon?: VNodeChild;
  name?: VNodeChild;
  path?: string;
}

export interface BreadcrumbItemInfo {
  href?: string;
  icon?: VNodeChild;
  name?: VNodeChild;
  path?: string;
  [key: string]: unknown;
}

export interface BreadcrumbShowTooltip {
  ellipsisPos?: 'end' | 'middle';
  opts?: TypographyTooltipOptions;
  width?: number | string;
}

export interface BreadcrumbProps {
  activeIndex?: number;
  autoCollapse?: boolean;
  class?: HTMLAttributes['class'];
  className?: string;
  compact?: boolean;
  maxItemCount?: number;
  moreType?: BreadcrumbMoreType;
  renderItem?: (route: BreadcrumbRoute, index: number) => VNodeChild;
  renderMore?: (items: VNodeChild[]) => VNodeChild;
  routes?: Array<BreadcrumbRoute | string>;
  separator?: VNodeChild;
  showTooltip?: boolean | BreadcrumbShowTooltip;
  style?: CSSProperties;
}

export interface BreadcrumbEmits {
  click: [item: BreadcrumbItemInfo, event: MouseEvent | KeyboardEvent];
}

export interface BreadcrumbSlots {
  default?: () => VNodeChild;
  item?: (props: { index: number; route: BreadcrumbRoute }) => VNodeChild;
  more?: (props: {
    expand: (event?: MouseEvent | KeyboardEvent) => void;
    items: VNodeChild[];
  }) => VNodeChild;
  separator?: () => VNodeChild;
}

export interface BreadcrumbItemProps {
  active?: boolean;
  className?: string;
  href?: string | null;
  icon?: VNodeChild;
  noLink?: boolean;
  route?: BreadcrumbRoute;
  separator?: VNodeChild;
  shouldRenderSeparator?: boolean;
  style?: CSSProperties;
}

export interface BreadcrumbItemEmits {
  click: [item: BreadcrumbItemInfo, event: MouseEvent | KeyboardEvent];
}

export interface BreadcrumbItemSlots {
  default?: () => VNodeChild;
  icon?: () => VNodeChild;
  separator?: () => VNodeChild;
}
