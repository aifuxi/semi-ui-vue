<script setup lang="ts">
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';
import '@aifuxi/semi-theme-default/auto-complete.css';
</script>
<template>
  <div>
    <AutoComplete default-value="ies" validate-status="warning"></AutoComplete>
    <br />
    <br />
    <AutoComplete default-value="ies" validate-status="error"></AutoComplete>
    <br />
    <br />
    <AutoComplete default-value="ies"></AutoComplete>
  </div>
</template>
