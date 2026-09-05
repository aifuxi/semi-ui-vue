---
title: 'Typography'
description: 'The basic format of text, images, paragraphs, and numeric.'
locale: 'en-US'
slug: 'typography'
category: 'basic'
order: 24
englishTitle: 'Typography'
icon: 'doc-typography'
upstream: 'basic/typography'
---

The chapters and examples follow the read-only Semi Design v2.102.0 documentation. Version numbers in API tables refer to upstream releases; the preview and source share the same Vue SFC.

## When to Use

- To display the text content of articles, blogs, logs, etc.
- To take basic operations such as copying and omitting text.

## Demos

### How to import

```ts
import { Typography, Title, Text, Paragraph, Numeral } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
```

### Title

Use `heading` to set different levels of headint title.

::demo-block{demo="typography/en-us/Title" title="Title"}
::

### Text

Text component has different built-in styles. You could also pass `icon` to use the build-in styles for icon. Different from passing icon to default slot, using `icon` for link will have no underline in compliance with Semi Design principles.

::demo-block{demo="typography/en-us/Text" title="Text"}
::

You could pass object to `link`, which will be mounted on `<a>`.

::demo-block{demo="typography/en-us/Link" title="Text"}
::

### Paragraph

Paragraph component has two spacings. You could set`spacing='extended'` for a looser spacing.

::demo-block{demo="typography/en-us/Paragraph" title="Paragraph"}
::

### Numeral

Based on Text component, added properties: `rule`, `precision`, `truncate`, `parser`, to provide the ability to handle Numeral in text separately.

The Numeral component recursively traverses default-slot nodes to detect all numeric text within it for conversion and display, taking care to control the rendering structure hierarchy.

For Numeral components with a rule of percentage, the data processing rules have changed. In **v2.22.0-v2.29.0**, for num whose absolute value is greater than or equal to 1, the result is num%; for num whose absolute value is less than or equal to 1, the result is (num\*100)%. After the **v2.30.0** version, it is unified to (num\*100)%.

`precision` allows you to set the number of decimal places to be retained, used to set precision  
`truncate` The truncation of the number of decimal places, optionally `ceil`, `floor`, `round`, aligned with Math.ceil, Math.floor, Math.round  
`rule` for setting the parsing rules

- set to `percentages` to automatically convert numbers to percentages
- set to `bytes-decimal` to automatically convert numbers to bytes, 1 KB is defined as 1000 bytes, (B, KB, MB, GB, TB, PB, EB, ZB, YB)
- Set to `bytes-binary` automatically converts the number to the unit of display corresponding to bytes, 1 KiB is defined as equal to 1024 bytes, (B, KiB, MiB, GiB, TiB, PiB, EiB, ZiB, YiB)
- When set to `text`, Automatic rounding of numbers only, based on the `precision` and `truncate` attributes
- When set to `numbers`, non-numeric characters will be filtered and only numbers will be displayed
- When set to `exponential`, numbers are automatically converted to scientific notation

::demo-block{demo="typography/en-us/Numeral" title="Numeral"}
::

Parsing rules can be customised via `parser`.

::demo-block{demo="typography/en-us/Parser" title="Numeral"}
::

### Size

Paragraph and Text component support two sizes, `small`(12px) and `normal`(14px). By default it is set to `normal`。

When the paragraph component or text component are used nested, set the `size` property of the inner component to `inherit`, and the size of the inner component will inherit the size setting of the outer component.

::demo-block{demo="typography/en-us/Size" title="Size"}
::

### Copyable text

Copying of text can be supported by configuring the `copyable` property.  
When copyable is configured as true, the default copied content is default slot itself. Note that at this time, default slot only support string type.  
When copyable is configured as object, you can specify the content copied to the clipboard through `copyable.content`, which is no longer strongly associated with default slot.  
At this time, default slot will no longer limit the type, but `copyable.content` still needs to be a string.  
Use the `copyIcon` / `copied` slots to customize the copy button, or a `copyable.render` function returning VNodeChild. The custom button example uses the render callback so it can copy again while displaying its success state.

::demo-block{demo="typography/en-us/Copyable" title="Copyable text"}
::

### Ellipsis

