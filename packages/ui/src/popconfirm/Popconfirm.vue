<script setup lang="ts">
import {
  PopconfirmFoundation,
  popconfirmCssClasses,
  popconfirmNumbers,
  type PopconfirmAdapter,
} from '@workspace/foundation-integration';
import { IconAlertTriangle, IconClose } from '@aifuxi/semi-icons-vue';
import {
  computed,
  getCurrentInstance,
  inject,
  isVNode,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useSlots,
  useTemplateRef,
  type VNodeChild,
} from 'vue';

import Button from '../button/Button.vue';
import { configContextKey, DEFAULT_CONFIG_LOCALE, semiGlobal } from '../config-provider';
import { Popover, type PopoverExposed, type PopoverProps } from '../popover';

import PopconfirmNodeRenderer from './PopconfirmNodeRenderer';
import type {
  PopconfirmActionResult,
  PopconfirmButtonProps,
  PopconfirmEmits,
  PopconfirmLocale,
  PopconfirmProps,
  PopconfirmSlots,
} from './types';

defineOptions({ name: 'Popconfirm', inheritAttrs: false });
const props = defineProps<PopconfirmProps>();
const emit = defineEmits<PopconfirmEmits>();
defineSlots<PopconfirmSlots>();
const slots = useSlots();
const instance = getCurrentInstance();
const popoverRef = useTemplateRef<PopoverExposed>('popover');
const footerRef = useTemplateRef<HTMLDivElement>('footer');
const injectedConfig = inject(configContextKey, undefined);
const cache = new Map<string, unknown>();

interface PopconfirmState {
  cancelLoading: boolean;
  confirmLoading: boolean;
  visible: boolean;
}

const state = shallowReactive<PopconfirmState>({
  cancelLoading: false,
  confirmLoading: false,
  visible: props.defaultVisible || false,
});

function hasExplicitProp(key: keyof PopconfirmProps): boolean {
  const rawProps = instance?.vnode.props;
  const kebabKey = String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    rawProps &&
    (Object.prototype.hasOwnProperty.call(rawProps, key) ||
      Object.prototype.hasOwnProperty.call(rawProps, kebabKey)),
  );
}

function resolveProp<Key extends keyof PopconfirmProps>(
  key: Key,
  fallback: NonNullable<PopconfirmProps[Key]>,
): NonNullable<PopconfirmProps[Key]> {
  if (hasExplicitProp(key) && props[key] !== undefined) {
    return props[key] as NonNullable<PopconfirmProps[Key]>;
  }
  const globalValue = semiGlobal.config.overrideDefaultProps?.Popconfirm?.[key];
  return (globalValue === undefined ? fallback : globalValue) as NonNullable<PopconfirmProps[Key]>;
}

const config = computed(() =>
  injectedConfig
    ? injectedConfig.value
    : {
        direction: 'ltr' as const,
        locale: DEFAULT_CONFIG_LOCALE,
        getPopupContainer: undefined,
      },
);
const prefixCls = computed(() => resolveProp('prefixCls', popconfirmCssClasses.PREFIX));
const disabled = computed(() => resolveProp('disabled', false));
const showCloseIcon = computed(() => resolveProp('showCloseIcon', true));
const position = computed(() =>
  resolveProp('position', config.value.direction === 'rtl' ? 'bottomRight' : 'bottomLeft'),
);
const trigger = computed(() =>
  hasExplicitProp('visible') ? 'custom' : resolveProp('trigger', 'click'),
);
const visible = computed(() =>
  hasExplicitProp('visible') ? Boolean(props.visible) : state.visible,
);
const locale = computed<PopconfirmLocale>(() => {
  const configured = config.value.locale.Popconfirm as PopconfirmLocale | undefined;
  return configured ?? { cancel: '取消', confirm: '确定' };
});
const titleContent = computed<VNodeChild>(() => slots.title?.() ?? props.title);
const contentValue = computed<VNodeChild>(() => props.content);
const iconContent = computed<VNodeChild>(() => slots.icon?.() ?? props.icon);
const usesDefaultIcon = computed(() => !slots.icon && !hasExplicitProp('icon'));
const hasIcon = computed(() => {
  if (usesDefaultIcon.value) return true;
  const content = iconContent.value;
  if (Array.isArray(content)) return content.some((node) => isVNode(node));
  return isVNode(content);
});
const showTitle = computed(() => titleContent.value !== null && titleContent.value !== undefined);
const showContent = computed(
  () => Boolean(slots.content) || (contentValue.value !== null && contentValue.value !== undefined),
);
const rootClasses = computed(() => [
  prefixCls.value,
  props.class,
  props.className,
  { [`${prefixCls.value}-rtl`]: config.value.direction === 'rtl' },
]);
const bodyClasses = computed(() => [
  `${prefixCls.value}-body`,
  { [`${prefixCls.value}-body-withIcon`]: hasIcon.value },
]);

