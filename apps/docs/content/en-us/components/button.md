---
title: 'Button'
description: 'Users use buttons to trigger an operation or jump.'
locale: 'en-US'
slug: 'button'
category: 'basic'
order: 22
englishTitle: 'Button'
icon: 'doc-button'
upstream: 'basic/button'
---

## Examples

### Import

```typescript
import { Button, ButtonGroup, SplitButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
```

### Button types

Five semantic types are available: primary (default), secondary, tertiary, warning and danger.

::demo-block{demo="button/en-us/Types" title="Button types"}
::

### Type text colors

Button colors use CSS variables, which are also available to custom elements.

::demo-block{demo="button/en-us/TypeColors" title="Type text colors"}
::

### Light background

The default theme is light. Other themes are solid, borderless and outline.

::demo-block{demo="button/en-us/Themelight" title="Light background"}
::

### Solid background

::demo-block{demo="button/en-us/Themesolid" title="Solid background"}
::

### No background

::demo-block{demo="button/en-us/Themeborderless" title="No background"}
::

### Outline

::demo-block{demo="button/en-us/Themeoutline" title="Outline"}
::

### Sizes

Three sizes are available: large, default and small.

::demo-block{demo="button/en-us/Sizes" title="Sizes"}
::

### Block button

A block button fills its parent, independently of its text length.

::demo-block{demo="button/en-us/Block" title="Block button"}
::

### Icon buttons

Use the icon slot and iconPosition to configure icons. Icon-only buttons require an accessible name.

::demo-block{demo="button/en-us/Icons" title="Icon buttons"}
::

### Link buttons

Use the link prop of [Typography](/en-us/components/typography/) for text links.

::demo-block{demo="button/en-us/Links" title="Link buttons"}
::

### Disabled

::demo-block{demo="button/en-us/Disabled" title="Disabled"}
::

### Loading

Set loading to true to show progress and prevent clicks. Disabled takes precedence over loading.

::demo-block{demo="button/en-us/Loading" title="Loading"}
::

### AI style — colorful buttons

Colorful buttons support every theme, with primary and tertiary types.

::demo-block{demo="button/en-us/Colorful" title="AI style — colorful buttons"}
::

### Group sizes

ButtonGroup applies size, disabled, type, theme and colorful to its buttons.

::demo-block{demo="button/en-us/GroupSizes" title="Group sizes"}
::

### Disabled group

::demo-block{demo="button/en-us/GroupDisabled" title="Disabled group"}
::

### Group types

::demo-block{demo="button/en-us/GroupTypes" title="Group types"}
::

### Split button group

Use SplitButtonGroup with Button and Dropdown to preserve spacing and corner radii. This local menu does not submit business operations.

::demo-block{demo="button/en-us/Split" title="Split button group"}
::

## API reference

::api-table{slug="button"}
::

## Accessibility

### ARIA

Use aria-label to name icon buttons. aria-disabled follows disabled. Give button groups an aria-label describing their actions.

### Keyboard and focus

Tab and Shift + Tab move between focusable buttons. Enter or Space activates the focused button. Each ButtonGroup child retains native focus order.

## Content guidelines

Start with a clear action verb so users can predict the result. Prefer a verb and a noun; the verb alone is sufficient when a dialog already supplies the object. Use sentence case.

| Recommended      | Avoid            |
| ---------------- | ---------------- |
| Apply permission | Apply            |
| Create project   | Create a project |
| Edit profile     | Edit             |

## Design tokens

::token-table{component="button"}
::

## FAQ

### Why is an icon missing?

Import Button from the public @aifuxi/semi-ui-vue/button entry and supply the #icon slot. Do not import internal BaseButton.
