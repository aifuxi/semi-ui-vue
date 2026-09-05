<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <div>
    <Button disabled>Disabled</Button
    ><Button disabled theme="borderless">Borderless disabled</Button
    ><Button disabled theme="light">Light disabled</Button
    ><Button disabled theme="borderless" type="primary">Primary borderless disabled</Button
    ><Button disabled theme="solid" type="warning">Solid warning disabled</Button>
  </div>
</template>
