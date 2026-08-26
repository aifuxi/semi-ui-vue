export const SPACE_ALIGNS = ['start', 'center', 'end', 'baseline'] as const;
export const SPACE_SPACING_PRESETS = ['tight', 'medium', 'loose'] as const;

export type SpaceAlign = (typeof SPACE_ALIGNS)[number];
export type SpaceSpacingPreset = (typeof SPACE_SPACING_PRESETS)[number];
export type SpaceSpacing = SpaceSpacingPreset | number;
export type SpaceSpacingValue = SpaceSpacing | readonly SpaceSpacing[];

export interface SpaceProps {
  align?: SpaceAlign;
  spacing?: SpaceSpacingValue;
  vertical?: boolean;
  wrap?: boolean;
}

export interface SpaceSlots {
  default?: () => unknown;
}
