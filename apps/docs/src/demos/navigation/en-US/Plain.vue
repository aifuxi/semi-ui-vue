<script setup lang="ts">
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/navigation.css';
const items1 = [
  { itemKey: 'user', text: 'User Management' },
  { itemKey: 'union', text: 'User Center' },
  {
    itemKey: 'union-management',
    text: 'Union Management',
    items: ['Announcement Settings', 'Union Inquiries', 'Entry information'],
  },
  {
    text: 'Task Platform',
    itemKey: 'task',
    items: ['Task Management', 'User Task Inquiries'],
  },
];
</script>
<template>
  <LocaleProvider :locale="locale">
    <Nav :body-style="{ height: '320px' }" :default-open-keys="['task']" :items="items1"></Nav>
  </LocaleProvider>
</template>
