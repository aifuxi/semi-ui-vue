# Steps 步骤

Steps 将具有先后关系的任务拆成可见阶段。本实现以本地固定 Semi Design v2.102.0 源码为唯一对齐基线。

## 引入

```ts
import { Step, Steps } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/steps.css';
```

## Fill 与 Basic

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Step, Steps } from '@aifuxi/semi-ui-vue';

const current = shallowRef(1);
</script>

<template>
  <Steps :current="current" @change="current = $event">
    <Step title="已完成" description="第一步说明" />
    <Step title="进行中" description="第二步说明" />
    <Step title="等待中" description="第三步说明" />
  </Steps>

  <Steps type="basic" size="small" :current="current" @change="current = $event">
    <Step title="已完成" description="第一步说明" />
    <Step title="进行中" description="第二步说明" />
    <Step title="等待中" description="第三步说明" />
  </Steps>
</template>
```

`current` 是从 0 开始的展示状态，组件不会在交互后自行修改它；父级在 `change(index)` 中回写即可形成 Vue 受控闭环。`initial` 同时影响显示序号和 `change` 返回值。

## Nav、竖向与状态覆盖

```vue
<Steps type="nav" :current="1">
  <Step title="注册账号" />
  <Step title="产品用途" />
  <Step title="期待尝试功能" />
</Steps>

<Steps type="basic" direction="vertical" :current="1" status="error">
  <Step title="已完成" />
  <Step title="发生错误" />
  <Step title="等待中" status="warning" />
</Steps>
```

子 `Step.status` 显式传入时优先于父级推导。`fill` 和 `basic` 支持竖向；`size` 只影响 `basic/nav`，`hasLine` 只影响 `basic`，与固定源码一致。

## 自定义内容与交互

```vue
<Steps type="basic" :current="0" @change="console.log">
  <Step aria-label="上传资料" @click="console.log('step click')">
    <template #icon><span>1</span></template>
    <template #title>上传资料</template>
    <template #description>支持自定义 VNode 内容</template>
  </Step>
  <Step title="完成" />
</Steps>
```

点击或按 Enter 时，Step 自身的 `click`/`keyDown` 先派发，非当前项随后派发父 `change`。固定源码没有方向键、Home/End 或 roving tabindex，Vue 不额外发明这些行为。

## Steps API

| 属性                  | 说明                                           | 类型                         | 默认值         |
| --------------------- | ---------------------------------------------- | ---------------------------- | -------------- |
| `type`                | 样式类型                                       | `'fill' \| 'basic' \| 'nav'` | `'fill'`       |
| `current`             | 当前步骤，从 0 开始                            | `number`                     | `0`            |
| `initial`             | 起始序号                                       | `number`                     | `0`            |
| `status`              | 当前项状态                                     | `StepsStatus`                | `'process'`    |
| `direction`           | fill/basic 方向                                | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `size`                | basic/nav 尺寸                                 | `'default' \| 'small'`       | `'default'`    |
| `hasLine`             | basic 是否显示连接线                           | `boolean`                    | `true`         |
| `prefixCls`           | 根 class 前缀                                  | `string`                     | `'semi-steps'` |
| `ariaLabel`           | 根无障碍名称；模板可写 `aria-label`            | `string`                     | -              |
| `className` / `style` | React 风格兼容入口；Vue `class/style` 同样支持 | `string` / `CSSProperties`   | -              |

事件：`change(index)`。默认 slot 接收 `Step`。

## Step API

| 属性/插槽                      | 说明                               | 类型                       | 默认值                       |
| ------------------------------ | ---------------------------------- | -------------------------- | ---------------------------- |
| `title` / `#title`             | 标题，插槽优先                     | `VNodeChild`               | -                            |
| `description` / `#description` | 描述，插槽优先                     | `VNodeChild`               | -                            |
| `icon` / `#icon`               | 自定义图标，插槽优先               | `VNodeChild`               | -                            |
| `status`                       | 覆盖父级推导状态                   | `StepsStatus`              | 父级推导 / 单独使用为 `wait` |
| `role` / `ariaLabel`           | 根节点 ARIA；模板可写 `aria-label` | `string`                   | -                            |
| `className` / `style`          | item 样式                          | `string` / `CSSProperties` | -                            |

事件：`click(event)`；仅按 Enter 时派发 `keyDown(event)`。

## React → Vue 迁移

| React v2.102.0            | Vue                                      |
| ------------------------- | ---------------------------------------- |
| `const Step = Steps.Step` | `import { Steps, Step }`                 |
| `onChange={setCurrent}`   | `@change="current = $event"`             |
| `title={<Node />}`        | `:title="vnode"` 或 `#title`             |
| `description={<Node />}`  | `:description="vnode"` 或 `#description` |
| `icon={<Icon />}`         | `:icon="vnode"` 或 `#icon`               |
| `onClick` / `onKeyDown`   | `@click` / `@key-down`                   |
| `className`               | `class`；同时保留 `className` 兼容       |

SSR 会稳定输出三种 DOM，不创建 Portal、Observer 或全局监听。Steps 没有组件内 Locale 文案；暗色和 RTL 完全由默认主题与 ConfigProvider 根方向类控制。

`Steps.Step` 也保留为 render function/渐进迁移兼容入口；Vue SFC 模板推荐使用独立导出的 `Step`。
