# CodeHighlight 代码高亮

`CodeHighlight` 基于固定 Semi Design v2.102.0 的 Prism 集成，对纯文本代码进行语法高亮并可显示行号。

```vue
<script setup lang="ts">
import { CodeHighlight } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/code-highlight.css';

const code = `const answer = 42;\nconsole.log(answer);`;
</script>

<template>
  <CodeHighlight :code="code" language="javascript" />
</template>
```

## 其他语言

Prism 核心默认包含 markup/html、CSS、类 C 与 JavaScript。其他语言需要由应用显式引入对应定义：

```ts
import 'prismjs/components/prism-vala.js';
```

## API

| 属性                  | 说明                   | 类型            | 默认值 |
| --------------------- | ---------------------- | --------------- | ------ |
| `code`                | 要高亮的纯文本代码     | `string`        | 必填   |
| `language`            | Prism 语言名称         | `string`        | 必填   |
| `lineNumber`          | 是否显示行号           | `boolean`       | `true` |
| `defaultTheme`        | 是否启用内置主题 class | `boolean`       | `true` |
| `className` / `class` | 根节点 class           | Vue class value | -      |
| `style`               | 根节点样式             | `StyleValue`    | -      |

关闭 `defaultTheme` 后，token DOM 仍会生成；应用需自行提供 Prism 主题。代码通过文本 prop 传入，组件不会执行代码中的 HTML。
