<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Form, useForm } from '@aifuxi/semi-ui-vue/form';
import { Modal } from '@aifuxi/semi-ui-vue/modal';
import { ref } from 'vue';
const [api] = useForm();
const visible = ref(false);
const result = ref('');
async function submit() {
  try {
    result.value = JSON.stringify(await api.validate());
    visible.value = false;
  } catch {
    result.value = '校验失败，请检查字段';
  }
}
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/modal.css';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Button html-type="button" @click="visible = true">打开弹窗</Button>
    <Modal
      title="创建"
      :visible="visible"
      @ok="submit"
      @cancel="
        () => {
          visible = false;
        }
      "
    >
      <Form :form="api">
        <Form.Select
          field="region"
          label="国家或地区"
          :option-list="
            ['China', 'US', 'Europe', 'Japan'].map((value) => ({ value, label: value }))
          "
          :rules="[{ required: true, message: '此项不能为空' }]"
        />
        <Form.Input
          field="owner"
          label="业务执行人"
          trigger="blur"
          :rules="[{ required: true, message: '此项不能为空' }]"
        />
        <Form.Select
          field="area"
          label="地区"
          :option-list="
            ['China', 'US', 'Europe', 'Japan'].map((value) => ({ value, label: value }))
          "
          :rules="[{ required: true, message: '此项不能为空' }]"
        />
        <Form.Input
          field="department"
          label="执行部门"
          trigger="blur"
          :rules="[{ required: true, message: '此项不能为空' }]"
        />
      </Form>
    </Modal>
    <output aria-live="polite">{{ result }}</output>
  </div>
</template>
