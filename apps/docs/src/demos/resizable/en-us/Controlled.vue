<script setup lang="ts">
import { shallowRef } from 'vue';
import { Resizable, type ResizeSize } from '@aifuxi/semi-ui-vue/resizable';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/resizable.css';
import '@aifuxi/semi-theme-default/button.css';
const size = shallowRef<ResizeSize>({ width: 200, height: 100 });
function grow() {
  size.value = { width: Number(size.value.width) + 10, height: Number(size.value.height) + 10 };
}
</script>
<template>
  <div :style="{ width: '500px', height: '60%' }">
    <Button @click="grow">set += 10</Button>
    <Resizable
      v-model:size="size"
      :style="{ backgroundColor: 'rgba(var(--semi-grey-1), 1)', marginTop: '10px' }"
    >
      <div :style="{ marginLeft: '20%' }">Control Width/Height</div>
    </Resizable>
  </div>
</template>
