---
title: '加载器'
description: '加载器组件用于告知用户内容正在加载且需要一段不确定的时长。'
locale: 'zh-CN'
slug: 'spin'
category: 'feedback'
order: 93
englishTitle: 'Spin'
icon: 'doc-spin'
upstream: 'feedback/spin'
---

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Spin } from '@aifuxi/semi-ui-vue/spin';
import '@aifuxi/semi-theme-default/spin.css';
</script>
```

### 基本用法

::demo-block{demo="spin/zh-cn/Basic" title="基本用法"}
::

### 尺寸

组件定义了三种尺寸：大、中（默认）、小。

::demo-block{demo="spin/zh-cn/Size" title="尺寸"}
::

### 带文字的

通过 `tip` 属性可设置当 Spin 用作包裹元素时的文字。

::demo-block{demo="spin/zh-cn/Tip" title="带文字的"}
::

### 自定义指示符

可以通过设置 `indicator` 属性自定义 Spin 的指示符样式。

::demo-block{demo="spin/zh-cn/Indicator" title="自定义指示符"}
::

### 延迟显示

通过 delay 设置延迟显示 `loading` 的效果  
组件是否处于 `loading` 状态由传入的 `spinning` 值决定，`spinning` 为受控属性

::demo-block{demo="spin/zh-cn/Delay" title="延迟显示"}
::

## API 参考

| 属性                | 说明                                | 类型                      | 默认值   |
| ------------------- | ----------------------------------- | ------------------------- | -------- |
| `childStyle`        | 内部子内容样式                      | `StyleValue`              | `—`      |
| `delay`             | 延迟显示加载效果，毫秒              | `number`                  | `0`      |
| `indicator`         | 自定义指示符，也可用 indicator 插槽 | `VNodeChild`              | `—`      |
| `size`              | small、middle、large，注意是 middle | `SpinSize`                | `middle` |
| `spinning`          | 受控加载状态；缺省为 true           | `boolean`                 | `true`   |
| `style`             | 外层样式                            | `StyleValue`              | `—`      |
| `tip`               | 加载提示文本或节点，也可用 tip 插槽 | `VNodeChild`              | `—`      |
| `wrapperClassName`  | 包裹元素的类名                      | `string`                  | `—`      |
| `class / className` | Vue 样式类与兼容别名                | `HTMLAttributes["class"]` | `—`      |

插槽：`default` 为被包裹内容，`indicator` 为图标，`tip` 为提示。命名插槽优先于同名属性。父层通过 `:spinning` 控制状态，组件没有 `v-model` 或 loading-change 事件。

## 设计变量

::token-table{component="spin"}
::

## 文案规范

- 准确地说明加载状态，使用比如“Loading”, “Submitting”, “Processing”等词
- 使用尽量少的词汇去描述状态

## FAQ

- **怎么修改 icon 的颜色？**

  可以通过给 .semi-spin-wrapper 类添加 color 属性覆盖原有的颜色（推荐以更高权重覆盖）

  ```
  .custom .semi-spin-wrapper {
    color: red;
  }
  ```

## Accessibility

为加载动画提供简短的文字状态。固定组件不会自动添加 live region 或 aria-busy，需要播报加载变化时由业务外层提供对应语义。不要仅靠遮罩阻止用户操作。

## React → Vue

| React                            | Vue                                    |
| -------------------------------- | -------------------------------------- |
| `children`                       | default 插槽                           |
| `indicator / tip 中的 ReactNode` | indicator / tip 插槽或 VNodeChild 属性 |
| `useState + setLoading`          | shallowRef + :spinning                 |
| `className / CSSProperties`      | class（兼容 className）/ StyleValue    |

示例使用公开 Vue 组件子路径；预览和源码编辑器读取同一个 SFC。参考基线为本地 Semi Design v2.102.0 submodule（`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`）。
