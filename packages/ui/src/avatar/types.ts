import type {
  CSSProperties,
  HTMLAttributes,
  ImgHTMLAttributes,
  StyleValue,
  VNode,
  VNodeChild,
} from 'vue';

export const AVATAR_SIZES = [
  'extra-extra-small',
  'extra-small',
  'small',
  'default',
  'medium',
  'large',
  'extra-large',
] as const;
export type AvatarPresetSize = (typeof AVATAR_SIZES)[number];
export type AvatarSize = AvatarPresetSize | (string & {});

export const AVATAR_SHAPES = ['circle', 'square'] as const;
export type AvatarShape = (typeof AVATAR_SHAPES)[number];

export const AVATAR_COLORS = [
  'grey',
  'red',
  'pink',
  'purple',
  'violet',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'white',
] as const;
export type AvatarColor = (typeof AVATAR_COLORS)[number];

export interface AvatarBorder {
  color?: string;
  motion?: boolean;
}

export interface AvatarBottomSlot {
  render?: () => VNodeChild;
  shape?: AvatarShape;
  text?: VNodeChild;
  bgColor?: string;
  textColor?: string;
  className?: HTMLAttributes['class'];
  style?: StyleValue;
}

export interface AvatarTopSlot {
  render?: () => VNodeChild;
  gradientStart?: string;
  gradientEnd?: string;
  text?: VNodeChild;
  textColor?: string;
  className?: HTMLAttributes['class'];
  style?: StyleValue;
}

export interface AvatarProps {
  alt?: string;
  border?: boolean | AvatarBorder;
  bottomSlot?: AvatarBottomSlot;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  color?: AvatarColor;
  contentMotion?: boolean;
  gap?: number;
  hoverMask?: VNodeChild;
  imgAttr?: ImgHTMLAttributes;
  onError?: (event: Event) => boolean | void;
  shape?: AvatarShape;
  size?: AvatarSize;
  src?: string;
  srcSet?: string;
  style?: StyleValue;
  topSlot?: AvatarTopSlot;
}

export interface AvatarEmits {
  click: [event: MouseEvent | KeyboardEvent];
  mouseenter: [event: MouseEvent];
  mouseleave: [event: MouseEvent];
}

export interface AvatarSlots {
  default?: () => VNodeChild;
  hoverMask?: () => VNodeChild;
  bottomSlot?: (props: { config: AvatarBottomSlot }) => VNodeChild;
  topSlot?: (props: { config: AvatarTopSlot }) => VNodeChild;
}

export type AvatarGroupOverlapFrom = 'start' | 'end';

export interface AvatarGroupProps {
  maxCount?: number;
  overlapFrom?: AvatarGroupOverlapFrom;
  renderMore?: (restNumber: number, restAvatars: VNode[]) => VNodeChild;
  shape?: AvatarShape;
  size?: AvatarSize;
}

export interface AvatarGroupSlots {
  default?: () => VNodeChild;
  more?: (props: { restNumber: number; restAvatars: VNode[] }) => VNodeChild;
}

export interface AvatarState {
  isImgExist: boolean;
  focusVisible: boolean;
  scale: number;
  showHoverMask: boolean;
}

export type AvatarRootStyle = CSSProperties | StyleValue;
