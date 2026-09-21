<script setup lang="ts">
import { PinCode } from '@aifuxi/semi-ui-vue/pin-code';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/pin-code.css';
import '@aifuxi/semi-theme-default/button.css';
import { shallowRef, useTemplateRef } from 'vue';
import type { PinCodeExposed } from '@aifuxi/semi-ui-vue/pin-code';
const pin = useTemplateRef<PinCodeExposed>('pin');
const value = shallowRef('69af41');
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
    <Button @click="pin?.focus(2)">Focus Third Input</Button><br /><br /><PinCode
      ref="pin"
      format="mixed"
      :value="value"
      @complete="complete"
      @change="change"
    />
  </div>
</template>
