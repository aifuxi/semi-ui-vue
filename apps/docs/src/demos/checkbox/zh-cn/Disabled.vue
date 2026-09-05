<script setup lang="ts">
import { Checkbox } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
</script>

<template>
  <div>
    <Checkbox :default-checked="false" disabled aria-label="Checkbox demo"
      >Unchecked Disabled</Checkbox
    ><br /><Checkbox default-checked disabled aria-label="Checkbox demo">Checked Disabled</Checkbox>
  </div>
</template>
