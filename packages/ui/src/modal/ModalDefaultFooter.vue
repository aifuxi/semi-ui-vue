<script setup lang="ts">
import { computed } from 'vue';

import { Button } from '../button';
import type { ModalButtonProps, ModalLocale } from './types';

interface Props {
  cancelButtonProps?: ModalButtonProps | undefined;
  cancelLoading: boolean;
  cancelText?: string | undefined;
  footerFill: boolean;
  hasCancel: boolean;
  locale: ModalLocale;
  okButtonProps?: ModalButtonProps | undefined;
  okLoading: boolean;
  okText?: string | undefined;
  okType: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';
}

const props = defineProps<Props>();
const emit = defineEmits<{
  cancel: [event: MouseEvent];
  ok: [event: MouseEvent];
}>();

const cancelBindings = computed(() => ({
  'aria-label': 'cancel',
  type: 'tertiary' as const,
  block: props.footerFill,
  autofocus: true,
  ...props.cancelButtonProps,
  style: [props.footerFill ? { marginLeft: 'unset' } : undefined, props.cancelButtonProps?.style],
}));
const okBindings = computed(() => ({
  'aria-label': 'confirm',
  type: props.okType,
  theme: 'solid' as const,
  block: props.footerFill,
  ...props.okButtonProps,
}));
</script>

<template>
  <div :class="{ 'semi-modal-footerfill': props.footerFill }">
    <Button
      v-if="props.hasCancel"
      v-bind="cancelBindings"
      :loading="props.cancelLoading"
      x-semi-children-alias="cancelText"
      @click="emit('cancel', $event)"
    >
      {{ props.cancelText || props.locale.cancel }}
    </Button>
    <Button
      v-bind="okBindings"
      :loading="props.okLoading"
      x-semi-children-alias="okText"
      @click="emit('ok', $event)"
    >
      {{ props.okText || props.locale.confirm }}
    </Button>
  </div>
</template>
