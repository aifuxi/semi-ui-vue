<script setup lang="ts">
import { CodeHighlight } from '@aifuxi/semi-ui-vue/code-highlight';
import '@aifuxi/semi-theme-default/code-highlight.css';

const code =
  '.grid {\n    .semi-row,\n    .semi-row-flex {\n        text-align: center;\n        .semi-col {\n            min-height: 30px;\n            line-height: 30px;\n            background: var(--semi-color-primary-light-default);\n            outline: 1px solid var(--semi-color-primary-light-active);\n        }\n    }\n}\n';
</script>

<template>
  <CodeHighlight :code="code" language="css" />
</template>
