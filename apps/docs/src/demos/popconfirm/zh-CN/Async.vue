<script setup lang="ts">
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { onBeforeUnmount } from 'vue';
const pending = new Map<ReturnType<typeof setTimeout>, () => void>();
function delay(rejectResult: boolean) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(timer);
      if (rejectResult) {
        console.log('reject, popconfirm still exist');
        reject(new Error('Keep the confirmation open'));
      } else {
        console.log('resolve, close popconfirm');
        resolve();
      }
    }, 2000);
    pending.set(timer, resolve);
  });
}
function onConfirm() {
  return delay(false);
}
function onCancel() {
  return delay(true);
}
onBeforeUnmount(() => {
  for (const [timer, resolve] of pending) {
    clearTimeout(timer);
    resolve();
  }
  pending.clear();
});
</script>
<template>
  <Popconfirm
    title="确定是否要保存此修改？"
    content="此修改将不可逆"
    @confirm="onConfirm"
    @cancel="onCancel"
    ><Button>保存</Button></Popconfirm
  >
</template>
