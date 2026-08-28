<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text as VueText,
  computed,
  inject,
  isVNode,
  markRaw,
  onBeforeUnmount,
  onMounted,
  useAttrs,
  useSlots,
  type VNodeChild,
} from 'vue';
import {
  BreadcrumbItemFoundation,
  type BreadcrumbItemAdapter,
} from '@workspace/foundation-integration';

import Text from '../typography/Text.vue';

import BreadcrumbIconRenderer from './BreadcrumbIconRenderer';
import BreadcrumbNodeRenderer from './BreadcrumbNodeRenderer';
import { breadcrumbContextKey } from './breadcrumb-context';
import type {
  BreadcrumbItemEmits,
  BreadcrumbItemInfo,
  BreadcrumbItemProps,
  BreadcrumbItemSlots,
  BreadcrumbShowTooltip,
} from './types';

defineOptions({ name: 'BreadcrumbItem', inheritAttrs: false });
const props = withDefaults(defineProps<BreadcrumbItemProps>(), {
  active: false,
  noLink: false,
  shouldRenderSeparator: true,
});
const emit = defineEmits<BreadcrumbItemEmits>();
defineSlots<BreadcrumbItemSlots>();
const attrs = useAttrs();
const slots = useSlots();

const fallbackShowTooltip: BreadcrumbShowTooltip = { width: 150, ellipsisPos: 'end' };
const context = inject(breadcrumbContextKey, {
  compact: computed(() => true),
  separator: computed<VNodeChild>(() => '/'),
  showTooltip: computed(() => fallbackShowTooltip),
  onClick: () => undefined,
});

function flattenContent(nodes: VNodeChild[]): VNodeChild[] {
  const output: VNodeChild[] = [];
  const visit = (node: VNodeChild): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!isVNode(node) || node.type === Comment) {
      if (node !== null && node !== undefined && typeof node !== 'boolean') output.push(node);
      return;
    }
    if (node.type === Fragment && Array.isArray(node.children)) {
      node.children.forEach((child) => visit(child as VNodeChild));
      return;
    }
    if (node.type === VueText && String(node.children ?? '').trim() === '') return;
    output.push(node);
  };
  nodes.forEach(visit);
  return output;
}

const contentNodes = computed(() => flattenContent((slots.default?.() ?? []) as VNodeChild[]));
const stringContent = computed<string | undefined>(() => {
  if (contentNodes.value.length !== 1) return undefined;
  const node = contentNodes.value[0];
  if (typeof node === 'string') return node.trim();
  return isVNode(node) && node.type === VueText ? String(node.children ?? '').trim() : undefined;
});
const iconContent = computed<VNodeChild>(() => slots.icon?.() ?? props.icon);
const hasHref = computed(() => props.href !== null && props.href !== undefined);
const itemTag = computed(() => (props.active || !hasHref.value ? 'span' : 'a'));
const itemClasses = computed(() => [
  'semi-breadcrumb-item',
  props.active ? 'semi-breadcrumb-item-active' : null,
  !props.noLink ? 'semi-breadcrumb-item-link' : null,
]);
const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style'].includes(name))),
);
const separatorContent = computed<VNodeChild>(() =>
  slots.separator ? slots.separator() : props.separator || context.separator.value,
);
const tooltipOptions = computed(() => {
  const showTooltip = context.showTooltip.value;
  if (!showTooltip) return { ellipsisPos: 'end' as const, opts: undefined, width: 150 };
  const configured = typeof showTooltip === 'object' ? showTooltip : {};
  return {
    ellipsisPos: configured.ellipsisPos ?? ('end' as const),
    opts: {
      autoAdjustOverflow: true,
      position: 'top' as const,
      ...(configured.opts ?? {}),
    },
    width: configured.width ?? 150,
  };
});
const tooltipWidth = computed(() =>
  typeof tooltipOptions.value.width === 'number'
    ? `${tooltipOptions.value.width}px`
    : tooltipOptions.value.width,
);
const ellipsis = computed(() => ({
  pos: tooltipOptions.value.ellipsisPos,
  showTooltip: tooltipOptions.value.opts ? { opts: tooltipOptions.value.opts } : false,
}));

function getItemInfo(): BreadcrumbItemInfo {
  if (props.route) return props.route;
  const item: BreadcrumbItemInfo = {
    name: stringContent.value ?? contentNodes.value,
  };
  if (props.href !== null && props.href !== undefined) item.href = props.href;
  return item;
}

const adapter: BreadcrumbItemAdapter = {
  notifyClick: (itemInfo, event) => emit('click', itemInfo as BreadcrumbItemInfo, event),
  notifyParent: (itemInfo, event) => context.onClick(itemInfo as BreadcrumbItemInfo, event),
};
const foundation = markRaw(new BreadcrumbItemFoundation(adapter));
onMounted(() => foundation.init());
onBeforeUnmount(() => foundation.destroy());

function handleClick(event: MouseEvent | KeyboardEvent): void {
  foundation.handleClick(getItemInfo(), event);
}
</script>

<template>
  <span
    v-bind="rootAttrs"
    :aria-current="active ? 'page' : undefined"
    :class="['semi-breadcrumb-item-wrap', className, attrs.class]"
    :style="[style, attrs.style]"
  >
    <component :is="itemTag" :class="itemClasses" :href="href" @click="handleClick">
      <BreadcrumbIconRenderer
        v-if="iconContent !== undefined && iconContent !== null"
        :compact="context.compact.value"
        :content="iconContent"
      />
      <span v-if="stringContent" class="semi-breadcrumb-item-title">
        <Text
          :ellipsis="ellipsis"
          :size="context.compact.value ? 'small' : 'normal'"
          :style="{ maxWidth: tooltipWidth }"
        >
          {{ stringContent }}
        </Text>
      </span>
      <span
        v-else-if="contentNodes.length"
        class="semi-breadcrumb-item-title semi-breadcrumb-item-title-inline"
      >
        <BreadcrumbNodeRenderer :content="contentNodes" />
      </span>
    </component>
    <template v-if="shouldRenderSeparator">
      <BreadcrumbNodeRenderer v-if="$slots.separator || separator" :content="separatorContent" />
      <span v-else class="semi-breadcrumb-separator">
        <BreadcrumbNodeRenderer :content="separatorContent" />
      </span>
    </template>
  </span>
</template>
