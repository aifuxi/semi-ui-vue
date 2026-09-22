<script setup lang="ts">
import { shallowRef } from 'vue';
import { Radio } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const disabled = shallowRef(true);
</script>

<template>
  <div>
    <Radio
      :default-checked="false"
      :disabled="disabled"
      aria-label="Radio demo"
      name="zh-cn-radio-disabled"
      >Disabled</Radio
    ><br /><Radio
      default-checked
      :disabled="disabled"
      aria-label="Radio demo"
      name="zh-cn-radio-default-disabled"
      >Disabled</Radio
    >
    <div style="margin-top: 20px">
      <Button type="primary" @click="disabled = !disabled">Toggle disabled</Button>
    </div>
  </div>
</template>
