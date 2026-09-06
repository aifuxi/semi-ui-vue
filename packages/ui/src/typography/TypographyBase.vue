<script setup lang="ts">
import {
  computed,
  cloneVNode,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  provide,
  shallowRef,
  unref,
  useAttrs,
  useSlots,
  watch,
  type CSSProperties,
  type ComputedRef,
  type VNodeChild,
  isVNode,
} from 'vue';

import TypographyTooltip from './TypographyTooltip';
import TypographyCopyable from './TypographyCopyable.vue';
import TypographyDecorations from './TypographyDecorations';
import TypographyNodeRenderer from './TypographyNodeRenderer';
import { DEFAULT_TYPOGRAPHY_LOCALE, typographyLocaleKey } from './typography-locale';
import { getTypographyText, measureTypographyEllipsis } from './typography-utils';
import type {
  TypographyBaseProps,
  TypographyContentSlots,
  TypographyCopyableConfig,
  TypographyEllipsis,
  TypographyHeading,
  TypographySize,
} from './types';

defineOptions({ name: 'TypographyBase', inheritAttrs: false });

const props = withDefaults(
  defineProps<
    TypographyBaseProps & {
      code?: boolean;
      // eslint-disable-next-line vue/require-default-prop
      headingTag?: `h${TypographyHeading}`;
      // eslint-disable-next-line vue/require-default-prop
      heading?: TypographyHeading;
      paragraph?: boolean;
      // eslint-disable-next-line vue/require-default-prop
      content?: VNodeChild[];
    }
  >(),
  {
    component: 'span',
    copyable: false,
    delete: false,
    disabled: false,
    ellipsis: false,
    link: false,
    mark: false,
    size: 'normal',
    spacing: 'normal',
    strong: false,
    type: 'primary',
    underline: false,
    code: false,
    paragraph: false,
  },
);
const emit = defineEmits<{
  copy: [event: MouseEvent | KeyboardEvent, content: string, result: boolean];
  expand: [expanded: boolean, event: MouseEvent | KeyboardEvent];
}>();
defineSlots<TypographyContentSlots>();

const attrs = useAttrs();
const slots = useSlots();
const injectedLocale = inject(typographyLocaleKey, DEFAULT_TYPOGRAPHY_LOCALE);
const locale = computed(() => unref(injectedLocale));
const inheritedSize = inject<ComputedRef<TypographySize>>(
  'semiTypographySize',
  computed(() => 'normal'),
);
const realSize = computed(() => (props.size === 'inherit' ? inheritedSize.value : props.size));
provide('semiTypographySize', realSize);

const root = shallowRef<HTMLElement | null>(null);
const expandElement = shallowRef<HTMLAnchorElement | null>(null);
const copyElement = shallowRef<InstanceType<typeof TypographyCopyable> | null>(null);
const expanded = shallowRef(false);
const isOverflowed = shallowRef(false);
const isTruncated = shallowRef(false);
const ellipsisContent = shallowRef('');
let resizeObserver: ResizeObserver | undefined;
let animationFrame: number | undefined;
let lastMeasuredContent = '';
let lastMeasurementKey = '';

