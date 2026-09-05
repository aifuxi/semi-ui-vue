<script setup lang="ts">
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
</script>

<template>
  <div>
    <Space style="margin-bottom: 10px; display: block"
      ><Switch size="small" aria-label="small switch demo" /><Switch
        size="small"
        default-checked
        aria-label="small switch demo" /><Switch
        size="small"
        loading
        aria-label="small switch demo" /><Switch
        size="small"
        loading
        default-checked
        aria-label="small switch demo" /></Space
    ><Space style="margin-bottom: 10px; display: block"
      ><Switch size="default" aria-label="default switch demo" /><Switch
        size="default"
        default-checked
        aria-label="default switch demo" /><Switch
        size="default"
        loading
        aria-label="default switch demo" /><Switch
        size="default"
        loading
        default-checked
        aria-label="default switch demo" /></Space
    ><Space
      ><Switch size="large" aria-label="large switch demo" /><Switch
        size="large"
        default-checked
        aria-label="large switch demo" /><Switch
        size="large"
        loading
        aria-label="large switch demo" /><Switch
        size="large"
        loading
        default-checked
        aria-label="large switch demo"
    /></Space>
  </div>
</template>
