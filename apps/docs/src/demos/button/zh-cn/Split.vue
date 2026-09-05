<script setup lang="ts">
import { Button, SplitButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { reactive } from 'vue';
import { Dropdown, type DropdownMenuItem } from '@aifuxi/semi-ui-vue/dropdown';
import { IconTreeTriangleDown } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/dropdown.css';
const themes = ['solid', 'light', 'borderless'] as const;
const visible = reactive({ solid: false, light: false, borderless: false });
const menu: DropdownMenuItem[] = [
  { node: 'item', name: '编辑项目' },
  { node: 'item', name: '重置项目' },
  { node: 'divider' },
  { node: 'item', name: '复制项目' },
  { node: 'item', name: '从项目创建模板' },
  { node: 'divider' },
  { node: 'item', name: '删除项目', type: 'danger' },
];
</script>

<template>
  <div>
    <SplitButtonGroup
      v-for="theme in themes"
      :key="theme"
      style="margin-right: 10px"
      aria-label="项目操作按钮组"
      ><Button
        :theme="theme"
        type="primary"
        :style="
          theme === 'borderless' && visible[theme] ? { background: 'var(--semi-color-fill-0)' } : {}
        "
        >分裂按钮</Button
      ><Dropdown
        :menu="menu"
        trigger="click"
        position="bottomRight"
        @visible-change="visible[theme] = $event"
        ><Button
          :theme="theme"
          type="primary"
          :style="{
            padding: '8px 4px',
            background: visible[theme]
              ? theme === 'solid'
                ? 'var(--semi-color-primary-hover)'
                : 'var(--semi-color-fill-1)'
              : undefined,
          }"
          aria-label="更多项目操作"
          ><template #icon><IconTreeTriangleDown /></template></Button></Dropdown
    ></SplitButtonGroup>
  </div>
</template>
