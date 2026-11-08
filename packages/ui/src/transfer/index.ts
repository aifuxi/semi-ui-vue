import TransferBase from './Transfer.vue';

/** 保留 Transfer 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const Transfer: typeof TransferBase = TransferBase;

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
