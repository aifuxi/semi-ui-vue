<script setup lang="ts">
import { PinCode } from '@aifuxi/semi-ui-vue/pin-code';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/pin-code.css';
import '@aifuxi/semi-theme-default/button.css';
import { shallowRef } from 'vue';
const value = shallowRef('69af41');
let seed = 42;
function randomValue() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  value.value = String(seed % 1000000).padStart(6, '0');
}
function complete(code: string) {
  console.log('pincode: ', code);
}
function change(code: string) {
  console.log(code);
  value.value = code;
}
</script>
<template>
  <div>
    <Button @click="randomValue">Set Random Value</Button><br /><br /><PinCode
      format="mixed"
      :value="value"
      @complete="complete"
      @change="change"
    />
  </div>
</template>
