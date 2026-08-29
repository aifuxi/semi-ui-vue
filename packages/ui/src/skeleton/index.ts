import type { DefineComponent } from 'vue';

import SkeletonBase from './Skeleton.vue';
import SkeletonAvatarBase from './SkeletonAvatar.vue';
import SkeletonButtonBase from './SkeletonButton.vue';
import SkeletonImageBase from './SkeletonImage.vue';
import SkeletonParagraphBase from './SkeletonParagraph.vue';
import SkeletonTitleBase from './SkeletonTitle.vue';
import type {
  SkeletonAvatarProps,
  SkeletonBasicProps,
  SkeletonParagraphProps,
  SkeletonProps,
} from './types';

export type SkeletonCompoundComponent = DefineComponent<SkeletonProps> & {
  Avatar: DefineComponent<SkeletonAvatarProps>;
  Button: DefineComponent<SkeletonBasicProps>;
  Image: DefineComponent<SkeletonBasicProps>;
  Paragraph: DefineComponent<SkeletonParagraphProps>;
  Title: DefineComponent<SkeletonBasicProps>;
};

export const SkeletonAvatar = SkeletonAvatarBase as unknown as DefineComponent<SkeletonAvatarProps>;
export const SkeletonButton = SkeletonButtonBase as unknown as DefineComponent<SkeletonBasicProps>;
export const SkeletonImage = SkeletonImageBase as unknown as DefineComponent<SkeletonBasicProps>;
export const SkeletonParagraph =
  SkeletonParagraphBase as unknown as DefineComponent<SkeletonParagraphProps>;
export const SkeletonTitle = SkeletonTitleBase as unknown as DefineComponent<SkeletonBasicProps>;
export const Skeleton = Object.assign(SkeletonBase, {
  Avatar: SkeletonAvatar,
  Button: SkeletonButton,
  Image: SkeletonImage,
  Paragraph: SkeletonParagraph,
  Title: SkeletonTitle,
}) as unknown as SkeletonCompoundComponent;

export { SKELETON_AVATAR_SHAPES, SKELETON_AVATAR_SIZES } from './types';
export type {
  AvatarProps,
  GenericProps,
  ParagraphProps,
  SkeletonAvatarProps,
  SkeletonAvatarShape,
  SkeletonAvatarSize,
  SkeletonBasicProps,
  SkeletonGenericProps,
  SkeletonParagraphProps,
  SkeletonProps,
  SkeletonSlots,
} from './types';

export default Skeleton;
