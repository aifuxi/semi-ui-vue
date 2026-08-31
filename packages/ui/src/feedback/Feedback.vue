<script setup lang="ts">
import { FeedbackFoundation, type FeedbackAdapter } from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  h,
  inject,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useAttrs,
  useSlots,
  type Component,
  type VNodeChild,
} from 'vue';

import Button from '../button/Button.vue';
import type { CheckboxValue } from '../checkbox';
import { configContextKey } from '../config-provider';
import { Modal } from '../modal';
import type { RadioChangeEvent } from '../radio';
import { SideSheet } from '../side-sheet';
import { localeContextKey } from '../locale/locale-context';
import zhCN from '../locale/source/zh_CN';

import FeedbackContent from './FeedbackContent.vue';
import FeedbackNodeRenderer from './FeedbackNodeRenderer';
import type {
  FeedbackActionResult,
  FeedbackEmits,
  FeedbackLocale,
  FeedbackProps,
  FeedbackSlots,
  FeedbackValue,
} from './types';

defineOptions({ name: 'Feedback', inheritAttrs: false });
const props = withDefaults(defineProps<FeedbackProps>(), {
  mode: 'popup',
  type: 'emoji',
});
const emit = defineEmits<FeedbackEmits>();
defineSlots<FeedbackSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const injectedConfig = inject(configContextKey, undefined);
const providedLocale = inject(
  localeContextKey,
  computed(() => zhCN),
);

interface FeedbackState {
  value: FeedbackValue;
  onOKReturnPromiseStatus: 'pending' | 'fulfilled' | 'rejected';
  onCancelReturnPromiseStatus: 'pending' | 'fulfilled' | 'rejected';
}

const state = shallowReactive<FeedbackState>({
  value: null,
  onOKReturnPromiseStatus: 'fulfilled',
  onCancelReturnPromiseStatus: 'fulfilled',
});
const cache = new Map<string, unknown>();

function rawHas(key: string): boolean {
  const raw = instance?.vnode.props;
  const kebabKey = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, key) ||
      Object.prototype.hasOwnProperty.call(raw, kebabKey)),
  );
}

function invokeAction(name: 'onCancel' | 'onOk', event: MouseEvent | KeyboardEvent) {
  const raw = instance?.vnode.props?.[name];
  const listeners = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const results = listeners
    .filter(
      (listener): listener is (event: MouseEvent | KeyboardEvent) => unknown =>
        typeof listener === 'function',
    )
    .map((listener) => listener(event));
  const promises = results.filter((result): result is PromiseLike<unknown> =>
    Boolean(result && typeof (result as PromiseLike<unknown>).then === 'function'),
  );
  return promises.length > 0 ? Promise.all(promises) : undefined;
}

const adapter: FeedbackAdapter<FeedbackProps, FeedbackState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => (props as unknown as Record<string, unknown>)[String(key)],
  getProps: () => props as unknown as FeedbackProps,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(String(key), value),
  stopPropagation: (event) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  setValue: (value) => {
    state.value = value as FeedbackValue;
  },
  notifyValueChange: (value) => {
    state.value = value as FeedbackValue;
    props.onValueChange?.(value as Exclude<FeedbackValue, null>);
  },
  notifyClose: () => props.afterClose?.(),
  notifyCancel: (event) => invokeAction('onCancel', event),
  notifyOk: (event) => invokeAction('onOk', event),
  notifyTextAreaChange: (value, event) => props.textAreaProps?.onChange?.(value, event as Event),
  notifyCheckBoxChange: (value) => props.checkboxGroupProps?.onChange?.(value),
  notifyRadioChange: (event) =>
    props.radioGroupProps?.onChange?.(
      event as Parameters<NonNullable<typeof props.radioGroupProps.onChange>>[0],
    ),
};
const foundation = markRaw(new FeedbackFoundation<FeedbackProps, FeedbackState>(adapter));

const locale = computed<FeedbackLocale>(() => {
  const candidate = injectedConfig?.value.locale ?? providedLocale.value;
  const configured = (candidate.code ? candidate : zhCN).Feedback as FeedbackLocale | undefined;
  return configured ?? { cancel: '取消', submit: '提交' };
});
const rootClasses = computed(() => [
  'semi-feedback',
  `semi-feedback-${props.type}`,
  props.class,
  attrs.class,
  props.className ? 'className' : undefined,
]);
const submitDisabled = computed(() => foundation.disableSubmitButton());

const feedbackSpecificKeys = new Set([
  'cancelButtonProps',
  'checkboxGroupProps',
  'class',
  'className',
  'mode',
  'okButtonProps',
  'onCancel',
  'onOk',
  'onValueChange',
  'radioGroupProps',
  'renderContent',
  'textAreaProps',
  'type',
]);

