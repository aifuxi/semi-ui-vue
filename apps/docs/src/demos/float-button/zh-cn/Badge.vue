<script setup lang="ts">
import { FloatButton } from '@aifuxi/semi-ui-vue/float-button';
import IconAIEditLevel1 from '@aifuxi/semi-icons-vue/icons/IconAIEditLevel1';
import '@aifuxi/semi-theme-default/float-button.css';
</script>
<template>
  <div style="min-height: 340px">
    <span>带徽章：页面右下第二列</span>
    <FloatButton
      disabled
      :badge="{ dot: true, type: 'danger' }"
      :style="{ bottom: 270, insetInlineEnd: '100px' }"
      ><template #icon><IconAIEditLevel1 /></template
    ></FloatButton>
    <FloatButton
      :badge="{ count: 1000, overflowCount: 999 }"
      :size="'large'"
      :style="{ bottom: 210, insetInlineEnd: 100 }"
      ><template #icon><IconAIEditLevel1 /></template
    ></FloatButton>
    <FloatButton :badge="{ dot: true }" colorful :style="{ bottom: 170, insetInlineEnd: 100 }"
      ><template #icon><IconAIEditLevel1 /></template
    ></FloatButton>
    <FloatButton
      colorful
      size="large"
      :badge="{ count: 'VIP', type: 'danger' }"
      :style="{ bottom: 110, insetInlineEnd: 100 }"
      ><template #icon><IconAIEditLevel1 /></template
    ></FloatButton>
  </div>
</template>
