<script setup lang="ts">
import { Dropdown, DropdownMenu, DropdownItem } from '@aifuxi/semi-ui-vue/dropdown';
import '@aifuxi/semi-theme-default/dropdown.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
</script>
<template>
  <div>
    <Dropdown :position="'bottom'">
      <Tag>Bottom</Tag>
      <template #content
        ><DropdownMenu>
          <DropdownItem>Menu Item 1</DropdownItem>
          <DropdownItem>Menu Item 2</DropdownItem>
          <DropdownItem>Menu Item 3</DropdownItem>
        </DropdownMenu></template
      ></Dropdown
    >
    <br />
    <br />
    <Dropdown :position="'bottomLeft'">
      <Tag>bottomLeft</Tag>
      <template #content
        ><DropdownMenu>
          <DropdownItem>Menu Item 1</DropdownItem>
          <DropdownItem>Menu Item 2</DropdownItem>
          <DropdownItem>Menu Item 3</DropdownItem>
        </DropdownMenu></template
      ></Dropdown
    >
    <br />
    <br />
    <Dropdown :position="'bottomRight'">
      <Tag>bottomRight</Tag>
      <template #content
        ><DropdownMenu>
          <DropdownItem>Menu Item 1</DropdownItem>
          <DropdownItem>Menu Item 2</DropdownItem>
          <DropdownItem>Menu Item 3</DropdownItem>
        </DropdownMenu></template
      ></Dropdown
    >
  </div>
</template>
