<script setup lang="ts">
import { shallowRef } from 'vue';
import { ResizeGroup, ResizeItem, ResizeHandler } from '@aifuxi/semi-ui-vue/resizable';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/resizable.css';
import '@aifuxi/semi-theme-default/button.css';
const text = shallowRef('drag to resize');
const direction = shallowRef<'horizontal' | 'vertical'>('horizontal');
function changeDirection() {
  direction.value = direction.value === 'horizontal' ? 'vertical' : 'horizontal';
}
</script>
<template>
  <div :style="{ width: '400px', height: '300px' }">
    <Button @click="changeDirection">{{ direction }}</Button>
    <ResizeGroup :direction="direction">
      <ResizeItem
        :default-size="5"
        @change="text = 'resizing'"
        @resize-end="text = 'drag to resize'"
      >
        <ResizeGroup direction="horizontal">
          <ResizeItem
            :style="{ backgroundColor: 'rgba(var(--semi-grey-1), 1)' }"
            @change="text = 'resizing'"
            @resize-end="text = 'drag to resize'"
          >
            <div :style="{ marginLeft: '20%', padding: '5px' }">
              {{ text }}
            </div>
          </ResizeItem>
          <ResizeHandler></ResizeHandler>
          <ResizeItem
            :style="{ backgroundColor: 'rgba(var(--semi-grey-1), 1)' }"
            @change="text = 'resizing'"
          >
            <div :style="{ marginLeft: '20%', padding: '5px' }">
              {{ text }}
            </div>
          </ResizeItem>
        </ResizeGroup>
      </ResizeItem>
      <ResizeHandler></ResizeHandler>
      <ResizeItem
        :style="{ backgroundColor: 'rgba(var(--semi-grey-1), 1)' }"
        :default-size="1.3"
        @change="text = 'resizing'"
      >
        <div :style="{ marginLeft: '20%', padding: '5px' }">
          {{ text }}
        </div>
      </ResizeItem>
    </ResizeGroup>
  </div>
</template>
