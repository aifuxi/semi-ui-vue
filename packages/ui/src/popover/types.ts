import type { CSSProperties, HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type {
  TooltipArrowBounding,
  TooltipInitialFocusRef,
  TooltipMargin,
  TooltipPosition,
  TooltipProps,
  TooltipSpacing,
  TooltipTrigger,
} from '../tooltip';

export interface PopoverArrowStyle {
  backgroundColor?: CSSProperties['backgroundColor'];
  borderColor?: CSSProperties['borderColor'];
  borderOpacity?: CSSProperties['opacity'];
}

export interface PopoverProps extends Omit<
  TooltipProps,
  'class' | 'content' | 'prefixCls' | 'role' | 'showArrow' | 'style' | 'zIndex'
> {
  arrowStyle?: PopoverArrowStyle;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  content?: VNodeChild;
  contentClassName?: HTMLAttributes['class'];
  prefixCls?: string;
  showArrow?: boolean;
  style?: StyleValue;
  zIndex?: number;
}

export interface PopoverEmits {
  afterClose: [];
  clickOutside: [event: MouseEvent];
  escKeydown: [event: KeyboardEvent];
  visibleChange: [visible: boolean];
  'update:visible': [visible: boolean];
}

export interface PopoverSlots {
  content?: (props: { initialFocusRef: TooltipInitialFocusRef }) => VNodeChild;
  default?: () => VNodeChild;
}

export interface PopoverExposed {
  focusTrigger(): void;
}

export type {
  TooltipArrowBounding as PopoverArrowBounding,
  TooltipMargin as PopoverMargin,
  TooltipPosition as PopoverPosition,
  TooltipSpacing as PopoverSpacing,
  TooltipTrigger as PopoverTrigger,
};
