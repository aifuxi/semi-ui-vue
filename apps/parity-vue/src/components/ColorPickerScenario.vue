<script setup lang="ts">
import { ColorPicker, colorStringToValue } from '@aifuxi/semi-ui-vue';

const initialColor = colorStringToValue('#7856ffcc');
</script>

<template>
  <div class="color-picker-scenario" data-testid="color-picker-vue">
    <div class="color-picker-scenario__inline" data-parity-target="color-picker-inline">
      <ColorPicker
        :alpha="true"
        :eye-dropper="false"
        :width="220"
        :height="140"
        :default-value="initialColor"
      />
    </div>
    <div class="color-picker-scenario__popover-trigger" data-parity-target="color-picker-trigger">
      <ColorPicker
        :alpha="true"
        :eye-dropper="false"
        :width="180"
        :height="110"
        :default-value="initialColor"
        :use-popover="true"
        :popover-props="{
          className: 'color-picker-target-popover',
          motion: false,
          position: 'bottom',
          trigger: 'custom',
          visible: true,
        }"
      />
    </div>
  </div>
</template>
