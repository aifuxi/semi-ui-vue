<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconCamera, IconSidebar, IconChevronDown } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <strong>Default Status: </strong
    ><Button aria-label="Screenshot"
      ><template #icon><IconCamera /></template></Button
    ><br /><br />
    <strong>Disabled Status：</strong
    ><Button aria-label="Screenshot"
      ><template #icon><IconCamera /></template></Button
    ><br /><br />
    <strong>With Type: </strong
    ><Button type="primary" style="margin-right: 8px" aria-label="Screenshot"
      ><template #icon><IconCamera /></template></Button
    ><Button type="secondary" style="margin-right: 8px" aria-label="Screenshot"
      ><template #icon><IconCamera /></template></Button
    ><Button type="warning" style="margin-right: 8px" aria-label="Screenshot"
      ><template #icon><IconCamera /></template></Button
    ><Button type="danger" style="margin-right: 8px" aria-label="Screenshot"
      ><template #icon><IconCamera /></template></Button
    ><br /><br />
    <strong>Change Theme: </strong
    ><Button theme="solid" style="margin-right: 10px" aria-label="Screenshot"
      ><template #icon><IconCamera /></template></Button
    ><Button theme="light" aria-label="Screenshot"
      ><template #icon><IconCamera /></template></Button
    ><br /><br />
    <strong>Change Icon Position: </strong
    ><Button theme="solid" style="margin-right: 10px"
      ><template #icon><IconSidebar /></template>Collapse</Button
    ><Button theme="solid" icon-position="right"
      ><template #icon><IconChevronDown /></template>Expand Options</Button
    ><br /><br />
  </div>
</template>
