<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { useFormApi } from '@aifuxi/semi-ui-vue/form';
const api = useFormApi();
let revision = 0;
function change() {
  api.setValue('name', `Semi ${++revision}`);
}
</script>
<template>
  <Button html-type="button" @click="change">formApi.setValue('name')</Button>
</template>
