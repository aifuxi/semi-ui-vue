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
    <Button :loading="true" theme="solid" :style="{ marginRight: '8px' }">加载</Button>

    <Button theme="solid" :style="{ marginRight: '8px' }"
      ><template #icon><IconSidebar></IconSidebar></template>收起</Button
    >

    <Button theme="solid" :icon-position="'right'" :style="{ marginRight: '8px' }"
      ><template #icon><IconChevronDown></IconChevronDown></template>展开选项</Button
    >

    <br />
    <br />

    <ButtonGroup>
      <Button>拷贝</Button>

      <Button>查询</Button>

      <Button>剪切</Button>
    </ButtonGroup>
  </Row>
</template>
