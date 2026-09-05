<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text,
  computed,
  h,
  isVNode,
  nextTick,
  renderSlot,
  shallowRef,
  useSlots,
  watch,
  type ComponentPublicInstance,
  type CSSProperties,
  type StyleValue,
  type VNode,
  type VNodeChild,
} from 'vue';

import TooltipArrow from './TooltipArrow.vue';
import TooltipNodeRenderer from './TooltipNodeRenderer';
import type { TooltipInitialFocusRef, TooltipPosition, TooltipState } from './types';

const props = defineProps<{
  clickToHide: boolean;
  content?: VNodeChild;
  direction: 'ltr' | 'rtl';
  initialFocusRef: TooltipInitialFocusRef;
  motion: boolean;
  popupClass?: unknown;
  popupStyle?: StyleValue;
  portalTarget: HTMLElement;
  prefixCls: string;
  role: string;
  showArrow: boolean | VNodeChild;
  state: TooltipState;
  stopPropagation: boolean;
}>();
const emit = defineEmits<{
  animationEnd: [state: 'enter' | 'leave'];
  animationStart: [state: 'enter' | 'leave'];
  hide: [];
  keydown: [event: KeyboardEvent];
  portalElement: [element: HTMLDivElement | null];
}>();
defineSlots<{
  arrow?: () => VNodeChild;
  content?: (props: { initialFocusRef: TooltipInitialFocusRef }) => VNodeChild;
}>();
const slots = useSlots();
const animationFinished = shallowRef(false);

// Keep the fallback as a named source function. The template-generated callback
// receives inconsistent V8 source ranges across workers when the slot overrides it.
function renderContentFallback(): VNode[] {
  return [h(TooltipNodeRenderer, { content: props.content })];
}

function ContentRenderer(): VNode {
  return renderSlot(
    slots,
    'content',
    { initialFocusRef: props.initialFocusRef },
    renderContentFallback,
  );
}

const transitionClass = computed(() => {
  if (
    animationFinished.value ||
    !props.motion ||
    !props.state.isPositionUpdated ||
    !props.state.transitionState
  )
    return undefined;
  return `${props.prefixCls}-animation-${props.state.transitionState === 'enter' ? 'show' : 'hide'}`;
});
const wrapperClasses = computed(() => [
  props.popupClass,
  `${props.prefixCls}-wrapper`,
  props.state.visible ? `${props.prefixCls}-wrapper-show` : undefined,
  props.showArrow ? `${props.prefixCls}-with-arrow` : undefined,
  props.direction === 'rtl' ? `${props.prefixCls}-rtl` : undefined,
  transitionClass.value,
]);
const portalInnerStyle = computed<CSSProperties>(() => {
  const style = { ...props.state.containerStyle } as CSSProperties;
  if (props.motion) delete style.transformOrigin;
  if (typeof style.left === 'number') style.left = `${style.left}px`;
  if (typeof style.top === 'number') style.top = `${style.top}px`;
  return style;
});
const wrapperArrowStyle = computed<CSSProperties>(() => ({
  ...(props.state.containerStyle['--semi-tooltip-arrow-offset-x']
    ? {
        '--semi-tooltip-arrow-offset-x':
          props.state.containerStyle['--semi-tooltip-arrow-offset-x'],
      }
    : {}),
  ...(props.state.containerStyle['--semi-tooltip-arrow-offset-y']
    ? {
        '--semi-tooltip-arrow-offset-y':
          props.state.containerStyle['--semi-tooltip-arrow-offset-y'],
      }
    : {}),
}));
const wrapperStyle = computed<StyleValue>(() => {
  const popupObject =
    props.popupStyle && typeof props.popupStyle === 'object' && !Array.isArray(props.popupStyle)
      ? (props.popupStyle as CSSProperties)
      : undefined;
  const userOpacity = popupObject?.opacity;
  return [
    props.motion && props.state.isPositionUpdated ? { animationFillMode: 'forwards' } : {},
    props.state.displayNone ? { display: 'none' } : {},
    { transformOrigin: props.state.containerStyle.transformOrigin },
    props.popupStyle,
    wrapperArrowStyle.value,
    userOpacity ? { opacity: props.state.isPositionUpdated ? userOpacity : '0' } : {},
  ];
});
const backgroundColor = computed(() => {
  if (
    !props.popupStyle ||
    typeof props.popupStyle !== 'object' ||
    Array.isArray(props.popupStyle)
  ) {
    return undefined;
  }
  return (props.popupStyle as CSSProperties).backgroundColor as string | undefined;
});
const usesCustomArrow = computed(
  () => typeof props.showArrow !== 'boolean' && props.showArrow !== undefined,
);

