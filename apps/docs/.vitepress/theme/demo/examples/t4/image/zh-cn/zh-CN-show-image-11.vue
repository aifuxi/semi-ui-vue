<script setup lang="ts">
import { Image, ImagePreview } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
const srcList = ['/demos/image-abstract.svg', '/demos/image-sky.svg'];
</script>
<template>
  <ImagePreview
    ><template #header="{ title }"
      ><div
        style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <span style="background: black; padding: 0 10px">自定义标题：{{ title }}</span>
      </div></template
    >
    <div>
      <Image
        v-for="(src, index) in srcList"
        :key="index"
        :src="src"
        :width="200"
        :alt="`lamp${index + 1}`"
        :preview="{ previewTitle: `lamp${index + 1}` }"
        style="margin-right: 5px"
      /></div
  ></ImagePreview>
</template>
