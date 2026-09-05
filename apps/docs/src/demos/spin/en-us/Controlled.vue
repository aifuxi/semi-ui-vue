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
    <Button style="margin-right: 20px" @click="loading = !loading">Controlled Spin</Button>
    <Spin :spinning="loading" />
  </div>
</template>
