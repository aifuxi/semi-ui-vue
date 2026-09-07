<script setup lang="ts">
import { CodeHighlight } from '@aifuxi/semi-ui-vue/code-highlight';
import '@aifuxi/semi-theme-default/code-highlight.css';

const code =
  '\nimport * as React from \'react"\nconst Test = ()=>{\n    const handleClick = ()=>{\n        alert("Click")\n    }\n    return <div onClick={handleClick}>test</div>\n}';
</script>

<template>
  <CodeHighlight :code="code" language="javascript" />
</template>
