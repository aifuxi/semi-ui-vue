<script setup lang="ts">
import { shallowRef } from 'vue';
import { ImagePreview } from '@aifuxi/semi-ui-vue/image';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/image.css';
import '@aifuxi/semi-theme-default/button.css';
const srcList = [
  '/demos/image-abstract.svg',
  '/demos/image-sky.svg',
  '/demos/image-greenleaf.svg',
  '/demos/image-colorful.svg',
];
const visible1 = shallowRef(false);
const visible2 = shallowRef(false);
</script>
<template>
  <Button @click="visible1 = true">Preview single Image</Button
  ><ImagePreview v-model:visible="visible1" src="/demos/image-sky.svg" /><br /><Button
    style="margin-top: 20px"
    @click="visible2 = true"
    >Preview multiple Images</Button
  ><ImagePreview v-model:visible="visible2" :src="srcList" />
</template>
