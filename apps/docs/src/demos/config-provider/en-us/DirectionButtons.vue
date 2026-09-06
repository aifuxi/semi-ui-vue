<script setup lang="ts">
import { ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Row } from '@aifuxi/semi-ui-vue/grid';
import { IconSidebar, IconChevronDown } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/grid.css';
const titleStyle = { margin: '50px 0 16px 0' };
const rowStyle = { margin: '16px 10px' };
</script>
<template>
  <Row>
    <h3 :style="titleStyle">Buttons</h3>
  </Row>

  <Row :style="rowStyle">
    <Button :loading="true" theme="solid" :style="{ marginRight: '8px' }">Loading</Button>

    <Button theme="solid" :style="{ marginRight: '8px' }"
      ><template #icon><IconSidebar></IconSidebar></template>Collapsing</Button
    >

    <Button theme="solid" :icon-position="'right'" :style="{ marginRight: '8px' }"
      ><template #icon><IconChevronDown></IconChevronDown></template>Expand options</Button
    >

    <br />
    <br />

    <ButtonGroup>
      <Button>Copy</Button>

      <Button>Query</Button>

      <Button>Cut</Button>
    </ButtonGroup>
  </Row>
</template>
