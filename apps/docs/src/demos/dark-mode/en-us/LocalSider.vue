<script setup lang="ts">
import { h } from 'vue';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconHome, IconHistogram, IconLive, IconSetting } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/navigation.css';
const items = [
  { itemKey: 'Home', text: 'Home', icon: h(IconHome, { size: 'large' }) },
  { itemKey: 'Histogram', text: 'Histogram', icon: h(IconHistogram, { size: 'large' }) },
  { itemKey: 'Live', text: 'Live', icon: h(IconLive, { size: 'large' }) },
  { itemKey: 'Setting', text: 'Setting', icon: h(IconSetting, { size: 'large' }) },
];
</script>
<template>
  <Nav
    :style="{ maxWidth: '220px', height: '100%' }"
    :default-selected-keys="['Home']"
    :items="items"
    :footer="{ collapseButton: true }"
  />
</template>
