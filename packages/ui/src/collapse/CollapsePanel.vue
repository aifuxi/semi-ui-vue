<script setup lang="ts">
import { createCollapsePanelId } from '@workspace/foundation-integration';
import { IconChevronDown, IconChevronUp } from '@workspace/icons';
import {
  computed,
  h,
  inject,
  onMounted,
  useAttrs,
  useSlots,
  useTemplateRef,
  type PropType,
} from 'vue';

import { Collapsible } from '../collapsible';
import CollapseNodeRenderer from './CollapseNodeRenderer';
import { collapseContextKey } from './collapse-context';
import type { CollapsePanelEmits, CollapsePanelProps, CollapsePanelSlots } from './types';

defineOptions({ name: 'CollapsePanel', inheritAttrs: false });
const props = defineProps({
  itemKey: { type: String, required: true },
  extra: {
    type: null as unknown as PropType<CollapsePanelProps['extra']>,
    default: undefined,
  },
  header: {
    type: null as unknown as PropType<CollapsePanelProps['header']>,
    default: undefined,
  },
  class: { type: null as unknown as PropType<CollapsePanelProps['class']>, default: undefined },
  className: {
    type: null as unknown as PropType<CollapsePanelProps['className']>,
    default: undefined,
  },
  reCalcKey: { type: [Number, String] as PropType<number | string>, default: undefined },
  style: {
    type: null as unknown as PropType<CollapsePanelProps['style']>,
    default: undefined,
  },
  showArrow: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits<CollapsePanelEmits>();
defineSlots<CollapsePanelSlots>();
const attrs = useAttrs();
const slots = useSlots();
const injectedContext = inject(collapseContextKey);
if (!injectedContext) throw new Error('CollapsePanel 必须作为 Collapse 的后代使用');
const context = injectedContext;

const headerIcon = useTemplateRef<HTMLElement>('header-icon');
const active = computed(() => context.activeSet.value.has(props.itemKey));
const hasChildren = computed(() => Boolean(slots.default));
const expandIconEnabled = computed(() => hasChildren.value && !props.disabled);
const stringHeader = computed(() => !slots.header && typeof props.header === 'string');
const itemClasses = computed(() => [
  'semi-collapse-item',
  active.value ? 'semi-collapse-item-active' : undefined,
  attrs.class,
  props.class,
  props.className,
]);
const itemStyle = computed(() => [props.style, attrs.style]);
const headerClasses = computed(() => [
  'semi-collapse-header',
  props.disabled ? 'semi-collapse-header-disabled' : undefined,
  context.expandIconPosition.value === 'left' ? 'semi-collapse-header-iconLeft' : undefined,
]);
const iconClasses = computed(() => [
  'semi-collapse-header-icon',
  !expandIconEnabled.value ? 'semi-collapse-header-iconDisabled' : undefined,
]);
const displayedIcon = computed(() => {
  const expandIcon = context.expandIcon();
  const collapseIcon = context.collapseIcon();
  if (!expandIconEnabled.value || !active.value) return expandIcon ?? h(IconChevronDown);
  return collapseIcon ?? h(IconChevronUp);
});
const forwardedAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
  ),
);
const collapsibleProps = computed(() => ({
  isOpen: active.value,
  keepDOM: context.keepDOM.value,
  lazyRender: context.lazyRender.value,
  motion: context.motion.value,
  ...(props.reCalcKey === undefined ? {} : { reCalcKey: props.reCalcKey }),
}));

let ariaId = '';
onMounted(() => {
  ariaId = createCollapsePanelId({});
});

function handleHeaderClick(event: MouseEvent): void {
  if (props.disabled) return;
  const target = event.target;
  if (
    context.clickHeaderToExpand.value ||
    (target instanceof Node && headerIcon.value?.contains(target))
  ) {
    context.onClick(props.itemKey, event);
  }
}
</script>

<template>
  <div v-bind="forwardedAttrs" :class="itemClasses" :style="itemStyle">
    <div
      role="button"
      tabindex="0"
      :class="headerClasses"
      :aria-disabled="props.disabled"
      :aria-expanded="active"
      :aria-owns="ariaId"
      @click="handleHeaderClick"
    >
      <template v-if="stringHeader">
        <span
          v-if="props.showArrow && context.expandIconPosition.value === 'left'"
          ref="header-icon"
          aria-hidden="true"
          :class="iconClasses"
        >
          <CollapseNodeRenderer :content="displayedIcon" />
        </span>
        <span>{{ props.header }}</span>
        <span class="semi-collapse-header-right">
          <span
            ><slot name="extra"><CollapseNodeRenderer :content="props.extra" /></slot
          ></span>
          <span
            v-if="props.showArrow && context.expandIconPosition.value !== 'left'"
            ref="header-icon"
            aria-hidden="true"
            :class="iconClasses"
          >
            <CollapseNodeRenderer :content="displayedIcon" />
          </span>
        </span>
      </template>
      <template v-else>
        <span
          v-if="props.showArrow && context.expandIconPosition.value === 'left'"
          ref="header-icon"
          aria-hidden="true"
          :class="iconClasses"
        >
          <CollapseNodeRenderer :content="displayedIcon" />
        </span>
        <slot name="header"><CollapseNodeRenderer :content="props.header" /></slot>
        <span
          v-if="props.showArrow && context.expandIconPosition.value !== 'left'"
          ref="header-icon"
          aria-hidden="true"
          :class="iconClasses"
        >
          <CollapseNodeRenderer :content="displayedIcon" />
        </span>
      </template>
    </div>
    <Collapsible v-if="hasChildren" v-bind="collapsibleProps" @motion-end="emit('motionEnd')">
      <div :id="ariaId" class="semi-collapse-content" :aria-hidden="!active">
        <div class="semi-collapse-content-wrapper"><slot /></div>
      </div>
    </Collapsible>
  </div>
</template>
