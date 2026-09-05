<script setup lang="ts">
import { shallowRef } from 'vue';
import { Spin } from '@aifuxi/semi-ui-vue/spin';
import '@aifuxi/semi-theme-default/spin.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const loading = shallowRef(false);
</script>

<template>
  <div>
    <Button style="margin-right: 20px" @click="loading = !loading">延迟显示的加载器</Button>
    <Spin :delay="1000" :spinning="loading" />
  </div>
</template>
