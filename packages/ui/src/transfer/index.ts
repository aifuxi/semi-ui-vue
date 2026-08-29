import type { DefineComponent } from 'vue';

import TransferBase from './Transfer.vue';
import type { TransferProps } from './types';

export const Transfer = TransferBase as unknown as DefineComponent<TransferProps>;

export type {
  TransferDataItem,
  TransferDataSource,
  TransferDragHandleProps,
  TransferEmits,
  TransferEmptyContent,
  TransferExposed,
  TransferFullPathItem,
  TransferGroupItem,
  TransferLocale,
  TransferPaginationProps,
  TransferPrimitive,
  TransferProps,
  TransferResolvedDataItem,
  TransferSelectedHeaderProps,
  TransferSelectedItemProps,
  TransferSelectedPanelProps,
  TransferSlots,
  TransferSourceHeaderProps,
  TransferSourceItemProps,
  TransferSourcePanelProps,
  TransferTreeItem,
  TransferType,
  TransferVirtualizeProps,
} from './types';

export default Transfer;
