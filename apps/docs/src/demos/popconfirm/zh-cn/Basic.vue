<script setup lang="ts">
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/toast.css';
const onConfirm = () => {
  Toast.success('确认保存！');
};
const onCancel = () => {
  Toast.warning('取消保存！');
};
</script>
<template>
  <Popconfirm
    title="确定是否要保存此修改？"
    content="此修改将不可逆"
    @confirm="onConfirm"
    @cancel="onCancel"
  >
    <Button> 保存</Button>
  </Popconfirm>
</template>
