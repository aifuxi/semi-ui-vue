# Progress React → Vue 迁移

| React v2.102.0                             | Vue                                              | 说明                                         |
| ------------------------------------------ | ------------------------------------------------ | -------------------------------------------- |
| `<Progress percent={40} />`                | `<Progress :percent="40" />`                     | prop 名与枚举值保持一致                      |
| `showInfo={true}`                          | `show-info` 或 `:show-info="true"`               | 缺省仍为 false                               |
| `format={percent => ...}`                  | `:format="percent => ..."`                       | 函数 prop 直接保留                           |
| `format={percent => <strong>...</strong>}` | `<template #format="{ percent }">...</template>` | 推荐的 Vue VNode/模板映射；slot 优先         |
| `motion={false}`                           | `:motion="false"`                                | 关闭数字动画；CSS 几何 transition 由样式保持 |
| `className/style`                          | `class/style` 或同名 prop                        | Vue 原生属性会与同名兼容 prop 合并           |
| React ref                                  | 无需迁移                                         | Progress 没有公开命令式 ref API              |

`percent` 是单向输入，不迁移为 `v-model`。组件不发出事件，不创建 Portal，也不需要键盘或焦点适配。
