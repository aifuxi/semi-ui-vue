<script setup lang="ts">
import type { SelectOptionProps } from './types';

defineOptions({ name: 'SelectOption' });
defineProps<SelectOptionProps>();
</script>

<template><slot /></template>
