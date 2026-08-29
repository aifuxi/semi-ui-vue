# Skeleton 骨架屏

Skeleton 在内容加载期间显示结构占位。本实现以本地 Semi Design v2.102.0 为唯一对齐基线。

## 基础用法

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Skeleton } from '@workspace/ui';

const loading = shallowRef(true);
</script>

<template>
  <Skeleton :loading="loading" active>
    <template #placeholder>
      <div style="display: flex; gap: 12px">
        <Skeleton.Avatar />
        <div style="width: 240px">
          <Skeleton.Title style="width: 120px; margin-bottom: 12px" />
          <Skeleton.Paragraph :rows="3" />
        </div>
      </div>
    </template>

    <article>实际内容</article>
  </Skeleton>
</template>
```

`loading` 缺省为 `true`。显式传入 `false` 后，Skeleton 不保留包装节点，只渲染默认 slot。

## 独立占位项

```vue
<div style="width: 240px; height: 120px">
  <Skeleton.Image />
</div>
<Skeleton.Avatar size="large" shape="square" />
<Skeleton.Title />
<Skeleton.Paragraph :rows="2" />
<Skeleton.Button />
```

## API

### Skeleton

| 属性                    | 说明                                    | 类型              | 默认值  |
| ----------------------- | --------------------------------------- | ----------------- | ------- |
| `active`                | 启用高亮扫过动画                        | `boolean`         | `false` |
| `loading`               | 显示 placeholder；false 时显示默认 slot | `boolean`         | `true`  |
| `placeholder`           | 占位 VNode prop；推荐使用同名 slot      | `VNodeChild`      | —       |
| `class/className/style` | loading 根节点属性                      | Vue/HTML 对应类型 | —       |

插槽：`#placeholder`、默认 slot。`#placeholder` 优先于同名 prop。组件没有 emits 或 `v-model`。

### Skeleton.Avatar

| 属性                    | 说明            | 类型                                                                                                   | 默认值     |
| ----------------------- | --------------- | ------------------------------------------------------------------------------------------------------ | ---------- |
| `size`                  | Avatar 占位尺寸 | `'extra-extra-small' \| 'extra-small' \| 'small' \| 'default' \| 'medium' \| 'large' \| 'extra-large'` | `'medium'` |
| `shape`                 | Avatar 占位形状 | `'circle' \| 'square'`                                                                                 | `'circle'` |
| `class/className/style` | 根节点属性      | Vue/HTML 对应类型                                                                                      | —          |

`Skeleton.Image`、`Skeleton.Title`、`Skeleton.Button` 支持 `class/className/style`；`Skeleton.Paragraph` 另有 `rows?: number`，默认 4。

## 无障碍、主题与 SSR

- Skeleton 不强加 role 或焦点行为；如占位状态需要被辅助技术感知，请由业务容器提供合适的 `aria-busy` 和状态文案。
- active 动画由默认主题提供；light/dark 使用 `--semi-color-fill-0/1`，RTL 自动设置占位根方向。
- 静态 SSR import/render 安全。完整源码证据、DOM、动画和视觉矩阵见 [对齐矩阵](./alignment.md)。
