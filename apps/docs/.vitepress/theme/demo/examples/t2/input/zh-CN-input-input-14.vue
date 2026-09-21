<script setup lang="ts">
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
</script>

<template>
  <div>
    <TextArea :textarea-style="{ height: '120px' }" placeholder="高度 120px"></TextArea>
    <br /><br />
    <TextArea
      :textarea-style="{ height: '200px', backgroundColor: '#f9f9f9' }"
      placeholder="高度 200px，灰色背景"
    ></TextArea>
    <br /><br />
    <TextArea
      :style="{ border: '2px solid var(--semi-color-primary)' }"
      :textarea-style="{ height: '150px' }"
      placeholder="style 控制外层容器，textareaStyle 控制 textarea"
    ></TextArea>
  </div>
</template>
