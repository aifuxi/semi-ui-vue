<script setup lang="ts">
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
</script>

<template>
  <div>
    <TextArea></TextArea>
    <br /><br />
    <TextArea :max-count="100" show-clear></TextArea>
  </div>
</template>
