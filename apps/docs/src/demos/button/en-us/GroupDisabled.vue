<script setup lang="ts">
import { Button, ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <div style="display: flex">
    <div style="margin-right: 10px">
      <ButtonGroup disabled
        ><Button>Copy</Button><Button>Query</Button><Button>Cut</Button></ButtonGroup
      >
    </div>
  </div>
</template>
