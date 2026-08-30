# Button 按钮

用于触发操作或提交原生表单。实现基线为 Semi Design v2.102.0，并保留 `.semi-button-*` 与 `--semi-*` 样式兼容契约。

## 引入

```ts
import { Button, ButtonGroup, SplitButtonGroup } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/button.css';
```

## 按钮类型

```vue
<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <div class="button-row">
    <Button>主要按钮</Button>
    <Button type="secondary">次要按钮</Button>
    <Button type="tertiary">第三按钮</Button>
    <Button type="warning">警告按钮</Button>
    <Button type="danger">危险按钮</Button>
  </div>
</template>
```

## 图标、加载与禁用

```vue
<Button aria-label="截屏">
  <template #icon="{ fill, iconSize, iconStyle }">
    <CameraIcon :fill="fill" :size="iconSize" :style="iconStyle" />
  </template>
</Button>

<Button loading>保存</Button>
<Button disabled>不可操作</Button>
```

`loading` 会阻止指针事件；当 `disabled` 与 `loading` 同时存在时，disabled 优先。纯图标按钮必须提供可访问名称。

## 组合

```vue
<ButtonGroup aria-label="编辑操作" size="large" theme="solid">
  <Button>复制</Button>
  <Button>查询</Button>
  <Button>剪切</Button>
</ButtonGroup>

<SplitButtonGroup aria-label="项目操作">
  <Button theme="solid">保存</Button>
  <Button theme="solid" aria-label="更多操作">
    <template #icon><ChevronDownIcon /></template>
  </Button>
</SplitButtonGroup>
```

## Button API

| 属性                  | 类型                                                    | 默认值        | 说明                     |
| --------------------- | ------------------------------------------------------- | ------------- | ------------------------ |
| `type`                | `primary \| secondary \| tertiary \| warning \| danger` | `primary`     | 按钮语义色               |
| `theme`               | `solid \| borderless \| light \| outline`               | `light`       | 按钮主题                 |
| `size`                | `default \| small \| large`                             | `default`     | 尺寸                     |
| `htmlType`            | `button \| reset \| submit`                             | `button`      | 原生 type                |
| `block`               | `boolean`                                               | `false`       | 宽度占满容器             |
| `circle`              | `boolean`                                               | `false`       | 保留 v2.102.0 状态 class |
| `disabled`            | `boolean`                                               | `false`       | 原生禁用状态             |
| `loading`             | `boolean`                                               | `false`       | 加载状态                 |
| `colorful`            | `boolean`                                               | `false`       | AI 多彩样式              |
| `iconPosition`        | `left \| right`                                         | `left`        | icon slot 位置           |
| `noHorizontalPadding` | `boolean \| left \| right \| (left \| right)[]`         | `false`       | 图标布局的水平内边距     |
| `contentClass`        | Vue class value                                         | -             | 内容 span class          |
| `prefixCls`           | `string`                                                | `semi-button` | class 前缀               |

原生 `class`、`style`、`id`、`aria-*`、`data-*` 和焦点事件通过 attrs 传给根 button。

### Slots

| Slot      | 参数                            | 说明                                     |
| --------- | ------------------------------- | ---------------------------------------- |
| `default` | -                               | 按钮内容                                 |
| `icon`    | `{ fill, iconSize, iconStyle }` | 图标；多彩模式通过 fill 参数传递颜色契约 |

### Emits

`click`、`mousedown`、`mouseenter`、`mouseleave`，payload 均为原生 `MouseEvent`。

## React → Vue 迁移

| React                 | Vue                                                 |
| --------------------- | --------------------------------------------------- |
| `children`            | 默认 slot                                           |
| `icon={<Icon />}`     | `#icon` slot                                        |
| `className` / `style` | 原生 `class` / `style` attrs                        |
| `contentClassName`    | `contentClass`                                      |
| `onClick`             | `@click`                                            |
| `onMouseDown`         | `@mousedown`                                        |
| `onMouseEnter`        | `@mouseenter`                                       |
| `onMouseLeave`        | `@mouseleave`                                       |
| React ref             | Vue template ref；焦点通常直接使用根 DOM attrs/事件 |

其余可自然保留的 prop 名、枚举值和默认值不变。
