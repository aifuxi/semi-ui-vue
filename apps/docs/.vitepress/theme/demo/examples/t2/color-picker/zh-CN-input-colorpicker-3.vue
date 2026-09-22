<script setup lang="ts">
import { ColorPicker } from '@aifuxi/semi-ui-vue/color-picker';
import '@aifuxi/semi-theme-default/color-picker.css';
</script>
<template>
  <div><ColorPicker :alpha="true" @change="console.log"></ColorPicker></div>
</template>
