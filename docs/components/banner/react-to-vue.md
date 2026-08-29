# Banner React → Vue 迁移

| Semi React v2.102.0                    | Vue                                                     |
| -------------------------------------- | ------------------------------------------------------- |
| `<Banner description="Notice" />`      | `<Banner description="Notice" />`                       |
| `<Banner fullMode={false} bordered />` | `<Banner :full-mode="false" bordered />`                |
| `title={<strong>Title</strong>}`       | `<template #title><strong>Title</strong></template>`    |
| `description={<span>Detail</span>}`    | `<template #description><span>Detail</span></template>` |
| `icon={<CustomIcon />}`                | `<template #icon><CustomIcon /></template>`             |
| `icon={null}`                          | `:icon="null"`                                          |
| `closeIcon={<CustomClose />}`          | `<template #closeIcon><CustomClose /></template>`       |
| `closeIcon={null}`                     | `:close-icon="null"`                                    |
| `onClose={handleClose}`                | `@close="handleClose"`                                  |
| `children`                             | 默认 slot                                               |
| `className` / `style`                  | `class` / `style`；`className` 仍兼容                   |

Banner 没有公开受控 visible API。关闭后组件内部会移除 DOM；需要重新显示时，应由调用方重新挂载 Banner，与固定 React 行为一致。
