# Tabs

Use Tabs to group content and switch between modules. This Vue implementation is pinned to local Semi Design v2.102.0 and preserves the `.semi-tabs-*` DOM/classes, theme tokens, keyboard behavior, and ARIA contract.

## Basic usage

```vue
<script setup lang="ts">
import { TabPane, Tabs } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/tabs.css';
</script>

<template>
  <Tabs>
    <TabPane item-key="docs" tab="Docs">Docs content</TabPane>
    <TabPane item-key="start" tab="Quick Start">Quick Start content</TabPane>
    <TabPane item-key="help" tab="Help">Help content</TabPane>
  </Tabs>
</template>
```

`TabPane` must be a direct child of `Tabs`. Uncontrolled Tabs select the first enabled item. Native two-way binding is also available:

```vue
<Tabs v-model="activeKey" type="card">
  <TabPane item-key="one" tab="One">One panel</TabPane>
  <TabPane item-key="two" tab="Two">Two panel</TabPane>
</Tabs>
```

## Types, position, and size

- `type`: `line` (default), `card`, `button`, or `slash`.
- `tabPosition`: `top` (default) or `left`.
- `size`: `large` (default), `medium`, or `small`; as in the pinned source, size styling mainly affects line Tabs.

## Disabled, closable, and lazy panes

```vue
<Tabs default-active-key="docs" :keep-d-o-m="false" lazy-render @tab-close="removePane">
  <TabPane item-key="docs" tab="Docs">Docs</TabPane>
  <TabPane disabled item-key="start" tab="Quick Start">Quick Start</TabPane>
  <TabPane closable item-key="help" tab="Help">Help</TabPane>
</Tabs>
```

`keepDOM=true` mounts every pane; `false` mounts only the active pane. `lazyRender=true` delays pane content until first activation and then keeps it. Close/Delete only emits `tabClose`; the caller owns the data update.

## More and scroll collapse

```vue
<Tabs :more="3" type="card">...</Tabs>
<Tabs collapsible type="card">...</Tabs>
<Tabs collapsible="auto" arrow-position="both" type="card">...</Tabs>
```

`more` moves a fixed trailing count into a More menu. `collapsible` provides scroll arrows and hidden-item menus; `auto` enables collapse only after real overflow. Menus render through a Portal and honor `ConfigProvider.getPopupContainer`.

## Slots

| Slot                                              | Description                                                           |
| ------------------------------------------------- | --------------------------------------------------------------------- |
| `default`                                         | Direct TabPane children, or caller-controlled content in tabList mode |
| `tabBarExtraContent`                              | Extra bar content                                                     |
| `tabBar="{ activeKey, list, onTabClick }"`        | Replaces React `renderTabBar`                                         |
| `more="{ hiddenTabs }"`                           | Custom More trigger                                                   |
| `arrow="{ items, position, click, defaultNode }"` | Custom collapse arrow                                                 |
| `TabPane#tab/#icon/default`                       | Label, icon, and pane content                                         |

## Tabs API

| Prop                 | Type                              | Default       | Description                                                   |
| -------------------- | --------------------------------- | ------------- | ------------------------------------------------------------- |
| `activeKey`          | `string`                          | -             | Controlled active key                                         |
| `modelValue`         | `string`                          | -             | Native `v-model` active key                                   |
| `defaultActiveKey`   | `string`                          | first enabled | Uncontrolled initial key                                      |
| `tabList`            | `PlainTab[]`                      | -             | Object-form tabs; a non-empty list wins over TabPane metadata |
| `type`               | `line \| card \| button \| slash` | `line`        | Bar type                                                      |
| `size`               | `small \| medium \| large`        | `large`       | Size                                                          |
| `tabPosition`        | `top \| left`                     | `top`         | Position                                                      |
| `keepDOM`            | `boolean`                         | `true`        | Keep inactive pane DOM                                        |
| `lazyRender`         | `boolean`                         | `false`       | Delay first content render                                    |
| `tabPaneMotion`      | `boolean`                         | `true`        | Use the pinned pane motion                                    |
| `collapsible`        | `boolean \| 'auto'`               | `false`       | Scroll-collapse mode                                          |
| `showRestInDropdown` | `boolean`                         | `true`        | Show hidden items from arrows                                 |
| `arrowPosition`      | `start \| end \| both`            | `both`        | Arrow position                                                |
| `more`               | `number \| TabsMoreOptions`       | -             | Fixed More count/configuration                                |
| `preventScroll`      | `boolean`                         | `false`       | Prevent scroll during keyboard focus movement                 |

## Events

| Event               | Arguments                | Description                                                |
| ------------------- | ------------------------ | ---------------------------------------------------------- |
| `change`            | `(activeKey)`            | Active key changed; not emitted for repeated active clicks |
| `update:modelValue` | `(activeKey)`            | `v-model` update                                           |
| `update:activeKey`  | `(activeKey)`            | Controlled prop update                                     |
| `tabClick`          | `(activeKey, event)`     | Every enabled click or Enter/Space                         |
| `tabClose`          | `(tabKey)`               | Close request; does not delete data                        |
| `visibleTabsChange` | `(Map<string, boolean>)` | Visible-state changes in collapse mode                     |

## Keyboard and accessibility

Horizontal tabs use Left/Right; vertical tabs use Up/Down. Focus wraps and skips disabled items. Home/End move to the edges, Enter/Space activates, and Delete/Backspace closes a closable tab. The tablist/tab/tabpanel roles, relationships, selection state, and roving tabindex match the pinned source.

See [alignment.md](./alignment.md) for source evidence, accepted adaptations, and verification gates.
