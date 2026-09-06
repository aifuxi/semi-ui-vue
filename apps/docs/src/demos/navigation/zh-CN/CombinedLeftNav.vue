<script setup lang="ts">
import { h } from 'vue';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconTreeSelect } from '@aifuxi/semi-icons-lab-vue';
import { IconBreadcrumb } from '@aifuxi/semi-icons-lab-vue';
import { IconBadge } from '@aifuxi/semi-icons-lab-vue';
import { IconSteps } from '@aifuxi/semi-icons-lab-vue';
import '@aifuxi/semi-theme-default/navigation.css';
const items1 = [
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
  { itemKey: 'user', text: '用户管理', icon: h(IconBadge, {}) },
  { itemKey: 'union', text: '活动管理', icon: h(IconTreeSelect, {}) },
];
const footer2 = {
  collapseButton: true,
};
</script>
<template>
  <Nav
    :style="{ maxWidth: '220px', height: '100%' }"
    :default-selected-keys="['Home']"
    :items="items1"
    :footer="footer2"
  ></Nav>
</template>
