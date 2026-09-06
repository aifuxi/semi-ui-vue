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
  { node: 'title', name: 'Title' },
  { node: 'item', name: 'Edit', onClick: () => console.log('Edit clicked') },
  { node: 'item', name: 'Reset', type: 'secondary' },
  { node: 'divider' },
  { node: 'item', name: 'Create', type: 'tertiary' },
  { node: 'item', name: 'Copy', type: 'warning' },
  { node: 'divider' },
  { node: 'item', name: 'Delete', type: 'danger' },
];
</script>

<template>
  <div>
    <SplitButtonGroup
      v-for="theme in themes"
      :key="theme"
      :style="theme === 'borderless' ? {} : { marginRight: '10px' }"
      aria-label="Project operate button group"
      ><Button
        :theme="theme"
        type="primary"
        :style="
          theme === 'borderless' && visible[theme] ? { background: 'var(--semi-color-fill-0)' } : {}
        "
        >SplitButton</Button
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
          ><template #icon><IconTreeTriangleDown size="small" /></template></Button></Dropdown
    ></SplitButtonGroup>
  </div>
</template>
