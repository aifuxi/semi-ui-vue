# Highlight

Highlight wraps matching ranges in configurable inline tags while preserving unmatched source text as text nodes. This implementation uses the pinned Semi Design v2.102.0 Adapter, Foundation, SCSS, and documentation as its only baseline.

## Import

```ts
import { Highlight } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/highlight.css';
```

The subpath is also available:

```ts
import Highlight, { type HighlightProps } from '@aifuxi/semi-ui-vue/highlight';
```

## Basic usage

```vue
<script setup lang="ts">
import { Highlight } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/highlight.css';
</script>

<template>
  <h2>
    <Highlight
      source-string="From Semi Design to Any Design, build your design system quickly"
      :search-words="['Semi Design', 'design system']"
    />
  </h2>
</template>
```

Highlight adds no root element. Unmatched ranges remain text nodes and matched ranges use `mark.semi-highlight-tag` by default. Avoid applying flex or grid directly to the text container because those layouts can split the text flow.

## Custom tag and shared style

```vue
<Highlight
  component="strong"
  source-string="Semi Design helps teams build a design system"
  :search-words="['Semi Design', 'design system']"
  highlight-class-name="search-result"
  :highlight-style="{
    borderRadius: '6px',
    padding: '0 4px',
    backgroundColor: 'var(--semi-color-primary)',
    color: 'var(--semi-color-white)',
  }"
/>
```

The default tag is `mark`; native tags such as `span` and `strong` are also supported. `highlightClassName` and `highlightStyle` apply to every matched range.

## Per-word styles

```vue
<Highlight
  component="span"
  source-string="Semi connects design and code"
  :search-words="[
    {
      text: 'Semi',
      className: 'brand-keyword',
      style: { backgroundColor: 'rgba(var(--semi-teal-5), 1)', color: 'white' },
    },
    {
      text: 'design',
      className: 'design-keyword',
      style: { backgroundColor: 'var(--semi-color-primary)', color: 'white' },
    },
  ]"
  :highlight-style="{ borderRadius: '4px', padding: '2px 4px' }"
/>
```

Object-level classes are appended after the shared class. Object-level styles are merged after the shared style and therefore win for duplicate properties. Overlapping or touching matches are combined using the pinned Foundation algorithm.

## Case sensitivity and regular expressions

```vue
<Highlight source-string="Semi semi" :search-words="['semi']" case-sensitive />

<Highlight source-string="Version 2.102 and 2x102" :search-words="['2.102']" :auto-escape="false" />
```

- `caseSensitive` defaults to `false`.
- `autoEscape` defaults to `true`, treating search words as literal text. Set it explicitly to `false` to use JavaScript regular-expression semantics.
- Omitted, explicit `true`, and explicit `false` values for `autoEscape` are independently covered; an explicit `false` is never overwritten by the default.

## API

### Props

| Property             | Type                   | Default  | Description                                       |
| -------------------- | ---------------------- | -------- | ------------------------------------------------- |
| `sourceString`       | `string`               | `''`     | Source text                                       |
| `searchWords`        | `HighlightSearchWords` | `[]`     | Array of string or object search words            |
| `component`          | `string`               | `'mark'` | Native tag used for matched ranges                |
| `highlightClassName` | `string`               | -        | Extra class for every highlight tag               |
| `highlightStyle`     | `CSSProperties`        | -        | Shared inline style for highlight tags            |
| `caseSensitive`      | `boolean`              | `false`  | Whether matching is case-sensitive                |
| `autoEscape`         | `boolean`              | `true`   | Whether regular-expression characters are escaped |

`HighlightSearchWord` contains `text: string` plus optional `className` and `style: CSSProperties`. The component has no slots, emits, `v-model`, or imperative ref API. The pinned Adapter has no root element, so Vue attrs have no valid fallthrough target and are not applied to highlight tags.

## Accessibility, themes, RTL, and SSR

- Highlighted content remains continuous text; the component creates no focus or keyboard behavior.
- The default `mark` tag provides native highlight semantics. Callers selecting another tag should confirm that its semantics fit their content.
- Light and dark colors are driven by `--semi-color-highlight` and `--semi-color-highlight-bg`.
- Text direction is inherited; there is no component-specific RTL layout.
- Root and `@aifuxi/semi-ui-vue/highlight` imports are DOM-free and SSR-safe. Source text is escaped as Vue text nodes; `v-html` is not used.

See the [alignment matrix](./alignment.md) for source evidence, matching rules, computed styles, visual coverage, and deviations. See [React → Vue](./react-to-vue.md) for migration details.
