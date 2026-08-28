import type { DefineComponent } from 'vue';

import CollapsibleBase from './Collapsible.vue';
import type { CollapsibleProps } from './types';

export const Collapsible = CollapsibleBase as unknown as DefineComponent<CollapsibleProps>;

export type {
  CollapsibleEmits,
  CollapsibleProps,
  CollapsibleSlots,
  CollapsibleState,
} from './types';

export default Collapsible;
