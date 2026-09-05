<script setup lang="ts">
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
</script>

<template>
  <div>
    <TextArea :textarea-style="{ height: '120px' }" placeholder="Height 120px"></TextArea>
    <br /><br />
    <TextArea
      :textarea-style="{ height: '200px', backgroundColor: '#f9f9f9' }"
      placeholder="Height 200px with gray background"
    ></TextArea>
    <br /><br />
    <TextArea
      :style="{ border: '2px solid var(--semi-color-primary)' }"
      :textarea-style="{ height: '150px' }"
      placeholder="style controls outer container, textareaStyle controls textarea"
    ></TextArea>
  </div>
</template>
