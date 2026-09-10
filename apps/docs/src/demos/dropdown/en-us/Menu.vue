<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/config-provider.css';
import { Dropdown } from '@aifuxi/semi-ui-vue/dropdown';
import '@aifuxi/semi-theme-default/dropdown.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconToken } from '@aifuxi/semi-icons-lab-vue';
import type { DropdownMenuItem } from '@aifuxi/semi-ui-vue/dropdown';
const menu: DropdownMenuItem[] = [
  { node: 'title', name: 'Group1' },
  {
    node: 'item',
    name: 'primary1',
    type: 'primary',
    onClick: () => console.log('click primary'),
  },
  { node: 'item', name: 'secondary', type: 'secondary' },
  { node: 'divider' },
  { node: 'title', name: 'Group2' },
  { node: 'item', name: 'tertiary', type: 'tertiary' },
  { node: 'item', name: 'warning', type: 'warning', active: true },
  { node: 'item', name: 'danger', type: 'danger' },
];
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><Dropdown :trigger="'click'" show-tick :position="'bottomLeft'" :menu="menu">
      <Button theme="outline" type="tertiary">
        Click Me
        <template #icon><IconToken /></template
      ></Button> </Dropdown
  ></ConfigProvider>
</template>
