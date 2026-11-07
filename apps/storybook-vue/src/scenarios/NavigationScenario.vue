<script setup lang="ts">
import { Nav, type NavigationItems } from '@aifuxi/semi-ui-vue/navigation';

/** 与固定 React 场景一致，使用公开模式 prop 覆盖水平/垂直两种真实排版。 */
const reviewMode =
  new URLSearchParams(window.location.search).get('navigationMode') === 'horizontal'
    ? 'horizontal'
    : 'vertical';
const items: NavigationItems = [
  { itemKey: 'home', text: '首页' },
  {
    itemKey: 'workspace',
    text: '工作台',
    items: [
      { itemKey: 'projects', text: '项目' },
      { itemKey: 'members', text: '成员' },
    ],
  },
  { itemKey: 'settings', text: '设置', disabled: true },
];
</script>

<template>
  <div
    class="navigation-scenario"
    data-testid="navigation-vue"
    :style="reviewMode === 'horizontal' ? { width: '100%' } : {}"
  >
    <Nav
      :mode="reviewMode"
      :body-style="reviewMode === 'horizontal' ? {} : { height: '224px' }"
      :style="reviewMode === 'horizontal' ? { width: '100%' } : {}"
      data-parity-target="navigation-root"
      :default-open-keys="['workspace']"
      :default-selected-keys="['projects']"
      :footer="{ collapseButton: true }"
      :header="{ text: 'Semi Console' }"
      :items="items"
    />
  </div>
</template>
