# Progress 进度条

Progress 用于展示操作或任务的当前完成度。本实现以本地 Semi Design v2.102.0 为唯一对齐基线。

## 基础用法

```vue
<script setup lang="ts">
import { Progress } from '@workspace/ui';
</script>

<template>
  <div style="width: 240px">
    <Progress :percent="50" aria-label="文件下载进度" />
    <Progress :percent="80" show-info size="large" aria-label="文件下载进度" />
  </div>
</template>
```

## 垂直与环形

```vue
<div style="height: 100px">
  <Progress :percent="60" direction="vertical" aria-label="磁盘使用率" />
</div>

<Progress :percent="75" type="circle" show-info :width="100" aria-label="磁盘使用率">
  <template #format="{ percent }">{{ percent }} 天</template>
</Progress>
```

## 自定义颜色

```vue
<script setup lang="ts">
const stroke = [
  { percent: 0, color: '#f93920' },
  { percent: 50, color: '#46259e' },
  { percent: 100, color: 'hsla(125, 50%, 46% / 1)' },
];
</script>

<template>
  <Progress :percent="65" :stroke="stroke" stroke-gradient show-info type="circle" />
</template>
```

## API

| 属性                                        | 说明                                                      | 类型                              | 默认值               |
| ------------------------------------------- | --------------------------------------------------------- | --------------------------------- | -------------------- |
| `percent`                                   | 完成百分比；渲染时钳制到 0–100                            | `number`                          | `0`                  |
| `type`                                      | 类型                                                      | `'line' \| 'circle'`              | `'line'`             |
| `direction`                                 | line 方向                                                 | `'horizontal' \| 'vertical'`      | `'horizontal'`       |
| `size`                                      | 尺寸                                                      | `'default' \| 'small' \| 'large'` | `'default'`          |
| `showInfo`                                  | 显示百分比文字；small circle 不显示                       | `boolean`                         | `false`              |
| `format`                                    | 格式化显示文字                                            | `(percent: number) => VNodeChild` | `` `${percent}%` ``  |
| `motion`                                    | 是否启用 300ms 数字动画；对象/函数保持 React 迁移类型兼容 | `boolean \| object \| function`   | `true`               |
| `stroke`                                    | 进度颜色或颜色区间                                        | `string \| ProgressStrokePoint[]` | CSS Token            |
| `strokeGradient`                            | 在颜色区间中插值                                          | `boolean`                         | `false`              |
| `orbitStroke`                               | 轨道颜色                                                  | `string`                          | CSS Token            |
| `strokeLinecap`                             | circle 线帽                                               | `'round' \| 'square'`             | `'round'`            |
| `strokeWidth`                               | circle 线宽                                               | `number`                          | `4`                  |
| `width`                                     | circle 宽高                                               | `number`                          | default 72；small 24 |
| `id/class/className/style`                  | 根节点属性                                                | Vue/HTML 对应类型                 | —                    |
| `aria-label/aria-labelledby/aria-valuetext` | 进度条无障碍描述                                          | `string`                          | —                    |

插槽：`#format="{ percent }"`，优先于同名函数 prop。Progress 没有 emits 或 `v-model`。

## 无障碍、主题与 SSR

- 根节点固定使用 `role="progressbar"`、`aria-valuemin="0"`、`aria-valuemax="100"` 和钳制后的 `aria-valuenow`。
- 组件不参与键盘或焦点交互；请用 `aria-label` 或 `aria-labelledby` 描述具体进度含义。
- light/dark 使用默认主题 Token；RTL 自动翻转 line 文字间距与 circle 文字定位。
- 静态 SSR import/render 安全。完整源码证据、动画和视觉矩阵见 [对齐矩阵](./alignment.md)。
