# Skeleton React → Vue 迁移

| React v2.102.0                               | Vue                                                     | 说明                                  |
| -------------------------------------------- | ------------------------------------------------------- | ------------------------------------- |
| `<Skeleton loading={loading}>...</Skeleton>` | `<Skeleton :loading="loading">...</Skeleton>`           | prop 名和默认值保持一致               |
| `active={true}`                              | `active` 或 `:active="true"`                            | 启用固定 CSS 高亮动画                 |
| `placeholder={<Skeleton.Avatar />}`          | `<template #placeholder><Skeleton.Avatar /></template>` | 推荐的 ReactNode → Vue slot 映射      |
| `placeholder={node}`                         | `:placeholder="node"`                                   | VNode prop 仍保留；slot 优先          |
| `<Skeleton.Avatar size="large" />`           | 同名复合组件写法                                        | size/shape 枚举保持一致               |
| `<Skeleton.Paragraph rows={2} />`            | `<Skeleton.Paragraph :rows="2" />`                      | 默认仍为四行                          |
| `className/style`                            | `class/style` 或同名 prop                               | loading 根或 item 根合并 Vue 原生属性 |
| React ref                                    | 无需迁移                                                | Skeleton 没有公开命令式 ref API       |

`loading` 是单向输入，不迁移为 `v-model`。内容态不会保留 Skeleton 包装节点，也不会把其 attrs 克隆到默认 slot 的子节点。
