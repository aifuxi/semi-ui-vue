<script setup lang="ts">
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTitle,
  DropdownDivider,
} from '@aifuxi/semi-ui-vue/dropdown';
import '@aifuxi/semi-theme-default/dropdown.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { HotKeys } from '@aifuxi/semi-ui-vue/hot-keys';
import '@aifuxi/semi-theme-default/hot-keys.css';
import {
  IconBox,
  IconSetting,
  IconForward,
  IconRefresh,
  IconSearch,
  IconAlertCircle,
} from '@aifuxi/semi-icons-vue';
import { IconToken } from '@aifuxi/semi-icons-lab-vue';
</script>
<template>
  <Dropdown position="bottomLeft">
    <Button theme="outline" type="tertiary">
      Hover Me
      <template #icon><IconToken /></template
    ></Button>
    <template #content
      ><DropdownMenu>
        <DropdownTitle> 分组1</DropdownTitle>
        <DropdownItem>
          Menu Item 1
          <HotKeys
            :style="{ marginLeft: '20px' }"
            :hot-keys="[HotKeys.Keys.Control, HotKeys.Keys.B]"
            :content="['Ctrl', 'B']" />
          <template #icon><IconBox /></template
        ></DropdownItem>
        <DropdownItem>
          Menu Item 2
          <HotKeys
            :style="{ marginLeft: '20px' }"
            :hot-keys="[HotKeys.Keys.Control, HotKeys.Keys.V]"
            :content="['Ctrl', 'V']" />
          <template #icon><IconSetting /></template
        ></DropdownItem>
        <DropdownItem disabled>
          Menu Item 3
          <HotKeys
            :style="{ marginLeft: '20px' }"
            :hot-keys="[HotKeys.Keys.Control, HotKeys.Keys.F3]"
            :content="['Ctrl', 'F3']" />
          <template #icon><IconForward /></template
        ></DropdownItem>
        <DropdownDivider />
        <DropdownTitle> 分组2</DropdownTitle>
        <DropdownItem type="tertiary">
          tertiary<template #icon><IconRefresh /></template
        ></DropdownItem>
        <DropdownItem type="warning">
          warning
          <template #icon><IconSearch /></template
        ></DropdownItem>
        <DropdownItem type="danger">
          danger<template #icon><IconAlertCircle /></template
        ></DropdownItem> </DropdownMenu></template
  ></Dropdown>
</template>
