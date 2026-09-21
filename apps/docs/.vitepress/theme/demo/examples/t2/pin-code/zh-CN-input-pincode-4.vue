<script setup lang="ts">
import { PinCode } from '@aifuxi/semi-ui-vue/pin-code';
import '@aifuxi/semi-theme-default/pin-code.css';
function complete(value: string) {
  console.log('pincode: ', value);
}
</script>
<template>
  <div>
    <PinCode
      size="large"
      default-value="6688"
      :count="4"
      @complete="complete"
      @change="console.log"
    ></PinCode>
  </div>
</template>
