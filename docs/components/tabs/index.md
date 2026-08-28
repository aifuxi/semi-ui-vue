# Tabs 标签栏

当内容需要分组并在不同模块间切换时使用 Tabs。本实现以本地 Semi Design v2.102.0 为固定基线，保留 `.semi-tabs-*` DOM/class、主题 Token、键盘与 ARIA 契约。

## 基本用法

```vue
<script setup lang="ts">
import { TabPane, Tabs } from '@workspace/ui';
import '@workspace/theme-default/tabs.css';
</script>

<template>
  <Tabs>
    <TabPane item-key="docs" tab="文档">文档内容</TabPane>
    <TabPane item-key="start" tab="快速起步">快速起步内容</TabPane>
    <TabPane item-key="help" tab="帮助">帮助内容</TabPane>
  </Tabs>
</template>
```

`TabPane` 必须是 `Tabs` 的直接子节点。非受控模式默认选择第一个未禁用项；也可使用 `v-model`：

```vue
<Tabs v-model="activeKey" type="card">
  <TabPane item-key="one" tab="One">One panel</TabPane>
  <TabPane item-key="two" tab="Two">Two panel</TabPane>
</Tabs>
```

## 类型、方向与尺寸

- `type`：`line`（默认）、`card`、`button`、`slash`。
- `tabPosition`：`top`（默认）或 `left`。
- `size`：`large`（默认）、`medium`、`small`；与固定上游一致，尺寸样式主要作用于 line Tabs。

## 禁用、关闭与懒挂载

```vue
<Tabs default-active-key="docs" :keep-d-o-m="false" lazy-render @tab-close="removePane">
  <TabPane item-key="docs" tab="文档">文档</TabPane>
  <TabPane disabled item-key="start" tab="快速起步">快速起步</TabPane>
  <TabPane closable item-key="help" tab="帮助">帮助</TabPane>
</Tabs>
```

- `keepDOM=true` 默认挂载所有面板；`false` 只挂载当前面板。
- `lazyRender=true` 让面板在首次激活前不渲染内容，激活后保留。
- 关闭按钮或 Delete/Backspace 只派发 `tabClose`，数据删除由调用方完成。

## More 与滚动折叠

```vue
<Tabs :more="3" type="card">...</Tabs>
<Tabs collapsible type="card">...</Tabs>
<Tabs collapsible="auto" arrow-position="both" type="card">...</Tabs>
```

`more` 将尾部固定数量的 tab 收入“更多”菜单；`collapsible` 使用滚动箭头和隐藏项菜单；`auto` 只在实际溢出时启用。菜单通过 Portal 渲染并遵循 `ConfigProvider.getPopupContainer`。

## Slots

| Slot                                              | 说明                                        |
| ------------------------------------------------- | ------------------------------------------- |
| `default`                                         | 直接 `TabPane` 或 tabList 模式的当前内容    |
| `tabBarExtraContent`                              | 标签栏附加内容                              |
| `tabBar="{ activeKey, list, onTabClick }"`        | 自定义整条标签栏，替代 React `renderTabBar` |
| `more="{ hiddenTabs }"`                           | 自定义 More 触发器                          |
| `arrow="{ items, position, click, defaultNode }"` | 自定义折叠箭头                              |
| `TabPane#tab/#icon/default`                       | 标签、图标与面板内容                        |

## Tabs API

| 属性                 | 类型                              | 默认值     | 说明                                        |
| -------------------- | --------------------------------- | ---------- | ------------------------------------------- |
| `activeKey`          | `string`                          | -          | 受控激活键                                  |
| `modelValue`         | `string`                          | -          | 原生 `v-model` 激活键                       |
| `defaultActiveKey`   | `string`                          | 首个可用项 | 非受控初值                                  |
| `tabList`            | `PlainTab[]`                      | -          | 对象式标签列表，非空时优先于 TabPane 元数据 |
| `type`               | `line \| card \| button \| slash` | `line`     | 标签栏类型                                  |
| `size`               | `small \| medium \| large`        | `large`    | 尺寸                                        |
| `tabPosition`        | `top \| left`                     | `top`      | 位置                                        |
| `keepDOM`            | `boolean`                         | `true`     | 是否保留隐藏面板 DOM                        |
| `lazyRender`         | `boolean`                         | `false`    | 是否延迟首次内容渲染                        |
| `tabPaneMotion`      | `boolean`                         | `true`     | 是否启用固定面板切换动效                    |
| `collapsible`        | `boolean \| 'auto'`               | `false`    | 滚动折叠模式                                |
| `showRestInDropdown` | `boolean`                         | `true`     | 箭头是否显示隐藏项菜单                      |
| `arrowPosition`      | `start \| end \| both`            | `both`     | 箭头位置                                    |
| `more`               | `number \| TabsMoreOptions`       | -          | 固定收入 More 的数量与配置                  |
| `preventScroll`      | `boolean`                         | `false`    | 键盘移动焦点时阻止滚动                      |

## Events

| 事件                | 参数                     | 说明                                 |
| ------------------- | ------------------------ | ------------------------------------ |
| `change`            | `(activeKey)`            | 激活项真正变化；当前项重复点击不触发 |
| `update:modelValue` | `(activeKey)`            | `v-model` 更新                       |
| `update:activeKey`  | `(activeKey)`            | 同名受控 prop 更新                   |
| `tabClick`          | `(activeKey, event)`     | 未禁用项每次点击或 Enter/Space       |
| `tabClose`          | `(tabKey)`               | 关闭请求，不自动删除数据             |
| `visibleTabsChange` | `(Map<string, boolean>)` | 折叠模式可见项变化                   |

## 键盘与可访问性

- 水平：Left/Right；垂直：Up/Down；循环移动焦点并跳过 disabled。
- Home/End 移到首尾，Enter/Space 激活，Delete/Backspace 关闭 closable 项。
- tablist/tab/tabpanel、`aria-controls`、`aria-labelledby`、`aria-selected` 与 roving tabindex 与固定基线一致。

完整证据、差异和验收门禁见 [alignment.md](./alignment.md)。
