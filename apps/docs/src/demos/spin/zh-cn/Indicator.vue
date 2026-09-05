<script setup lang="ts">
import { Spin } from '@aifuxi/semi-ui-vue/spin';
import '@aifuxi/semi-theme-default/spin.css';
import IconLoading from '@aifuxi/semi-icons-vue/icons/IconLoading';
</script>

<template>
  <div style="margin-left: 30px">
    <div>自定义加载指示符。</div>
    <Spin
      ><template #indicator><IconLoading /></template
    ></Spin>
  </div>
</template>
