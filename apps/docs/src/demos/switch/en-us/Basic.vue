<script setup lang="ts">
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
</script>

<template>
  <div>
    <Switch aria-label="a switch for demo" @change="console.log" /><br /><Switch
      default-checked
      aria-label="a switch for semi demo"
      @change="console.log"
    />
  </div>
</template>
