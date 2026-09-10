<script setup lang="ts">
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/tooltip.css';
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <Tooltip content="Copy link">
    <Button>Hover me</Button>
  </Tooltip>
</template>
