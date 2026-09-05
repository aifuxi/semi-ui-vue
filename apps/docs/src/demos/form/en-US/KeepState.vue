<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
import { ref } from 'vue';
const show = ref(true);
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/switch.css';
</script>
<template>
  <Form v-slot="{ formState }">
    <Form.Switch field="alwaysShow" label="Always visible field" />
    <label> <input v-model="show" type="checkbox" />Show conditional fields</label>
    <Form.Input v-if="show" field="conditionalField" label="keepState" keep-state />
    <Form.Input v-if="show" field="noKeepState" label="Without keepState" />
    <Button html-type="submit">Submit</Button>
    <pre>{{ JSON.stringify(formState, null, 2) }}</pre>
  </Form>
</template>
