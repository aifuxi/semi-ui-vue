---
title: 'FloatButton'
description: 'A floating button is an actionable button that can float on the page'
locale: 'en-US'
slug: 'float-button'
category: 'basic'
order: 23
englishTitle: 'FloatButton'
icon: 'doc-floatButton'
upstream: 'basic/floatbutton'
---

## Demos

### How to import

FloatButton is supported since 2.85.0.

```vue
<script setup lang="ts">
import { FloatButton, FloatButtonGroup } from '@aifuxi/semi-ui-vue/float-button';
import '@aifuxi/semi-theme-default/float-button.css';
</script>
```

### Basic usage

::demo-block{demo="float-button/en-us/Basic" title="Basic usage"}
::

### Size

Three sizes are supported: default, small, large.

::demo-block{demo="float-button/en-us/Size" title="Size"}
::

### Shape

Two shapes are defined by default: square (default) and circle.

::demo-block{demo="float-button/en-us/Shape" title="Shape"}
::

### Click to jump

You can set the jump address through `href`, and `target` specifies the window or frame in which the target web page should be opened.

::demo-block{demo="float-button/en-us/Link" title="Click to jump"}
::

### AI style - Colorful floating buttons

You can set `colorful` to true to display colorful floating buttons.

::demo-block{demo="float-button/en-us/Colorful" title="AI style - Colorful floating buttons"}
::

### Badge

::demo-block{demo="float-button/en-us/Badge" title="Badge"}
::

### Floating button Group

Subitems can be passed in via `items`.

::demo-block{demo="float-button/en-us/Group" title="Floating button Group"}
::

## API Reference

### FloatButton

| Property   | Description                                                                                                                                     | Type                    | Default   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------- |
| `shape`    | Shape, supports round, square                                                                                                                   | `FloatButtonShape`      | `round`   |
| `colorful` | Use colorful floating buttons                                                                                                                   | `boolean`               | `false`   |
| `icon`     | Icon                                                                                                                                            | `VNodeChild`            | `—`       |
| `href`     | Click the jump link, the same as [href](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/href)                                         | `string`                | `—`       |
| `target`   | Specifies where to display the URL of the link, same as [target](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/a#target) | `string`                | `—`       |
| `disabled` | Disabled state                                                                                                                                  | `boolean`               | `false`   |
| `size`     | Size, supports default, small, large                                                                                                            | `FloatButtonSize`       | `default` |
| `badge`    | Badge parameters                                                                                                                                | `FloatButtonBadgeProps` | `—`       |

### FloatButtonBadge

| Property         | Description                         | Type                             | Default    |
| ---------------- | ----------------------------------- | -------------------------------- | ---------- |
| `count`          | Badge content                       | `VNodeChild`                     | `—`        |
| `dot`            | Use a dot badge                     | `boolean`                        | `—`        |
| `type`           | Badge semantic color                | `FloatButtonBadgeType`           | `primary`  |
| `theme`          | Badge theme: solid, light, inverted | `FloatButtonBadgeTheme`          | `solid`    |
| `position`       | Badge position                      | `FloatButtonBadgePosition`       | `rightTop` |
| `overflowCount`  | Maximum displayed badge count       | `number`                         | `99`       |
| `style`          | Style                               | `CSSProperties`                  | `—`        |
| `className`      | Style class name                    | `string`                         | `—`        |
| `countClassName` | Count-node class                    | `string`                         | `—`        |
| `countStyle`     | Count-node style                    | `CSSProperties`                  | `—`        |
| `onClick`        | Click callback function             | `(event: MouseEvent) => unknown` | `—`        |
| `onMouseEnter`   | Mouse-enter callback                | `(event: MouseEvent) => unknown` | `—`        |
| `onMouseLeave`   | Mouse-leave callback                | `(event: MouseEvent) => unknown` | `—`        |

### FloatButtonGroupItem

Extends FloatButtonProps with the following fields.

| Property  | Description   | Type         | Default |
| --------- | ------------- | ------------ | ------- |
| `value`   | Value of item | `string`     | `—`     |
| `content` | Text content  | `VNodeChild` | `—`     |

### FloatButtonGroup

| Property   | Description                      | Type                              | Default |
| ---------- | -------------------------------- | --------------------------------- | ------- |
| `disabled` | Disabled state                   | `boolean`                         | `false` |
| `items`    | Information about a single child | `readonly FloatButtonGroupItem[]` | `—`     |

FloatButton accepts an `#icon` slot and emits `@click(event: MouseEvent)`. FloatButtonGroup accepts required items, supports `#item="{ item, index }"`, and emits `@click(value, event: MouseEvent)`. Group item content accepts Vue nodes. Use class/style as native attributes; className is not a Vue styling prop. Badge callbacks remain function fields of badge, and badge uses FloatButtonBadgeProps rather than every Badge prop.

## Accessibility

Provide accessible names for icon-only actions. The fixed-source button uses pointer-click semantics; adding aria-label alone does not create native button keyboard behavior. Use an accessible surrounding workflow when keyboard activation is required.

## Content Guidelines

Use concise action names and keep group labels easy to distinguish.

## Design Tokens

::token-table{component="floatButton"}
::

## FAQ

**Where is the button positioned?** It is fixed to the viewport by default; use style to adjust bottom and insetInlineEnd.

**Why does a disabled action not navigate?** Disabled buttons intentionally ignore click and href navigation.

**What does group click return?** The configured item value and MouseEvent.

## React → Vue

| React                              | Vue                      |
| ---------------------------------- | ------------------------ |
| `icon ReactNode`                   | `#icon / VNodeChild`     |
| `FloatButtonGroup items[].content` | `VNodeChild`             |
| `onClick`                          | `@click`                 |
| `className`                        | `class native attribute` |
