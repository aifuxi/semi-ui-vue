<script setup lang="ts">
import { h } from 'vue';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconApps } from '@aifuxi/semi-icons-vue';
import { IconForm } from '@aifuxi/semi-icons-lab-vue';
import { IconBadge } from '@aifuxi/semi-icons-lab-vue';
import { IconBanner } from '@aifuxi/semi-icons-lab-vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/navigation.css';
const items1 = [
  { itemKey: 'user', text: '用户管理', icon: h(IconBadge, {}) },
  { itemKey: 'union', text: '活动管理', icon: h(IconBanner, {}) },
  {
    text: '任务平台',
    icon: h(IconForm, {}),
    itemKey: 'job',
    items: ['任务管理', '用户任务查询'],
  },
];
const header2 = {
  logo: h(IconApps, { style: { height: '36px', fontSize: '36px' } }),
  text: '组件运营后台',
};
const footer3 = {
  collapseButton: true,
};
</script>
<template>
  <LocaleProvider :locale="locale">
    <Nav
      :toggle-icon-position="'left'"
      :default-open-keys="['job']"
      :body-style="{ height: '300px' }"
      :items="items1"
      :header="header2"
      :footer="footer3"
    ></Nav>
  </LocaleProvider>
</template>
