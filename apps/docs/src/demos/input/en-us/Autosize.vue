<script setup lang="ts">
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
</script>

<template>
  <div>
    <TextArea autosize :rows="1"></TextArea>
    <br /><br />
    <TextArea autosize :max-count="100"></TextArea>
  </div>
</template>
