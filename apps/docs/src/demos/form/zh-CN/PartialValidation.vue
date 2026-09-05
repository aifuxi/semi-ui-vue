<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form, useForm } from '@aifuxi/semi-ui-vue/form';
import { ref } from 'vue';
const [api] = useForm();
const result = ref('');
const fields = ['a[1]', 'a[0]', 'b.name[0]', 'b.name[1]', 'b.type', 'c', 'd'];
const options = ['a', 'b', 'c', 'd', 'b.name'];
const validator = (value: unknown) =>
  !value ? '此项不能为空' : String(value).length <= 5 ? '长度必须大于 5' : '';
async function validate(all = false) {
  try {
    await api.validate(all ? options : ((api.getValue('validateScope') as string[]) ?? []));
    result.value = '校验通过';
  } catch {
    result.value = '校验失败，请检查字段';
  }
}
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/checkbox.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Form :form="api" auto-scroll-to-error>
    <Form.Input
      v-for="field in fields"
      :key="field"
      :field="field"
      :validator="validator"
      trigger="blur"
    />
    <Form.CheckboxGroup
      field="validateScope"
      label="需要校验的字段"
      :options="options"
      :init-value="['a', 'b']"
    />
    <Form.CheckboxGroup field="resetScope" label="需要重置的字段" :options="options" />
    <Button html-type="reset"> 重置</Button>
    <Button html-type="button" @click="validate(true)">校验全部</Button>
    <Button html-type="button" @click="validate()">校验所选字段</Button>
    <Button html-type="button" @click="api.reset(api.getValue('resetScope') as string[])">
      重置所选字段</Button
    >
    <output>{{ result }}</output>
  </Form>
</template>
