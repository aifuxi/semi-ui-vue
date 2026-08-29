# Spin React → Vue 迁移

| React v2.102.0                             | Vue                                               | 说明                                      |
| ------------------------------------------ | ------------------------------------------------- | ----------------------------------------- |
| `<Spin />`                                 | `<Spin />`                                        | `spinning` 仍默认 `true`                  |
| `<Spin spinning={loading} delay={1000} />` | `<Spin :spinning="loading" :delay="1000" />`      | 单向受控 prop，不改为 `v-model`           |
| `indicator={<IconLoading />}`              | `<template #indicator><IconLoading /></template>` | 同名 VNode prop 仍可用，slot 优先         |
| `tip={<span>Loading</span>}`               | `<template #tip><span>Loading</span></template>`  | 同名 VNode prop 仍可用，slot 优先         |
| `children`                                 | 默认 slot                                         | 保留 `.semi-spin-block`、遮罩与内容透明度 |
| `wrapperClassName` / `childStyle`          | 同名 prop                                         | 保留落点                                  |

React ref 没有公开命令式 API，无需迁移。默认 SVG、三种尺寸、delay、主题、RTL 和 SSR 行为保持固定 v2.102.0 契约。
