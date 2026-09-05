<script setup lang="ts">
import { ref } from 'vue';
import { Resizable, type ResizeSize } from '@aifuxi/semi-ui-vue/resizable';

const size = ref<ResizeSize>({ width: 320, height: 180 });
import '@aifuxi/semi-theme-default/resizable.css';
</script>

<template>
  <Resizable
    v-model:size="size"
    :min-width="180"
    max-width="80%"
    :grid="[8, 8]"
    @change="
      (nextSize: ResizeSize, event: MouseEvent | TouchEvent | Touch, direction: string) =>
        console.log(nextSize, event, direction)
    "
  >
    可拖动八个方向的边缘与角点
  </Resizable>
</template>
