<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { useFieldApi } from '@aifuxi/semi-ui-vue/form';
const api = useFieldApi('name');
let revision = 0;
function change() {
  api.setValue(`Semi ${++revision}`);
}
</script>
<template>
  <Button html-type="button" @click="change">fieldApi.setValue()</Button>
</template>
