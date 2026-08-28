<script setup lang="ts">
import { DropdownFoundation, type DropdownAdapter } from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  provide,
  shallowRef,
  useTemplateRef,
  useId,
  watch,
} from 'vue';

import { semiGlobal } from '../config-provider';
import Tooltip from '../tooltip/Tooltip.vue';
import type { TooltipExposed, TooltipProps } from '../tooltip';
import { dropdownContextKey } from './dropdown-context';
import DropdownDivider from './DropdownDivider.vue';
import DropdownItem from './DropdownItem.vue';
import DropdownMenu from './DropdownMenu.vue';
import DropdownNodeRenderer from './DropdownNodeRenderer';
import DropdownTitle from './DropdownTitle.vue';
import DropdownTriggerRenderer from './DropdownTriggerRenderer';
import type {
  DropdownEmits,
  DropdownExposed,
  DropdownMenuItem,
  DropdownProps,
  DropdownSlots,
  TooltipSpacing,
  TooltipTrigger,
} from './types';

defineOptions({ name: 'Dropdown', inheritAttrs: false });
const props = defineProps<DropdownProps>();
const emit = defineEmits<DropdownEmits>();
const slots = defineSlots<DropdownSlots>();
const instance = getCurrentInstance();
const parentContext = inject(dropdownContextKey, undefined);
const tooltipRef = useTemplateRef<TooltipExposed>('tooltip');
const triggerElement = shallowRef<HTMLElement | null>(null);
const popVisible = shallowRef(Boolean(props.visible));
const generatedPopupId = `semi-dropdown-${useId()}`;
const pendingNotification = shallowRef<boolean | undefined>(undefined);
let enterTimer: ReturnType<typeof setTimeout> | undefined;
let leaveTimer: ReturnType<typeof setTimeout> | undefined;
let restoreFocusAfterClose = false;

function hasRawProp(key: keyof DropdownProps): boolean {
  const kebabKey = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  const rawProps = instance?.vnode.props;
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, key) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabKey)),
  );
}

