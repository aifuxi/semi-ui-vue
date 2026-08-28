import type { DefineComponent } from 'vue';

import DescriptionsBase from './Descriptions.vue';
import DescriptionsItemBase from './DescriptionsItem.vue';
import type { DescriptionsItemProps, DescriptionsProps } from './types';

export type DescriptionsCompoundComponent = DefineComponent<DescriptionsProps> & {
  Item: DefineComponent<DescriptionsItemProps>;
};

export const DescriptionsItem =
  DescriptionsItemBase as unknown as DefineComponent<DescriptionsItemProps>;
export const Descriptions = Object.assign(DescriptionsBase, {
  Item: DescriptionsItem,
}) as unknown as DescriptionsCompoundComponent;

export { DESCRIPTIONS_ALIGNS, DESCRIPTIONS_LAYOUTS, DESCRIPTIONS_SIZES } from './types';
export type {
  DescriptionsAlign,
  DescriptionsDataItem,
  DescriptionsItemProps,
  DescriptionsItemSlots,
  DescriptionsLayout,
  DescriptionsProps,
  DescriptionsSize,
  DescriptionsSlots,
} from './types';

export default Descriptions;
