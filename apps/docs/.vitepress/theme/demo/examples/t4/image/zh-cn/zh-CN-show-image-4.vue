<script setup lang="ts">
import { shallowRef } from 'vue';
import { Image } from '@aifuxi/semi-ui-vue/image';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/image.css';
import '@aifuxi/semi-theme-default/button.css';
const reload = shallowRef('');
</script>
<template>
  <Image
    :key="reload"
    :width="300"
    :height="200"
    :src="`/demos/image-abstract-big.svg?reload=${reload}`"
    ><template #placeholder
      ><Image
        src="/demos/image-abstract-small.svg"
        :width="300"
        :height="200"
        :preview="false" /></template></Image
  ><br /><Button theme="solid" style="margin-top: 10px" @click="reload = String(Date.now())"
    >Reload</Button
  >
</template>
