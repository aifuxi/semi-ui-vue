<script setup lang="ts">
import { shallowRef } from 'vue';
import { Form, type FormApi } from '@aifuxi/semi-ui-vue/form';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { IconUpload } from '@aifuxi/semi-icons-vue';
import type { UploadCustomRequestArgs, UploadFileItem } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/form.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/upload.css';
const props = defineProps<{ onSend?: (content?: string, attachment?: UploadFileItem[]) => void }>();
const api = shallowRef<FormApi>();
function submit() {
  const values = api.value?.getValues();
  if (!values) return;
  const name = typeof values.name === 'string' ? values.name : '';
  const files = (values.file ?? []) as UploadFileItem[];
  if (name || files.length) {
    props.onSend?.(name, files);
    api.value?.reset();
  }
}
function upload({ onSuccess }: UploadCustomRequestArgs) {
  onSuccess({ url: '/demos/photo.svg' });
}
</script>
<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      border: 1px solid var(--semi-color-border);
      margin: 8px 16px;
      border-radius: 8px;
      padding: 8px;
    "
  >
    <Form
      :get-form-api="
        (value) => {
          api = value;
        }
      "
      ><strong>Input information</strong
      ><Form.Input
        field="name"
        label="Name (Input)"
        :style="{ width: '250px' }"
        trigger="blur"
      /><Form.Upload
        field="file"
        action=""
        label="Document"
        :custom-request="upload"
        :after-upload="() => ({ url: '/demos/photo.svg' })"
        ><Button theme="light"
          ><template #icon><IconUpload /></template>Click to upload</Button
        ></Form.Upload
      ></Form
    ><Button style="width: fit-content" @click="submit">Submit</Button>
  </div>
</template>
