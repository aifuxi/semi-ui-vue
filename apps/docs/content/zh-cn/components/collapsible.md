---
title: '折叠'
description: '行为组件，是一个用于展开或折叠内容的容器。'
locale: 'zh-CN'
slug: 'collapsible'
category: 'show'
order: 68
englishTitle: 'Collapsible'
icon: 'doc-collapsible'
upstream: 'show/collapsible'
---

## 使用场景

- `Collapsible` 是一个行为组件，默认开启动画效果。它被用于 Semi 的各种组件中，如：`Navigation`， `Collapse`, `Tree`， `TreeSelect`，以及 `Typography` 中。
- 当上述组件不能满足需求或者需要自定义一些折叠行为时，可以使用 `Collapsible` 来包裹需要展开或者折叠的内容。

## 代码演示

### 如何引入

```ts
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import '@aifuxi/semi-theme-default/collapsible.css';
```

### 基本用法

通过 `isOpen` 来控制内容的展开或者折叠。

::demo-block{demo="collapsible/zh-cn/Basic" title="基本用法"}
::

### 自定义动画时间

通过 `duration` 设置动画展开或者折叠的时间，也可以通过 `motion` 来关闭动画。

::demo-block{demo="collapsible/zh-cn/Duration" title="自定义动画时间"}
::

### 嵌套使用

::demo-block{demo="collapsible/zh-cn/Nested" title="嵌套使用"}
::

### 自定义折叠高度

可以使用 collapseHeight 自定义收起的高度

::demo-block{demo="collapsible/zh-cn/CollapseHeight" title="自定义折叠高度"}
::

## API 参考

| 属性                   | 说明                                                                                                                | 类型                | 默认值  | 版本   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------- | ------- | ------ |
| class                  | 类名                                                                                                                | string              | -       | 0.34.0 |
| collapseHeight         | 折叠高度                                                                                                            | number              | 0       | 1.0.0  |
| collapseHeightAdaptive | 当内容高度小于 collapseHeight 时，是否自适应内容高度。为 true 时，收起状态高度为 Math.min(内容高度, collapseHeight) | boolean             | false   | 2.77.0 |
| duration               | 动画执行的时间                                                                                                      | number              | 250     | -      |
| fade                   | 是否开启淡入淡出                                                                                                    | boolean             | false   | 2.21.0 |
| isOpen                 | 是否展开内容区域                                                                                                    | boolean             | `false` | -      |
| keepDOM                | 是否保留隐藏的面板 DOM 树，默认销毁                                                                                 | boolean             | `false` | 0.25.0 |
| lazyRender             | 配合 keepDOM 使用，为 true 时挂载时不会渲染组件                                                                     | boolean             | `false` | 2.54.0 |
| motion                 | 是否开启动画                                                                                                        | boolean             | `true`  | -      |
| @motion-end            | 动画结束的回调                                                                                                      | () => void          | -       | -      |
| reCalcKey              | 当 reCalcKey 改变时，将重新计算子节点的高度，用于优化动态渲染时的计算                                               | number \| string    | -       | 1.5.0  |
| style                  | 样式                                                                                                                | CSSProperties       | -       | 0.34.0 |
| id                     | id                                                                                                                  | html id string type | -       | 2.3.0  |

## Accessibility

### ARIA

- Collapsible 具有 `id` props，传入的值会被设置为 wrapper 元素的id, 可以配合其他组件的 `aria-controls` 指明控制关系, 见下方使用示例。

```vue
<script setup lang="ts">
import { shallowRef, useId } from 'vue';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/collapsible.css';
import '@aifuxi/semi-theme-default/button.css';
const visible = shallowRef(false);
const collapseId = useId();
</script>
<template>
  <Button :aria-controls="collapseId" :aria-expanded="visible" @click="visible = !visible">{{
    visible ? 'hide' : 'show'
  }}</Button>
  <Collapsible :id="collapseId" :is-open="visible"><div>hide content</div></Collapsible>
</template>
```

## FAQ

- 为什么使用 Collapsible 没有正常展开?  
  检查 Collapsible 父级是否设置 display:none，此时因为无法拿到节点高度，会出现无法展开的问题。父级恢复可见后，可通过 reCalcKey 触发重新测量。

## 设计变量

Collapsible 不定义专属设计变量。动画时长通过 duration 设置，内容样式由插槽决定。

## React → Vue 迁移

| React            | Vue                                             |
| ---------------- | ----------------------------------------------- |
| children         | 默认插槽                                        |
| isOpen / setOpen | `:is-open="isOpen"` 与 shallowRef，由调用方更新 |
| onMotionEnd      | @motion-end，无参数                             |
| className        | class，兼容 className                           |
| React ref        | Vue 模板 ref；组件不公开 toggle 方法            |

Collapsible 不提供 v-model，也不内置开关按钮。keepDOM 保留隐藏内容，lazyRender 配合 keepDOM 延迟首次挂载；reCalcKey 改变时重新测量动态内容。示例使用 useId 保证同页多个实例的 aria-controls 不冲突。动画与高度测量只在客户端进行。