const forwardedBindings = computed<Record<string, unknown>>(() => {
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!feedbackSpecificKeys.has(key) && rawHas(key)) output[key] = value;
  }
  for (const [key, value] of Object.entries(attrs)) {
    if (!['class', 'style', 'onUpdate:visible'].includes(key)) output[key] = value;
  }
  if (rawHas('style') || attrs.style !== undefined) output.style = [props.style, attrs.style];
  return output;
});

const contentNode = computed<VNodeChild>(() =>
  h(
    FeedbackContent as Component,
    {
      type: props.type,
      value: state.value,
      ...(props.checkboxGroupProps ? { checkboxGroupProps: props.checkboxGroupProps } : {}),
      ...(props.radioGroupProps ? { radioGroupProps: props.radioGroupProps } : {}),
      ...(props.textAreaProps ? { textAreaProps: props.textAreaProps } : {}),
      onCheckboxChange: (value: CheckboxValue[]) => foundation.handleCheckboxChange(value),
      onEmojiClick: (event: MouseEvent) => foundation.handleEmojiClick(event),
      onEmojiReasonChange: (value: string, event: Event) =>
        foundation.handleEmojiReasonChange(value, event),
      onRadioChange: (event: RadioChangeEvent) => foundation.handleRadioChange(event),
      onTextChange: (value: string, event: Event) => foundation.handleTextChange(value, event),
    },
    { default: () => slots.default?.() },
  ),
);
const realContent = computed<VNodeChild>(() => {
  if (slots.content) return slots.content({ content: contentNode.value });
  return props.renderContent?.(contentNode.value) ?? contentNode.value;
});

function popupButtonBindings(kind: 'cancel' | 'ok'): Record<string, unknown> {
  const buttonProps = kind === 'cancel' ? props.cancelButtonProps : props.okButtonProps;
  const defaults: Record<string, unknown> =
    kind === 'cancel'
      ? {
          loading: state.onCancelReturnPromiseStatus === 'pending',
          onClick: (event: MouseEvent) => foundation.handleCancel(event),
          type: 'primary',
        }
      : {
          disabled: submitDisabled.value,
          loading: state.onOKReturnPromiseStatus === 'pending',
          onClick: (event: MouseEvent) => foundation.handleSubmit(event),
          theme: 'solid',
          type: 'primary',
        };
  return { ...defaults, ...buttonProps };
}

const popupFooter = computed<VNodeChild>(() => {
  if (slots.footer) return slots.footer();
  if (rawHas('footer')) return props.footer;
  return h('div', { class: 'semi-feedback-footer' }, [
    h(Button, popupButtonBindings('cancel'), () => locale.value.cancel),
    h(Button, popupButtonBindings('ok'), () => locale.value.submit),
  ]);
});
const modalBindings = computed<Record<string, unknown>>(() => ({
  cancelText: locale.value.cancel,
  class: rootClasses.value,
  okButtonProps: { disabled: submitDisabled.value },
  okText: locale.value.submit,
  ...forwardedBindings.value,
  ...(rawHas('cancelButtonProps') ? { cancelButtonProps: props.cancelButtonProps } : {}),
  ...(rawHas('okButtonProps') ? { okButtonProps: props.okButtonProps } : {}),
  onCancel: (event: MouseEvent | KeyboardEvent): FeedbackActionResult =>
    foundation.handleModalCancel(event) as FeedbackActionResult,
  onOk: (event: MouseEvent | KeyboardEvent): FeedbackActionResult =>
    foundation.handleModalOk(event) as FeedbackActionResult,
}));
const sideSheetBindings = computed<Record<string, unknown>>(() => ({
  canVerticalSetWidth: true,
  class: rootClasses.value,
  disableScroll: false,
  footer: popupFooter.value,
  height: 'auto',
  mask: false,
  placement: 'bottom',
  ...forwardedBindings.value,
}));

function forwardVisible(visible: boolean): void {
  emit('update:visible', visible);
}

onMounted(() => foundation.init());
onBeforeUnmount(() => foundation.destroy());
</script>

<template>
  <Modal
    v-if="mode === 'modal'"
    key="feedback-modal"
    v-bind="modalBindings"
    @update:visible="forwardVisible"
  >
    <FeedbackNodeRenderer :content="realContent" />
    <template v-if="$slots.title" #title><slot name="title" /></template>
    <template v-if="$slots.header" #header><slot name="header" /></template>
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
    <template v-if="$slots.closeIcon" #closeIcon><slot name="closeIcon" /></template>
  </Modal>
  <SideSheet
    v-else
    key="feedback-popup"
    v-bind="sideSheetBindings"
    @cancel="foundation.handleCancel"
    @update:visible="forwardVisible"
  >
    <FeedbackNodeRenderer :content="realContent" />
    <template v-if="$slots.title" #title><slot name="title" /></template>
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
    <template v-if="$slots.closeIcon" #closeIcon><slot name="closeIcon" /></template>
  </SideSheet>
</template>
