# Typography

Typography provides headings, text, paragraphs, links, copy actions, ellipsis, and numeral formatting. It targets Semi Design v2.102.0 while preserving the `.semi-typography*` and `--semi-*` compatibility contracts.

## Import

```ts
import { Typography, Title, Text, Paragraph, Numeral } from '@workspace/ui';
import '@workspace/theme-default/typography.css';
```

The compound members are also available through `Typography.Title`, `.Text`, `.Paragraph`, and `.Numeral`.

## Basic usage

```vue
<Title :heading="2" weight="semibold">Design system</Title>
<Text type="secondary" strong>Supporting copy</Text>
<Paragraph spacing="extended">Readable long-form content.</Paragraph>
<Text :link="{ href: '/guide' }" underline>Read the guide</Text>
```

## Copy and ellipsis

```vue
<Text :copyable="{ content: 'token-name', duration: 2 }" @copy="onCopy">
  token-name
</Text>

<Paragraph
  :ellipsis="{ rows: 2, expandable: true, collapsible: true, suffix: ' [docs]' }"
  @expand="onExpand"
>
  Long plain-text content…
</Paragraph>
```

Simple end ellipsis uses CSS. Middle ellipsis, expandable content, suffixes, and copyable text use measured JavaScript truncation. As in v2.102.0, ellipsis is supported for plain text.

## Numeral

```vue
<Numeral rule="bytes-binary" :precision="2">1536</Numeral>
<!-- 1.50 KiB -->
```

Rules are `text`, `numbers`, `bytes-decimal`, `bytes-binary`, `percentages`, and `exponential`; truncate modes are `ceil`, `floor`, and `round`.

## Slots and migration

The default slot replaces React children. The `icon` slot is available on Text and Numeral; the scoped `copyIcon` slot exposes `{ copy, copied }`, while `copied` customizes the success state. The scoped `tooltip` slot replaces `showTooltip.renderTooltip`. Configuration callbacks remain supported, and Vue also emits `copy` and `expand`.

All native class, style, id, role, aria, and data attributes are forwarded to the rendered root element.
