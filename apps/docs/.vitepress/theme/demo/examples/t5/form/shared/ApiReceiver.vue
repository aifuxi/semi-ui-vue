<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import type { FormApi } from '@aifuxi/semi-ui-vue/form';
const props = defineProps<{ formApi: FormApi }>();
let revision = 0;
function change() {
  props.formApi.setValue('name', `Semi ${++revision}`);
}
</script>
<template>
  <Button html-type="button" @click="change">withFormApi: setValue('name')</Button>
</template>
