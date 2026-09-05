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
    result.value = 'Validation failed; check the fields';
  }
}
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/modal.css';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Button html-type="button" @click="visible = true">Open dialog</Button>
    <Modal
      title="Create"
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
          label="Country or region"
          :option-list="
            ['China', 'US', 'Europe', 'Japan'].map((value) => ({ value, label: value }))
          "
          :rules="[{ required: true, message: 'This field is required' }]"
        />
        <Form.Input
          field="owner"
          label="Owner"
          trigger="blur"
          :rules="[{ required: true, message: 'This field is required' }]"
        />
        <Form.Select
          field="area"
          label="Area"
          :option-list="
            ['China', 'US', 'Europe', 'Japan'].map((value) => ({ value, label: value }))
          "
          :rules="[{ required: true, message: 'This field is required' }]"
        />
        <Form.Input
          field="department"
          label="Department"
          trigger="blur"
          :rules="[{ required: true, message: 'This field is required' }]"
        />
      </Form>
    </Modal>
    <output aria-live="polite">{{ result }}</output>
  </div>
</template>
