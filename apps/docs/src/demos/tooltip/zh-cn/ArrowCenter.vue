<script setup lang="ts">
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
</script>
<template>
  <div>
    <Tooltip position="topLeft" content="semi design tooltip">
      <Button type="secondary" :style="{ marginRight: '8px' }"> 指向元素中心</Button>
    </Tooltip>
  </div>

  <div :style="{ marginTop: '20px' }">
    <Tooltip content="semi design tooltip" :arrow-point-at-center="false" position="topLeft">
      <Button type="secondary" :style="{ marginRight: '8px', width: '120px' }"> 边缘对齐</Button>
    </Tooltip>
  </div>
</template>
