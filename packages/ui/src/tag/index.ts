import type { DefineComponent } from 'vue';

import TagBase from './Tag.vue';
import TagGroupBase from './TagGroup';
import SplitTagGroupBase from './SplitTagGroup';
import type { SplitTagGroupProps, TagGroupProps, TagProps } from './types';

export const Tag = TagBase as unknown as DefineComponent<TagProps>;
export const TagGroup = TagGroupBase as unknown as DefineComponent<TagGroupProps>;
export const SplitTagGroup = SplitTagGroupBase as unknown as DefineComponent<SplitTagGroupProps>;

export { TAG_COLORS, TAG_SHAPES, TAG_SIZES, TAG_TYPES } from './types';
export type {
  SplitTagGroupProps,
  SplitTagGroupSlots,
  TagAvatarShape,
  TagColor,
  TagData,
  TagEmits,
  TagGroupEmits,
  TagGroupProps,
  TagProps,
  TagShape,
  TagSize,
  TagSlots,
  TagType,
} from './types';

export default Tag;
