<script setup lang="ts">
import type { FormState } from '@aifuxi/semi-ui-vue/form';
defineProps<{ formState: FormState }>();
</script>
<template>
  <pre>{{ JSON.stringify(formState, null, 2) }}</pre>
</template>
