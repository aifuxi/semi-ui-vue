import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const SKELETON_AVATAR_SIZES = [
  'extra-extra-small',
  'extra-small',
  'small',
  'default',
  'medium',
  'large',
  'extra-large',
] as const;
export const SKELETON_AVATAR_SHAPES = ['circle', 'square'] as const;

export type SkeletonAvatarSize = (typeof SKELETON_AVATAR_SIZES)[number];
export type SkeletonAvatarShape = (typeof SKELETON_AVATAR_SHAPES)[number];

export interface SkeletonProps {
  active?: boolean;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  loading?: boolean;
  placeholder?: VNodeChild;
  style?: StyleValue;
}

export interface SkeletonSlots {
  default?: () => VNodeChild;
  placeholder?: () => VNodeChild;
}

export interface SkeletonBasicProps {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  prefixCls?: string;
  style?: StyleValue;
}

export interface SkeletonAvatarProps extends SkeletonBasicProps {
  shape?: SkeletonAvatarShape;
  size?: SkeletonAvatarSize;
}

export interface SkeletonParagraphProps extends SkeletonBasicProps {
  rows?: number;
}

export interface SkeletonGenericProps extends SkeletonAvatarProps {
  type?: string;
}

export type AvatarProps = SkeletonAvatarProps;
export type ParagraphProps = SkeletonParagraphProps;
export type GenericProps = SkeletonGenericProps;
