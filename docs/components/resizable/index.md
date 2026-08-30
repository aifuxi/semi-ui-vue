# Resizable 伸缩框

用于拖动改变单个区域尺寸，或通过分隔条调整一组相邻面板。实现基线为 Semi Design v2.102.0，并保留 `.semi-resizable-*` 与 `--semi-*` 样式兼容契约。

## 引入

```ts
import { Resizable, ResizeGroup, ResizeHandler, ResizeItem } from '@aifuxi/semi-ui-vue';
// 或从 '@aifuxi/semi-ui-vue/resizable' 引入
import '@aifuxi/semi-theme-default/resizable.css';
```

## 单体伸缩框

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { ResizeSize } from '@aifuxi/semi-ui-vue';

const size = ref<ResizeSize>({ width: 320, height: 180 });
</script>

<template>
  <Resizable
    v-model:size="size"
    :min-width="180"
    max-width="80%"
    :grid="[8, 8]"
    @change="(nextSize, event, direction) => console.log(nextSize, event, direction)"
  >
    可拖动八个方向的边缘与角点
  </Resizable>
</template>
```

传 `size` 时属于受控用法，应监听 `update:size` 或使用 `v-model:size` 更新外部状态；只需初始值时使用 `default-size`。

## 组合面板

```vue
<template>
  <ResizeGroup direction="horizontal" style="width: 720px; height: 320px">
    <ResizeItem default-size="35%" min="180px">目录</ResizeItem>
    <ResizeHandler />
    <ResizeItem default-size="65%" min="30%">详情</ResizeItem>
  </ResizeGroup>
</template>
```

`ResizeItem` 的 `%` 和 `px` 值表示固定初始份额；数字或纯数字字符串表示剩余空间的分配权重。Handler 必须位于两个相邻 Item 之间。

## 自定义手柄

```vue
<Resizable :default-size="{ width: 280, height: 160 }">
  内容
  <template #handle-right>
    <span class="my-handle" />
  </template>
</Resizable>
```

可用的具名 slot 为 `handle-top`、`handle-right`、`handle-bottom`、`handle-left`、`handle-topRight`、`handle-bottomRight`、`handle-bottomLeft` 和 `handle-topLeft`。脚本/render function 也可传 `handleNode`。

## 取消开始拖拽

React `onResizeStart` 可返回 `false`；Vue emit 不读取监听器返回值，因此使用同步守卫：

```vue
<Resizable :before-resize-start="() => !locked" @resize-start="handleStart" />
```

## API

### Resizable props

| 属性                               | 类型                                    | 默认值   | 说明                     |
| ---------------------------------- | --------------------------------------- | -------- | ------------------------ |
| `size`                             | `ResizeSize`                            | -        | 受控尺寸                 |
| `defaultSize`                      | `ResizeSize`                            | -        | 非受控初始尺寸           |
| `minWidth/minHeight`               | `string \| number`                      | -        | 最小宽高                 |
| `maxWidth/maxHeight`               | `string \| number`                      | -        | 最大宽高                 |
| `grid`                             | `number \| [number, number]`            | `[1, 1]` | 宽高增量吸附             |
| `snap`                             | `{ x?: number[]; y?: number[] }`        | -        | 绝对像素吸附点           |
| `snapGap`                          | `number`                                | `0`      | 进入吸附所需距离         |
| `boundElement`                     | `parent \| window \| HTMLElement`       | -        | 尺寸边界                 |
| `boundsByDirection`                | `boolean`                               | `false`  | 从当前拖拽方向计算边界   |
| `lockAspectRatio`                  | `boolean \| number`                     | `false`  | 锁定初始或指定宽高比     |
| `lockAspectRatioExtraWidth/Height` | `number`                                | `0`      | 锁定比例之外的附加尺寸   |
| `enable`                           | `ResizeEnable \| false`                 | 全方向   | 启用的拖拽方向           |
| `handleStyle/handleClass`          | 方向映射                                | -        | 各方向手柄样式/class     |
| `handleWrapperStyle/Class`         | `CSSProperties/string`                  | -        | 手柄包装层样式/class     |
| `handleNode`                       | `ResizeHandleNode`                      | -        | 脚本传入的各方向节点     |
| `scale`                            | `number`                                | `1`      | 元素外部缩放比例         |
| `ratio`                            | `number \| [number, number]`            | `1`      | 指针位移到宽高变化的倍率 |
| `beforeResizeStart`                | `(event, direction) => boolean \| void` | -        | 返回 false 取消拖拽      |

### Resizable emits

| 事件          | 参数                       |
| ------------- | -------------------------- |
| `resizeStart` | `(event, direction)`       |
| `change`      | `(size, event, direction)` |
| `resizeEnd`   | `(size, event, direction)` |
| `update:size` | `(size)`                   |

### ResizeGroup / ResizeItem

| 组件属性                 | 类型                     | 默认值       | 说明                    |
| ------------------------ | ------------------------ | ------------ | ----------------------- |
| `ResizeGroup.direction`  | `horizontal \| vertical` | `horizontal` | 组合伸缩轴              |
| `ResizeItem.defaultSize` | `string \| number`       | -            | `%`/`px` 份额或数字权重 |
| `ResizeItem.min/max`     | `string`                 | -            | 百分比或像素约束        |

ResizeItem 发出 `resizeStart`、`change`、`resizeEnd`，参数与 Resizable 对应事件一致。ResizeHandler 接受默认 slot、class 和 style；不传 slot 时显示默认 `IconHandle`。

## 可访问性与 SSR

固定 v2.102.0 的拖拽手柄只支持鼠标和触摸，没有 role、tabindex、ARIA 或键盘操作。若业务需要键盘可调整的 Splitter，应在业务层补充完整语义与交互，而不是只添加 tabindex。全部公开入口可以在 SSR 环境安全 import 和 render。

## React → Vue 迁移

| React                                | Vue                                                |
| ------------------------------------ | -------------------------------------------------- |
| `children`                           | 默认 slot                                          |
| `handleNode.right`                   | `#handle-right`，或继续使用 `handleNode` 脚本 prop |
| `size` + `onChange`                  | `v-model:size` + `@change`                         |
| `onResizeStart={() => false}`        | `:before-resize-start="() => false"`               |
| `onResizeStart/onChange/onResizeEnd` | `@resize-start/@change/@resize-end`                |
| `className`                          | `class`                                            |
