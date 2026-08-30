# Dropdown 下拉菜单

Dropdown 通过触发器展示操作菜单。本实现只以本地 Semi Design v2.102.0 为对齐基线，保留 `.semi-*` DOM、Portal、键盘焦点和主题契约。

## 基础用法

```vue
<script setup lang="ts">
import { Dropdown } from '@aifuxi/semi-ui-vue';
</script>

<template>
  <Dropdown>
    <button>更多操作</button>
    <template #content>
      <Dropdown.Menu>
        <Dropdown.Title>常用操作</Dropdown.Title>
        <Dropdown.Item>编辑</Dropdown.Item>
        <Dropdown.Item disabled>删除</Dropdown.Item>
      </Dropdown.Menu>
    </template>
  </Dropdown>
</template>
```

`menu` 适合数据驱动场景；`v-model:visible` 适合受控显示。

```vue
<Dropdown
  v-model:visible="visible"
  trigger="click"
  show-tick
  :menu="[
    { node: 'title', name: '操作' },
    { node: 'item', name: '编辑', active: true },
    { node: 'divider' },
    { node: 'item', name: '删除', disabled: true, type: 'danger' },
  ]"
>
  <button>菜单</button>
</Dropdown>
```

## API

### Dropdown

| 属性                | 说明                             | 类型                                                         | 默认值                |
| ------------------- | -------------------------------- | ------------------------------------------------------------ | --------------------- |
| `visible`           | 是否显示；支持 `v-model:visible` | `boolean`                                                    | -                     |
| `trigger`           | 触发方式                         | `'hover' \| 'focus' \| 'click' \| 'custom' \| 'contextMenu'` | `'hover'`             |
| `position`          | 浮层位置                         | `TooltipPosition`                                            | `'bottom'`            |
| `menu`              | 数据驱动菜单                     | `readonly DropdownMenuItem[]`                                | -                     |
| `showTick`          | 为 Item 保留勾选列               | `boolean`                                                    | `false`               |
| `contentClassName`  | 内容根 class                     | `HTMLAttributes['class']`                                    | -                     |
| `getPopupContainer` | Portal 容器                      | `() => HTMLElement`                                          | ConfigProvider / body |
| `spacing`           | trigger 与浮层间距               | `number \| TooltipSpacing`                                   | 一级 4，嵌套 2        |
| `motion`            | 是否启用浮层动效                 | `boolean`                                                    | `true`                |
| `closeOnEsc`        | Esc 是否关闭                     | `boolean`                                                    | `true`                |
| `mouseEnterDelay`   | hover/focus 打开延迟             | `number`                                                     | `50`                  |
| `mouseLeaveDelay`   | hover/focus 关闭延迟             | `number`                                                     | `100`                 |
| `zIndex`            | Portal 层级                      | `number`                                                     | `1060`                |
| `class`             | popup wrapper class              | Vue class                                                    | -                     |
| `style`             | `.semi-dropdown` 内容根样式      | Vue style                                                    | -                     |

保留 Tooltip 的定位与行为属性，包括 `autoAdjustOverflow`、`margin`、`rePosKey`、`clickToHide`、`clickTriggerToHide`、`stopPropagation`、`keepDOM` 和 `preventScroll`。

事件：`visibleChange`、`update:visible`、`clickOutside`、`escKeydown`、`afterClose`。公开实例方法：`focusTrigger()`、`getPopupId()`、`rePosition()`。

Slots：默认 slot 是 trigger；`#content` 是菜单内容并优先于 `menu`。

### Dropdown.Menu

接收默认 slot、Vue 原生 `class` / `style` / `data-*` / `aria-*`，输出 `role="menu"`。

### Dropdown.Item

| 属性       | 说明                           | 类型                                                              | 默认值  |
| ---------- | ------------------------------ | ----------------------------------------------------------------- | ------- |
| `active`   | 激活态；配合 `showTick` 显示勾 | `boolean`                                                         | `false` |
| `disabled` | 禁用鼠标交互并退出键盘导航     | `boolean`                                                         | `false` |
| `type`     | 文本类型                       | `'primary' \| 'secondary' \| 'tertiary' \| 'warning' \| 'danger'` | -       |
| `icon`     | 左侧图标，也可用 `#icon`       | `VNodeChild \| () => VNodeChild`                                  | -       |
| `showTick` | Item 局部勾选列；外层值优先    | `boolean`                                                         | `false` |

事件：`click`、`mouseenter`、`mouseleave`、`contextmenu`、`keydown`。默认 slot 是 Item 内容。

### Dropdown.Title / Dropdown.Divider

两者都接收 Vue 原生 `class`、`style` 和透传属性；Title 接收默认 slot。

## 无障碍与 SSR

- trigger 保留 `aria-haspopup`、`aria-expanded` 和 `data-popupid`。
- ArrowUp/ArrowDown 循环移动可用项；打印字符按首字符跳转；Enter/Space 激活；Esc 关闭并回焦。
- SSR 只输出 trigger；Portal 和 DOM 监听只在客户端生命周期创建并在卸载时清理。

参见 [React → Vue 迁移说明](./react-to-vue.md) 和 [v2.102.0 对齐矩阵](./alignment.md)。
