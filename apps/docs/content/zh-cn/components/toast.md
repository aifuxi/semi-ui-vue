---
title: '提示'
description: 'Toast 提示是对用户的操作做出及时反馈，由用户的操作触发，反馈信息可以是操作的结果状态，如成功、失败、出错、警告等。'
locale: 'zh-CN'
slug: 'toast'
category: 'feedback'
order: 94
englishTitle: 'Toast'
icon: 'doc-toast'
upstream: 'feedback/toast'
---

Toast 用于在操作后给出短暂、及时的结果反馈。Vue 版本以 Semi Design v2.102.0 为基线，保留 `.semi-toast-*` DOM/class、主题 Token、命令式方法、工厂实例和上下文 holder。

## 基本用法

```ts
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/toast.css';

Toast.success('保存成功');

const id = Toast.warning({
  content: '访问凭证即将过期',
  duration: 0,
  theme: 'light',
});

Toast.close(id);
```

`info`、`success`、`warning`、`error` 接受字符串或 options，并返回可用于更新/关闭的 id。同一个 id 再次调用会原位更新内容并重启自动关闭计时。

```ts
const id = Toast.info({ content: '正在同步', duration: 10 });

Toast.success({ id, content: '同步已完成', duration: 3 });
```

## 堆叠与位置

同屏存在多条提示时可启用 `stack`；折叠状态通过 hover 展开。位置支持数字（转成 px）或 CSS 字符串。

```ts
Toast.config({ top: 24, zIndex: 1200 });

Toast.info({ content: '第一条', stack: true });
Toast.warning({ content: '第二条', stack: true });
```

`Toast.config` 应在当前实例首次显示前调用。wrapper 创建后，`zIndex` 与 `getPopupContainer` 不迁移；`top/right/bottom/left` 在后续调用显式提供时仍会更新。

## Vue 上下文 holder

在 `<script setup>` 中调用 `useToast`，并把返回的 holder 渲染到希望继承 ConfigProvider 上下文的位置。

::demo-block{demo="toast/zh-CN/Example1" title="Vue 上下文 holder"}
::

holder API 额外提供 `open(options)`，用于显示 `default` 类型 Toast。

## 独立工厂

需要不同容器或默认配置时使用 `ToastFactory.create`。每个实例拥有独立 wrapper、默认值和销毁边界。

```ts
import { ToastFactory } from '@aifuxi/semi-ui-vue/toast';

const LocalToast = ToastFactory.create({
  getPopupContainer: () => document.querySelector('#toast-host') as HTMLElement,
  top: 12,
});

LocalToast.info('局部提示');
LocalToast.destroyAll();
```

## API

### Toast options

| 属性                    | 类型                        | 默认值          | 说明                           |
| ----------------------- | --------------------------- | --------------- | ------------------------------ |
| `content`               | `VNodeChild`                | `''`            | 提示内容                       |
| `icon`                  | `VNodeChild`                | 按 type         | 自定义图标                     |
| `showClose`             | `boolean`                   | `true`          | 是否显示关闭按钮               |
| `textMaxWidth`          | `number \| string`          | `450`           | 内容最大宽度                   |
| `duration`              | `number`                    | `3`             | 自动关闭秒数，0 表示不自动关闭 |
| `theme`                 | `'normal' \| 'light'`       | `'normal'`      | 填充样式                       |
| `stack`                 | `boolean`                   | `false`         | 是否堆叠多条 Toast             |
| `direction`             | `'ltr' \| 'rtl'`            | 上下文或 LTR    | 文本方向                       |
| `id`                    | `string \| number`          | 自动生成        | 自定义 id；相同 id 更新        |
| `onClose`               | `() => void`                | -               | 关闭后的回调                   |
| `className`             | Vue class 值                | -               | 单条根节点 class               |
| `style`                 | `StyleValue`                | -               | 单条根节点样式                 |
| `top/right/bottom/left` | `number \| string`          | -               | wrapper 偏移                   |
| `zIndex`                | `number`                    | `1010`          | wrapper 首次创建时的层级       |
| `getPopupContainer`     | `() => HTMLElement \| null` | `document.body` | wrapper 首次创建时的父节点     |

### 静态方法

- `Toast.info(options | string)`
- `Toast.success(options | string)`
- `Toast.warning(options | string)`
- `Toast.error(options | string)`
- `Toast.close(id)`
- `Toast.destroyAll()`
- `Toast.config(config)`
- `ToastFactory.create(config?)`
- `useToast()` / `Toast.useToast()`

## 可访问性与 SSR

每条 Toast 使用 `role="alert"` 与 `{type} type` 的 `aria-label`。关闭按钮复用 Button 的原生键盘和焦点能力；组件不捕获 Escape，也不改变当前焦点。

根入口和 `@aifuxi/semi-ui-vue/toast` 均可在 SSR 中安全导入。命令式方法只能在浏览器调用；holder 在服务端可安全渲染空列表。

## React → Vue

| React v2.102.0                           | Vue 3.5+                           | 说明                            |
| ---------------------------------------- | ---------------------------------- | ------------------------------- |
| `Toast.info('Saved')`                    | `Toast.info('Saved')`              | 字符串简写不变                  |
| `Toast.success(options)`                 | `Toast.success(options)`           | 返回 id；同 id 原位更新         |
| `Toast.close(id)`                        | `Toast.close(id)`                  | 命令式关闭不变                  |
| `Toast.config(config)`                   | `Toast.config(config)`             | 应在实例第一次显示前调用        |
| `ToastFactory.create(config)`            | `ToastFactory.create(config)`      | 返回隔离的 Vue 命令式实例       |
| `const [api, holder] = Toast.useToast()` | `const [api, Holder] = useToast()` | Vue 返回可直接渲染的 Component  |
| `{holder}`                               | `<Holder />`                       | holder 放在需要继承上下文的位置 |
| `ReactNode` content/icon                 | `VNodeChild` content/icon          | 使用 Vue VNode/组件实例         |
| React context direction                  | `ConfigProvider` direction         | holder 可继承；静态实例默认 LTR |

Vue 不公开 React component ref、render prop 或 `ReactElement`。Toast 是命令式反馈 API，没有 `v-model` 或业务数据双向绑定。
