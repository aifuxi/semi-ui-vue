<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form, useForm } from '@aifuxi/semi-ui-vue/form';
const [api] = useForm();
function update(value: unknown) {
  api.setValue('Note', value === 'male' ? 'Hi male' : 'Hi female!');
}
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <Form :form="api" style="max-width: 250px">
    <p>选择 Sex 后会更新 Note</p>
    <Form.Input field="Note" />
    <Form.Select
      field="Sex"
      :option-list="['female', 'male'].map((value) => ({ value, label: value }))"
      @change="update"
    />
    <Button html-type="submit">提交</Button>
    <Button html-type="reset">重置</Button>
  </Form>
</template>
