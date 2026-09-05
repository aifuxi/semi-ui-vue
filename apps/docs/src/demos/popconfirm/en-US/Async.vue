<script setup lang="ts">
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
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
  <ConfigProvider :locale="enUS"
    ><Popconfirm
      title="Are you sure to save this modification?"
      content="This modification will be irreversible"
      @confirm="onConfirm"
      @cancel="onCancel"
      ><Button>Save</Button></Popconfirm
    ></ConfigProvider
  >
</template>
