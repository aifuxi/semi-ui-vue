<script setup lang="ts">
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
import { IconBolt } from '@aifuxi/semi-icons-vue';
import { useUploadSimulation } from '../simulateUpload';
const simulateUpload = useUploadSimulation();
</script>

<template>
  <Upload
    action="/demonstration-only"
    :custom-request="simulateUpload"
    draggable
    accept="application/pdf,.jpeg"
    style="margin-top: 10px"
    ><template #dragIcon><IconBolt /></template>
    <div class="custom-drag">
      <img src="/demos/one.svg" height="96" alt="演示图片" style="border-radius: 4px" />
      <div
        style="
          font-size: 14px;
          margin-top: 8px;
          flex-basis: 100%;
          text-align: center;
          color: var(--semi-color-tertiary);
        "
      >
        Wow, you can really dance.
      </div>
    </div></Upload
  >
</template>

<style scoped>
.custom-drag {
  border-radius: var(--semi-border-radius-small);
  border: 2px dashed var(--semi-color-border);
  width: 100%;
  padding: 12px;
  background-color: var(--semi-color-tertiary-light-default);
  display: flex;
  cursor: pointer;
  flex-wrap: wrap;
  justify-content: center;
}
.custom-drag:hover {
  background-color: var(--semi-color-primary-light-default);
  border-color: var(--semi-color-primary);
}
</style>
