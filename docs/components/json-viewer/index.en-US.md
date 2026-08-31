# JsonViewer

JsonViewer matches Semi Design v2.102.0 for viewing, editing, searching, replacing, formatting, folding, and custom token rendering. Parsing, validation, and folding run in an inline Worker; SSR imports and server rendering do not create a Worker.

```ts
import { JsonViewer } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/json-viewer.css';
```

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { JsonViewer } from '@aifuxi/semi-ui-vue';

const value = ref('{"name":"Semi UI Vue","ready":true}');
</script>

<template>
  <JsonViewer v-model:value="value" :width="640" :height="320" />
</template>
```

## API

| Prop                      | Description                                                                          | Type                              | Default                               |
| ------------------------- | ------------------------------------------------------------------------------------ | --------------------------------- | ------------------------------------- |
| `value`                   | JSON source text                                                                     | `string`                          | `''`                                  |
| `width` / `height`        | Editor dimensions                                                                    | `number \| string`                | `400`                                 |
| `showSearch`              | Shows the search entry                                                               | `boolean`                         | `true`                                |
| `options`                 | Core read-only, wrapping, formatting, completion, and custom rendering options       | `JsonViewerOptions`               | `{ readOnly: false, autoWrap: true }` |
| `limitSearchButtonBounds` | Constrains the draggable search entry to the viewer                                  | `boolean`                         | `false`                               |
| `renderSearchButton`      | Receives the default VNode and stable search controls                                | `(node, controls) => VNodeChild`  | -                                     |
| `renderTooltip`           | Compatibility prop retained from v2.102.0; that baseline does not wire a hover event | `(value, element) => HTMLElement` | -                                     |

The `change` and `update:value` events emit the full JSON source after an edit. Exposed methods are `getValue`, `format`, `search`, `getSearchResults`, `prevSearch`, `nextSearch`, `replace`, and `replaceAll`.

## Accessibility and SSR

Search options support pointer, Enter, and Space activation and expose `aria-pressed`. Search, replace, navigation, and close controls have accessible names. SSR emits stable containers only; the core, ResizeObserver, and Worker are created after client mount and disposed on unmount.

See the [React-to-Vue migration guide](./react-to-vue.md) and the [alignment matrix](./alignment.md).