const contentNodes = computed<VNodeChild[]>(() => props.content ?? slots.default?.() ?? []);
const contentText = computed(() => getTypographyText(contentNodes.value));
const ellipsisOptions = computed(() => {
  const options: TypographyEllipsis = typeof props.ellipsis === 'object' ? props.ellipsis : {};
  return {
    rows: options.rows ?? 1,
    expandable: options.expandable ?? false,
    expandText: options.expandText ?? (options.expandable ? locale.value.expand : undefined),
    collapsible: options.collapsible ?? false,
    collapseText: options.collapseText ?? (options.collapsible ? locale.value.collapse : undefined),
    pos: options.pos ?? ('end' as const),
    suffix: options.suffix ?? '',
    showTooltip: options.showTooltip ?? false,
    onExpand: options.onExpand,
  };
});
const copyConfig = computed<TypographyCopyableConfig | null>(() => {
  if (!props.copyable) return null;
  return { duration: 3, ...(typeof props.copyable === 'object' ? props.copyable : {}) };
});
const copyContent = computed(() => copyConfig.value?.content ?? contentText.value);
const measurementKey = computed(() => {
  const options = ellipsisOptions.value;
  return JSON.stringify({
    collapsible: options.collapsible,
    collapseText: options.collapseText,
    copyable: Boolean(copyConfig.value),
    expandable: options.expandable,
    expandText: options.expandText,
    pos: options.pos,
    rows: options.rows,
    strong: props.strong,
    suffix: options.suffix,
  });
});
const canUseCssEllipsis = computed(() => {
  const options = ellipsisOptions.value;
  return (
    !options.expandable &&
    options.expandText === undefined &&
    !props.copyable &&
    options.pos === 'end' &&
    !options.suffix.length
  );
});
const hasExpandOperation = computed(() => {
  if (!isTruncated.value) return false;
  const options = ellipsisOptions.value;
  return expanded.value
    ? options.collapsible || options.collapseText !== undefined
    : options.expandable || options.expandText !== undefined;
});
const expandLabel = computed(() =>
  expanded.value ? ellipsisOptions.value.collapseText : ellipsisOptions.value.expandText,
);
const ellipsisClasses = computed(() => {
  if (!props.ellipsis) return [];
  const rows = ellipsisOptions.value.rows;
  const useCss = !expanded.value && canUseCssEllipsis.value;
  return [
    'semi-typography-ellipsis',
    rows === 1 ? 'semi-typography-ellipsis-single-line' : 'semi-typography-ellipsis-multiple-line',
    rows > 1 && props.component === 'span' ? 'semi-typography-ellipsis-multiple-line-text' : null,
    rows === 1 && useCss ? 'semi-typography-ellipsis-overflow-ellipsis' : null,
    rows === 1 && useCss && props.component === 'span'
      ? 'semi-typography-ellipsis-overflow-ellipsis-text'
      : null,
  ];
});
const rootClasses = computed(() =>
  Array.from(
    new Set([
      'semi-typography',
      props.paragraph ? 'semi-typography-paragraph' : null,
      props.link ? 'semi-typography-link' : `semi-typography-${props.type}`,
      `semi-typography-${realSize.value}`,
      props.disabled ? 'semi-typography-disabled' : null,
      `semi-typography-${props.spacing}`,
      props.headingTag ? `semi-typography-${props.headingTag}` : null,
      props.headingTag && typeof props.weight === 'string'
        ? `semi-typography-${props.headingTag}-weight-${props.weight}`
        : null,
      ...ellipsisClasses.value,
      attrs.class,
    ]),
  ),
);
const rootStyle = computed<CSSProperties[]>(() => [
  attrs.style as CSSProperties,
  typeof props.weight === 'number' ? { fontWeight: props.weight } : {},
  props.ellipsis && !expanded.value && canUseCssEllipsis.value && ellipsisOptions.value.rows > 1
    ? ({ webkitLineClamp: String(ellipsisOptions.value.rows) } as CSSProperties)
    : {},
]);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([attribute]) => !['class', 'style'].includes(attribute)),
  ),
);
const linkClasses = computed(() => [
  props.link ? 'semi-typography-link-text' : null,
  props.link && props.underline ? 'semi-typography-link-underline' : null,
]);
const iconContent = computed<VNodeChild>(() => {
  const content = slots.icon?.() ?? props.icon ?? null;
  const iconSize = realSize.value === 'small' ? 'small' : 'default';
  const normalize = (node: VNodeChild): VNodeChild => {
    if (!isVNode(node)) return node;
    const type = node.type as { elementType?: string };
    return type.elementType === 'Icon' ? cloneVNode(node, { size: iconSize }) : node;
  };
  return Array.isArray(content) ? content.map(normalize) : normalize(content);
});
const tooltipOptions = computed(() =>
  typeof ellipsisOptions.value.showTooltip === 'object'
    ? ellipsisOptions.value.showTooltip
    : { type: 'tooltip' },
);

function compareSingleRow(): boolean {
  const element = root.value;
  if (!element || typeof document === 'undefined' || !document.createRange) return false;
  const style = window.getComputedStyle(element);
  const availableWidth = Math.max(
    0,
    element.clientWidth -
      (Number.parseFloat(style.paddingLeft) || 0) -
      (Number.parseFloat(style.paddingRight) || 0),
  );
  const range = document.createRange();
  if (typeof range.getBoundingClientRect !== 'function') {
    return element.scrollWidth > availableWidth;
  }
  const contentWidth = Array.from(element.childNodes).reduce((total, node) => {
    range.selectNodeContents(node);
    return total + (range.getBoundingClientRect().width || 0);
  }, 0);
  range.detach();
  return contentWidth > availableWidth;
}

function shouldTruncate(): boolean {
  const element = root.value;
  const rows = ellipsisOptions.value.rows;
  if (!element || rows < 1) return false;
  return rows <= 1 ? compareSingleRow() : element.scrollHeight > element.offsetHeight;
}

async function updateEllipsis(): Promise<void> {
  await nextTick();
  const element = root.value;
  if (!props.ellipsis || !element || expanded.value) return;
  lastMeasuredContent = contentText.value;
  lastMeasurementKey = measurementKey.value;
  if (canUseCssEllipsis.value) {
    isOverflowed.value = shouldTruncate();
    isTruncated.value = false;
    return;
  }
  const fixedNodes: Node[] = [];
  if (expandElement.value) fixedNodes.push(expandElement.value);
  const copyRoot = copyElement.value?.$el as Node | undefined;
  if (copyRoot) fixedNodes.push(copyRoot);
  const measured = measureTypographyEllipsis(
    element,
    ellipsisOptions.value.rows,
    contentText.value,
    fixedNodes,
    ellipsisOptions.value.suffix,
    ellipsisOptions.value.pos,
    props.strong,
  );
  ellipsisContent.value = measured;
  isTruncated.value = measured !== contentText.value;
  isOverflowed.value = false;
}

