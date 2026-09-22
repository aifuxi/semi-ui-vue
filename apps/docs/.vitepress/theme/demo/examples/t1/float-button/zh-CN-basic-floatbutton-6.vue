<script setup lang="ts">
import { FloatButton } from '@aifuxi/semi-ui-vue/float-button';
import IconAIEditLevel1 from '@aifuxi/semi-icons-vue/icons/IconAIEditLevel1';
import '@aifuxi/semi-theme-default/float-button.css';
</script>
<template>
  <div style="min-height: 340px; transform: translateZ(0)">
    <span>多彩按钮：页面右下第一列</span>
    <FloatButton
      colorful
      :style="{ bottom: '110px', insetInlineEnd: '150px' }"
      :href="'https://semi.design'"
      :target="'_blank'"
      ><template #icon><IconAIEditLevel1 /></template
    ></FloatButton>
  </div>
</template>
