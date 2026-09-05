<script setup lang="ts">
import { shallowRef } from 'vue';
import { Image } from '@aifuxi/semi-ui-vue/image';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/image.css';
import '@aifuxi/semi-theme-default/button.css';
const reload = shallowRef(0);
</script>
<template>
  <Image
    :key="reload"
    :width="300"
    :height="200"
    :src="`/demos/photo.svg?reload=${reload}`"
    alt="Sample image"
    ><template #placeholder
      ><Image
        src="/demos/photo.svg?preview=1"
        :width="300"
        :height="200"
        :preview="false"
        alt="Sample image" /></template></Image
  ><br /><Button theme="solid" style="margin-top: 10px" @click="reload++">Reload</Button>
</template>
