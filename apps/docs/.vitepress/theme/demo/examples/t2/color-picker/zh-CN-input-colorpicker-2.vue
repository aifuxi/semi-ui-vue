<script setup lang="ts">
import { ColorPicker } from '@aifuxi/semi-ui-vue/color-picker';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/color-picker.css';
import '@aifuxi/semi-theme-default/button.css';
</script>
<template>
  <div>
    <div>
      <ColorPicker :alpha="true" :use-popover="true" @change="console.log"></ColorPicker>
      <br />
      <div>自定义 trigger</div>
      <ColorPicker :alpha="true" :use-popover="true" @change="console.log">
        <Button> Trigger </Button>
      </ColorPicker>
    </div>
  </div>
</template>
