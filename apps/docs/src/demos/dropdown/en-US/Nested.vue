<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/config-provider.css';
import { Dropdown, DropdownMenu, DropdownItem } from '@aifuxi/semi-ui-vue/dropdown';
import '@aifuxi/semi-theme-default/dropdown.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
</script>
<template>
  <ConfigProvider :locale="enUS"
    ><div :style="{ margin: '100px' }">
      <Dropdown>
        <Tag> Hover Me</Tag>
        <template #content
          ><DropdownMenu>
            <Dropdown :position="'rightTop'">
              <DropdownItem> Menu Item 1</DropdownItem>
              <template #content
                ><DropdownMenu>
                  <DropdownItem> Menu Item 1</DropdownItem>
                  <DropdownItem> Menu Item 2</DropdownItem>
                  <DropdownItem> Menu Item 3</DropdownItem>
                </DropdownMenu></template
              ></Dropdown
            >
            <Dropdown :position="'leftTop'">
              <DropdownItem> Menu Item 2</DropdownItem>
              <template #content
                ><DropdownMenu>
                  <DropdownItem> Menu Item 1</DropdownItem>
                  <DropdownItem> Menu Item 2</DropdownItem>
                  <DropdownItem> Menu Item 3</DropdownItem>
                </DropdownMenu></template
              ></Dropdown
            >
            <DropdownItem> Menu Item 3</DropdownItem>
          </DropdownMenu></template
        ></Dropdown
      >
    </div></ConfigProvider
  >
</template>
