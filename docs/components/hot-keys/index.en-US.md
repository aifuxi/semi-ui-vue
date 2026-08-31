# HotKeys

HotKeys uses the shortcut state machine pinned to Semi Design v2.102.0 while rendering the same
keyboard-hint structure. A combination must contain exactly one non-modifier key and may include
Meta, Shift, Alt, and Control.

```ts
import { HotKeys } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/hot-keys.css';
```

## Basic usage

```vue
<script setup lang="ts">
import { HotKeys } from '@aifuxi/semi-ui-vue/hot-keys';

function save(event: KeyboardEvent) {
  console.log('save', event.code);
}
</script>

<template>
  <HotKeys
    :hot-keys="[HotKeys.Keys.Control, HotKeys.Keys.S]"
    :content="['Ctrl', 'S']"
    prevent-default
    @hot-key="save"
  />
</template>
```

The ordinary key is matched through `KeyboardEvent.code`, so letter casing does not change the
combination. Modifiers that are not configured must also be released: Control+Shift+S does not
match a Control+S shortcut.

## Custom listener target

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { HotKeys } from '@aifuxi/semi-ui-vue/hot-keys';

const panel = useTemplateRef<HTMLElement>('panel');
</script>

<template>
  <section ref="panel" tabindex="0">
    <HotKeys
      :hot-keys="[HotKeys.Keys.Enter]"
      :get-listener-target="() => panel"
      @hot-key="() => console.log('panel enter')"
    />
  </section>
</template>
```

The default target is `document.body`. The target is resolved on mount and is not rebound when the
getter changes, matching the pinned v2.102.0 Adapter. Unmount removes the listener from the target
that was actually registered.

## Custom rendering

The default slot is the Vue-native mapping of React's `render` prop. It replaces the generated key
caps while retaining the `.semi-hotKeys` root.

```vue
<HotKeys :hot-keys="[HotKeys.Keys.Control, HotKeys.Keys.K]">
  <strong>Open command palette</strong>
</HotKeys>
```

## API

| Property              | Description                                                   | Type                                     | Default         |
| --------------------- | ------------------------------------------------------------- | ---------------------------------------- | --------------- |
| `hotKeys`             | Valid combination with exactly one ordinary key               | `HotKeysKey[]`                           | required        |
| `content`             | Display labels; does not change the actual combination        | `string[]`                               | `hotKeys`       |
| `getListenerTarget`   | Returns the keydown listener target                           | `() => HTMLElement \| null \| undefined` | `document.body` |
| `preventDefault`      | Prevents the matched event's default action                   | `boolean`                                | `false`         |
| `mergeMetaCtrl`       | v2.102.0 compatibility prop; a no-op in the pinned Foundation | `boolean`                                | `false`         |
| `class` / `className` | Root classes                                                  | `HTMLAttributes['class']`                | -               |
| `style`               | Root inline style                                             | `StyleValue`                             | -               |

Events are `hotKey(event: KeyboardEvent)` and `click(event: MouseEvent)`. The default slot replaces
the key-cap display. The component does not add focusability or an ARIA role; pass business-specific
`role`, `aria-*`, and `data-*` attributes when needed.

See the [alignment matrix](./alignment.md) for event order, SSR, dark mode, RTL, and accepted
deviations, and the [migration guide](./react-to-vue.md) for React mappings.
