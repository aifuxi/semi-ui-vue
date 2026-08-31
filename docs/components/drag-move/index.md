# DragMove 拖拽移动

`DragMove` 让唯一子元素通过鼠标或触摸改变位置，支持约束范围、自定义拖拽手柄、
输入框保护、relative 定位和自定义位置写入。

```ts
import { DragMove } from '@aifuxi/semi-ui-vue/drag-move';
import '@aifuxi/semi-theme-default/drag-move.css';
```

## 基本用法

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { DragMove } from '@aifuxi/semi-ui-vue/drag-move';
import '@aifuxi/semi-theme-default/drag-move.css';

const container = useTemplateRef<HTMLElement>('container');
</script>

<template>
  <div ref="container" style="position: relative; width: 300px; height: 240px">
    <DragMove :constrainer="() => container">
      <div style="top: 40px; left: 40px; width: 80px; height: 80px">拖动我</div>
    </DragMove>
  </div>
</template>
```

DragMove 缺省把子元素设置为 `position: absolute`。约束容器应建立定位上下文，通常
使用 `position: relative`。如果需要保留元素原本的布局位置，设置
`position-strategy="relative"`。

## 自定义手柄

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';

const handle = useTemplateRef<HTMLElement>('handle');
</script>

<template>
  <DragMove :handler="() => handle">
    <section>
      <button ref="handle" type="button">拖拽手柄</button>
      <p>正文不会触发拖拽</p>
    </section>
  </DragMove>
</template>
```

## 输入与自定义移动

原生 `input` / `textarea` 默认保留编辑行为而不开始拖拽。需要从输入框拖动时显式设置
`allow-input-drag`。`customMove` 会接收约束后的 `top/left`，设置后组件不再自动写入
位置。

```vue
<DragMove
  allow-input-drag
  :custom-move="
    (element, top, left) => {
      element.style.transform = `translate(${left}px, ${top}px)`;
    }
  "
>
  <label><input value="也可以从这里拖动" /></label>
</DragMove>
```

## API

| 属性               | 说明                                   | 类型                                      | 默认值       |
| ------------------ | -------------------------------------- | ----------------------------------------- | ------------ |
| `allowInputDrag`   | 是否允许从原生 input/textarea 开始拖动 | `boolean`                                 | `false`      |
| `allowMove`        | start 后判断本次是否允许拖动           | `(event, element) => boolean`             | -            |
| `constrainer`      | 约束元素或直接使用父元素               | `'parent' \| (() => HTMLElement \| null)` | -            |
| `customMove`       | 自定义约束后的位置写入                 | `(element, top, left) => void`            | -            |
| `handler`          | 返回唯一拖拽触发元素                   | `() => HTMLElement \| null`               | 子元素       |
| `positionStrategy` | 子元素定位策略                         | `'absolute' \| 'relative'`                | `'absolute'` |

默认 slot 必须只有一个原生元素，或一个根节点可解析为 `HTMLElement` 的 Vue 组件。
DragMove 不增加 DOM wrapper，并会保留子节点原有 ref。

## 事件

| 事件                                                        | 参数         |
| ----------------------------------------------------------- | ------------ |
| `mouse-down` / `mouse-move` / `mouse-up`                    | `MouseEvent` |
| `touch-start` / `touch-move` / `touch-end` / `touch-cancel` | `TouchEvent` |

start 回调总会先触发；当 input guard 或 `allowMove` 拒绝本次拖动时，不会继续产生
move/end 回调。