function resolveProp<Key extends keyof DropdownProps>(
  key: Key,
  fallback: NonNullable<DropdownProps[Key]>,
): NonNullable<DropdownProps[Key]> {
  if (hasRawProp(key) && props[key] !== undefined) {
    return props[key] as NonNullable<DropdownProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.Dropdown?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<DropdownProps[Key]>;
}

function resolveOptional<Key extends keyof DropdownProps>(key: Key): DropdownProps[Key] {
  if (hasRawProp(key)) return props[key] as DropdownProps[Key];
  const globalValue = semiGlobal.config.overrideDefaultProps?.Dropdown?.[key];
  return (globalValue === undefined ? props[key] : globalValue) as DropdownProps[Key];
}

const runtimeTrigger = computed(() => resolveProp('trigger', 'hover'));
const runtimeShowTick = computed(() => resolveProp('showTick', false));
const runtimePrefixCls = computed(() => resolveProp('prefixCls', 'semi-dropdown'));
const runtimeVisible = computed(() =>
  hasRawProp('visible') ? Boolean(props.visible) : popVisible.value,
);
const runtimePopupId = computed(() => resolveOptional('wrapperId') ?? generatedPopupId);
const runtimeSpacing = computed<number | TooltipSpacing>(() => {
  const explicit = resolveOptional('spacing');
  if (explicit !== undefined) return explicit;
  return (parentContext?.level ?? 0) > 0 ? 2 : 4;
});

provide(dropdownContextKey, {
  level: (parentContext?.level ?? 0) + 1,
  showTick: runtimeShowTick,
  trigger: runtimeTrigger as ReturnType<typeof computed<TooltipTrigger>>,
});

interface FoundationProps {
  trigger: TooltipTrigger;
}
interface FoundationState {
  visible: boolean;
}

const adapter: DropdownAdapter<FoundationProps, FoundationState> = {
  getPopupId: () => tooltipRef.value?.getPopupId() ?? '',
  getProps: () => ({ trigger: runtimeTrigger.value }),
  getStates: () => ({ visible: runtimeVisible.value }),
  notifyVisibleChange: (visible) => {
    if (pendingNotification.value === visible) {
      pendingNotification.value = undefined;
      return;
    }
    emit('visibleChange', visible);
    emit('update:visible', visible);
  },
  setPopVisible: (visible) => {
    popVisible.value = visible;
  },
};
const foundation = markRaw(new DropdownFoundation(adapter));

const tooltipBindings = computed<TooltipProps>(() => {
  const bindings: TooltipProps = {
    closeOnEsc: false,
    motion: resolveProp('motion', true),
    mouseEnterDelay: resolveProp('mouseEnterDelay', 50),
    mouseLeaveDelay: resolveProp('mouseLeaveDelay', 100),
    position: resolveProp('position', 'bottom'),
    prefixCls: runtimePrefixCls.value,
    returnFocusOnClose: resolveProp('returnFocusOnClose', true),
    role: resolveProp('role', 'tooltip'),
    showArrow: resolveProp('showArrow', false),
    spacing: runtimeSpacing.value,
    trigger: 'custom',
    visible: runtimeVisible.value,
    zIndex: resolveProp('zIndex', 1060),
  };
  const optional = {
    arrowBounding: resolveOptional('arrowBounding'),
    arrowPointAtCenter: resolveOptional('arrowPointAtCenter'),
    autoAdjustOverflow: resolveOptional('autoAdjustOverflow'),
    class: props.class,
    clickToHide: resolveOptional('clickToHide'),
    clickTriggerToHide: resolveOptional('clickTriggerToHide'),
    condition: resolveOptional('condition'),
    disableArrowKeyDown: resolveOptional('disableArrowKeyDown'),
    disableFocusListener: resolveOptional('disableFocusListener'),
    getPopupContainer: resolveOptional('getPopupContainer'),
    guardFocus: resolveOptional('guardFocus'),
    keepDOM: resolveOptional('keepDOM'),
    margin: resolveOptional('margin'),
    preventScroll: resolveOptional('preventScroll'),
    rePosKey: resolveOptional('rePosKey'),
    stopPropagation: resolveOptional('stopPropagation'),
    transformFromCenter: resolveOptional('transformFromCenter'),
    wrapWhenSpecial: resolveOptional('wrapWhenSpecial'),
    wrapperId: runtimePopupId.value,
  };
  for (const [key, value] of Object.entries(optional)) {
    if (value !== undefined) (bindings as Record<string, unknown>)[key] = value;
  }
  return bindings;
});

watch(
  () => props.visible,
  (visible) => {
    if (hasRawProp('visible')) popVisible.value = Boolean(visible);
  },
);

function handleVisibleChange(visible: boolean): void {
  foundation.handleVisibleChange(visible);
  if (visible && runtimeTrigger.value === 'click') {
    void nextTick(() => {
      const id = tooltipRef.value?.getPopupId();
      if (id) foundation.setFocusToFirstMenuItem(id);
    });
  } else if (
    !visible &&
    runtimeTrigger.value !== 'custom' &&
    resolveProp('returnFocusOnClose', true)
  ) {
    restoreFocusAfterClose = true;
    resolveCurrentTrigger()?.focus();
  }
}

function handleTriggerKeydown(event: KeyboardEvent): void {
  rememberTrigger(event);
  if (event.key === 'Escape' && runtimeVisible.value && resolveProp('closeOnEsc', true)) {
    emit('escKeydown', event);
    requestVisible(false);
    return;
  }
  foundation.handleKeyDown(event);
}

function clearEnterTimer(): void {
  if (enterTimer) clearTimeout(enterTimer);
  enterTimer = undefined;
}

function clearLeaveTimer(): void {
  if (leaveTimer) clearTimeout(leaveTimer);
  leaveTimer = undefined;
}

function requestVisible(visible: boolean): void {
  if (runtimeVisible.value === visible) return;
  popVisible.value = visible;
  pendingNotification.value = visible;
  emit('visibleChange', visible);
  emit('update:visible', visible);
}

function delayVisible(visible: boolean): void {
  if (visible) {
    clearLeaveTimer();
    clearEnterTimer();
    enterTimer = setTimeout(() => requestVisible(true), resolveProp('mouseEnterDelay', 50));
  } else {
    clearEnterTimer();
    clearLeaveTimer();
    leaveTimer = setTimeout(() => requestVisible(false), resolveProp('mouseLeaveDelay', 100));
  }
}

const triggerEventSet = computed<
  Record<string, (event: MouseEvent | FocusEvent | KeyboardEvent) => void>
>(() => {
  const events: Record<string, (event: MouseEvent | FocusEvent | KeyboardEvent) => void> = {
    onKeydown: (event) => handleTriggerKeydown(event as KeyboardEvent),
  };
  if (runtimeTrigger.value === 'click') {
    events.onClick = (event) => {
      rememberTrigger(event);
      requestVisible(!runtimeVisible.value);
    };
  } else if (runtimeTrigger.value === 'hover') {
    events.onMouseenter = (event) => {
      rememberTrigger(event);
      delayVisible(true);
    };
    events.onMouseleave = () => delayVisible(false);
  } else if (runtimeTrigger.value === 'focus') {
    events.onFocus = (event) => {
      rememberTrigger(event);
      delayVisible(true);
    };
    events.onBlur = () => delayVisible(false);
  } else if (runtimeTrigger.value === 'contextMenu') {
    events.onContextmenu = (event) => {
      rememberTrigger(event);
      event.preventDefault();
      requestVisible(true);
    };
  }
  return events;
});

function handlePopupEnter(): void {
  if (runtimeTrigger.value === 'hover' || runtimeTrigger.value === 'focus') clearLeaveTimer();
}

function handlePopupLeave(): void {
  if (runtimeTrigger.value === 'hover' || runtimeTrigger.value === 'focus') delayVisible(false);
}

function handlePopupKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !resolveProp('closeOnEsc', true)) return;
  emit('escKeydown', event);
  requestVisible(false);
  if (resolveProp('returnFocusOnClose', true)) {
    restoreFocusAfterClose = true;
    resolveCurrentTrigger()?.focus();
  }
}

