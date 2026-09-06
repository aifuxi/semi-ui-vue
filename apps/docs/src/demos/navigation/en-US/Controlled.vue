<script setup lang="ts">
import { h, ref } from 'vue';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconUser } from '@aifuxi/semi-icons-vue';
import { IconStar } from '@aifuxi/semi-icons-vue';
import { IconUserGroup } from '@aifuxi/semi-icons-vue';
import { IconSetting } from '@aifuxi/semi-icons-vue';
import { IconApps } from '@aifuxi/semi-icons-vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/navigation.css';
const openKeys = ref(['union-management', 'job']);
const selectedKeys = ref(['User Task Query']);
const isCollapsed = ref(true);
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
    text: 'Task Platform',
    icon: h(IconSetting, {}),
    itemKey: 'job',
    items: ['Task Management', 'User Task Query'],
  },
];
const items1 = items;
const header2 = {
  logo: h(IconApps, { style: { height: '36px', fontSize: '36px' } }),
  text: 'Live Platform',
};
const footer3 = {
  collapseButton: true,
};
</script>
<template>
  <LocaleProvider :locale="locale">
    <Nav
      v-model:is-collapsed="isCollapsed"
      v-model:open-keys="openKeys"
      v-model:selected-keys="selectedKeys"
      :body-style="{ height: '360px' }"
      :items="items1"
      :header="header2"
      :footer="footer3"
    ></Nav>
  </LocaleProvider>
</template>
