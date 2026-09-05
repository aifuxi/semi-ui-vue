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
  { node: 'item', name: 'Edit project' },
  { node: 'item', name: 'Reset project' },
  { node: 'divider' },
  { node: 'item', name: 'Copy project' },
  { node: 'item', name: 'Create template from project' },
  { node: 'divider' },
  { node: 'item', name: 'Delete project', type: 'danger' },
];
</script>

<template>
  <div>
    <SplitButtonGroup
      v-for="theme in themes"
      :key="theme"
      style="margin-right: 10px"
      aria-label="Project actions"
      ><Button
        :theme="theme"
        type="primary"
        :style="
          theme === 'borderless' && visible[theme] ? { background: 'var(--semi-color-fill-0)' } : {}
        "
        >Split button</Button
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
          aria-label="More project actions"
          ><template #icon><IconTreeTriangleDown /></template></Button></Dropdown
    ></SplitButtonGroup>
  </div>
</template>
