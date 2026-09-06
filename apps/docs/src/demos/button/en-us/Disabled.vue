<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <div>
    <Button disabled>Disabled</Button
    ><Button disabled theme="borderless">No background and disabled</Button
    ><Button disabled theme="light">Light and disbaled</Button
    ><Button disabled theme="borderless" type="primary">No background, primary and disabled</Button
    ><Button disabled theme="solid" type="warning">Solid, warning and disabled</Button>
  </div>
</template>
