<script setup lang="ts">
import { h } from 'vue';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconApps } from '@aifuxi/semi-icons-vue';
import { IconTreeSelect } from '@aifuxi/semi-icons-lab-vue';
import { IconForm } from '@aifuxi/semi-icons-lab-vue';
import { IconBanner } from '@aifuxi/semi-icons-lab-vue';
import { IconBadge } from '@aifuxi/semi-icons-lab-vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/navigation.css';
const items1 = [
  { itemKey: 'user', text: '用户管理', icon: h(IconBadge, {}) },
  { itemKey: 'union', text: '活动管理', icon: h(IconTreeSelect, {}) },
  {
    itemKey: 'union-management',
    text: '任务管理',
    icon: h(IconForm, {}),
    items: ['任务设置', '任务查询', '信息录入'],
  },
  {
    text: '公告管理',
    icon: h(IconBanner, {}),
    itemKey: 'job',
    items: ['推送管理', '已推送查询'],
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
    <div :style="{ width: '100%' }">
      <Nav
        :body-style="{ height: '300px' }"
        :items="items1"
        :header="header2"
        :footer="footer3"
      ></Nav>
    </div>
  </LocaleProvider>
</template>
