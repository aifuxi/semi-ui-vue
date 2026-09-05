<script setup lang="ts">
import { CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
</script>

<template>
  <div style="border: 1px solid var(--semi-color-border); padding: 10px; margin-bottom: 24px">
    <p style="font-weight: 600; font-size: 16px">Checkbox Content Demo</p>
    <CheckboxGroup
      :options="['Call', 'IM', 'Ticket', 'Offline', 'Buzz']"
      direction="horizontal"
      aria-label="Contact channel"
      style="margin-top: 10px"
    />
  </div>
</template>
