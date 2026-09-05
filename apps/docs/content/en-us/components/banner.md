---
title: 'Banner'
description: 'The Banner component is usually used to identify the status or notification of the full page. It is usually resident and requires the user to close it initiatively.'
locale: 'en-US'
slug: 'banner'
category: 'feedback'
order: 87
englishTitle: 'Banner'
icon: 'doc-banner'
upstream: 'feedback/banner'
---

## Demos

### How to import

```vue
<script setup lang="ts">
import { Banner } from '@aifuxi/semi-ui-vue/banner';
import '@aifuxi/semi-theme-default/banner.css';
</script>
```

### Basic Usage

::demo-block{demo="banner/en-us/Basic" title="Basic Usage"}
::

### Types

The `type` prop supports one of: `info` (default),`danger`,`warning`, `success`.

::demo-block{demo="banner/en-us/Types" title="Types"}
::

### Use in Container

You could set `:full-mode="false"` to use style for non-fullscreen mode。
Also, use `bordered` for bordered style.

::demo-block{demo="banner/en-us/Container" title="Use in Container"}
::

```css
.components-banner-demo {
  .semi-banner-info.semi-banner-bordered {
    border: 1px solid var(--semi-color-primary-disabled);
  }
  .semi-banner-warning.semi-banner-bordered {
    border: 1px solid var(--semi-color-warning-light-active);
  }
  .semi-banner-danger.semi-banner-bordered {
    border: 1px solid var(--semi-color-danger-light-active);
  }
  .semi-banner-success.semi-banner-bordered {
    border: 1px solid var(--semi-color-success-light-active);
  }
}
```

### Customized Content

Use the default slot to create customized content.
::demo-block{demo="banner/en-us/Custom" title="Customized Content"}
::

## API Reference

### Banner

| Property            | Description                                    | Type                      | Default     |
| ------------------- | ---------------------------------------------- | ------------------------- | ----------- |
| `bordered`          | Show a border in container mode                | `boolean`                 | `false`     |
| `class / className` | Vue class and compatibility class name         | `HTMLAttributes["class"]` | `—`         |
| `style`             | Root styles                                    | `StyleValue`              | `—`         |
| `closeIcon`         | Close icon; null hides the entire close button | `VNodeChild`              | `IconClose` |
| `description`       | Description                                    | `VNodeChild`              | `—`         |
| `fullMode`          | Full-screen mode                               | `boolean`                 | `true`      |
| `icon`              | Status icon; null hides the icon               | `VNodeChild`              | `by type`   |
| `title`             | Title                                          | `VNodeChild`              | `—`         |
| `type`              | info, success, danger, warning                 | `BannerType`              | `info`      |

Slots: `title`, `description`, `icon`, `closeIcon`, and `default` for extra content. Named slots take precedence over matching props. `@close(event: MouseEvent)` fires before the banner is hidden. There is no visible prop or v-model: use parent v-if to mount a new banner after closing.

## Accessibility

### ARIA

- The component has a `role` of 'alert'.
- The close icon has a `aria-label` of 'Close'.

### Keyboard and Focus

- The close button of the Banner can be focused with the `Tab` key. After the button is focused, hit the `Enter` key or the `Space` key to close the banner.

## Content Guidelines

- Full screen Banner
  - Try to keep the content displayed completely on one line
  - Use correct punctuation, commas within sentences and periods between sentences
- Non-fullscreen Banner
  - title
    - Instructions in condensed language
    - Try to avoid using commas, periods and other punctuation marks in the title, and support the use of question marks at the end when there are and only interrogative sentences
  - text
    - On the premise of complete information transmission, try to compress the text to 1-2 sentences
    - A detailed description or explanation of the title, rather than a repetition of the title
    - Use correct punctuation, commas within sentences and periods between sentences

## Design Tokens

::token-table{component="banner"}
::

## FAQ

**How do I show a closed banner again?** Remount it with parent v-if.

**How do I hide the icon or close button?** Pass null to icon or closeIcon respectively.

**Why is bordered not visible?** It applies to non-fullscreen mode; set fullMode to false.

**Can close be cancelled?** The close event is a notification. event.preventDefault() does not cancel hiding; omit the close control when closing must be restricted.

## React → Vue

| React                                              | Vue                              |
| -------------------------------------------------- | -------------------------------- |
| `children`                                         | default slot                     |
| `title / description / icon / closeIcon ReactNode` | Matching slots or VNodeChild     |
| `onClose`                                          | @close                           |
| `React conditional rendering`                      | Parent v-if                      |
| `className`                                        | class (className alias retained) |
