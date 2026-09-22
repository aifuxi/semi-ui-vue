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
    <Form.Input field="name" label="用户名" />
    <Form.RadioGroup field="isAnchor" label="是否已注册主播">
      <Form.Radio value="yes">是</Form.Radio>
      <Form.Radio value="no">否</Form.Radio>
    </Form.RadioGroup>
    <Form.Input v-if="values.isAnchor === 'yes'" field="liveRoom" label="直播间名称" />
    <Button html-type="submit"> 提交 </Button>
    <pre>{{ JSON.stringify(values, null, 2) }}</pre>
  </Form>
</template>
