<script setup lang="ts">
import { Checkbox, type CheckboxChangeEvent } from '@aifuxi/semi-ui-vue/checkbox';

function changed(event: CheckboxChangeEvent) {
  console.log(event.target.checked);
}
import '@aifuxi/semi-theme-default/checkbox.css';
</script>

<template>
  <Checkbox aria-label="Checkbox example" @change="changed">Semi Design</Checkbox>
</template>
