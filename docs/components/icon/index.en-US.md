# Icon

The icon packages align with Semi Design v2.102.0: `@aifuxi/semi-icons-vue` ships the `Icon` base plus 523 stable icons, and `@aifuxi/semi-icons-lab-vue` ships the `Icon` base plus 84 colored Lab icons. The main UI package root export and the `@aifuxi/semi-ui-vue/icon` subpath both forward the stable `Icon` base. Icons keep the pinned `<span role="img">` + `<svg>` structure, classes, size tokens, rotation and multi-fill contracts.

## Basic usage

```vue
<script setup lang="ts">
import { IconHome, IconDelete } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <IconHome />
  <IconHome size="small" style="color: var(--semi-color-primary)" />
  <IconDelete aria-label="Delete" />
</template>
```

The root is `span.semi-icon[role="img"]`; `aria-label` defaults to the icon `type` (e.g. `home`). The inner `svg` always uses `viewBox="0 0 24 24"`, `width/height=1em`, `focusable="false"`, `aria-hidden="true"` and `path fill="currentColor"`, so icons follow the text `color`.

## Rotation, size and animation

| Need            | Usage                                                                | Result                                                         |
| --------------- | -------------------------------------------------------------------- | -------------------------------------------------------------- |
| Size            | `size="extra-small" / "small" / "default" / "large" / "extra-large"` | Adds `semi-icon-{size}`; `inherit` adds no size class          |
| Rotation        | `:rotate="90"`                                                       | Inline `transform: rotate(90deg)` on the root                  |
| Spin            | `spin`                                                               | Adds `semi-icon-spinning` (`1s linear infinite`)               |
| Color           | `style="color: …"` or `fill`                                         | `currentColor` follows text color; `fill` overrides path fills |
| Bicolor / multi | `:fill="['#0064fa', '#15c39a']"`                                     | Applies fills to the generated SVG paths in order              |

## Custom icons

```vue
<script setup lang="ts">
import { h } from 'vue';
import { Icon, convertIcon } from '@aifuxi/semi-icons-vue';

const CustomDot = convertIcon(
  ({ fill }) => h('circle', { cx: 12, cy: 12, fill, r: 4 }),
  'custom_dot',
);
</script>

<template>
  <Icon type="custom-dot" :svg="h('circle', { cx: 12, cy: 12, r: 4, fill: 'currentColor' })" />
  <CustomDot />
</template>
```

- The `Icon` base accepts custom SVG through the default slot or the `svg` prop; `type` drives the icon class and the default `aria-label`.
- `convertIcon(renderSvg, iconType)` returns a component inheriting every `Icon` prop; `renderSvg` receives `{ fill }` and returns a `VNode`. Stable and Lab icons are generated this way.
- `prefixCls` defaults to `semi`; a custom prefix changes the classes to `{prefixCls}-icon*`.

## API

### Icon

| Prop        | Type                                                                             | Default     |
| ----------- | -------------------------------------------------------------------------------- | ----------- |
| `fill`      | `string \| string[]`                                                             | -           |
| `prefixCls` | `string`                                                                         | `'semi'`    |
| `rotate`    | `number`                                                                         | -           |
| `size`      | `'inherit' \| 'extra-small' \| 'small' \| 'default' \| 'large' \| 'extra-large'` | `'default'` |
| `spin`      | `boolean`                                                                        | `false`     |
| `svg`       | `VNodeChild`                                                                     | -           |
| `type`      | `string`                                                                         | -           |

Slots: `default` (custom SVG content). Exposed: `element` (the root `span` ref).

### convertIcon

`convertIcon(renderSvg: (props: { fill?: string | string[] }) => VNode, iconType: string)` returns a component inheriting the `Icon` props, named after `iconType` in PascalCase.

### Icon exports

- `@aifuxi/semi-icons-vue`: default `Icon`, `convertIcon` and 523 named icons (e.g. `IconHome`, `IconDelete`).
- `@aifuxi/semi-icons-lab-vue`: default `Icon` and 84 colored Lab icons.
- The `@aifuxi/semi-ui-vue` root export and `@aifuxi/semi-ui-vue/icon` subpath forward the stable `Icon` base with matching default and named exports.

## Accessibility, theme and SSR

- Semantic icons expose their name through `role="img"` + `aria-label`; decorative icons should pass `aria-hidden="true"` explicitly, as the component never strips caller ARIA attributes.
- Icon color uses `currentColor`, so light/dark themes and theme tokens drive it through text color and `--semi-*` variables. Icons have no direction-specific behavior; RTL is decided by the surrounding layout.
- Icons render functionally with no observers, portals or global listeners; import and SSR render never touch DOM globals.

## React → Vue

See the [React → Vue mapping](./react-to-vue.md). Full public behavior, visual and release evidence lives in the [alignment matrix](./alignment.md).
