<script setup lang="ts">
import { CodeHighlight } from '@aifuxi/semi-ui-vue/code-highlight';
import '@aifuxi/semi-theme-default/code-highlight.css';

const code = `const answer = 42;\nconsole.log(answer);`;
</script>

<template>
  <CodeHighlight :code="code" language="javascript" />
</template>
