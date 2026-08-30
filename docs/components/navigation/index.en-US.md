# Navigation

`Navigation` organizes application destinations. This Vue adapter is aligned to the pinned local Semi Design v2.102.0 source and preserves the `.semi-navigation-*` DOM/classes, states, theme, keyboard behavior, and ARIA contract.

```vue
<script setup lang="ts">
import { Nav } from '@aifuxi/semi-ui-vue/navigation';

const items = [
  { itemKey: 'home', text: 'Home' },
  { itemKey: 'manage', text: 'Manage', items: [{ itemKey: 'users', text: 'Users' }] },
];
</script>

<template>
  <Nav
    :items="items"
    :default-selected-keys="['home']"
    :default-open-keys="['manage']"
    :header="{ text: 'Console' }"
    :footer="{ collapseButton: true }"
  />
</template>
```

Use `v-model:selected-keys`, `v-model:open-keys`, and `v-model:is-collapsed` for controlled state. Controlled views wait for the parent to feed the update back. `select` precedes `click`; a SubNav `openChange` precedes `click`.

The compound API exposes `Nav.Item`, `Nav.Sub`, `Nav.Header`, and `Nav.Footer`; `NavItem` and `SubNav` are also named exports. Slots include `default`, `header`, `footer`, `itemWrapper`, item `icon`/`text`, and SubNav `expandIcon`.

Important defaults are `mode="vertical"`, `limitIndent=true`, `subNavMotion=true`, `toggleIconPosition="right"`, and collapse/open/select state false or empty. Use `getPopupContainer` for collapsed or horizontal sub-navigation portals. Import standalone styles from `@aifuxi/semi-theme-default/navigation.css`.

The list uses `role="menu"`, items use `role="menuitem"`, and Enter follows click behavior. Imports and initial render are SSR-safe; portals and listeners are client-only and cleaned up on unmount.

See [alignment.md](./alignment.md) and [React-to-Vue migration](./react-to-vue.md) for the full contract.
