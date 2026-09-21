<script setup lang="ts">
import { useFormState } from '@aifuxi/semi-ui-vue/form';
const state = useFormState();
</script>
<template>
  <pre>{{ JSON.stringify(state, null, 2) }}</pre>
</template>
