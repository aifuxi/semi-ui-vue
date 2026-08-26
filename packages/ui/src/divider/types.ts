export const DIVIDER_ALIGNS = ['left', 'right', 'center'] as const;
export const DIVIDER_LAYOUTS = ['horizontal', 'vertical'] as const;

export type DividerAlign = (typeof DIVIDER_ALIGNS)[number];
export type DividerLayout = (typeof DIVIDER_LAYOUTS)[number];

export interface DividerProps {
  align?: DividerAlign;
  dashed?: boolean;
  layout?: DividerLayout;
  margin?: number | string;
}

export interface DividerSlots {
  default?: () => unknown;
}
