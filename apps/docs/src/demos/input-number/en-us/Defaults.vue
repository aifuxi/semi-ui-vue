<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
</script>

<template>
  <div :style="{ width: '280px' }">
    <label>Set defaultValue to 1 </label>
    <InputNumber :default-value="1"></InputNumber>
    <br /><br />

    <label>Set disabled to true</label>
    <InputNumber :default-value="2" disabled></InputNumber>
    <br /><br />

    <label>Set precision to 2 </label>
    <InputNumber :precision="2" :default-value="1.234"></InputNumber>
    <br /><br />

    <label>Set innerButtons=true </label>
    <InputNumber
      :inner-buttons="true"
      suffix="Hour"
      :default-value="1"
      :style="{ width: '190px' }"
    ></InputNumber>
    <br />
  </div>
</template>
