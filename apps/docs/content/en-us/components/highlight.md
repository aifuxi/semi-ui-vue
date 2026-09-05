---
title: 'Highlight'
description: 'highlight specific content'
locale: 'en-US'
slug: 'highlight'
category: 'show'
order: 72
englishTitle: 'Highlight'
icon: 'doc-highlight'
upstream: 'show/highlight'
---

## code demo

### How to import

Semi support `Highlight` component since v2.24.0

```ts
import { Highlight } from '@aifuxi/semi-ui-vue/highlight';
import '@aifuxi/semi-theme-default/highlight.css';
```

### Basic usage

You can specify keywords to be highlighted with `searchWords` and source text with `sourceString`

The Highlight component will split the text into multiple independent inline elements. Any CSS layout that splits the text flow (such as flex layout) may break the highlighted text. To prevent the highlighted content from being split into different rows or columns by the browser, please wrap the Highlight component with a wrapper element as needed.

::demo-block{demo="highlight/en-us/Basic" title="Basic usage"}
::

### Specify highlight style

By default, the highlighted text will have its own text style, the text color is black, and the background color is `--semi-yellow-4`.  
In dark mode, the text color is white, and the background color is `--semi-yellow-2`.  
When you need to customize different highlight styles, you can specify them through `highlightClassName`, `highlightStyle`

::demo-block{demo="highlight/en-us/Style" title="Specify highlight style"}
::

### Use Different Styles for Different Texts

After v2.71.0, it supports using different highlight styles for different highlighted texts.
The `searchWords` is a string array by default. When an array of objects is passed in, the highlighted text can be specified through `text`, and the `className` and `style` can be specified separately at the same time.

::demo-block{demo="highlight/en-us/Keywords" title="Use Different Styles for Different Texts"}
::

### Specify the highlight tag

Semi will wrap the text matching searchWords in sourceString with mark tag by default, you can also re-specify the tag through `component`

::demo-block{demo="highlight/en-us/Tag" title="Specify the highlight tag"}
::

## API Reference

### Highlight

| property           | description                                                 | type                                 | default value |
| ------------------ | ----------------------------------------------------------- | ------------------------------------ | ------------- |
| searchWords        | Keywords: strings or objects with text, className and style | Array<string \| HighlightSearchWord> | -             |
| sourceString       | Source text                                                 | string                               | ''            |
| component          | Highlight label                                             | string                               | `mark`        |
| highlightClassName | Class name of highlighted tags                              | string                               | -             |
| highlightStyle     | Inline style of highlighted tags                            | CSSProperties                        | -             |
| caseSensitive      | Case sensitive matching                                     | boolean                              | false         |
| autoEscape         | Automatically escape keywords                               | boolean                              | true          |

## Design Tokens

::token-table{component="highlight"}
::

## Accessibility

The default mark tag identifies contextually relevant text without changing reading order. Maintain contrast for custom colors and do not communicate additional meaning through color alone.

## FAQ

**Why does highlighted text split into columns?**

Highlight renders multiple inline fragments. Wrap it in h2, p or span instead of making its fragments direct flex children.

## React → Vue Migration

| React                         | Vue                                            |
| ----------------------------- | ---------------------------------------------- |
| sourceString / searchWords    | Same props; bind arrays with a colon           |
| highlightStyle                | CSSProperties with valid CSS units             |
| highlightClassName            | A string class name, not ReactNode             |
| component                     | HTML tag name, default mark                    |
| Per-keyword style / className | Preserved object fields for individual matches |

searchWords accepts strings or `{ text, className?, style? }` objects and is omitted by default. sourceString defaults to an empty string, autoEscape to true, and caseSensitive to false. There is no common wrapper, default slot or v-model; pass text using sourceString.
