import TagBase from './Tag.vue';
import TagGroupBase from './TagGroup';
import SplitTagGroupBase from './SplitTagGroup';

/** 保留 Tag 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const Tag: typeof TagBase = TagBase;
/** 保留 TagGroup 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const TagGroup: typeof TagGroupBase = TagGroupBase;
/** 保留 SplitTagGroup 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const SplitTagGroup: typeof SplitTagGroupBase = SplitTagGroupBase;

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
