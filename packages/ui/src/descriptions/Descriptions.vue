<script setup lang="ts">
import {
  DescriptionsFoundation,
  type DescriptionsAdapter,
} from '@workspace/foundation-integration';
import {
  Comment,
  Fragment,
  Text,
  computed,
  getCurrentInstance,
  isVNode,
  markRaw,
  provide,
  useAttrs,
  useSlots,
  type PropType,
  type Slots,
  type VNode,
  type VNodeChild,
} from 'vue';

import { semiGlobal } from '../config-provider';
import DescriptionsItem from './DescriptionsItem.vue';
import { descriptionsContextKey } from './descriptions-context';
import type {
  DescriptionsAlign,
  DescriptionsDataItem,
  DescriptionsLayout,
  DescriptionsProps,
  DescriptionsSize,
  DescriptionsSlots,
} from './types';

interface NormalizedItem {
  class: DescriptionsDataItem['class'] | undefined;
  className: DescriptionsDataItem['className'] | undefined;
  dataAttrs: Record<string, unknown>;
  hidden: boolean;
  internalKey: VNodeChild | (() => VNodeChild) | undefined;
  internalValue: VNodeChild | (() => VNodeChild) | undefined;
  keyStyle: DescriptionsDataItem['keyStyle'] | undefined;
  span: number | undefined;
  style: DescriptionsDataItem['style'] | undefined;
}

defineOptions({ name: 'Descriptions', inheritAttrs: false });
const props = defineProps({
  align: { type: String as PropType<DescriptionsAlign>, default: undefined },
  row: { type: Boolean, default: undefined },
  size: { type: String as PropType<DescriptionsSize>, default: undefined },
  class: { type: null as unknown as PropType<DescriptionsProps['class']>, default: undefined },
  className: {
    type: null as unknown as PropType<DescriptionsProps['className']>,
    default: undefined,
  },
  style: { type: null as unknown as PropType<DescriptionsProps['style']>, default: undefined },
  data: {
    type: Array as PropType<readonly DescriptionsDataItem[]>,
    default: undefined,
  },
  layout: { type: String as PropType<DescriptionsLayout>, default: undefined },
  column: { type: Number, default: undefined },
});
defineSlots<DescriptionsSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();

function hasRawProp(name: keyof DescriptionsProps): boolean {
  const rawProps = instance?.vnode.props;
  const kebabName = String(name).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, name) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabName)),
  );
}

