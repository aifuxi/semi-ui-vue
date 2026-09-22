<script setup lang="ts">
import { h } from 'vue';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconApps } from '@aifuxi/semi-icons-vue';
import { IconTreeSelect } from '@aifuxi/semi-icons-lab-vue';
import { IconForm } from '@aifuxi/semi-icons-lab-vue';
import { IconTree } from '@aifuxi/semi-icons-lab-vue';
import { IconBanner } from '@aifuxi/semi-icons-lab-vue';
import { IconBadge } from '@aifuxi/semi-icons-lab-vue';
import { IconNotification } from '@aifuxi/semi-icons-lab-vue';
import { IconSteps } from '@aifuxi/semi-icons-lab-vue';
import { IconTabs } from '@aifuxi/semi-icons-lab-vue';
import { IconNavigation } from '@aifuxi/semi-icons-lab-vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/navigation.css';
const items1 = [
  { itemKey: 'user', text: '用户管理', icon: h(IconBadge, {}) },
  { itemKey: '2', text: '订单管理', icon: h(IconBanner, {}) },
  { itemKey: '3', text: '资源管理', icon: h(IconTreeSelect, {}) },
  {
    text: '任务平台',
    icon: h(IconForm, {}),
    itemKey: '4',
    items: ['任务管理', '用户任务查询'],
  },
  { itemKey: '5', text: '推送通知', icon: h(IconNotification, {}) },
  { itemKey: '6', text: '任务', icon: h(IconSteps, {}) },
  { itemKey: '7', text: '活动管理', icon: h(IconTree, {}) },
  { itemKey: '8', text: '内容工具', icon: h(IconTabs, {}) },
  { itemKey: '9', text: '快捷导航', icon: h(IconNavigation, {}) },
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
      :style="{ height: '520px' }"
      :body-style="{ height: '300px' }"
      :items="items1"
      :header="header2"
      :footer="footer3"
    ></Nav>
  </LocaleProvider>
</template>
