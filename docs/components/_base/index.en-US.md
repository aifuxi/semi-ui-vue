# `_base` infrastructure

`_base` exposes the public Vue boundary for the Foundation architecture pinned to Semi
v2.102.0. It does not render standalone UI. Application components should continue to use the
Composition API and only reach for this module when implementing a custom Foundation adapter.

## Import

```ts
import { BaseComponent, BaseFoundation, useBaseComponent } from '@aifuxi/semi-ui-vue';
import type { BaseProps, ValidateStatus } from '@aifuxi/semi-ui-vue/_base';
```

## Bind lifecycle in setup

```ts
const controller = useBaseComponent({
  props,
  state: shallowReactive({ visible: true }),
  context: { locale: 'en-US' },
});

controller.foundation = new CustomFoundation(controller.adapter);
```

`useBaseComponent` calls `foundation.init()` after mount, then calls `foundation.destroy()` and
clears the cache during unmount. `isControlled(key)` uses an own-property check, so an explicitly
passed `undefined` value is still controlled.

## Subpaths

- `/_base`: complete public entry.
- `/_base/base`: base props, motion, and `ValidateStatus` types.
- `/_base/base-foundation`: pinned `BaseFoundation` public facade.
- `/_base/base-component`: controller and `useBaseComponent`.
- `/_base/component-utils`: Vue component, VNode, HTMLElement, and empty-child checks.

The module owns no DOM or CSS. The default theme root already includes the pinned base styles.
