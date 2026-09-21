<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
</script>

<template>
  <InputNumber
    :formatter="(value) => `${value}`.replace(/\D/g, '')"
    :min="0"
    :max="Number.MAX_SAFE_INTEGER"
    @number-change="(number) => console.log(number)"
  ></InputNumber>
</template>
