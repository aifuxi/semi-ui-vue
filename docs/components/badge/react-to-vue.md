# Badge React → Vue 迁移

| React v2.102.0                  | Vue                                                              |
| ------------------------------- | ---------------------------------------------------------------- |
| `<Badge count={5}>base</Badge>` | `<Badge :count="5">base</Badge>`                                 |
| `count={<Icon />}`              | `<template #count><Icon /></template>`，也可传 `VNodeChild` prop |
| `children`                      | 默认 slot                                                        |
| `className`                     | 保留 `className`，也可使用 Vue `class`                           |
| `onClick`                       | `@click`                                                         |
| `onMouseEnter` / `onMouseLeave` | `@mouseenter` / `@mouseleave`                                    |

`type`、`theme`、`position`、`overflowCount`、`countClassName`、`countStyle` 保持同名。为忠实兼容固定 Adapter，`style` 作用于内部 count 节点并优先于 `countStyle`，并非 Vue 常见的根样式落点。

RTL 缺省位置依赖 `ConfigProvider direction="rtl"`；只给外层 DOM 写 `dir="rtl"` 不会改变组件运行时的缺省 position。