function getListener(name: 'onCancel' | 'onConfirm'): unknown {
  return instance?.vnode.props?.[name];
}

function invokeActionListeners(
  name: 'onCancel' | 'onConfirm',
  event: MouseEvent,
): PopconfirmActionResult {
  const listener = getListener(name);
  const listeners = Array.isArray(listener) ? listener : listener ? [listener] : [];
  const results = listeners
    .filter(
      (candidate): candidate is (event: MouseEvent) => unknown => typeof candidate === 'function',
    )
    .map((candidate) => candidate(event));
  const promises = results.filter((result): result is PromiseLike<unknown> =>
    Boolean(result && typeof (result as PromiseLike<unknown>).then === 'function'),
  );
  return promises.length > 0 ? Promise.all(promises) : undefined;
}

function getFoundationProps(): PopconfirmProps {
  const foundationProps = { ...props } as PopconfirmProps;
  if (!hasExplicitProp('visible')) delete foundationProps.visible;
  return foundationProps;
}

const adapter: PopconfirmAdapter<PopconfirmProps, PopconfirmState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key],
  getProps: getFoundationProps,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(String(key), value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  setVisible: (nextVisible) => {
    state.visible = nextVisible;
  },
  updateConfirmLoading: (loading) => {
    state.confirmLoading = loading;
  },
  updateCancelLoading: (loading) => {
    state.cancelLoading = loading;
  },
  notifyConfirm: (event) => invokeActionListeners('onConfirm', event),
  notifyCancel: (event) => invokeActionListeners('onCancel', event),
  notifyVisibleChange: (nextVisible) => {
    emit('visibleChange', nextVisible);
    emit('update:visible', nextVisible);
  },
  notifyClickOutSide: (event) => emit('clickOutside', event),
  focusCancelButton: () => {
    void nextTick(() =>
      footerRef.value
        ?.querySelector<HTMLElement>('[data-type=cancel]')
        ?.focus({ preventScroll: true }),
    );
  },
  focusOkButton: () => {
    void nextTick(() =>
      footerRef.value?.querySelector<HTMLElement>('[data-type=ok]')?.focus({ preventScroll: true }),
    );
  },
  focusPrevFocusElement: () => popoverRef.value?.focusTrigger(),
};
const foundation = markRaw(new PopconfirmFoundation<PopconfirmProps, PopconfirmState>(adapter));

function actionButtonBindings(
  kind: 'cancel' | 'ok',
  buttonProps: PopconfirmButtonProps | undefined,
): Record<string, unknown> {
  const overrides = { ...buttonProps };
  delete overrides.autoFocus;
  const defaults =
    kind === 'cancel'
      ? {
          'data-type': 'cancel',
          loading: state.cancelLoading,
          onClick: (event: MouseEvent) => foundation.handleCancel(event),
          type: resolveProp('cancelType', 'tertiary'),
        }
      : {
          'data-type': 'ok',
          loading: state.confirmLoading,
          onClick: (event: MouseEvent) => foundation.handleConfirm(event),
          theme: 'solid',
          type: resolveProp('okType', 'primary'),
        };
  return { ...defaults, ...overrides };
}

