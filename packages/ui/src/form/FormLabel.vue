<script setup lang="ts">
import { computed, inject } from 'vue';

import { configContextKey } from '../config-provider';
import FormNodeRenderer from './FormNodeRenderer';
import type { FormLabelProps } from './types';

defineOptions({ name: 'FormLabel' });

const props = withDefaults(defineProps<FormLabelProps>(), {
  align: 'left',
  optional: false,
  required: false,
});
const config = inject(configContextKey, undefined);
const optionalText = computed(() => {
  const formLocale = config?.value.locale.Form as { optional?: unknown } | undefined;
  return typeof formLocale?.optional === 'string' ? formLocale.optional : '（可选）';
});
const labelClass = computed(() => [
  'semi-form-field-label',
  `semi-form-field-label-${props.align}`,
  props.required ? 'semi-form-field-label-required' : undefined,
  props.disabled ? 'semi-form-field-label-disabled' : undefined,
  props.extra ? 'semi-form-field-label-with-extra' : undefined,
  props.className,
]);
</script>

<template>
  <label
    :id="props.id"
    :for="props.name"
    :class="labelClass"
    :style="[props.style, props.width !== undefined ? { width: props.width } : undefined]"
  >
    <div class="semi-form-field-label-text" x-semi-prop="label">
      <slot><FormNodeRenderer :content="props.text" /></slot>
      <span v-if="props.optional" class="semi-form-field-label-optional-text">{{
        optionalText
      }}</span>
    </div>
    <div v-if="props.extra" class="semi-form-field-label-extra">
      <FormNodeRenderer :content="props.extra" />
    </div>
  </label>
</template>
