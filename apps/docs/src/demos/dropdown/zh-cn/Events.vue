<script setup lang="ts">
import { Dropdown, DropdownMenu, DropdownItem } from '@aifuxi/semi-ui-vue/dropdown';
import '@aifuxi/semi-theme-default/dropdown.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/toast.css';
import { IconToken } from '@aifuxi/semi-icons-lab-vue';
</script>
<template>
  <Dropdown :trigger="'click'" :position="'bottomLeft'">
    <Button theme="outline" type="tertiary">
      Click Me
      <template #icon><IconToken /></template
    ></Button>
    <template #content
      ><DropdownMenu>
        <DropdownItem @click="() => Toast.info({ content: 'You clicked me!' })">
          1: click me!
        </DropdownItem>
        <DropdownItem @mouseenter="() => Toast.info({ content: 'Nice to meet you!' })">
          2: mouse enter
        </DropdownItem>
        <DropdownItem @mouseleave="() => Toast.info({ content: 'See ya!' })">
          3: mouse leave
        </DropdownItem>
        <DropdownItem @contextmenu="() => Toast.info({ content: 'Right clicked!' })">
          4: right click
        </DropdownItem>
      </DropdownMenu></template
    ></Dropdown
  >
</template>