function scheduleEllipsisUpdate(): void {
  if (typeof window === 'undefined') return;
  if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
  animationFrame = window.requestAnimationFrame(() => {
    animationFrame = undefined;
    void updateEllipsis();
  });
}

function toggleExpanded(event: MouseEvent | KeyboardEvent): void {
  const nextExpanded = !expanded.value;
  ellipsisOptions.value.onExpand?.(nextExpanded, event);
  emit('expand', nextExpanded, event);
  const options = ellipsisOptions.value;
  if (
    (options.expandable && !expanded.value) ||
    (options.collapsible && expanded.value) ||
    (!expanded.value && options.expandText !== undefined) ||
    (expanded.value && options.collapseText !== undefined)
  ) {
    expanded.value = nextExpanded;
    if (!expanded.value) scheduleEllipsisUpdate();
  }
}

function onExpandKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') toggleExpanded(event);
}

const tooltipEnabled = computed(() => {
  const options = ellipsisOptions.value;
  return Boolean(
    props.ellipsis &&
    !expanded.value &&
    (canUseCssEllipsis.value ? isOverflowed.value : isTruncated.value) &&
    !options.expandable &&
    options.expandText === undefined &&
    options.showTooltip,
  );
});

function onContentMouseenter(): void {
  if (canUseCssEllipsis.value) isOverflowed.value = shouldTruncate();
}

onMounted(() => {
  ellipsisContent.value = contentText.value;
  if (!props.ellipsis) return;
  scheduleEllipsisUpdate();
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    resizeObserver = new ResizeObserver(scheduleEllipsisUpdate);
    resizeObserver.observe(root.value);
    if (root.value.parentElement) resizeObserver.observe(root.value.parentElement);
  }
});

// Wrapping or unwrapping the text can replace its DOM node; observe the current root.
watch(root, (element) => {
  resizeObserver?.disconnect();
  if (element && resizeObserver) {
    resizeObserver.observe(element);
    if (element.parentElement) resizeObserver.observe(element.parentElement);
  }
});

onUpdated(() => {
  if (
    props.ellipsis &&
    (contentText.value !== lastMeasuredContent || measurementKey.value !== lastMeasurementKey)
  ) {
    expanded.value = false;
    scheduleEllipsisUpdate();
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (animationFrame !== undefined && typeof window !== 'undefined') {
    window.cancelAnimationFrame(animationFrame);
  }
});
</script>

<template>
  <TypographyTooltip
    :enabled="tooltipEnabled"
    :options="tooltipOptions"
    :content="contentNodes"
    :text="contentText"
  >
    <component
      :is="component"
      ref="root"
      v-bind="rootAttrs"
      :class="rootClasses"
      :style="rootStyle"
    >
      <TypographyDecorations
        :mark="mark"
        :code="code"
        :underline="underline"
        :strong="strong"
        :delete="props.delete"
        :disabled="disabled"
        :link="link"
      >
        <span v-if="iconContent" class="semi-typography-icon" x-semi-prop="icon">
          <TypographyNodeRenderer :content="iconContent" />
        </span>
        <span v-if="link" :class="linkClasses">
          <span v-if="ellipsis" @mouseenter="onContentMouseenter">
            <template v-if="expanded || !isTruncated">
              <TypographyNodeRenderer :content="contentNodes" />{{ ellipsisOptions.suffix }}
            </template>
            <template v-else>{{ ellipsisContent }}{{ ellipsisOptions.suffix }}</template>
          </span>
          <TypographyNodeRenderer v-else :content="contentNodes" />
        </span>
        <template v-else>
          <span v-if="ellipsis" @mouseenter="onContentMouseenter">
            <template v-if="expanded || !isTruncated">
              <TypographyNodeRenderer :content="contentNodes" />{{ ellipsisOptions.suffix }}
            </template>
            <template v-else>{{ ellipsisContent }}{{ ellipsisOptions.suffix }}</template>
          </span>
          <TypographyNodeRenderer v-else :content="contentNodes" />
        </template>
      </TypographyDecorations>

      <a
        v-if="hasExpandOperation"
        ref="expandElement"
        role="button"
        tabindex="0"
        class="semi-typography-ellipsis-expand"
        :aria-label="expandLabel"
        @click="toggleExpanded"
        @keydown="onExpandKeydown"
        >{{ expandLabel }}</a
      >

      <TypographyCopyable
        v-if="copyConfig"
        ref="copyElement"
        :config="copyConfig"
        :content="copyContent"
        @copy="(...arguments_) => emit('copy', ...arguments_)"
      >
        <template v-if="$slots.copyIcon" #icon="slotProps">
          <slot name="copyIcon" v-bind="slotProps" />
        </template>
        <template v-if="$slots.copied" #copied><slot name="copied" /></template>
      </TypographyCopyable>
    </component>
    <template v-if="slots.tooltip" #tooltip="slotProps"
      ><slot name="tooltip" v-bind="slotProps"
    /></template>
  </TypographyTooltip>
</template>
