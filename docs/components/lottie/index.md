# Lottie 动画

Lottie 在 Vue 中管理 `lottie-web` 的容器、实例创建、参数更新与销毁。实现以本地
Semi Design v2.102.0 源码为唯一基线，并锁定 `lottie-web@5.13.0`。

## 基本用法

推荐直接导入随应用打包的动画 JSON，避免把示例依赖到不稳定的外部 CDN。

```vue
<script setup lang="ts">
import animationData from './loading.json';
import { Lottie } from '@aifuxi/semi-ui-vue';
</script>

<template>
  <Lottie :params="{ animationData, autoplay: true, loop: true }" width="300px" height="300px" />
</template>
```

`params` 会补上 `renderer: 'svg'`、`loop: true`、`autoplay: true`；调用方显式传入的
字段优先，因此 `loop: false` 和 `autoplay: false` 会被保留。也可以传入与
`animationData` 互斥的 `path`。

## 控制动画实例

```vue
<script setup lang="ts">
import type { LottieAnimationItem } from '@aifuxi/semi-ui-vue';

let animation: LottieAnimationItem | null = null;
</script>

<template>
  <Lottie
    :params="{ animationData }"
    :get-animation-instance="(instance) => (animation = instance)"
  />
  <button @click="animation?.pause()">暂停</button>
</template>
```

固定 v2.102.0 Adapter 在首次 mounted 时会用同一个实例调用
`getAnimationInstance` 两次；`params` 发生深度不等价的替换时，旧实例先销毁，再用
新实例调用一次。回调应保持幂等。

## 外部容器

`params.container` 可把动画渲染到调用方拥有的 Element。此时 Lottie 不输出内部根
节点，也不会把 class、style、data 或 ARIA attrs 写到外部容器；调用方负责该容器的
结构与语义，组件仍负责动画实例销毁。

## API

| 属性                   | 说明                                                      | 类型                 | 默认值 |
| ---------------------- | --------------------------------------------------------- | -------------------- | ------ |
| `params`               | `lottie.loadAnimation` 参数；内部容器时可省略 `container` | `LottieParams`       | 必填   |
| `width`                | 内部容器宽度                                              | `string`             | -      |
| `height`               | 内部容器高度                                              | `string`             | -      |
| `className` / `class`  | 内部容器 class                                            | Vue class value      | -      |
| `style`                | 内部容器样式；优先于 width/height                         | Vue style value      | -      |
| `getAnimationInstance` | 获取当前 AnimationItem                                    | `(instance) => void` | -      |
| `getLottie`            | 获取全局 LottiePlayer                                     | `(lottie) => void`   | -      |

`Lottie.getLottie()` 提供与上游同名的静态访问方法。该播放器是浏览器运行时能力；SSR
只渲染内部空容器，hydration 后才创建动画。

## 可访问性与 SSR

组件不擅自添加 role、tabindex 或键盘逻辑。内部容器模式可直接透传 ARIA/data attrs；
生成 SVG 的标题、描述和 focusable 行为应通过 `params.rendererSettings` 配置。根入口和
`@aifuxi/semi-ui-vue/lottie` 均支持 SSR-safe import。

完整 API、DOM、生命周期、视觉与 deviation 证据见 [对齐矩阵](./alignment.md)，React
迁移见 [React → Vue](./react-to-vue.md)。
