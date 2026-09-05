<script setup lang="ts">
import { FloatButton } from '@aifuxi/semi-ui-vue/float-button';
import IconAIEditLevel1 from '@aifuxi/semi-icons-vue/icons/IconAIEditLevel1';
import '@aifuxi/semi-theme-default/float-button.css';
</script>
<template>
  <div style="min-height: 340px">
    <span>Click to jump: Row four, third column at the bottom right of the page</span>
    <FloatButton :style="{ bottom: '100px' }" :href="'https://semi.design'" :target="'_blank'"
      ><template #icon><IconAIEditLevel1 /></template
    ></FloatButton>
  </div>
</template>
