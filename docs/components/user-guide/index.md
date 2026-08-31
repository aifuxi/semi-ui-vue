# UserGuide 用户引导

UserGuide 通过气泡卡片或居中弹窗分步介绍页面能力。Vue 版本对齐 Semi Design v2.102.0 的 DOM、状态机、主题、遮罩、按钮和国际化行为。

## 基本用法

```vue
<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { UserGuide, type UserGuideStepItem } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/user-guide.css';

const target = useTemplateRef<HTMLElement>('target');
const visible = ref(false);
const current = ref(0);
const steps = ref<UserGuideStepItem[]>([]);

onMounted(() => {
  steps.value = [
    {
      target: () => target.value,
      title: '创建任务',
      description: '从这里开始创建一条新任务。',
      position: 'bottom',
    },
  ];
});
</script>

<template>
  <button ref="target" type="button" @click="visible = true">开始引导</button>
  <UserGuide
    v-model:current="current"
    :visible="visible"
    :steps="steps"
    @finish="visible = false"
    @skip="visible = false"
  />
</template>
```

目标元素应在引导打开前完成挂载。目标函数可以暂时返回 `null`，此时不会创建气泡或 spotlight。

## 内容 slot

`steps` 可直接保存 `VNodeChild`。在 SFC 模板中，也可以用 scoped slot 为当前步骤提供内容：

```vue
<UserGuide :visible="visible" :steps="steps">
  <template #cover="{ index }">
    <img v-if="index === 0" src="/guide-cover.png" alt="功能概览" />
  </template>
  <template #title="{ step }">
    <strong>{{ step.title }}</strong>
  </template>
</UserGuide>
```

slot 的参数为 `{ current, index, step }`，存在对应 slot 时优先于步骤字段。

## 受控步骤与事件

- 不传 `current` 时，组件内部维护当前步骤。
- 显式传入 `current` 时，组件只发出 `change` 和 `update:current`，等待父组件回写。
- 下一步依次触发 `change`、`update:current`、`next`；上一步触发相同的 current 更新后再触发 `prev`。
- 最后一步只触发 `finish`；`skip` 不会自动关闭组件。调用方应更新 `visible`。

## 弹窗模式

```vue
<UserGuide
  mode="modal"
  :visible="visible"
  :steps="steps"
  finish-text="开始使用"
  @finish="visible = false"
/>
```

modal 模式复用 Modal 的焦点、Escape、Portal 与可访问性能力；popup 模式复用 Popover 的定位与 dialog role。

## API

### UserGuideProps

| 属性                  | 说明                                                   | 类型                           | 默认值          |
| --------------------- | ------------------------------------------------------ | ------------------------------ | --------------- |
| `current`             | 当前步骤；显式传入时受控                               | `number`                       | `0`             |
| `visible`             | 是否显示                                               | `boolean`                      | `false`         |
| `steps`               | 步骤配置                                               | `readonly UserGuideStepItem[]` | `[]`            |
| `mode`                | 气泡或弹窗模式                                         | `'popup' \| 'modal'`           | `'popup'`       |
| `mask`                | 是否显示遮罩                                           | `boolean`                      | `true`          |
| `position`            | 默认气泡位置                                           | `PopoverPosition`              | `'bottom'`      |
| `theme`               | 默认主题                                               | `'default' \| 'primary'`       | `'default'`     |
| `spotlightPadding`    | 高亮区域外扩像素                                       | `number`                       | `5`             |
| `showPrevButton`      | 是否显示上一步按钮                                     | `boolean`                      | `true`          |
| `showSkipButton`      | 是否显示跳过按钮                                       | `boolean`                      | `true`          |
| `finishText`          | 完成按钮文字                                           | `string`                       | Locale `finish` |
| `nextButtonProps`     | 下一步/完成 Button 属性；`content` 映射 React children | `UserGuideButtonProps`         | `{}`            |
| `prevButtonProps`     | 上一步 Button 属性；`content` 映射 React children      | `UserGuideButtonProps`         | `{}`            |
| `class` / `className` | popup Popover 自定义类                                 | `HTMLAttributes['class']`      | -               |
| `style`               | popup Popover 自定义样式                               | `StyleValue`                   | -               |
| `getPopupContainer`   | 固定 v2.102.0 仅用于决定是否锁 body；见兼容说明        | `() => HTMLElement`            | -               |
| `zIndex`              | spotlight SVG 层级                                     | `number`                       | `1030`          |

### UserGuideStepItem

| 属性               | 说明                          | 类型                                              | 默认值 |
| ------------------ | ----------------------------- | ------------------------------------------------- | ------ |
| `target`           | 目标 Element 或返回目标的函数 | `Element \| (() => Element \| null \| undefined)` | -      |
| `cover`            | 封面                          | `VNodeChild`                                      | -      |
| `title`            | 标题                          | `VNodeChild`                                      | -      |
| `description`      | 描述                          | `VNodeChild`                                      | -      |
| `showArrow`        | popup 是否显示箭头            | `boolean`                                         | `true` |
| `spotlightPadding` | 当前步骤外扩像素              | `number`                                          | -      |
| `theme`            | 当前步骤主题                  | `'default' \| 'primary'`                          | -      |
| `position`         | 当前步骤气泡位置              | `PopoverPosition`                                 | -      |

### 事件与 slots

| 名称                                 | 参数                       |
| ------------------------------------ | -------------------------- |
| `change` / `update:current`          | `(current: number)`        |
| `next` / `prev`                      | `(current: number)`        |
| `skip` / `finish`                    | `()`                       |
| `#cover` / `#title` / `#description` | `{ current, index, step }` |

## 固定基线兼容说明

v2.102.0 的类型和文档声明了 step 级 `mask` 与 `className`，但固定 React Adapter 没有读取它们；Vue 为运行时对齐也不使其生效。`getPopupContainer` 同样只影响 UserGuide 自己的 body scroll 锁，不会直接传给内部 Popover/Modal。要改变浮层容器，请在 `ConfigProvider` 上配置 `getPopupContainer`。

## SSR

模块导入是 SSR-safe 的；DOM 解析、滚动和测量只在客户端可见周期执行。建议服务端先以 `visible=false` 渲染，hydration 后再打开。
