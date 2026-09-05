---
title: '骨架屏'
description: '在需要等待加载内容的位置提供的占位组件。'
locale: 'zh-CN'
slug: 'skeleton'
category: 'feedback'
order: 92
englishTitle: 'Skeleton'
icon: 'doc-skeleton'
upstream: 'feedback/skeleton'
---

## 概述

- `SkeletonAvatar`：占位头像，默认为圆形，默认尺寸：Avatar medium: `width: 48px`，`height: 48px`。支持 Avatar 的 size、shape 属性 （上游自 v2.20 支持）
- `SkeletonImage`：占位图像，默认尺寸：`width: 100%`，`height: 100%`。
- `SkeletonTitle`：占位标题，默认尺寸：`width: 100%`， `height: 24px`。
- `SkeletonParagraph`：占位内容部分，默认尺寸：`width: 100%`，`height: 16px`，`margin-bottom: 10px`。
- `SkeletonButton`：占位按钮，默认尺寸：`width: 115px`，`height: 32px`。

> 注意：默认样式均可通过 `className` 或 `style` 进行自定义。

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Skeleton } from '@aifuxi/semi-ui-vue/skeleton';
import '@aifuxi/semi-theme-default/skeleton.css';
</script>
```

### 基本使用

::demo-block{demo="skeleton/zh-cn/Basic" title="基本使用"}
::

### 组合使用

图片和标题。

::demo-block{demo="skeleton/zh-cn/ImageTitle" title="组合使用"}
::

统计数字。

::demo-block{demo="skeleton/zh-cn/Statistics" title="组合使用"}
::

头像和标题。

::demo-block{demo="skeleton/zh-cn/AvatarTitle" title="组合使用"}
::

居中段落和按钮。

::demo-block{demo="skeleton/zh-cn/ParagraphButton" title="组合使用"}
::

头像、标题和段落。

::demo-block{demo="skeleton/zh-cn/AvatarParagraph" title="组合使用"}
::

表格。

::demo-block{demo="skeleton/zh-cn/Table" title="组合使用"}
::

### 加载动画

通过设置 `active` 属性可以展示动画效果。

::demo-block{demo="skeleton/zh-cn/Animation" title="加载动画"}
::

## API 参考

### Skeleton

| 属性                | 说明                                      | 类型                      | 默认值  |
| ------------------- | ----------------------------------------- | ------------------------- | ------- |
| `active`            | 显示加载动画                              | `boolean`                 | `false` |
| `class / className` | 样式类，className 为兼容别名              | `HTMLAttributes["class"]` | `—`     |
| `style`             | 内联样式                                  | `StyleValue`              | `—`     |
| `loading`           | true 显示 placeholder；false 显示默认插槽 | `boolean`                 | `true`  |
| `placeholder`       | 占位节点，优先使用 placeholder 插槽       | `VNodeChild`              | `—`     |

### SkeletonAvatar

| 属性                | 说明                                                                       | 类型                      | 默认值          |
| ------------------- | -------------------------------------------------------------------------- | ------------------------- | --------------- |
| `class / className` | 样式类，className 为兼容别名                                               | `HTMLAttributes["class"]` | `—`             |
| `style`             | 内联样式                                                                   | `StyleValue`              | `—`             |
| `prefixCls`         | 骨架屏 class 前缀                                                          | `string`                  | `semi-skeleton` |
| `size`              | extra-extra-small、extra-small、small、default、medium、large、extra-large | `SkeletonAvatarSize`      | `medium`        |
| `shape`             | circle、square                                                             | `SkeletonAvatarShape`     | `circle`        |

### SkeletonParagraph

| 属性                | 说明                         | 类型                      | 默认值          |
| ------------------- | ---------------------------- | ------------------------- | --------------- |
| `class / className` | 样式类，className 为兼容别名 | `HTMLAttributes["class"]` | `—`             |
| `style`             | 内联样式                     | `StyleValue`              | `—`             |
| `prefixCls`         | 骨架屏 class 前缀            | `string`                  | `semi-skeleton` |
| `rows`              | 段落占位行数                 | `number`                  | `4`             |

### SkeletonImage / SkeletonTitle / SkeletonButton

| 属性                | 说明                         | 类型                      | 默认值          |
| ------------------- | ---------------------------- | ------------------------- | --------------- |
| `class / className` | 样式类，className 为兼容别名 | `HTMLAttributes["class"]` | `—`             |
| `style`             | 内联样式                     | `StyleValue`              | `—`             |
| `prefixCls`         | 骨架屏 class 前缀            | `string`                  | `semi-skeleton` |

使用 `#placeholder` 提供加载占位，默认插槽提供加载完成内容。子组件也保留 Skeleton.Avatar、Skeleton.Image、Skeleton.Title、Skeleton.Paragraph、Skeleton.Button 形式；模板中推荐具名导入。loading 由 prop 控制，没有 change 事件或 v-model。

## 文案规范

- 不变的固定内容直接展示固定内容，可变的内容使用骨架屏展示

## 设计变量

::token-table{component="skeleton"}
::

## Accessibility

占位图形不应参与交互。必要时在内容区域外层说明加载状态，loading=false 后展示真实内容。Skeleton 不自动添加 aria-busy 或 live region。

## FAQ

**为什么图片占位不可见？** SkeletonImage 填满容器，容器需要明确宽高。

**Skeleton 会加载数据吗？** 不会，由父层在数据就绪时更新 loading。

**如何显示动画？** 在 Skeleton 上设置 active，它会作用于占位子组件。

## React → Vue

| React                                                  | Vue                                                                                 |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `children`                                             | default 插槽                                                                        |
| `placeholder ReactNode`                                | #placeholder 插槽或 VNodeChild                                                      |
| `Skeleton.Avatar / Title / Image / Button / Paragraph` | SkeletonAvatar / SkeletonTitle / SkeletonImage / SkeletonButton / SkeletonParagraph |
| `useState + setLoading`                                | shallowRef + :loading                                                               |
| `className / CSSProperties`                            | class（兼容 className）/ StyleValue                                                 |
