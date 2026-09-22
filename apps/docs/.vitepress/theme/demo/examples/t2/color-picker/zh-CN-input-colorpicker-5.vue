<script setup lang="ts">
import { ColorPicker } from '@aifuxi/semi-ui-vue/color-picker';
import '@aifuxi/semi-theme-default/color-picker.css';
</script>
<template>
  <div>
    <div>
      <ColorPicker
        :default-value="ColorPicker.colorStringToValue('rgb(57,197,187)')"
        class=""
        :alpha="true"
        @change="console.log"
      ></ColorPicker>
    </div>
  </div>
</template>
