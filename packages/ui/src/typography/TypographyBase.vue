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

import { getTypographySignature, observeThemeChanges } from '../_utils/theme-scope';

import { useRenderComputed } from '../_utils';
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
// 记录实际排版，避免固定宽度下的主题变化遗漏省略重算。
let lastTypographySignature = '';
// 根节点替换和卸载时释放共享主题观察订阅。
let stopThemeObservation: (() => void) | undefined;

const contentNodes = useRenderComputed<VNodeChild[]>(
  () => props.content ?? slots.default?.() ?? [],
);
const contentText = useRenderComputed(() => getTypographyText(contentNodes.value));
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
const copyContent = useRenderComputed(() => copyConfig.value?.content ?? contentText.value);
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
const iconContent = useRenderComputed<VNodeChild>(() => {
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

/** DOM 更新后，按当前排版重新计算 CSS 溢出状态或 JS 截断结果。 */
async function updateEllipsis(): Promise<void> {
  await nextTick();
  // 根节点可能因 Tooltip 包装发生替换，始终取本次实际元素。
  const element = root.value;
  if (!props.ellipsis || !element || expanded.value) return;
  lastMeasuredContent = contentText.value;
  lastMeasurementKey = measurementKey.value;
  lastTypographySignature = getTypographySignature(element);
  if (canUseCssEllipsis.value) {
    isOverflowed.value = shouldTruncate();
    isTruncated.value = false;
    return;
  }
  // 展开、复制入口占据的宽度也参与截断测量。
  const fixedNodes: Node[] = [];
  if (expandElement.value) fixedNodes.push(expandElement.value);
  // 复制组件的真实根节点会被克隆到测量容器。
  const copyRoot = copyElement.value?.$el as Node | undefined;
  if (copyRoot) fixedNodes.push(copyRoot);
  // 使用真实字号、行高及装饰字重得到可展示的文本。
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

/** 合并同一帧的布局失效，避免主题更新重复执行同步测量。 */
function scheduleEllipsisUpdate(): void {
  if (typeof window === 'undefined') return;
  if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
  // 浏览器完成本帧样式更新后再读取布局。
  animationFrame = window.requestAnimationFrame(() => {
    animationFrame = undefined;
    void updateEllipsis();
  });
}

/** 为当前根节点绑定尺寸与主题观察，支持运行时开启省略。 */
function observeTypographyLayout(): void {
  resizeObserver?.disconnect();
  stopThemeObservation?.();
  stopThemeObservation = undefined;
  // 未开启省略时不订阅全局字体及样式变化。
  const element = root.value;
  if (!element || !props.ellipsis) return;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver ??= new ResizeObserver(scheduleEllipsisUpdate);
    resizeObserver.observe(element);
    if (element.parentElement) resizeObserver.observe(element.parentElement);
  }
  // 字体加载可能保持相同的 CSS 字体名，仍必须强制重算字形宽度。
  stopThemeObservation = observeThemeChanges(element, (reason) => {
    if (reason !== 'attributes' || getTypographySignature(element) !== lastTypographySignature) {
      scheduleEllipsisUpdate();
    }
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

// 挂载后才访问排版和布局，SSR 保持无 DOM。
onMounted(() => {
  ellipsisContent.value = contentText.value;
  if (!props.ellipsis) return;
  observeTypographyLayout();
  scheduleEllipsisUpdate();
});

// Tooltip 包装会替换根节点，省略配置也可以在挂载后开启或关闭。
watch(
  // 只在根节点或省略开关改变时重建订阅。
  [root, () => Boolean(props.ellipsis)],
  // 订阅新根后调度一次实际布局测量。
  () => {
    observeTypographyLayout();
    if (props.ellipsis) scheduleEllipsisUpdate();
  },
  { flush: 'post' },
);

// 内容与配置变化沿用原有收起行为，纯排版变化保留用户展开状态。
onUpdated(() => {
  if (
    props.ellipsis &&
    (contentText.value !== lastMeasuredContent || measurementKey.value !== lastMeasurementKey)
  ) {
    expanded.value = false;
    scheduleEllipsisUpdate();
  } else if (
    props.ellipsis &&
    root.value &&
    getTypographySignature(root.value) !== lastTypographySignature
  ) {
    scheduleEllipsisUpdate();
  }
});

// 清理元素观察和未执行的帧回调，避免卸载后继续读取布局。
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  stopThemeObservation?.();
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
