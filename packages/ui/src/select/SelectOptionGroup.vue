<script setup lang="ts">
import type { SelectOptionGroupProps } from './types';

defineOptions({ name: 'SelectOptionGroup' });
defineProps<SelectOptionGroupProps>();
</script>

<template><slot /></template>
