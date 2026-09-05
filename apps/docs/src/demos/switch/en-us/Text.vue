<script setup lang="ts">
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
</script>

<template>
  <div>
    <Switch
      size="default"
      checked-text="On"
      unchecked-text="Off"
      aria-label="Text switch demo"
    /><Switch
      size="default"
      checked-text="｜"
      unchecked-text="〇"
      style="margin-left: 5px"
      aria-label="Text switch demo"
    /><br /><br /><Switch
      default-checked
      size="default"
      checked-text="On"
      unchecked-text="Off"
      aria-label="Text switch demo"
    /><Switch
      default-checked
      size="default"
      checked-text="｜"
      unchecked-text="〇"
      style="margin-left: 5px"
      aria-label="Text switch demo"
    /><br /><br /><Switch
      size="large"
      checked-text="On"
      unchecked-text="Off"
      aria-label="Text switch demo"
    /><Switch
      size="large"
      checked-text="｜"
      unchecked-text="〇"
      style="margin-left: 5px"
      aria-label="Text switch demo"
    /><br /><br /><Switch
      default-checked
      size="large"
      checked-text="On"
      unchecked-text="Off"
      aria-label="Text switch demo"
    /><Switch
      default-checked
      size="large"
      checked-text="｜"
      unchecked-text="〇"
      style="margin-left: 5px"
      aria-label="Text switch demo"
    />
  </div>
</template>