Show ellipsis if text is overflowed. Refer to [Ellipsis Config](#ellipsis-config) for detailed configuration.

1. ellipsis only supports truncation of plain text, and does not support complex types such as VNodeChild. Please ensure that the content type of default slot is string
2. To achieve abbreviation, ellipsis needs to have a clear width or maxWidth limit for comparison and judgment. If the width is not set by itself (for example, purely relying on the flex property to expand), or the width is an indefinite value such as 100%, the parent needs to have a clear width or maxWidth
3. Ellipsis needs to obtain information such as the width and height of the DOM to make basic judgments. If there is a display:none style in itself or the parent, the value will be incorrect, and the abbreviation will be invalid at this time
4. For more information on ellipsis see [FAQ](#faq)

::demo-block{demo="typography/en-us/Ellipsis" title="Ellipsis"}
::

When the tooltip does not wrap in the pop-up tooltip when the long text occurs, please set it manually through [word-break](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break) or [word-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap), more details can be found in the FAQ section of Tooltip

::demo-block{demo="typography/en-us/TooltipWrapping" title="Ellipsis"}
::

```scss
// config word-break

.components-typography-demo {
  word-break: break-word;
  // or
  word-break: break-all;
}
```

## API Reference

### Typography.Text

| Properties | Instructions                                                                                                                             | type                                                  | Default   | version |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------- | ------- |
| copyable   | Toggle whether to be copyable                                                                                                            | boolean \| object:[Copyable Config](#copyable-config) | false     |         |
| code       | wrap with `code` element                                                                                                                 | boolean                                               | -         |         |
| component  | Custom rendering html element                                                                                                            | html element                                          | span      |         |
| delete     | Deleted style                                                                                                                            | boolean                                               | false     |         |
| disabled   | Disabled style                                                                                                                           | boolean                                               | false     |         |
| ellipsis   | Display ellipsis when text overflows                                                                                                     | boolean\|object:Ellipsis Config                       | false     |         |
| icon       | Prefix icon.                                                                                                                             | VNodeChild                                            | -         |         |
| link       | Toggle whether to display as a link. When passing object, the attributes will be transparently passed to the a tag                       | boolean\|object                                       | false     |         |
| mark       | Marked style                                                                                                                             | boolean                                               | false     |         |
| size       | Size, one of `normal`, `small`, `inherit`                                                                                                | string                                                | `normal`  |         |
| strong     | Bold style                                                                                                                               | boolean                                               | false     |         |
| type       | Type, one of `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v>=1.2.0**) , `quaternary`(**v>=1.2.0**), `success`(**v>=1.7.0**) | string                                                | `primary` |         |
| underline  | Underlined style                                                                                                                         | boolean                                               | false     |         |
| weight     | set font weight                                                                                                                          | number                                                |           | 2.34.0  |

### Typography.Title

| Properties | Instructions                                                                                                                            | type                                                  | Default   | version |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------- | ------- |
| copyable   | Toggle whether to be copyable                                                                                                           | boolean \| object:[Copyable Config](#copyable-config) | false     |         |
| component  | Custom rendering html element. The default is determined by heading prop                                                                | html element                                          | h1~h6     |         |
| delete     | Deleted style                                                                                                                           | boolean                                               | false     |         |
| disabled   | Disabled style                                                                                                                          | boolean                                               | false     |         |
| ellipsis   | Display ellipsis when text overflows                                                                                                    | boolean\|object:Ellipsis Config                       | false     |         |
| heading    | Heading level, one of 1， 2， 3，4，5，6                                                                                                | number                                                | 1         |         |
| link       | Toggle whether to display as a link. When passing object, the attributes will be transparently passed to the a tag                      | boolean\|object                                       | false     |         |
| mark       | Marked style                                                                                                                            | boolean                                               | false     |         |
| type       | Type, one of `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v>=1.2.0**), `quaternary`(**v>=1.2.0**), `success`(**v>=1.7.0**) | string                                                | `primary` |         |
| underline  | Underlined style                                                                                                                        | boolean                                               | false     |         |
| weight     | set font weight, one of `light`, `regular`, `medium`, `semibold`, `bold`, `default`                                                     | string, number                                        |           | 2.34.0  |
| strong     | Bold text                                                                                                                               | boolean                                               | false     |         |

### Typography.Paragraph

| Properties | Instructions                                                                                                                            | type                                                  | Default   | version |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------- | ------- |
| copyable   | Toggle whether to be copyable                                                                                                           | boolean \| object:[Copyable Config](#copyable-config) | false     |         |
| component  | Custom rendering html element                                                                                                           | html element                                          | p         |         |
| delete     | Deleted style                                                                                                                           | boolean                                               | false     |         |
| disabled   | Disabled style                                                                                                                          | boolean                                               | false     |         |
| ellipsis   | Display ellipsis when text overflows                                                                                                    | boolean\|object:Ellipsis Config                       | false     |         |
| link       | Toggle whether to display as a link. When passing object, the attributes will be transparently passed to the a tag                      | boolean\|object                                       | false     |         |
| mark       | Marked style                                                                                                                            | boolean                                               | false     |         |
| size       | Size, one of `normal`，`small`                                                                                                          | string                                                | `normal`  |         |
| spacing    | paragraph spacing, one of `normal`, `extended`                                                                                          | string                                                | `normal`  |         |
| strong     | Bold style                                                                                                                              | boolean                                               | false     |         |
| type       | Type, one of `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v>=1.2.0**), `quaternary`(**v>=1.2.0**), `success`(**v>=1.7.0**) | string                                                | `primary` |         |
| underline  | Underlined style                                                                                                                        | boolean                                               | false     |         |

### Typography.Numeral

| Properties | Instructions                                                                                                                             | type                                                  | Default   | version |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------- | ------- |
| rule       | Parsing rules, one of `text`, `numbers`, `bytes-decimal`, `bytes-binary`, `percentages`, `currency`, `exponential`                       | string                                                | `text`    | 2.22.0  |
| precision  | allows you to set the number of decimal places to be retained, used to set precision                                                     | number                                                | 0         | 2.22.0  |
| truncate   | The truncation of the number of decimal places, optionally `ceil`, `floor`, `round`, aligned with Math.ceil, Math.floor, Math.round      | string                                                | `round`   | 2.22.0  |
| parser     | Custom numeral parsing functions                                                                                                         | (str: string) => string                               | -         | 2.22.0  |
| copyable   | Toggle whether to be copyable                                                                                                            | boolean \| object:[Copyable Config](#copyable-config) | false     | 2.22.0  |
| code       | wrap with `code` element                                                                                                                 | boolean                                               | -         | 2.22.0  |
| component  | Custom rendering html element                                                                                                            | html element                                          | span      | 2.22.0  |
| delete     | Deleted style                                                                                                                            | boolean                                               | false     | 2.22.0  |
| disabled   | Disabled style                                                                                                                           | boolean                                               | false     | 2.22.0  |
| icon       | Prefix icon.                                                                                                                             | VNodeChild                                            | -         | 2.22.0  |
| link       | Toggle whether to display as a link. When passing object, the attributes will be transparently passed to the a tag                       | boolean \| object                                     | false     | 2.22.0  |
| mark       | Marked style                                                                                                                             | boolean                                               | false     | 2.22.0  |
| size       | Size, one of `normal`，`small`                                                                                                           | string                                                | `normal`  | 2.22.0  |
| strong     | Bold style                                                                                                                               | boolean                                               | false     | 2.22.0  |
| type       | Type, one of `primary`, `secondary`, `warning`, `danger`, `tertiary`(**v>=1.2.0**) , `quaternary`(**v>=1.2.0**), `success`(**v>=1.7.0**) | string                                                | `primary` | 2.22.0  |
| underline  | Underlined style                                                                                                                         | boolean                                               | false     | 2.22.0  |

### Ellipsis Config

| Properties   | Instructions                                             | type                                        | Default    |
| ------------ | -------------------------------------------------------- | ------------------------------------------- | ---------- |
| collapseText | Displayed text to collapse                               | string                                      | `Collapse` |
| collapsible  | Toggle whether text is collapsible                       | boolean                                     | false      |
| expandText   | Displayed text to expand                                 | string                                      | `Expand`   |
| expandable   | Toggle whether text is expandable                        | boolean                                     | false      |
| pos          | Position to start ellipsis, one of `end`, `middle`       | string                                      | `end`      |
| rows         | Number of rows that should not be truncated              | number                                      | 1          |
| showTooltip  | Show an overlay; use the tooltip slot for custom content | boolean \| { type?: string, opts?: object } | false      |
| suffix       | Text suffix that will not be truncated                   | string                                      | -          |
| onExpand     | Callback when expand or collapse                         | function(expanded: bool, Event: e)          | -          |

### Copyable Config

| Properties | Instructions                                                            | Type                                           | Default | Version |
| ---------- | ----------------------------------------------------------------------- | ---------------------------------------------- | ------- | ------- |
| content    | Copied content                                                          | string                                         | -       |         |
| copyTip    | Tooltip content when hovering over icon                                 | VNodeChild                                     | -       |         |
| icon       | Custom render duplicate node                                            | VNodeChild                                     | -       | 2.31.0  |
| onCopy     | Callback for copy action                                                | Function(e:Event, content:string, res:boolean) | -       |         |
| render     | Custom copy render function; copyIcon / copied slots are also available | `(copied, copy, config) => VNodeChild`         | -       | 2.65.0  |
| successTip | Successful tip content                                                  | VNodeChild                                     | -       |         |

## Content Guidelines

- Link
  - Text links need to be clear and predictable, users should be able to predict what will happen when they click on the link
  - Do not mislead users by mislabeling links
  - Avoid using "Click here" or "Here" as stand-alone links

| ✅ Recommended usage              | ❌ Deprecated usage           |
| --------------------------------- | ----------------------------- |
| No spaces yet? ** Create space ** | No spaces yet? **Click here** |

- Avoid using entire sentences as clickable text links, and instead use text that describes where to go as the link content

| ✅ Recommended usage                     | ❌ Deprecated usage                     |
| ---------------------------------------- | --------------------------------------- |
| Views **user documentation** for details | **View user documentation for details** |

- Using short terms or words as link text is more conducive to internationalization, to avoid the problem of link text being split due to different grammar and word order in different languages

| ✅ Recommended usage        | ❌ Deprecated usage         |
| --------------------------- | --------------------------- |
| Manage **notifications **to | **Manage notifications** to |

- When ending with a text link, there is no need to follow punctuation, except for the question mark "?"

| ✅ Recommended usage              | ❌ Deprecated usage           |
| --------------------------------- | ----------------------------- |
| No spaces yet? ** Create space ** | No spaces yet? **Click here** |
| ** Forgot password ？**           | **Forgot password**           |

- Link text does not contain the articles "the, a, an"

| ✅ Recommended usage                      | ❌ Deprecated usage                         |
| ----------------------------------------- | ------------------------------------------- |
| View ** user documentation ** for details | View the** user documentation** for details |

## Design Tokens

::token-table{component="typography"}
::

## FAQ

- **What are the specific mechanism and precautions of Typography ellipsis?**

  Semi ellipsis has two strategies, CSS ellipsis and JS ellipsis. When setting middle truncation (pos='middle')、 expandable、 suffix is not empty string、copyable, the JS ellipsis strategy is enabled. Otherwise, enable the CSS ellipsis strategy.

  In general CSS truncation performance is better than JS truncation. when the default slot and container size remain unchanged, CSS truncation only involves 1~2 calculations, while js truncation is based on dichotomy and may require multiple calculations.

  Pay attention to performance consumption when using a large number of Typography with ellipsis. For example, in Table, you can reduce performance loss by setting a reasonable pageSize for paging.

## Accessibility

Use native `class`, `style`, `id`, `role`, `aria-*`, and `data-*` attributes. Keep the reading order meaningful and give interactive children accessible names and keyboard support.

## React → Vue Migration

| React                                     | Vue                                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------- |
| `Typography.Title/Text/Paragraph/Numeral` | Compound members or direct named imports                                            |
| `children`                                | `default` slot; default copy and ellipsis content must be plain text                |
| `icon` ReactNode                          | `icon` slot or VNodeChild prop on Text/Numeral                                      |
| `copyable.render`                         | Prefer `copyIcon` / `copied` slots; functions returning VNodeChild remain supported |
| `showTooltip.renderTooltip`               | `tooltip` scoped slot with `{ content }`                                            |
| `onCopy` / `onExpand`                     | Configuration callbacks, plus `@copy` / `@expand` events                            |
| React ref                                 | Vue template ref                                                                    |

The `copyIcon` slot receives `{ copied, copy }`. Call `copy(event)` from custom controls and prevent bubbling from causing duplicate copies. The `copy` event receives `(event, content, result)` and `expand` receives `(expanded, event)`. `copyable.duration` controls the copied state in seconds (default 3). `component` accepts a tag name or Vue component.

`showTooltip` accepts a boolean or `{ type, opts }`. The current Vue default overlay displays the original text; provide custom content through the `tooltip` slot, as these examples do for the upstream `opts.content` behavior. `renderTooltip` is not a Vue configuration field. Numeral's public Vue type excludes `ellipsis`; the fixed React Numeral public type also excludes it, so the erroneous upstream table row is removed. Paragraph and Numeral also accept `size="inherit"`.

Keep headings in a meaningful hierarchy and link labels predictable. Custom copy controls need keyboard operation and accessible names. Provide localized default action labels with `typographyLocaleKey`; English examples inject `EN_US_TYPOGRAPHY_LOCALE`.
