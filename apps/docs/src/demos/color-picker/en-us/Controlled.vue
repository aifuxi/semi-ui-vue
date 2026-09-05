<script setup lang="ts">
import { ColorPicker } from '@aifuxi/semi-ui-vue/color-picker';
import '@aifuxi/semi-theme-default/color-picker.css';
import { shallowRef } from 'vue';
import { colorStringToValue } from '@aifuxi/semi-ui-vue/color-picker';
const value = shallowRef(colorStringToValue('#39c5bb'));
</script>
<template>
  <ColorPicker v-model="value" alpha />
</template>
