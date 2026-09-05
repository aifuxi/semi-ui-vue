<script setup lang="ts">
import { shallowRef } from 'vue';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';

const enabled = shallowRef(false);
</script>

<template>
  <Switch v-model="enabled" aria-label="Enable notifications" />
</template>
