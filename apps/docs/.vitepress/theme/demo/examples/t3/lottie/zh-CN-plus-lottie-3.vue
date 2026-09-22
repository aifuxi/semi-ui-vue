<script setup lang="ts">
import { onMounted, onBeforeUnmount, shallowRef } from 'vue';
import { Lottie } from '@aifuxi/semi-ui-vue/lottie';
import '@aifuxi/semi-theme-default/lottie.css';
const data = shallowRef<object | null>(null);
const error = shallowRef('');
const controller = new AbortController();
onMounted(async () => {
  try {
    const response = await fetch('/demos/lottie.json', { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    data.value = await response.json();
  } catch (cause) {
    if (!controller.signal.aborted) error.value = String(cause);
  }
});
onBeforeUnmount(() => controller.abort());
</script>

<template>
  <p v-if="error" role="alert">{{ error }}</p>
  <Lottie v-if="data" :params="{ animationData: data }" width="300px" height="300px" />
</template>
