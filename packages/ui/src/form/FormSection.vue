<script setup lang="ts">
import FormNodeRenderer from './FormNodeRenderer';
import type { FormSectionProps } from './types';

defineOptions({ name: 'FormSection' });
const props = defineProps<FormSectionProps>();
</script>

<template>
  <section :class="['semi-form-section', props.className]" :style="props.style">
    <h5 class="semi-form-section-text">
      <slot name="text"><FormNodeRenderer :content="props.text" /></slot>
    </h5>
    <slot />
  </section>
</template>