function resolveProp<Key extends keyof DescriptionsProps>(
  key: Key,
  fallback: NonNullable<DescriptionsProps[Key]>,
): NonNullable<DescriptionsProps[Key]> {
  if (hasRawProp(key) && props[key] !== undefined) {
    return props[key] as NonNullable<DescriptionsProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.Descriptions?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<
    DescriptionsProps[Key]
  >;
}

const runtimeAlign = computed(() => resolveProp('align', 'center'));
const runtimeRow = computed(() => resolveProp('row', false));
const runtimeSize = computed(() => resolveProp('size', 'medium'));
const runtimeData = computed(() => resolveProp('data', [] as DescriptionsDataItem[]));
const runtimeLayout = computed(() => resolveProp('layout', 'vertical'));
const runtimeColumn = computed(() => resolveProp('column', 3));

provide(descriptionsContextKey, { align: runtimeAlign, layout: runtimeLayout });

function isPlainRecord(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cloneDataItems(items: readonly DescriptionsDataItem[]): NormalizedItem[] {
  return items.filter(isPlainRecord).map((item) => ({
    class: item.class,
    className: item.className,
    dataAttrs: Object.fromEntries(
      Object.entries(item).filter(([name]) => name.startsWith('data-')),
    ),
    hidden: item.hidden === true,
    internalKey: item.key,
    internalValue: item.value,
    keyStyle: item.keyStyle,
    span: item.span,
    style: item.style,
  }));
}

function getVNodeProp(vnode: VNode, camelName: string, kebabName: string): unknown {
  const vnodeProps = vnode.props;
  if (!vnodeProps) return undefined;
  if (Object.prototype.hasOwnProperty.call(vnodeProps, camelName)) return vnodeProps[camelName];
  return vnodeProps[kebabName];
}

function vnodeHasProp(vnode: VNode, camelName: string, kebabName: string): boolean {
  const vnodeProps = vnode.props;
  return Boolean(
    vnodeProps &&
    (Object.prototype.hasOwnProperty.call(vnodeProps, camelName) ||
      Object.prototype.hasOwnProperty.call(vnodeProps, kebabName)),
  );
}

function flattenItemVNodes(children: VNodeChild, output: VNode[] = []): VNode[] {
  if (Array.isArray(children)) {
    for (const child of children) flattenItemVNodes(child, output);
    return output;
  }
  if (!isVNode(children) || children.type === Comment || children.type === Text) return output;
  if (children.type === Fragment) {
    flattenItemVNodes(children.children as VNodeChild, output);
  } else if (children.type === DescriptionsItem) {
    output.push(children);
  }
  return output;
}

function slotFromVNode(vnode: VNode, name: string): (() => VNodeChild) | undefined {
  const vnodeChildren = vnode.children;
  if (!vnodeChildren || typeof vnodeChildren !== 'object' || Array.isArray(vnodeChildren)) {
    return undefined;
  }
  const candidate = (vnodeChildren as Slots)[name];
  return typeof candidate === 'function' ? candidate : undefined;
}

function normalizeItemVNode(vnode: VNode): NormalizedItem {
  const rawSpan = getVNodeProp(vnode, 'span', 'span');
  const rawHidden = getVNodeProp(vnode, 'hidden', 'hidden');
  const item: NormalizedItem = {
    class: getVNodeProp(vnode, 'class', 'class') as DescriptionsDataItem['class'],
    className: getVNodeProp(vnode, 'className', 'class-name') as DescriptionsDataItem['className'],
    hidden: vnodeHasProp(vnode, 'hidden', 'hidden') ? rawHidden !== false : false,
    internalKey:
      slotFromVNode(vnode, 'key') ?? (getVNodeProp(vnode, 'itemKey', 'item-key') as VNodeChild),
    internalValue: slotFromVNode(vnode, 'default'),
    keyStyle: getVNodeProp(vnode, 'keyStyle', 'key-style') as DescriptionsDataItem['keyStyle'],
    span: rawSpan === undefined ? undefined : Number(rawSpan),
    style: getVNodeProp(vnode, 'style', 'style') as DescriptionsDataItem['style'],
    dataAttrs: Object.fromEntries(
      Object.entries(vnode.props ?? {}).filter(([name]) => name.startsWith('data-')),
    ),
  };
  return item;
}

const slotItems = computed(() =>
  flattenItemVNodes(slots.default?.() ?? []).map(normalizeItemVNode),
);
const normalizedItems = computed(() =>
  runtimeData.value.length > 0 ? cloneDataItems(runtimeData.value) : slotItems.value,
);

const foundationProps = computed(() => ({
  children: slots.default,
  column: runtimeColumn.value,
  data: runtimeData.value,
}));
const adapter: DescriptionsAdapter<typeof foundationProps.value, NormalizedItem> = {
  getProps: () => foundationProps.value,
  getColumns: () => normalizedItems.value.map((item) => ({ ...item })),
};
const foundation = markRaw(new DescriptionsFoundation(adapter));
const horizontalRows = computed(() => foundation.getHorizontalList());

const rootClasses = computed(() => [
  'semi-descriptions',
  !runtimeRow.value ? `semi-descriptions-${runtimeAlign.value}` : undefined,
  runtimeRow.value ? 'semi-descriptions-double' : undefined,
  runtimeRow.value ? `semi-descriptions-double-${runtimeSize.value}` : undefined,
  `semi-descriptions-${runtimeLayout.value}`,
  attrs.class,
  props.class,
  props.className,
]);
const rootStyle = computed(() => [props.style, attrs.style]);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
function itemProps(item: NormalizedItem): Record<string, unknown> {
  return {
    ...item.dataAttrs,
    class: item.class,
    className: item.className,
    hidden: item.hidden,
    internalKey: item.internalKey,
    internalValue: item.internalValue,
    keyStyle: item.keyStyle,
    span: item.span,
    style: item.style,
  };
}
</script>

<template>
  <div :class="rootClasses" :style="rootStyle" v-bind="dataAttrs">
    <table>
      <tbody>
        <template v-if="runtimeLayout === 'horizontal'">
          <tr v-for="(items, rowIndex) in horizontalRows" :key="rowIndex">
            <DescriptionsItem
              v-for="(item, itemIndex) in items"
              :key="`${rowIndex}-${itemIndex}`"
              v-bind="itemProps(item)"
            />
          </tr>
        </template>
        <template v-else-if="runtimeData.length > 0">
          <DescriptionsItem
            v-for="(item, itemIndex) in normalizedItems"
            :key="itemIndex"
            v-bind="itemProps(item)"
          />
        </template>
        <slot v-else />
      </tbody>
    </table>
  </div>
</template>
