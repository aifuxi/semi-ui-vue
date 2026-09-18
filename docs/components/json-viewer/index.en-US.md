# JsonViewer

JsonViewer aligns with Semi Design v2.102.0 (`plus/jsonviewer`) and keeps the pinned JSON core DOM/classes, editable `contentEditable` semantics, search/replace, folding, completion, theme tokens and RTL contracts. The pinned `semi-json-viewer-core` and its inline Worker are compiled into the public artifact through the private integration boundary. The public entry is the `@aifuxi/semi-ui-vue` root export and the `@aifuxi/semi-ui-vue/json-viewer` subpath.

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { JsonViewer } from '@aifuxi/semi-ui-vue';

const value = ref('{"name":"Semi","tags":["vue","design"]}');
</script>

<template>
  <JsonViewer v-model="value" :height="320" :width="600" />
</template>
```

`v-model` binds `value`; edits notify in the order `change → update:value` with the current text. `width`/`height` default to `400` and accept numbers (px) or CSS size strings.

## Line height, wrapping, read-only and formatting

`options` is a self-contained Vue type; deep changes recreate the core and Worker:

| Option                                | Description                                                          | Default            |
| ------------------------------------- | -------------------------------------------------------------------- | ------------------ |
| `lineHeight`                          | Line height in px                                                    | core default       |
| `autoWrap`                            | Wrap long lines                                                      | `true`             |
| `readOnly`                            | Read-only; replace buttons are disabled and `replace` is a no-op     | `false`            |
| `formatOptions`                       | `{ tabSize, insertSpaces, eol }`                                     | core default       |
| `completionOptions.staticCompletions` | Static completions `{ label, insertText?, detail?, documentation? }` | -                  |
| `customRenderRule`                    | `{ match, render }[]` custom token rendering                         | -                  |
| `prefixCls`                           | Custom class prefix                                                  | `semi-json-viewer` |

## Custom render rules

```ts
const options = {
  customRenderRule: [
    {
      match: (_value, pathChain) => pathChain === 'root.name',
      render: (text: string) => h('span', { class: 'json-name' }, text.toUpperCase()),
    },
  ],
};
```

`match` accepts a string, a RegExp or `(value, pathChain, tokenType) => boolean`; `render` returns a VNode or HTMLElement replacing the matching key/value token.

## Search and replace

- `showSearch` defaults to `true` and renders the search trigger in the top-right corner; `limitSearchButtonBounds` keeps the button inside the component bounds.
- Search supports case sensitivity, whole-word matching and regular expressions; option buttons are focusable buttons exposing their active state through `aria-pressed`.
- The `#searchButton` scoped slot replaces the default trigger and receives `defaultSearchButton` plus the full `controls` (`onToggleSearchBar`/`onSearch`/`onPrevSearch`/`onNextSearch`/`onReplace`/`onReplaceAll`).
- Labels come from LocaleProvider `JsonViewer.search/replace/replaceAll` (Chinese by default, English for `en-US`).

## API

### Props

| Prop                            | Type                                            | Default                                       |
| ------------------------------- | ----------------------------------------------- | --------------------------------------------- |
| `value`                         | `string`                                        | `''`                                          |
| `width` / `height`              | `number \| string`                              | `400` / `400`                                 |
| `showSearch`                    | `boolean`                                       | `true`                                        |
| `options`                       | `JsonViewerOptions`                             | `{ readOnly: false, autoWrap: true }`         |
| `limitSearchButtonBounds`       | `boolean`                                       | `false`                                       |
| `renderSearchButton`            | `(defaultSearchButton, controls) => VNodeChild` | -                                             |
| `renderTooltip`                 | `(value, element) => HTMLElement`               | - (never fires in the pinned baseline either) |
| `class` / `className` / `style` | Vue native class/style and compatible props     | -                                             |

### Events

`change(value)`, `update:value(value)`.

### Slots

`searchButton="{ defaultSearchButton, controls }"`.

### Methods

Through the component ref: `getValue()`, `format()`, `search(text, caseSensitive?, wholeWord?, regex?)`, `getSearchResults()`, `prevSearch(step?)`, `nextSearch(step?)`, `replace(text)`, `replaceAll(text)`.

## Accessibility, keyboard and SSR

- The editable area keeps the core `contentEditable`, selection, Enter/Backspace, arrow keys, undo/redo and completion keyboard logic; the component never overrides editor key semantics.
- Search/replace controls are real buttons, icon buttons carry localized `aria-label`s, and the search input handles IME composition.
- Importing the module never touches `window`/`document`/`Worker`; the Worker and core are created in `onMounted`, so import and SSR render are safe. Unmount and prop-driven rebuilds terminate the Worker and clear callbacks.

## Theme, RTL and release boundary

- Classes and tokens follow the pinned `.semi-json-viewer*`, `.json-viewer-container` and `.lines-content` surface; the per-component style entry is `@aifuxi/semi-theme-default/json-viewer.css`.
- RTL is driven by ConfigProvider `.semi-rtl` for the search bar and content direction.
- The Worker is inlined through Vite `?worker&inline`, so the real tarball consumer makes no extra vendor/worker requests; `pnpm check:artifacts` covers exports, types, SSR import, `json-viewer.css`, licenses and SBOM.

## React → Vue

See the [React → Vue mapping](./react-to-vue.md). Full public behavior, visual and release evidence lives in the [alignment matrix](./alignment.md).
