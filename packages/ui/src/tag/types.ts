import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { PopoverProps } from '../popover';

export const TAG_COLORS = [
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
export type TagColor = (typeof TAG_COLORS)[number];

export const TAG_TYPES = ['light', 'solid', 'ghost'] as const;
export type TagType = (typeof TAG_TYPES)[number];

export const TAG_SIZES = ['default', 'small', 'large'] as const;
export type TagSize = (typeof TAG_SIZES)[number];

export const TAG_SHAPES = ['square', 'circle'] as const;
export type TagShape = (typeof TAG_SHAPES)[number];
export type TagAvatarShape = TagShape;

export interface TagProps {
  avatarShape?: TagAvatarShape;
  avatarSrc?: string;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  closable?: boolean;
  color?: TagColor;
  colorful?: boolean;
  content?: VNodeChild;
  gradient?: boolean;
  prefixIcon?: VNodeChild;
  shape?: TagShape;
  size?: TagSize;
  style?: StyleValue;
  suffixIcon?: VNodeChild;
  tabIndex?: number;
  tagKey?: string | number;
  type?: TagType;
  visible?: boolean;
}

export interface TagEmits {
  click: [event: MouseEvent | KeyboardEvent];
  close: [
    content: VNodeChild,
    event: MouseEvent | KeyboardEvent,
    tagKey: string | number | undefined,
  ];
  keydown: [event: KeyboardEvent];
  mouseenter: [event: MouseEvent];
  'update:visible': [visible: boolean];
}

export interface TagSlots {
  default?: () => VNodeChild;
  prefixIcon?: () => VNodeChild;
  suffixIcon?: () => VNodeChild;
}

export interface TagData extends TagProps {
  onClick?: (event: MouseEvent | KeyboardEvent) => void;
  onClose?: (
    content: VNodeChild,
    event: MouseEvent | KeyboardEvent,
    tagKey: string | number | undefined,
  ) => void;
  onKeydown?: (event: KeyboardEvent) => void;
  onMouseenter?: (event: MouseEvent) => void;
}

export interface TagGroupProps {
  avatarShape?: TagAvatarShape;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  maxTagCount?: number;
  mode?: string;
  popoverProps?: PopoverProps;
  restCount?: number;
  showPopover?: boolean;
  size?: TagSize;
  style?: StyleValue;
  tagList?: Array<TagData | VNodeChild>;
}

export interface TagGroupEmits {
  plusNMouseenter: [event: MouseEvent];
  tagClose: [
    content: VNodeChild,
    event: MouseEvent | KeyboardEvent,
    tagKey: string | number | undefined,
  ];
}

export interface SplitTagGroupProps {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: StyleValue;
}

export interface SplitTagGroupSlots {
  default?: () => VNodeChild;
}