function collectRenderableNodes(nodes: VNodeChild[]): VNode[] {
  const result: VNode[] = [];
  const visit = (node: VNodeChild): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!isVNode(node) || node.type === Comment) return;
    if (node.type === Text && String(node.children ?? '').trim() === '') return;
    if (node.type === Fragment && Array.isArray(node.children)) {
      node.children.forEach((child) => visit(child as VNodeChild));
      return;
    }
    result.push(node);
  };
  nodes.forEach(visit);
  return result;
}

const customArrowNodes = computed(() =>
  collectRenderableNodes((slots.arrow?.() ?? []) as VNodeChild[]),
);

function setPortalElement(element: Element | ComponentPublicInstance | null): void {
  emit('portalElement', element instanceof HTMLDivElement ? element : null);
}

function stopIfNeeded(event: Event): void {
  if (props.stopPropagation) event.stopPropagation();
}

function handleClick(event: MouseEvent): void {
  if (props.clickToHide) emit('hide');
  stopIfNeeded(event);
}

function handleAnimationStart(): void {
  if (props.state.transitionState) emit('animationStart', props.state.transitionState);
}

function handleAnimationEnd(): void {
  // Match the pinned CSSAnimation adapter: release the completed animation's
  // transform so the portal returns to its normal text rasterization layer.
  animationFinished.value = true;
  if (props.state.transitionState) emit('animationEnd', props.state.transitionState);
}

watch(
  () => [props.state.transitionState, props.motion, props.state.isPositionUpdated] as const,
  ([state, motion, positioned], previous) => {
    animationFinished.value = false;
    if (!state) return;
    const changed =
      !previous || previous[0] !== state || previous[1] !== motion || previous[2] !== positioned;
    if (!changed || (motion && positioned)) return;
    void nextTick(() => {
      emit('animationStart', state);
      emit('animationEnd', state);
    });
  },
  { immediate: true },
);
</script>

<template>
  <Teleport :to="portalTarget">
    <div
      :ref="setPortalElement"
      tabindex="-1"
      class="semi-portal-inner"
      :style="portalInnerStyle"
      @click="handleClick"
      @focus="stopIfNeeded"
      @blur="stopIfNeeded"
      @mousedown="stopIfNeeded"
      @keydown="emit('keydown', $event)"
    >
      <div
        v-bind="state.portalEventSet"
        :id="state.id"
        :class="wrapperClasses"
        :style="wrapperStyle"
        :role="role"
        :x-placement="state.placement"
        @animationstart.self="handleAnimationStart"
        @animationend.self="handleAnimationEnd"
      >
        <div :class="`${prefixCls}-content`">
          <ContentRenderer />
        </div>
        <template v-if="showArrow">
          <TooltipNodeRenderer v-if="customArrowNodes.length" :content="customArrowNodes" />
          <TooltipNodeRenderer v-else-if="usesCustomArrow" :content="showArrow" />
          <TooltipArrow
            v-else
            :background-color="backgroundColor"
            :placement="state.placement as TooltipPosition"
            :prefix-cls="prefixCls"
          />
        </template>
      </div>
    </div>
  </Teleport>
</template>
