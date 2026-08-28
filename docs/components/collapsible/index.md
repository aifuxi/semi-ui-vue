# Collapsible 折叠

`Collapsible` 是控制一段内容展开或收起的无交互行为容器。控制按钮由调用方提供，组件负责内容高度测量、过渡和 DOM 保留策略。

## 基本用法

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Collapsible } from '@workspace/ui/collapsible';
import '@workspace/theme-default/collapsible.css';

const open = shallowRef(false);
</script>

<template>
  <button aria-controls="details" @click="open = !open">
    {{ open ? '收起' : '展开' }}
  </button>
  <Collapsible id="details" :is-open="open">
    <p>这段内容会随 isOpen 展开或收起。</p>
  </Collapsible>
</template>
```

## 保留与懒渲染

`keepDOM` 会在关闭后保留内容 DOM；同时设置 `lazyRender` 后，内容会等到第一次打开时才创建，之后继续保留。

```vue
<Collapsible :is-open="open" keep-d-o-m lazy-render>
  <ExpensivePanel />
</Collapsible>
```

## 自定义折叠高度

`collapseHeight` 可保留一部分内容；`collapseHeightAdaptive` 会在内容不足指定高度时使用真实内容高度。`reCalcKey` 改变后会重新测量动态内容。

```vue
<Collapsible
  :is-open="open"
  :collapse-height="64"
  collapse-height-adaptive
  :re-calc-key="items.length"
>
  <ItemList :items="items" />
</Collapsible>
```

## API

| 属性                     | 说明                                             | 类型               | 默认值  |
| ------------------------ | ------------------------------------------------ | ------------------ | ------- |
| `isOpen`                 | 是否展开                                         | `boolean`          | `false` |
| `duration`               | 过渡时长，单位 ms                                | `number`           | `250`   |
| `motion`                 | 是否启用高度/透明度过渡                          | `boolean`          | `true`  |
| `keepDOM`                | 关闭后是否保留 slot DOM                          | `boolean`          | `false` |
| `lazyRender`             | 与 `keepDOM` 配合，首次打开前不渲染              | `boolean`          | `false` |
| `collapseHeight`         | 收起高度                                         | `number`           | `0`     |
| `collapseHeightAdaptive` | 收起高度不超过真实内容高度                       | `boolean`          | `false` |
| `fade`                   | 高度为 0 时同步淡入淡出                          | `boolean`          | `false` |
| `reCalcKey`              | 变化时重新测量内容高度                           | `number \| string` | -       |
| `id`                     | 内层内容节点 id，可供控制器 `aria-controls` 引用 | `string`           | -       |
| `className` / `style`    | 外层 wrapper 类名与样式                          | Vue class/style    | -       |

| 事件         | 说明                                         | 参数 |
| ------------ | -------------------------------------------- | ---- |
| `motion-end` | wrapper 的过渡结束；关闭时内容隐藏状态已更新 | 无   |

默认 slot 是需要展开或收起的内容。组件本身不创建可聚焦控制器或键盘行为。
