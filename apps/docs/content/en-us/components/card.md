---
title: 'Card'
description: 'Card container can consist of titles, paragraphs, pictures, lists, and other content.'
locale: 'en-US'
slug: 'card'
category: 'show'
order: 65
englishTitle: 'Card'
icon: 'doc-card'
upstream: 'show/card'
---

## Demos

### How to import

```ts
import { Card, CardMeta, CardGroup } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
```

### Basic card

The basic card contains the title, content and other parts.

::demo-block{demo="card/en-us/Basic" title="Basic card"}
::

### Simple card

The card can only set the content area.

::demo-block{demo="card/en-us/Simple" title="Simple card"}
::

### Cover

You can use the `cover` property to set the cover.

::demo-block{demo="card/en-us/Cover" title="Cover"}
::

### Border and line

You can use `bordered` to set whether the card has an outer border, the default is true. At the same time, you can also use `headerLine` to set whether the content area and title area have borders, and `footerLine` to set whether the content area and footer area have borders.

::demo-block{demo="card/en-us/Border" title="Border and line"}
::

### Shadows

You can use `shadows` to set the timing of the shadow display. Optional: `hover` (show shadow when hover), `always` (show shadow always), if this property is not set, there will be no shadow.

::demo-block{demo="card/en-us/Shadows" title="Shadows"}
::

### Customized content

You can use `Card.Meta` to support more flexible content, allowing you to set `title`, `avatar`, and `description`.

::demo-block{demo="card/en-us/Flexible" title="Customized content"}
::

### Inner card

Other cards can be nested inside the card.

::demo-block{demo="card/en-us/Inner" title="Inner card"}
::

### Card in column

The system overview page is often combined with the grid.

::demo-block{demo="card/en-us/Grid" title="Card in column"}
::

### loading

You can use the `loading` property of `Card` to set whether to display placeholder elements in the card content area. When it is true, the placeholder elements will be displayed, and vice versa.

::demo-block{demo="card/en-us/Loading" title="loading"}
::

### With Skeleton

The `loading` property of `Card` can only set the preloading effect of the content area. If you want to set the preloading of other parts, or customize a richer preloading effect, you can combine it with the Skeleton component.

::demo-block{demo="card/en-us/Skeleton" title="With Skeleton"}
::

### With tabs

You can use the `Tabs` component in the card component.

::demo-block{demo="card/en-us/Tabs" title="With tabs"}
::

### Actions

`actions` receives the VNodeChild array, and the elements will be displayed at the bottom of the content area with a horizontal spacing of 12px.

::demo-block{demo="card/en-us/Actions" title="Actions"}
::

### Card group

Use `CardGroup` to present the cards in an evenly spaced arrangement.

::demo-block{demo="card/en-us/Group" title="Card group"}
::

### Grid card

You can use the `type` property of `CardGroup` to set the card group to a grid type.

::demo-block{demo="card/en-us/GridGroup" title="Grid card"}
::

### API reference

**Card**

| PROPERTIES         | INSTRUCTIONS                                                                                                      | TYPE               | DEFAULT | VERSION |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- | ------------------ | ------- | ------- |
| actions            | Card operation group, located at the bottom of the card content area                                              | Array<VNodeChild\> | -       | -       |
| bodyStyle          | Body style                                                                                                        | CSSProperties      | -       | -       |
| bordered           | Whether to set the outer border of the card                                                                       | boolean            | true    | -       |
| class              | The className of Card container                                                                                   | string             | -       | -       |
| cover              | Card cover                                                                                                        | VNodeChild         | -       | -       |
| headerExtraContent | Extra content to the right of the card title                                                                      | VNodeChild         | -       | -       |
| footer             | Customize card footer                                                                                             | VNodeChild         | -       | -       |
| footerLine         | Whether to set borders in the footer area and content area of the card                                            | boolean            | false   | -       |
| footerStyle        | Footer style                                                                                                      | CSSProperties      | -       | -       |
| header             | Custom card header, if passed in, it will override `title` and `headerExtraContent`                               | VNodeChild         | -       | -       |
| headerLine         | Whether to set borders in the title area and content area of the card                                             | boolean            | true    | -       |
| headerStyle        | Header style                                                                                                      | CSSProperties      | -       | -       |
| loading            | Whether to set a placeholder when loading                                                                         | boolean            | false   | -       |
| shadows            | Set the time to show the shadow. If this property is not set, there will be no shadow. Optiona: `hover`, `always` | string             | -       | -       |
| style              | Card style                                                                                                        | CSSProperties      | -       | -       |
| title              | Card title                                                                                                        | VNodeChild         | -       | -       |

**CardGroup**

| PROPERTIES | INSTRUCTIONS                                                                                                                       | TYPE               | DEFAULT | VERSION |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------- | ------- |
| class      | The className of CardGroup                                                                                                         | string             | -       | -       |
| spacing    | Spacing size, support numeric value or array, `[horizontal spacing, vertical spacing]`                                             | number \| number[] | 16      | -       |
| style      | CardGroup style                                                                                                                    | CSSProperties      | -       | -       |
| type       | You can set the card deck to a grid type. After setting this property, the `spacing` property will be overwritten.Optional: `grid` | string             | -       | -       |

**Card.Meta**

| PROPERTIES  | INSTRUCTIONS          | TYPE          | DEFAULT | VERSION |
| ----------- | --------------------- | ------------- | ------- | ------- |
| avatar      | avatar                | VNodeChild    | -       | -       |
| class       | The className of Meta | string        | -       | -       |
| description | description           | VNodeChild    | -       | -       |
| style       | Meta style            | CSSProperties | -       | -       |
| title       | title                 | VNodeChild    | -       | -       |

## Accessibility

- Card supports the input of `aria-label` to indicate the function of the Card
- When Card loading, `aria-busy` will be turned on
- Card is a container-type component, and any elements inside the card need to follow their respective accessibility guidelines

## Content Guidelines

- Card title
  - Card titles should be informative and focus on the most important information
  - try to limit the title to 1 phrase or segment
  - Card titles should be written in sentence case
  - do not end with punctuation marks (except question marks)
- Text
  - Actionable: Use imperative sentences instead of "you can" to describe the body, which better tells the user what can be done

| ✅ Recommended usage           | ❌ Deprecated usage                    |
| ------------------------------ | -------------------------------------- |
| Get order progress for details | You can get order progress for details |

- Always say the most important information first
- Use "Need to" instead of "must"

## Design Tokens

::token-table{component="card"}
::

## FAQ

**Why is the title missing?**

Check whether header is provided; a complete header overrides title and headerExtraContent.

## React → Vue Migration

| React                                                | Vue                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| children                                             | Default slot                                                              |
| title / header / headerExtraContent / cover / footer | Named slots or VNodeChild props; slots take precedence                    |
| actions array                                        | Multiple top-level children in the actions slot, or readonly VNodeChild[] |
| Card.Meta                                            | CardMeta or the preserved compound member                                 |
| Meta avatar / title / description                    | Named slots or VNodeChild props                                           |
| className                                            | class; className is also supported                                        |

The header slot overrides title and headerExtraContent. CardGroup spacing defaults to 16 in the fixed Adapter; the upstream table's 12px is corrected here. Card has no selection state or v-model. Remote cover and avatar images use existing local demo assets.
