import type { CSSProperties, HTMLAttributes, VNodeChild } from 'vue';

import type { TooltipPosition } from '../tooltip';

export type PaginationSize = 'small' | 'default';
export type PaginationPage = number | '...';
export type PaginationPageList = PaginationPage[];

export interface PaginationLocale {
  pageSize: string;
  total: string;
  jumpTo: string;
  page: string;
}

export interface PaginationProps {
  class?: HTMLAttributes['class'];
  className?: string;
  currentPage?: number;
  defaultCurrentPage?: number;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  hoverShowPageSelect?: boolean;
  modelValue?: number;
  nextText?: VNodeChild;
  pageSize?: number;
  pageSizeOpts?: number[];
  popoverPosition?: TooltipPosition;
  popoverZIndex?: number;
  preventPageChangeOnPageSizeChange?: boolean;
  prevText?: VNodeChild;
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  showTotal?: boolean;
  size?: PaginationSize;
  style?: CSSProperties;
  total?: number;
}

export interface PaginationEmits {
  change: [currentPage: number, pageSize: number];
  pageChange: [currentPage: number];
  pageSizeChange: [pageSize: number];
  'update:currentPage': [currentPage: number];
  'update:modelValue': [currentPage: number];
  'update:pageSize': [pageSize: number];
}

export interface PaginationSlots {
  next?: () => VNodeChild;
  prev?: () => VNodeChild;
}
