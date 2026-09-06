<script setup lang="ts">
import { h } from 'vue';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import { Dropdown } from '@aifuxi/semi-ui-vue/dropdown';
import { IconStar } from '@aifuxi/semi-icons-vue';
import { IconUser } from '@aifuxi/semi-icons-vue';
import { IconSetting } from '@aifuxi/semi-icons-vue';
import { IconEdit } from '@aifuxi/semi-icons-vue';
import { IconApps } from '@aifuxi/semi-icons-vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/navigation.css';
import '@aifuxi/semi-theme-default/avatar.css';
const items1 = [
  { itemKey: 'user', text: 'User Management', icon: h(IconUser, {}) },
  { itemKey: 'union', text: 'Union Center', icon: h(IconStar, {}) },
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
const header2 = {
  logo: h(IconApps, { style: { height: '36px', fontSize: '36px' } }),
  text: 'Live Platform',
};
</script>
<template>
  <LocaleProvider :locale="locale">
    <div :style="{ width: '100%' }">
      <Nav :mode="'horizontal'" :items="items1" :header="header2">
        <template #footer>
          <Dropdown position="bottomRight">
            <Avatar size="small" color="light-blue" :style="{ margin: '4px' }">BD</Avatar>
            <span>Bytedancer</span>
            <template #content>
              <Dropdown.Menu>
                <Dropdown.Item>Detail</Dropdown.Item>
                <Dropdown.Item>Quit</Dropdown.Item>
              </Dropdown.Menu>
            </template>
          </Dropdown>
        </template>
      </Nav>
    </div>
  </LocaleProvider>
</template>
