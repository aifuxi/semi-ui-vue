<script setup lang="ts">
import { Nav } from '@aifuxi/semi-ui-vue/navigation';

const items = [
  { itemKey: 'home', text: '首页' },
  { itemKey: 'manage', text: '管理', items: [{ itemKey: 'users', text: '用户' }] },
];
import '@aifuxi/semi-theme-default/navigation.css';
</script>

<template>
  <Nav
    :items="items"
    :default-selected-keys="['home']"
    :default-open-keys="['manage']"
    :header="{ text: '控制台' }"
    :footer="{ collapseButton: true }"
  />
</template>
