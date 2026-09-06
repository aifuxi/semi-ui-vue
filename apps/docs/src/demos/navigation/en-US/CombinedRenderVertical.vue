<script setup lang="ts">
import { h } from 'vue';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconStar } from '@aifuxi/semi-icons-vue';
import { IconUser } from '@aifuxi/semi-icons-vue';
import { IconUserGroup } from '@aifuxi/semi-icons-vue';
import { IconSetting } from '@aifuxi/semi-icons-vue';
import { IconEdit } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/navigation.css';
const items = [
  { itemKey: 'user', text: 'User Management', icon: h(IconUser, {}) },
  { itemKey: 'union', text: 'Union Center', icon: h(IconStar, {}) },
  {
    itemKey: 'union-management',
    text: 'Union Management',
    icon: h(IconUserGroup, {}),
    items: ['Announcement Settings', 'Union Query', 'Entry Information'],
  },
  {
    itemKey: 'approve-management',
    text: 'Approval Management',
    icon: h(IconEdit, {}),
    items: [
      'Check-in Review',
      {
        itemKey: 'operation-management',
        text: 'Operations Management',
        items: ['Personnel Management', 'Personnel Change'],
      },
    ],
  },
  {
    text: 'Task Platform',
    icon: h(IconSetting, {}),
    itemKey: 'job',
    items: ['Task Management', 'User Task Query'],
  },
];
const items1 = items;
const footer2 = {
  collapseButton: true,
};
</script>
<template>
  <Nav :body-style="{ height: '320px' }" :items="items1" :footer="footer2"></Nav>
</template>
