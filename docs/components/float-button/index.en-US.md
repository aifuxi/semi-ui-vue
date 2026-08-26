# FloatButton

FloatButton hosts frequent page-level actions. It targets Semi Design v2.102.0 and preserves the `.semi-floatButton*`, `.semi-badge*`, and `--semi-*` compatibility surface.

## Import

```ts
import { FloatButton, FloatButtonGroup } from '@workspace/ui';
import '@workspace/theme-default/float-button.css';
```

## Basic usage

```vue
<FloatButton aria-label="Create" @click="createItem">
  <template #icon><IconPlus /></template>
</FloatButton>
```

## Size, shape, and state

```vue
<FloatButton size="small"><template #icon><IconPlus /></template></FloatButton>
<FloatButton size="default" shape="square"><template #icon><IconPlus /></template></FloatButton>
<FloatButton size="large" colorful><template #icon><IconPlus /></template></FloatButton>
<FloatButton disabled><template #icon><IconPlus /></template></FloatButton>
```

## Badge and group

```vue
<FloatButton :badge="{ count: 120, overflowCount: 99 }" aria-label="Messages">
  <template #icon><IconBell /></template>
</FloatButton>

<FloatButtonGroup :items="items" @click="handleGroupClick" />
```

Group items support `value`, `content`, `icon`, and `badge`. Use the `#item="{ item, index }"` slot when migrating ReactNode rendering.

## API

| Prop       | Type                        | Default   | Description                           |
| ---------- | --------------------------- | --------- | ------------------------------------- |
| `shape`    | `round \| square`           | `round`   | Shape                                 |
| `size`     | `small \| default \| large` | `default` | Size                                  |
| `colorful` | `boolean`                   | `false`   | AI gradient style                     |
| `disabled` | `boolean`                   | `false`   | Prevent navigation and click emit     |
| `href`     | `string`                    | -         | Navigation URL                        |
| `target`   | `string`                    | -         | `_blank` opens a new browsing context |
| `badge`    | `FloatButtonBadgeProps`     | -         | Badge configuration                   |
| `icon`     | `VNodeChild`                | -         | Compatibility prop; prefer the slot   |

### Group

| Prop       | Type                              | Default  | Description                                          |
| ---------- | --------------------------------- | -------- | ---------------------------------------------------- |
| `items`    | `readonly FloatButtonGroupItem[]` | required | Item configurations                                  |
| `disabled` | `boolean`                         | `false`  | Matches upstream: adds only the disabled group class |

### Events and slots

| Name    | Arguments                  | Description               |
| ------- | -------------------------- | ------------------------- |
| `click` | FloatButton: `MouseEvent`  | Emitted when enabled      |
| `click` | Group: `value, MouseEvent` | Delegated root click      |
| `#icon` | -                          | FloatButton icon          |
| `#item` | `{ item, index }`          | Custom group item content |

The pinned v2.102.0 root is a div and has no built-in keyboard semantics. Provide an accessible name; add explicit role/tabindex/keyboard handling at the composition layer when the product requires keyboard activation.

## React → Vue migration

| React                  | Vue                                 |
| ---------------------- | ----------------------------------- |
| `icon={<IconPlus />}`  | `#icon` slot                        |
| `items[].icon/content` | matching VNode prop or `#item` slot |
| `onClick`              | `@click`                            |
| `className / style`    | native `class / style` attrs        |
| React ref              | Vue template ref                    |

All other prop names, enums, defaults, and delegated group event semantics stay unchanged.
