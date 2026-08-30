<script setup lang="ts">
import { Nav, type NavigationItems } from '@workspace/ui';

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
  <div class="navigation-scenario" data-testid="navigation-vue">
    <Nav
      :body-style="{ height: '224px' }"
      data-parity-target="navigation-root"
      :default-open-keys="['workspace']"
      :default-selected-keys="['projects']"
      :footer="{ collapseButton: true }"
      :header="{ text: 'Semi Console' }"
      :items="items"
    />
  </div>
</template>
