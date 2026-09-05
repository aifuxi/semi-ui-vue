<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';

function confirm(): void {
  console.log('confirmed');
}
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <Popconfirm title="Save this change?" content="This change cannot be undone." @confirm="confirm">
    <Button>Save</Button>
  </Popconfirm>
</template>
