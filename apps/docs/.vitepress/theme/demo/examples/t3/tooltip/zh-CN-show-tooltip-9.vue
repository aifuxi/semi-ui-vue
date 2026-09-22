<script setup lang="ts">
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
</script>
<template>
  <Popconfirm content="是否确认删除" title="确认" :style="{ width: '320px' }">
    <span :style="{ display: 'inline-block' }">
      <Tooltip :content="'删除评价'">
        <Button type="danger"> 删除</Button>
      </Tooltip>
    </span>
  </Popconfirm>
</template>
