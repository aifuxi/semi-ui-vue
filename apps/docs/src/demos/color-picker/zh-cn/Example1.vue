<script setup lang="ts">
import { shallowRef } from 'vue';
import { ColorPicker, colorStringToValue, type ColorValue } from '@aifuxi/semi-ui-vue/color-picker';
import '@aifuxi/semi-theme-default/color-picker.css';

const color = shallowRef<ColorValue>(colorStringToValue('#39c5bb'));
</script>

<template>
  <ColorPicker v-model="color" alpha />
</template>
