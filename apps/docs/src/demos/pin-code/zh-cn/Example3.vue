<script setup lang="ts">
import { PinCode, type PinCodeExposed } from '@aifuxi/semi-ui-vue/pin-code';
import { useTemplateRef } from 'vue';

const pinCode = useTemplateRef<PinCodeExposed>('pinCode');
import '@aifuxi/semi-theme-default/pin-code.css';
</script>

<template>
  <button type="button" @click="pinCode?.focus(2)">聚焦第三格</button>
  <PinCode ref="pinCode" :count="4" :format="/[A-Z]/" default-value="ABCD" />
</template>
