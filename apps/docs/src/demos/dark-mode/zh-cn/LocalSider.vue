<script setup lang="ts">
import { h } from 'vue';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconHome, IconHistogram, IconLive, IconSetting } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/navigation.css';
const items = [
  { itemKey: 'Home', text: '首页', icon: h(IconHome, { size: 'large' }) },
  { itemKey: 'Histogram', text: '基础数据', icon: h(IconHistogram, { size: 'large' }) },
  { itemKey: 'Live', text: '测试功能', icon: h(IconLive, { size: 'large' }) },
  { itemKey: 'Setting', text: '设置', icon: h(IconSetting, { size: 'large' }) },
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
