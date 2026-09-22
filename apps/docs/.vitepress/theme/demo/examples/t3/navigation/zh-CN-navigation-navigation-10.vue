<script setup lang="ts">
import { h } from 'vue';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconApps } from '@aifuxi/semi-icons-vue';
import { IconForm } from '@aifuxi/semi-icons-lab-vue';
import { IconBadge } from '@aifuxi/semi-icons-lab-vue';
import { IconBanner } from '@aifuxi/semi-icons-lab-vue';
import { IconTabs } from '@aifuxi/semi-icons-lab-vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/navigation.css';
const items1 = [
  { itemKey: 'user', text: '用户管理', icon: h(IconBadge, {}) },
  {
    text: '任务平台',
    icon: h(IconBanner, {}),
    itemKey: 'job',
    items: [
      '任务管理',
      {
        text: '任务1',
        icon: h(IconForm, {}),
        itemKey: 'mission1',
        items: [
          '任务2',
          {
            text: '任务3拆解',
            icon: h(IconTabs, {}),
            itemKey: 'mission3',
            items: ['子任务1', '子任务2'],
          },
        ],
      },
    ],
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
      :limit-indent="false"
      :default-open-keys="['job', 'mission1']"
      :body-style="{ height: '300px' }"
      :items="items1"
      :header="header2"
      :footer="footer3"
    ></Nav>
  </LocaleProvider>
</template>
