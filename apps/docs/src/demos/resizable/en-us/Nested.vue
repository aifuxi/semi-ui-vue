<script setup lang="ts">
import { shallowRef } from 'vue';
import { ResizeGroup, ResizeItem, ResizeHandler } from '@aifuxi/semi-ui-vue/resizable';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/resizable.css';
import '@aifuxi/semi-theme-default/toast.css';
const text = shallowRef('Drag to resize');
function notify(content: string) {
  Toast.info({ content, duration: 1, stack: true });
}
</script>
<template>
  <div :style="{ width: '1000px', height: '600px' }">
    <ResizeGroup direction="vertical">
      <ResizeItem
        :style="{ backgroundColor: 'rgba(var(--semi-grey-1), 1)' }"
        :default-size="'20%'"
        @change="text = 'resizing'"
        @resize-start="notify('resize start')"
        @resize-end="
          notify('resize end');
          text = 'Drag to resize';
        "
      >
        <div :style="{ marginLeft: '20%' }">
          {{ 'header' }}
        </div>
      </ResizeItem>
      <ResizeHandler></ResizeHandler>
      <ResizeItem :default-size="'80%'" @change="text = 'resizing'">
        <ResizeGroup direction="horizontal">
          <ResizeItem
            :style="{
              backgroundColor: 'rgba(var(--semi-grey-1), 1)',
              border: 'var(--semi-color-border) 1px solid',
            }"
            :default-size="'25%'"
            @change="text = 'resizing'"
            @resize-start="notify('resize start')"
            @resize-end="
              notify('resize end');
              text = 'Drag to resize';
            "
          >
            <div :style="{ marginLeft: '20%' }">
              {{ 'tab' }}
            </div>
          </ResizeItem>
          <ResizeHandler></ResizeHandler>
          <ResizeItem
            :style="{
              backgroundColor: 'rgba(var(--semi-grey-1), 1)',
              border: 'var(--semi-color-border) 1px solid',
            }"
            :default-size="'75%'"
            @change="text = 'resizing'"
          >
            <div :style="{ marginLeft: '20%' }">
              {{ text }}
            </div>
          </ResizeItem>
        </ResizeGroup>
      </ResizeItem>
    </ResizeGroup>
  </div>
</template>
