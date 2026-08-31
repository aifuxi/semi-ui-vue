# Lottie React → Vue 迁移

## 导入与基础参数

```tsx
// React
import { Lottie } from '@douyinfe/semi-ui';

<Lottie params={{ animationData, autoplay: false }} width="240px" height="240px" />;
```

```vue
<!-- Vue -->
<script setup lang="ts">
import { Lottie } from '@aifuxi/semi-ui-vue';
</script>

<template>
  <Lottie :params="{ animationData, autoplay: false }" width="240px" height="240px" />
</template>
```

属性名保持一致；模板中可按 Vue 习惯写成 `get-animation-instance`。`params` 是普通单向
prop，不映射为 `v-model`。替换为深度不等价的新对象会销毁并重建动画。

## 实例与全局播放器

React 的 `getAnimationInstance` 与 `getLottie` 仍是同名 props：

```vue
<Lottie :params="{ animationData }" :get-animation-instance="onAnimation" :get-lottie="onLottie" />
```

静态 `Lottie.getLottie()` 也保留。固定上游首次挂载会把同一 animation instance 回调
两次，Vue 为行为对齐保留该时序；不要在回调中执行不可重复的副作用。

## 外部容器

React ref 改为 Vue 3.5 `useTemplateRef`，并在 mounted 后再传入已存在的 Element：

```vue
<script setup lang="ts">
import { onMounted, shallowRef, useTemplateRef } from 'vue';

const target = useTemplateRef<HTMLDivElement>('target');
const ready = shallowRef(false);
onMounted(() => (ready.value = true));
</script>

<template>
  <div ref="target" aria-label="Animation" />
  <Lottie v-if="ready" :params="{ animationData, container: target! }" />
</template>
```

外部模式没有 Lottie 根节点，class/style/ARIA 应直接写到目标容器。不要把 Vue ref 对象
本身传给 `params.container`，应传 `target` 解包后的 Element。

## 类型映射

| React / lottie-web              | Vue 公开类型          |
| ------------------------------- | --------------------- |
| `LottieProps`                   | `LottieProps`         |
| `Partial<loadAnimation params>` | `LottieParams`        |
| `AnimationItem`                 | `LottieAnimationItem` |
| `LottiePlayer`                  | `LottiePlayer`        |

Vue 不复制 React ref、ReactNode 或生命周期语义；本组件也没有 slots、emits 或
`v-model`。所有浏览器资源只在 mounted 后创建，SSR 模板无需条件导入组件。
