<script setup lang="ts">
import { FloatButton } from '@aifuxi/semi-ui-vue/float-button';
import IconAIEditLevel1 from '@aifuxi/semi-icons-vue/icons/IconAIEditLevel1';
import '@aifuxi/semi-theme-default/float-button.css';
function onClick() {
  console.info('float button clicked');
}
</script>
<template>
  <div style="min-height: 340px">
    <span>Square: Row three, third column at the bottom right of the page </span>
    <FloatButton shape="square" :style="{ bottom: '150px' }" @click="onClick"
      ><template #icon><IconAIEditLevel1 /></template
    ></FloatButton>
  </div>
</template>
