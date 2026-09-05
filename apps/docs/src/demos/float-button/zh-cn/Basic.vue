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
    <span>基本使用：页面右下第三列 1 </span>
    <FloatButton :style="{ bottom: '270px' }" @click="onClick"
      ><template #icon><IconAIEditLevel1 /></template
    ></FloatButton>
  </div>
</template>
