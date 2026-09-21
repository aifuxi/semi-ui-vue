<script setup lang="ts">
import { shallowRef } from 'vue';
import { Form, type FormApi } from '@aifuxi/semi-ui-vue/form';
import { Modal } from '@aifuxi/semi-ui-vue/modal';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/modal.css';
defineProps<{ visible: boolean }>();
const emit = defineEmits<{
  cancel: [];
  create: [values: { name: string; src: string; desc: string }];
}>();
const formApi = shallowRef<FormApi>();
function validIcon(_rule: unknown, value: unknown) {
  return (
    typeof value === 'string' &&
    (/^\/demos\//.test(value) ||
      /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?::\d+)?(?:\/[^\s]*)?$/i.test(
        value,
      ))
  );
}
// Match the upstream synchronous callback; Form owns validation feedback.
function submit(): void {
  void formApi.value
    ?.validate()
    .then((values) => {
      emit('create', {
        name: String(values.name),
        src: String(values.src),
        desc: String(values.desc),
      });
    })
    .catch(() => {
      // Form displays validation feedback and the dialog remains open.
    });
}
</script>
<template>
  <Modal
    :visible="visible"
    :cancel-button-props="{ autofocus: false }"
    title="自定义 MCP"
    close-on-esc
    @ok="submit"
    @cancel="emit('cancel')"
    ><Form :get-form-api="(api) => (formApi = api)" layout="vertical"
      ><Form.Input
        field="name"
        label="MCP 名称"
        :rules="[{ required: true, message: '请输入 MCP 名称' }]"
        style="width: 100%" /><Form.Input
        field="src"
        label="MCP 图标 URL"
        init-value="/demos/one.svg"
        :rules="[
          { required: true, message: '请输入 MCP 图标 URL' },
          { validator: validIcon, message: '请输入有效的 MCP 图标 URL' },
        ]"
        style="width: 100%" /><Form.TextArea
        field="desc"
        label="MCP 介绍"
        :rules="[{ required: true, message: '请输入 MCP 介绍' }]"
        style="width: 100%" /></Form
  ></Modal>
</template>