function handleAfterClose(): void {
  if (restoreFocusAfterClose) {
    restoreFocusAfterClose = false;
    resolveCurrentTrigger()?.focus();
  }
  emit('afterClose');
}

function handleClickOutside(event: MouseEvent): void {
  const trigger = runtimeTrigger.value;
  const clickTriggerToHide = Boolean(resolveOptional('clickTriggerToHide'));
  if (
    trigger === 'click' ||
    trigger === 'contextMenu' ||
    trigger === 'custom' ||
    clickTriggerToHide
  ) {
    emit('clickOutside', event);
  }
  if (trigger === 'click' || trigger === 'contextMenu' || clickTriggerToHide) {
    requestVisible(false);
  }
}

function menuItemKey(item: DropdownMenuItem, index: number): string | number {
  return item.key ?? `${item.node}-${index}`;
}

function menuItemBindings(item: DropdownMenuItem): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(item).filter(([key]) => !['key', 'name', 'node'].includes(key)),
  );
}

function focusTrigger(): void {
  resolveCurrentTrigger()?.focus();
}

function resolveCurrentTrigger(): HTMLElement | null {
  if (typeof document === 'undefined') return triggerElement.value;
  return (
    document.querySelector<HTMLElement>(`[data-popupid="${runtimePopupId.value}"]`) ??
    triggerElement.value
  );
}

function rememberTrigger(event: Event): void {
  if (event.currentTarget instanceof HTMLElement) triggerElement.value = event.currentTarget;
}

function setTriggerElement(element: HTMLElement | null): void {
  if (element) triggerElement.value = element;
}

function getPopupId(): string | undefined {
  return tooltipRef.value?.getPopupId() ?? runtimePopupId.value;
}

function rePosition(): Record<string, unknown> {
  return tooltipRef.value?.rePosition() ?? {};
}

defineExpose<DropdownExposed>({ focusTrigger, getPopupId, rePosition });

onBeforeUnmount(() => {
  clearEnterTimer();
  clearLeaveTimer();
});
</script>

<template>
  <Tooltip
    ref="tooltip"
    v-bind="tooltipBindings"
    @after-close="handleAfterClose"
    @click-outside="handleClickOutside"
    @esc-keydown="emit('escKeydown', $event)"
    @visible-change="handleVisibleChange"
  >
    <template #content>
      <div
        :class="[runtimePrefixCls, props.contentClassName]"
        :style="props.style"
        @mouseenter="handlePopupEnter"
        @mouseleave="handlePopupLeave"
        @keydown.capture="handlePopupKeydown"
      >
        <div :class="`${runtimePrefixCls}-content`" x-semi-prop="render">
          <slot v-if="slots.content" name="content" />
          <DropdownNodeRenderer v-else-if="props.render" :content="props.render" />
          <DropdownMenu v-else-if="Array.isArray(props.menu)">
            <template v-for="(item, index) in props.menu" :key="menuItemKey(item, index)">
              <DropdownTitle v-if="item.node === 'title'" v-bind="menuItemBindings(item)">
                <DropdownNodeRenderer :content="item.name" />
              </DropdownTitle>
              <DropdownItem v-else-if="item.node === 'item'" v-bind="menuItemBindings(item)">
                <DropdownNodeRenderer :content="item.name" />
              </DropdownItem>
              <DropdownDivider v-else v-bind="menuItemBindings(item)" />
            </template>
          </DropdownMenu>
        </div>
      </div>
    </template>

    <DropdownTriggerRenderer
      :event-set="triggerEventSet"
      :popup-id="runtimePopupId"
      :prefix-cls="runtimePrefixCls"
      :set-trigger-element="setTriggerElement"
      :visible="runtimeVisible"
    >
      <slot />
    </DropdownTriggerRenderer>
  </Tooltip>
</template>
