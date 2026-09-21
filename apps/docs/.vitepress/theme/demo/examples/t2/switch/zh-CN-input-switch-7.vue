<script setup lang="ts">
import { shallowRef } from 'vue';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
const checked = shallowRef(true);
</script>

<template>
  <Switch v-model="checked" aria-label="a switch for demo" />
</template>
