<script setup lang="ts">
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
</script>

<template>
  <div>
    <Switch disabled aria-label="Disabled off" /><br /><Switch
      disabled
      :checked="true"
      aria-label="Disabled on"
    />
  </div>
</template>
