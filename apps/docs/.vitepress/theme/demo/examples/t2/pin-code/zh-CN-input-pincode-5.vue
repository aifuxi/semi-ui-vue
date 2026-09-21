<script setup lang="ts">
import { PinCode } from '@aifuxi/semi-ui-vue/pin-code';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/pin-code.css';
import '@aifuxi/semi-theme-default/typography.css';
function complete(value: string) {
  console.log('pincode: ', value);
}
function lowercase(character: string) {
  return /[a-z]/.test(character);
}
</script>
<template>
  <div>
    <Text>纯数字</Text>
    <PinCode format="number" @complete="complete"></PinCode>
    <br />
    <Text>字母和数字</Text>
    <PinCode format="mixed" @complete="complete"></PinCode>
    <br />
    <Text>只大写字母</Text>
    <PinCode :format="/[A-Z]/" @complete="complete"></PinCode>
    <br />
    <Text>只小写字母(函数判断)</Text>
    <PinCode :format="lowercase" @complete="complete"></PinCode>
  </div>
</template>
