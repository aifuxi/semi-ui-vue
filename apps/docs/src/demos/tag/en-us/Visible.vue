<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { RadioGroup, Radio } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
const visible = shallowRef(false);
function toggleVisible(): void {
  visible.value = !visible.value;
}
</script>

<template>
  <div>
    <RadioGroup :default-value="0" type="button" @change="toggleVisible"
      ><Radio :value="1">Show</Radio><Radio :value="0">Hide</Radio></RadioGroup
    >
    <div style="margin-top: 10px">
      <Tag :visible="visible" size="large" color="light-blue">Invisible tag </Tag>
    </div>
  </div>
</template>
