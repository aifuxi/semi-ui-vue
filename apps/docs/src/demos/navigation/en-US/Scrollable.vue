<script setup lang="ts">
import { h } from 'vue';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconUser } from '@aifuxi/semi-icons-vue';
import { IconStar } from '@aifuxi/semi-icons-vue';
import { IconSetting } from '@aifuxi/semi-icons-vue';
import { IconFolder } from '@aifuxi/semi-icons-vue';
import { IconApps } from '@aifuxi/semi-icons-vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/navigation.css';
const items1 = [
  { itemKey: 'user', text: 'User Management', icon: h(IconUser, {}) },
  { itemKey: 'union', text: 'Union Center', icon: h(IconStar, {}) },
  {
    text: 'Task Platform',
    icon: h(IconSetting, {}),
    itemKey: 'job',
    items: ['Task Management', 'User Task Query'],
  },
  {
    text: 'Resource Management',
    icon: h(IconFolder, {}),
    itemKey: 'resource',
    items: ['Turntable Configuration', 'Turntable Review'],
  },
];
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
      :style="{ height: '520px' }"
      :body-style="{ height: '320px' }"
      :default-open-keys="['job', 'resource']"
      :items="items1"
      :header="header2"
      :footer="footer3"
    ></Nav>
  </LocaleProvider>
</template>
