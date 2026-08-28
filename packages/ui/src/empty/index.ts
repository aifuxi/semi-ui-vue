import type { DefineComponent } from 'vue';

import EmptyComponent from './Empty.vue';
import type { EmptyProps } from './types';

export const Empty = EmptyComponent as unknown as DefineComponent<EmptyProps>;

export { EMPTY_LAYOUTS } from './types';
export type { EmptyImage, EmptyLayout, EmptyProps, EmptySlots, EmptySvgNode } from './types';

export default Empty;
