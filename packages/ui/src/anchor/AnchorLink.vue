<script setup lang="ts">
import { AnchorLinkFoundation, type AnchorLinkAdapter } from '@workspace/foundation-integration';
import {
  computed,
  inject,
  markRaw,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowReactive,
  useAttrs,
  useSlots,
  watch,
} from 'vue';

import { Text } from '../typography';

import AnchorNodeRenderer from './AnchorNodeRenderer';
import { anchorContextKey, anchorLevelKey, anchorParentHrefKey } from './anchor-context';
import type { AnchorLinkProps, AnchorLinkSlots, AnchorShowTooltip } from './types';

defineOptions({ name: 'AnchorLink', inheritAttrs: false });

const props = withDefaults(defineProps<AnchorLinkProps>(), {
  className: '',
  disabled: false,
  href: '#',
  title: '',
});
defineSlots<AnchorLinkSlots>();

interface FoundationLinkProps {
  href: string;
}

const attrs = useAttrs();
const slots = useSlots();
const injectedContext = inject(anchorContextKey);
if (!injectedContext) throw new Error('[Semi] Anchor.Link must be used inside Anchor.');
const context = injectedContext;
const parentHref = inject(
  anchorParentHrefKey,
  computed(() => undefined),
);
const level = inject(
  anchorLevelKey,
  computed(() => 1),
);
const token = Symbol('semi-anchor-link');
const cache = new Map<string, unknown>();
const emptyState = shallowReactive<Record<string, never>>({});

const adapter: AnchorLinkAdapter<FoundationLinkProps, Record<string, never>> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => ({ href: props.href })[key as keyof FoundationLinkProps],
  getProps: () => ({ href: props.href }),
  getState: () => undefined,
  getStates: () => emptyState,
  setState: (_nextState, callback) => callback?.(),
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(String(key), value),
  stopPropagation: (event) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  addLink: (href) => context.addLink(token, href, parentHref.value),
  removeLink: (href) => context.removeLink(token, href),
};
const foundation = markRaw(
  new AnchorLinkFoundation<FoundationLinkProps, Record<string, never>>(adapter),
);

const currentHref = computed(() => props.href);
const childLevel = computed(() => level.value + 1);
provide(anchorParentHrefKey, currentHref);
provide(anchorLevelKey, childLevel);

const active = computed(() => context.activeLink.value === props.href);
const showChildren = computed(
  () =>
    !context.autoCollapse.value ||
    active.value ||
    Boolean(context.childMap.value[props.href]?.has(context.activeLink.value)),
);
const linkClasses = computed(() => ['semi-anchor-link', props.className, attrs.class]);
const linkStyle = computed(() => [attrs.style, props.style]);
const titleClasses = computed(() => [
  'semi-anchor-link-title',
  active.value ? 'semi-anchor-link-title-active' : undefined,
  props.disabled ? 'semi-anchor-link-title-disabled' : undefined,
]);
const tooltipClasses = computed(() => [
  'semi-anchor-link-tooltip',
  context.size.value === 'small' ? 'semi-anchor-link-tooltip-small' : undefined,
  active.value ? 'semi-anchor-link-tooltip-active' : undefined,
  props.disabled ? 'semi-anchor-link-tooltip-disabled' : undefined,
]);
const titleStyle = computed(() =>
  context.direction.value === 'rtl'
    ? { paddingRight: `${8 * level.value}px` }
    : { paddingLeft: `${8 * level.value}px` },
);
const tooltipConfig = computed<AnchorShowTooltip>(() => {
  const configured = context.showTooltip.value;
  const value =
    typeof configured === 'object'
      ? { ...configured, opts: { ...(configured.opts ?? {}) } }
      : { type: 'tooltip' as const, opts: {} };
  if (context.position.value) value.opts.position = context.position.value;
  return value;
});
const titleContent = computed(() => slots.title?.() ?? props.title);

function handleClick(event: MouseEvent | KeyboardEvent): void {
  if (!props.disabled) context.onClick(event, props.href);
}

watch(
  () => props.href,
  (href, previousHref) => foundation.handleUpdateLink(href, previousHref),
);
onMounted(() => foundation.handleAddLink());
onBeforeUnmount(() => foundation.handleRemoveLink());
</script>

<template>
  <div :class="linkClasses" :style="linkStyle" role="listitem">
    <div
      role="link"
      tabindex="0"
      :aria-disabled="props.disabled"
      :aria-details="active ? 'active' : undefined"
      :title="
        !context.showTooltip.value && typeof props.title === 'string' ? props.title : undefined
      "
      :style="titleStyle"
      :class="titleClasses"
      @click="handleClick"
      @keypress="handleClick"
    >
      <Text
        v-if="context.showTooltip.value"
        :size="context.size.value === 'default' ? 'normal' : 'small'"
        :ellipsis="{ showTooltip: tooltipConfig }"
        type="tertiary"
        :class="tooltipClasses"
      >
        <AnchorNodeRenderer :content="titleContent" />
      </Text>
      <AnchorNodeRenderer v-else :content="titleContent" />
    </div>
    <div v-if="showChildren" role="list"><slot /></div>
  </div>
</template>
