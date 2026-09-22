<script setup lang="ts">
import { shallowRef } from 'vue';
import { Upload, type UploadFileItem } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import { IconPlus } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation, imageFiles } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
const files = imageFiles();
const location = shallowRef<'start' | 'end'>('end');
function preview(file: UploadFileItem) {
  if (file.url) window.open(file.url, 'imagePreview', 'width=300,height=300');
}
</script>

<template>
  <RadioGroup v-model="location" type="button"
    ><Radio value="start">start</Radio><Radio value="end">end</Radio></RadioGroup
  >
  <hr />
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    list-type="picture"
    show-pic-info
    accept="image/*"
    multiple
    :hot-spot-location="location"
    :default-file-list="files"
    @preview-click="preview"
    ><IconPlus size="extra-large"
  /></Upload>
</template>
