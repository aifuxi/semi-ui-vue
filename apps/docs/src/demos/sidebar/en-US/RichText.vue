<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/sidebar.css';
import { ref } from 'vue';
import { Sidebar } from '@aifuxi/semi-ui-vue/sidebar';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { defaultFileContent } from './listData';
import { imgUploadProps } from './mockUpload';
const editable = ref(true),
  content = ref(defaultFileContent);
</script>
<template>
  <ConfigProvider :locale="locale"
    ><Button @click="editable = !editable">Editable: {{ editable ? 'Yes' : 'No' }}</Button
    ><br /><br /><Sidebar.FileItem
      :content="content"
      :editable="editable"
      style="border: 1px solid var(--semi-color-border); padding: 12px"
      :img-upload-props="imgUploadProps"
      @content-change="content = $event"
    /><output class="file-output">{{ content }}</output></ConfigProvider
  >
</template>
