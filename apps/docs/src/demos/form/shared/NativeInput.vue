<script setup lang="ts">
defineOptions({ inheritAttrs: false });
defineProps<{ value?: unknown; validateStatus?: string }>();
const emit = defineEmits<{ change: [event: Event] }>();
</script>
<template>
  <input v-bind="$attrs" :value="String(value ?? '')" @input="emit('change', $event)" />
</template>
