<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';

function confirm(): void {
  console.log('confirmed');
}
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <Popconfirm title="确定保存此修改？" content="此修改将不可逆" @confirm="confirm">
    <Button>保存</Button>
  </Popconfirm>
</template>
