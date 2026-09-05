<script setup lang="ts">
import { ColorPicker } from '@aifuxi/semi-ui-vue/color-picker';
import '@aifuxi/semi-theme-default/color-picker.css';
</script>
<template>
  <div>
    <ColorPicker :alpha="true" @change="console.log"
      ><template #top><div>TopSlot</div></template
      ><template #bottom><div>Bottom Slot</div></template></ColorPicker
    >
  </div>
</template>
