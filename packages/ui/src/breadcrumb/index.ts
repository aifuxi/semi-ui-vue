import BreadcrumbBase from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem.vue';

export type BreadcrumbCompoundComponent = typeof BreadcrumbBase & {
  Item: typeof BreadcrumbItem;
};

export const Breadcrumb = Object.assign(BreadcrumbBase, {
  Item: BreadcrumbItem,
}) as BreadcrumbCompoundComponent;

export { BreadcrumbItem };
export { breadcrumbContextKey } from './breadcrumb-context';
export { BREADCRUMB_MORE_TYPES } from './types';
export type {
  BreadcrumbEmits,
  BreadcrumbItemEmits,
  BreadcrumbItemInfo,
  BreadcrumbItemProps,
  BreadcrumbItemSlots,
  BreadcrumbMoreType,
  BreadcrumbProps,
  BreadcrumbRoute,
  BreadcrumbShowTooltip,
  BreadcrumbSlots,
} from './types';

export default Breadcrumb;
