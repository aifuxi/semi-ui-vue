<script setup lang="ts">
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/auto-complete.css';
import '@aifuxi/semi-theme-default/empty.css';
import { IllustrationNoContent } from '@aifuxi/semi-illustrations-vue';
import { shallowRef, onBeforeUnmount } from 'vue';
const timers = new Set<ReturnType<typeof setTimeout>>();
function later(callback: () => void, delay: number) {
  const id = setTimeout(() => {
    timers.delete(id);
    callback();
  }, delay);
  timers.add(id);
  return id;
}
onBeforeUnmount(() => timers.forEach(clearTimeout));
const data = shallowRef<number[]>([]);
const loading = shallowRef(false);
let token = 0;
function fetchData(input: string) {
  const current = ++token;
  loading.value = true;
  later(() => {
    if (current !== token) return;
    data.value = input ? [0.12, 0.28, 0.43, 0.67, 0.91] : [];
    loading.value = false;
  }, 1000);
}
</script>
<template>
  <AutoComplete :loading="loading" :data="data" @search="fetchData"
    ><template #emptyContent
      ><Empty style="padding: 12px; width: 300px" description="暂无内容"
        ><template #image
          ><IllustrationNoContent
            style="width: 150px; height: 150px" /></template></Empty></template
  ></AutoComplete>
</template>
