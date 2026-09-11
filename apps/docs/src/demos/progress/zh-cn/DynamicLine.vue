<script setup lang="ts">
import { shallowRef } from 'vue';
import { Progress } from '@aifuxi/semi-ui-vue/progress';
import '@aifuxi/semi-theme-default/progress.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import IconChevronLeft from '@aifuxi/semi-icons-vue/icons/IconChevronLeft';
import IconChevronRight from '@aifuxi/semi-icons-vue/icons/IconChevronRight';
const percent = shallowRef(40);
</script>

<template>
  <div>
    <Progress :percent="percent" show-info aria-label="磁盘使用量" />
    <Button theme="light" aria-label="减少进度" :disabled="percent === 0" @click="percent -= 10"
      ><template #icon><IconChevronLeft /></template
    ></Button>
    <Button theme="light" aria-label="增加进度" :disabled="percent >= 100" @click="percent += 10"
      ><template #icon><IconChevronRight /></template
    ></Button>
  </div>
</template>