const cancelBindings = computed(() => actionButtonBindings('cancel', props.cancelButtonProps));
const okBindings = computed(() => actionButtonBindings('ok', props.okButtonProps));
const forwardedPopoverProps = computed<PopoverProps>(() => {
  const excluded = new Set([
    'cancelButtonProps',
    'cancelText',
    'cancelType',
    'class',
    'className',
    'content',
    'defaultVisible',
    'disabled',
    'icon',
    'okButtonProps',
    'okText',
    'okType',
    'position',
    'prefixCls',
    'showCloseIcon',
    'style',
    'title',
    'trigger',
    'visible',
    'zIndex',
  ]);
  return Object.fromEntries(
    Object.entries(props).filter(
      ([key, value]) =>
        !excluded.has(key) && value !== undefined && hasExplicitProp(key as keyof PopconfirmProps),
    ),
  ) as PopoverProps;
});

function stopImmediatePropagation(event: MouseEvent): void {
  event.stopImmediatePropagation();
}

function handleCancel(event: MouseEvent): void {
  foundation.handleCancel(event);
}

function handleClickOutside(event: MouseEvent): void {
  foundation.handleClickOutSide(event);
}

function handleVisibleChange(nextVisible: boolean): void {
  if (nextVisible === visible.value) return;
  foundation.handleVisibleChange(nextVisible);
}

onMounted(() => foundation.init());
onBeforeUnmount(() => foundation.destroy());
</script>

<template>
  <slot v-if="disabled" />
  <Popover
    v-else
    ref="popover"
    v-bind="forwardedPopoverProps"
    :class-name="popconfirmCssClasses.POPOVER"
    :motion="resolveProp('motion', true)"
    :position="position"
    :show-arrow="resolveProp('showArrow', false)"
    :stop-propagation="resolveProp('stopPropagation', true)"
    :trigger="trigger"
    :visible="visible"
    :z-index="resolveProp('zIndex', popconfirmNumbers.DEFAULT_Z_INDEX)"
    @click-outside="handleClickOutside"
    @esc-keydown="emit('escKeydown', $event)"
    @update:visible="handleVisibleChange"
  >
    <template #content="{ initialFocusRef }">
      <div :class="rootClasses" :style="props.style" @click="stopImmediatePropagation">
        <div :class="`${prefixCls}-inner`">
          <div :class="`${prefixCls}-header`">
            <i v-if="hasIcon" :class="`${prefixCls}-header-icon`" x-semi-prop="icon">
              <IconAlertTriangle v-if="usesDefaultIcon" size="extra-large" />
              <PopconfirmNodeRenderer v-else :content="iconContent" />
            </i>
            <div :class="`${prefixCls}-header-body`">
              <div v-if="showTitle" :class="`${prefixCls}-header-title`" x-semi-prop="title">
                <PopconfirmNodeRenderer :content="titleContent" />
              </div>
            </div>
            <Button
              v-if="showCloseIcon"
              :class="`${prefixCls}-btn-close`"
              size="small"
              theme="borderless"
              :type="resolveProp('cancelType', 'tertiary')"
              @click="handleCancel"
            >
              <template #icon><IconClose /></template>
            </Button>
          </div>
          <div v-if="showContent" :class="bodyClasses" x-semi-prop="content">
            <slot v-if="$slots.content" name="content" :initial-focus-ref="initialFocusRef" />
            <PopconfirmNodeRenderer v-else :content="contentValue" />
          </div>
          <div ref="footer" :class="`${prefixCls}-footer`">
            <Button v-bind="cancelBindings">{{ props.cancelText || locale.cancel }}</Button>
            <Button v-bind="okBindings">{{ props.okText || locale.confirm }}</Button>
          </div>
        </div>
      </div>
    </template>
    <slot />
  </Popover>
</template>
