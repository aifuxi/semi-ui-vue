export const GRID_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;
export const GRID_RESPONSIVE_PRIORITY = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;

export const GRID_RESPONSIVE_MAP = Object.freeze({
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
});

export type GridBreakpoint = (typeof GRID_BREAKPOINTS)[number];
export type GridResponsiveMap = typeof GRID_RESPONSIVE_MAP;
export type GridGutter = number | Partial<Record<GridBreakpoint, number>>;
export type GridGutters = readonly [horizontal: number, vertical: number];
export type GridRowType = 'flex';
export type GridRowAlign = 'top' | 'middle' | 'bottom';
export type GridRowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between';

export interface RowProps {
  type?: GridRowType;
  align?: GridRowAlign;
  justify?: GridRowJustify;
  gutter?: GridGutter | readonly [GridGutter, GridGutter];
  prefixCls?: string;
}

export interface ColSize {
  span?: number;
  order?: number;
  offset?: number;
  push?: number;
  pull?: number;
}

export type GridResponsiveCol = number | ColSize;

export interface ColProps extends ColSize {
  prefixCls?: string;
  xs?: GridResponsiveCol;
  sm?: GridResponsiveCol;
  md?: GridResponsiveCol;
  lg?: GridResponsiveCol;
  xl?: GridResponsiveCol;
  xxl?: GridResponsiveCol;
}

export interface GridSlots {
  default?: () => unknown;
}
