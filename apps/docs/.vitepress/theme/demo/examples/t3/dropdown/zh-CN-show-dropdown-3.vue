<script setup lang="ts">
import { Dropdown, DropdownMenu, DropdownItem } from '@aifuxi/semi-ui-vue/dropdown';
import '@aifuxi/semi-theme-default/dropdown.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconToken } from '@aifuxi/semi-icons-lab-vue';
</script>
<template>
  <div :style="{ margin: '100px' }">
    <Dropdown>
      <Button theme="outline" type="tertiary">
        Hover Me
        <template #icon><IconToken /></template
      ></Button>
      <template #content
        ><DropdownMenu>
          <Dropdown :position="'rightTop'">
            <DropdownItem>Menu Item 1</DropdownItem>
            <template #content
              ><DropdownMenu>
                <DropdownItem>Nested Menu Item 1</DropdownItem>
                <DropdownItem>Nested Menu Item 2</DropdownItem>
                <DropdownItem>Nested Menu Item 3</DropdownItem>
              </DropdownMenu></template
            ></Dropdown
          >
          <Dropdown :position="'leftTop'">
            <DropdownItem>Menu Item 2</DropdownItem>
            <template #content
              ><DropdownMenu>
                <DropdownItem>Nested Menu Item 1</DropdownItem>
                <DropdownItem>Nested Menu Item 2</DropdownItem>
                <DropdownItem>Nested Menu Item 3</DropdownItem>
              </DropdownMenu></template
            ></Dropdown
          >
          <DropdownItem>Menu Item 3</DropdownItem>
        </DropdownMenu></template
      ></Dropdown
    >
  </div>
</template>
