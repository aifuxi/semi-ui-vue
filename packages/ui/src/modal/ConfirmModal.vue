<script setup lang="ts">
import { computed, h, nextTick, shallowRef, type Component } from 'vue';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconHelpCircle,
  IconInfoCircle,
  IconTickCircle,
} from '@workspace/icons';

import ModalBase from './Modal.vue';
import ModalNodeRenderer from './ModalNodeRenderer';
import type { ModalConfirmProps, ModalConfirmType, ModalProps } from './types';

interface Props {
  config: ModalConfirmProps;
  visible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  closed: [];
  'update:visible': [visible: boolean];
}>();
const okLoading = shallowRef(false);
const cancelLoading = shallowRef(false);

const iconByType: Record<ModalConfirmType, Component> = {
  confirm: IconHelpCircle,
  error: IconAlertCircle,
  info: IconInfoCircle,
  success: IconTickCircle,
  warning: IconAlertTriangle,
};
const confirmType = computed<ModalConfirmType>(() => props.config.type ?? 'confirm');
const confirmClass = computed(() => [
  props.config.class,
  props.config.className,
  'semi-modal-confirm',
  props.config.direction === 'rtl' ? 'semi-modal-confirm-rtl' : undefined,
]);
const titleNode = computed(() =>
  props.config.title == null
    ? undefined
    : h('span', { class: 'semi-modal-confirm-title-text' }, props.config.title),
);
const iconNode = computed(() => {
  if (props.config.icon !== undefined) return props.config.icon;
  const Icon = iconByType[confirmType.value];
  return h(Icon, {
    class: ['semi-modal-confirm-icon', `semi-modal-${confirmType.value}-icon`],
    size: 'extra-large',
  });
});
const contentNode = computed(() =>
  h(
    'div',
    {
      class: [
        'semi-modal-confirm-content',
        { 'semi-modal-confirm-content-withIcon': iconNode.value != null },
      ],
      'x-semi-prop': 'content',
    },
    [h(ModalNodeRenderer, { content: props.config.content })],
  ),
);
const okButtonProps = computed(() => ({
  ...(confirmType.value === 'error' ? { type: 'danger' as const } : {}),
  ...props.config.okButtonProps,
}));
const forwardedKeys = new Set<keyof ModalConfirmProps>([
  'afterClose',
  'class',
  'className',
  'confirmLoading',
  'cancelLoading',
  'content',
  'icon',
  'okButtonProps',
  'onAfterClose',
  'onCancel',
  'onOk',
  'title',
  'type',
  'visible',
]);
const forwarded = computed<ModalProps>(() => {
  return Object.fromEntries(
    Object.entries(props.config).filter(
      ([key]) => !forwardedKeys.has(key as keyof ModalConfirmProps),
    ),
  ) as ModalProps;
});

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return Boolean(value && typeof (value as PromiseLike<unknown>).then === 'function');
}

function handleRequestVisible(): void {
  // Confirm callbacks decide when an imperative modal closes. In particular,
  // a Promise keeps it visible until resolution.
}

function handleOk(event: MouseEvent | KeyboardEvent): void {
  const result = props.config.onOk?.(event);
  if (!isPromiseLike(result)) {
    emit('update:visible', false);
    return;
  }
  okLoading.value = true;
  void Promise.resolve(result).then(
    () => emit('update:visible', false),
    () => {
      okLoading.value = false;
    },
  );
}

function handleCancel(event: MouseEvent | KeyboardEvent): void {
  const result = props.config.onCancel?.(event);
  if (!isPromiseLike(result)) {
    emit('update:visible', false);
    return;
  }
  cancelLoading.value = true;
  void Promise.resolve(result).then(
    () => emit('update:visible', false),
    () => {
      cancelLoading.value = false;
    },
  );
}

function handleAfterClose(): void {
  props.config.afterClose?.();
  if (props.config.onAfterClose !== props.config.afterClose) props.config.onAfterClose?.();
  void nextTick(() => emit('closed'));
}
</script>

<template>
  <ModalBase
    v-bind="forwarded"
    :visible="props.visible"
    :class="confirmClass"
    :title="titleNode"
    :icon="iconNode"
    :content="contentNode"
    :confirm-loading="props.config.confirmLoading ?? okLoading"
    :cancel-loading="props.config.cancelLoading ?? cancelLoading"
    :ok-button-props="okButtonProps"
    :on-ok="handleOk"
    :on-cancel="handleCancel"
    :on-after-close="handleAfterClose"
    @update:visible="handleRequestVisible"
  />
</template>
