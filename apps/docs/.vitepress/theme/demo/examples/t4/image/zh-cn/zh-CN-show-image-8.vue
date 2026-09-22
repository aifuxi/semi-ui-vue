<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { Image, ImagePreview } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
const srcList = ['/demos/image-abstract.svg', '/demos/image-sky.svg', '/demos/image-greenleaf.svg'];
const container = useTemplateRef<HTMLElement>('container');
const getContainer = () => container.value!;
</script>
<template>
  <div id="container" ref="container" style="height: 400px; position: relative">
    <ImagePreview
      :get-popup-container="getContainer"
      style="height: 100%; display: flex; align-items: center; justify-content: center"
      ><Image
        v-for="(src, index) in srcList"
        :key="index"
        :src="src"
        :width="200"
        :alt="`lamp${index + 1}`"
        style="margin-right: 5px"
    /></ImagePreview>
  </div>
</template>
