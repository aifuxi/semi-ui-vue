<script setup lang="ts">
import { h } from 'vue';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconUser } from '@aifuxi/semi-icons-vue';
import { IconSetting } from '@aifuxi/semi-icons-vue';
import { IconApps } from '@aifuxi/semi-icons-vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/navigation.css';
const items1 = [
  { itemKey: 'user', text: 'User Management', icon: h(IconUser, {}) },
  {
    text: 'Task platform',
    icon: h(IconSetting, {}),
    itemKey: 'job',
    items: [
      'Task Management',
      {
        text: 'Task 1',
        icon: h(IconSetting, {}),
        itemKey: 'mission1',
        items: [
          'Task 2',
          {
            text: 'Task 3 disassembly',
            icon: h(IconSetting, {}),
            itemKey: 'mission3',
            items: ['Subtask 1', 'Subtask 2'],
          },
        ],
      },
    ],
  },
];
const header2 = {
  logo: h(IconApps, { style: { height: '36px', fontSize: '36px' } }),
  text: 'Live broadcast operation background',
};
const footer3 = {
  collapseButton: true,
};
</script>
<template>
  <LocaleProvider :locale="locale">
    <Nav
      :limit-indent="false"
      :default-open-keys="['job']"
      :body-style="{ height: '320px' }"
      :items="items1"
      :header="header2"
      :footer="footer3"
    ></Nav>
  </LocaleProvider>
</template>
