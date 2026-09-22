<script setup lang="ts">
import { h } from 'vue';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import { Dropdown } from '@aifuxi/semi-ui-vue/dropdown';
import { Layout } from '@aifuxi/semi-ui-vue/layout';
import { IconApps } from '@aifuxi/semi-icons-vue';
import { IconTreeSelect } from '@aifuxi/semi-icons-lab-vue';
import { IconBreadcrumb } from '@aifuxi/semi-icons-lab-vue';
import { IconBadge } from '@aifuxi/semi-icons-lab-vue';
import { IconSteps } from '@aifuxi/semi-icons-lab-vue';
import '@aifuxi/semi-theme-default/navigation.css';
import '@aifuxi/semi-theme-default/avatar.css';
import '@aifuxi/semi-theme-default/layout.css';
const items1 = [
  { itemKey: 'user', text: '用户管理', icon: h(IconBadge, {}) },
  { itemKey: 'union', text: '活动管理', icon: h(IconTreeSelect, {}) },
  {
    itemKey: 'approve-management',
    text: '审批管理',
    icon: h(IconBreadcrumb, {}),
    items: [
      '入驻审核',
      {
        itemKey: 'operation-management',
        text: '运营管理',
        items: ['人员管理', '人员变更'],
      },
    ],
  },
  {
    text: '任务平台',
    icon: h(IconSteps, {}),
    itemKey: 'job',
    items: ['任务管理', '用户任务查询'],
  },
];
const header2 = {
  logo: h(IconApps, { style: { height: '36px', fontSize: '36px' } }),
  text: '组件运营后台',
};
</script>
<template>
  <Layout.Header :style="{ backgroundColor: 'var(--semi-color-bg-1)' }">
    <div>
      <Nav :mode="'horizontal'" :items="items1" :header="header2">
        <template #footer>
          <Dropdown position="bottomRight">
            <Avatar size="small" color="light-blue" :style="{ margin: '4px' }">BD</Avatar>
            <span>Bytedancer</span>
            <template #content>
              <Dropdown.Menu>
                <Dropdown.Item>详情</Dropdown.Item>
                <Dropdown.Item>退出</Dropdown.Item>
              </Dropdown.Menu>
            </template>
          </Dropdown>
        </template>
      </Nav>
    </div>
  </Layout.Header>
</template>
