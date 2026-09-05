<script setup lang="ts">
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
</script>

<template>
  <div>
    <Input default-value="enabled input"></Input>
    <br />
    <br />
    <Input disabled default-value="disbaled input"></Input>
  </div>
</template>
