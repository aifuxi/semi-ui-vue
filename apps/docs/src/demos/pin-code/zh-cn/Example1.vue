<script setup lang="ts">
import { PinCode } from '@aifuxi/semi-ui-vue/pin-code';
import '@aifuxi/semi-theme-default/pin-code.css';
</script>

<template>
  <PinCode
    size="small"
    default-value="123456"
    @change="(value) => console.log(value)"
    @complete="(value) => console.log('pincode:', value)"
  />
  <PinCode size="default" default-value="123456" @change="(value) => console.log(value)" />
  <PinCode size="large" default-value="123456" @change="(value) => console.log(value)" />
</template>
