export interface PopoverArrowBoundingConstants {
  height: number;
  offsetX: number;
  offsetY: number;
  width: number;
}

export const popoverCssClasses: {
  readonly ARROW: string;
  readonly PREFIX: string;
};

export const popoverNumbers: {
  readonly ARROW_BOUNDING: PopoverArrowBoundingConstants;
  readonly DEFAULT_Z_INDEX: number;
  readonly SPACING: number;
  readonly SPACING_WITH_ARROW: number;
};

export const popoverStrings: {
  readonly DEFAULT_ARROW_STYLE: {
    readonly backgroundColor: string;
    readonly borderColor: string;
    readonly borderOpacity: string;
  };
  readonly POSITION_SET: readonly string[];
  readonly TRIGGER_SET: readonly string[];
};
