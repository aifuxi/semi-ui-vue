<script setup lang="ts">
import '@aifuxi/semi-theme-default/icon.css';
import {
  IconSearch,
  IconHelpCircle,
  IconAlertCircle,
  IconMinusCircle,
  IconPlusCircle,
  IconPlus,
  IconRefresh,
} from '@aifuxi/semi-icons-vue';
import type { IconSize } from '@aifuxi/semi-icons-vue';
const icons = [
  IconSearch,
  IconHelpCircle,
  IconAlertCircle,
  IconMinusCircle,
  IconPlusCircle,
  IconPlus,
  IconRefresh,
];
const sizes: IconSize[] = ['extra-small', 'small', 'default', 'large', 'extra-large'];
</script>

<template>
  <div v-for="(icon, index) in icons" :key="index" :style="{ marginBottom: '4px' }">
    <component :is="icon" v-for="size in sizes" :key="size" :size="size" />
  </div>
</template>
