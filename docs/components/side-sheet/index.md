# SideSheet 滑动侧边栏

SideSheet 从页面边缘滑出，用于承载不会离开当前上下文的二级操作。本实现以本地 Semi Design v2.102.0 为唯一基线。

## 基本使用

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, SideSheet } from '@workspace/ui';
import '@workspace/theme-default/side-sheet.css';

const visible = ref(false);
</script>

<template>
  <Button @click="visible = true">打开详情</Button>
  <SideSheet v-model:visible="visible" title="资源详情">
    <p>这里是侧边栏内容。</p>
  </SideSheet>
</template>
```

## 位置、尺寸和容器

- `placement` 支持 `top`、`right`、`bottom`、`left`。
- left/right 使用 `size=small|medium|large`（448/684/920px）或自定义 `width`。
- top/bottom 默认高 448px，可设置 `height`。
- `mask=false` 允许操作外部区域；如还需滚动页面，请同时设置 `disableScroll=false`。
- `getPopupContainer` 可把 SideSheet 首次挂载到稳定容器；容器应设置 `position: relative` 和 `overflow: hidden`。

```vue
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { SideSheet } from '@workspace/ui';

const host = useTemplateRef<HTMLElement>('host');
const visible = ref(true);
</script>

<template>
  <section ref="host" class="sheet-host">
    <SideSheet
      v-model:visible="visible"
      placement="left"
      width="320px"
      title="容器内侧栏"
      :get-popup-container="() => host!"
    >
      内容
    </SideSheet>
  </section>
</template>
```

## 插槽与事件

- 默认插槽：body；`#title`、`#footer`、`#closeIcon` 分别覆盖同名 prop。
- `v-model:visible` 是推荐受控方式；取消由 close、mask 或启用后的 Escape 触发。
- `@cancel` 收到原始 MouseEvent/KeyboardEvent；`@after-visible-change` 在渲染态进入或离场完成后触发。
- `keepDOM=true` 关闭后保留内容状态，使用 `.semi-sidesheet-hidden` 隐藏。

## API

| Prop                                                | 类型                                     | 默认值            |
| --------------------------------------------------- | ---------------------------------------- | ----------------- |
| `visible`                                           | `boolean`                                | `false`           |
| `placement`                                         | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'`         |
| `size`                                              | `'small' \| 'medium' \| 'large'`         | `'small'`         |
| `width` / `height`                                  | `number \| string`                       | size 宽度 / `448` |
| `title` / `footer` / `closeIcon`                    | `VNodeChild`                             | -                 |
| `closable` / `mask` / `maskClosable`                | `boolean`                                | `true`            |
| `closeOnEsc`                                        | `boolean`                                | `false`           |
| `disableScroll` / `motion`                          | `boolean`                                | `true`            |
| `keepDOM`                                           | `boolean`                                | `false`           |
| `getPopupContainer`                                 | `() => HTMLElement`                      | `document.body`   |
| `zIndex`                                            | `number`                                 | `1000`            |
| `bodyStyle` / `headerStyle` / `maskStyle` / `style` | `StyleValue`                             | -                 |
| `aria-label`                                        | `string`                                 | -                 |

完整源码矩阵、事件顺序、SSR 与偏差结论见 `alignment.md`，React 迁移见 `react-to-vue.md`。
