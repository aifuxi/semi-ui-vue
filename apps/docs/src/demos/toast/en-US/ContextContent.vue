<script setup lang="ts">
import { inject } from 'vue';
import { reachableContextKey } from './context-key';

const name = inject(reachableContextKey);
</script>

<template>ReachableContext: {{ name }}</template>
