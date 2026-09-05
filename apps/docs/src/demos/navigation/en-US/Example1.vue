<script setup lang="ts">
import { Nav } from '@aifuxi/semi-ui-vue/navigation';

const items = [
  { itemKey: 'home', text: 'Home' },
  { itemKey: 'manage', text: 'Manage', items: [{ itemKey: 'users', text: 'Users' }] },
];
import '@aifuxi/semi-theme-default/navigation.css';
</script>

<template>
  <Nav
    :items="items"
    :default-selected-keys="['home']"
    :default-open-keys="['manage']"
    :header="{ text: 'Console' }"
    :footer="{ collapseButton: true }"
  />
</template>
