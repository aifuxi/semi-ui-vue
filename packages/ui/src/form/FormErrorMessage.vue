<script setup lang="ts">
import { IconAlertCircle, IconAlertTriangle } from '@workspace/icons';
import { computed, isVNode } from 'vue';

import FormNodeRenderer from './FormNodeRenderer';
import type { FormErrorMessageProps } from './types';

defineOptions({ name: 'FormErrorMessage' });

const props = defineProps<FormErrorMessageProps>();
const hasError = computed(() => Boolean(props.error));
const displayValue = computed(() => (hasError.value ? props.error : props.helpText));
const shouldRender = computed(() => {
  if (props.error === '' && props.validateStatus === 'error') return false;
  if (Array.isArray(props.error) && !props.error.some(Boolean) && !props.helpText) return false;
  return Boolean(props.error) || Boolean(props.helpText);
});
const text = computed(() => {
  const value = displayValue.value;
  if (Array.isArray(value)) {
    const entries = value.filter(Boolean);
    return entries.length ? entries.join(', ') : undefined;
  }
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return undefined;
});
const contentId = computed(() => (hasError.value ? props.errorMessageId : props.helpTextId));
</script>

<template>
  <div
    v-if="shouldRender"
    :class="[
      hasError ? 'semi-form-field-error-message' : undefined,
      props.helpText ? 'semi-form-field-help-text' : undefined,
      props.className,
    ]"
    :style="props.style"
  >
    <template v-if="props.showValidateIcon && displayValue">
      <IconAlertCircle
        v-if="props.isInInputGroup || props.validateStatus === 'error'"
        class="semi-form-field-validate-status-icon"
      />
      <IconAlertTriangle
        v-else-if="props.validateStatus === 'warning'"
        class="semi-form-field-validate-status-icon"
      />
    </template>
    <span v-if="text !== undefined" :id="contentId">{{ text }}</span>
    <FormNodeRenderer v-else-if="isVNode(displayValue)" :content="displayValue" />
  </div>
</template>
