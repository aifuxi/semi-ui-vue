<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form } from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/radio.css';
</script>
<template>
  <Form v-slot="{ values }" style="max-width: 450px">
    <Form.Input field="name" label="Username" />
    <Form.RadioGroup field="isAnchor" label="Registered broadcaster">
      <Form.Radio value="yes">Yes</Form.Radio>
      <Form.Radio value="no">No</Form.Radio>
    </Form.RadioGroup>
    <Form.Input v-if="values.isAnchor === 'yes'" field="liveRoom" label="Room name" />
    <Button html-type="submit"> Submit </Button>
    <pre>{{ JSON.stringify(values, null, 2) }}</pre>
  </Form>
</template>
