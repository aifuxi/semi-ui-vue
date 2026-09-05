<script setup lang="ts">
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
</script>

<template>
  <div>
    <Input default-value="ies" validate-status="warning"></Input>
    <br /><br />
    <Input default-value="ies" validate-status="error"></Input>
    <br /><br />
    <Input default-value="ies"></Input>
  </div>
</template>
