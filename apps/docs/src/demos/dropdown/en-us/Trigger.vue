<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/config-provider.css';
import { Dropdown, DropdownMenu, DropdownItem } from '@aifuxi/semi-ui-vue/dropdown';
import '@aifuxi/semi-theme-default/dropdown.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><div>
      <Dropdown :trigger="'hover'" :position="'bottomLeft'">
        <Tag> Hover me</Tag>
        <template #content
          ><DropdownMenu>
            <DropdownItem> Menu Item 1</DropdownItem>
            <DropdownItem> Menu Item 2</DropdownItem>
            <DropdownItem> Menu Item 3</DropdownItem>
          </DropdownMenu></template
        ></Dropdown
      >
      <br />
      <br />
      <Dropdown :trigger="'focus'" :position="'bottomLeft'">
        <div
          :style="{
            border: '1px solid var(--semi-color-border)',
            borderRadius: '4px',
            height: '36px',
            width: '220px',
          }"
        >
          Please use Tab to focus this div
        </div>
        <template #content
          ><DropdownMenu :tabindex="-1">
            <DropdownItem> Menu Item 1</DropdownItem>
            <DropdownItem> Menu Item 2</DropdownItem>
            <DropdownItem> Menu Item 3</DropdownItem>
          </DropdownMenu></template
        ></Dropdown
      >
      <br />
      <br />
      <Dropdown :trigger="'click'" :position="'bottomLeft'">
        <Button> Click me</Button>
        <template #content
          ><DropdownMenu>
            <DropdownItem> Menu Item 1</DropdownItem>
            <DropdownItem> Menu Item 2</DropdownItem>
            <DropdownItem> Menu Item 3</DropdownItem>
          </DropdownMenu></template
        ></Dropdown
      >
    </div></ConfigProvider
  >
</template>
