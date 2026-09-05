<script setup lang="ts">
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
</script>

<template>
  <div>
    <Switch loading aria-label="Loading off" /><br /><Switch
      loading
      default-checked
      aria-label="Loading on"
    />
  </div>
</template>
