# CodeHighlight

`CodeHighlight` uses the Prism integration pinned by Semi Design v2.102.0 to highlight plain-text code and optionally render line numbers.

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

## Additional languages

Prism core includes markup/HTML, CSS, C-like languages, and JavaScript. Import other language definitions explicitly in the consuming application:

```ts
import 'prismjs/components/prism-vala.js';
```

## API

| Prop                  | Description                      | Type            | Default  |
| --------------------- | -------------------------------- | --------------- | -------- |
| `code`                | Plain-text source to highlight   | `string`        | required |
| `language`            | Prism language name              | `string`        | required |
| `lineNumber`          | Shows line numbers               | `boolean`       | `true`   |
| `defaultTheme`        | Enables the built-in theme class | `boolean`       | `true`   |
| `className` / `class` | Root class value                 | Vue class value | -        |
| `style`               | Root style                       | `StyleValue`    | -        |

When `defaultTheme` is false, token markup is still generated and the application must provide its own Prism theme. Code is accepted as text; embedded HTML is never executed.
