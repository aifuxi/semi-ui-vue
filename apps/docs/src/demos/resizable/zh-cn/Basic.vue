<script setup lang="ts">
import { shallowRef } from 'vue';
import { Resizable } from '@aifuxi/semi-ui-vue/resizable';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/resizable.css';
import '@aifuxi/semi-theme-default/toast.css';
const text = shallowRef('Drag edge to resize');
function notify(content: string) {
  Toast.info({ content, duration: 1, stack: true });
}
</script>
<template>
  <div :style="{ width: '500px' }">
    <Resizable
      :style="{ backgroundColor: 'rgba(var(--semi-grey-1), 1)' }"
      :default-size="{
        width: '60%',
        height: 300,
      }"
      @change="text = 'resizing'"
      @resize-start="notify('resize start')"
      @resize-end="
        notify('resize end');
        text = 'Drag edge to resize';
      "
    >
      <div :style="{ marginLeft: '20%' }">{{ text }}</div>
    </Resizable>
  </div>
</template>
