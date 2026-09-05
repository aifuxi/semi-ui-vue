<script setup lang="ts">
import { useFieldState } from '@aifuxi/semi-ui-vue/form';
const props = defineProps<{ field: string }>();
const state = useFieldState(props.field);
</script>
<template>
  <div>
    <span>{{ field }}: </span>
    <code>{{ JSON.stringify(state) }}</code>
  </div>
</template>
