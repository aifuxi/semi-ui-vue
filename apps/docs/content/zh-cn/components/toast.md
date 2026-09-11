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

## 代码演示

### 如何引入

```ts
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/toast.css';
```

### 普通提示

调用 Toast 方法显示提示。推荐使用 `stack: true` 将同屏多条提示堆叠，hover 时展开（自 v2.42.0 支持）。第二个按钮保留 10 秒仅前沿触发的节流；关闭提示会取消节流，允许立即再次展示。

::demo-block{demo="toast/zh-CN/Basic" title="普通提示"}
::

### 其他提示类型

使用 `success`、`warning`、`error` 展示成功、警告和错误提示；成功示例演示字符串简写。

::demo-block{demo="toast/zh-CN/Types" title="其他提示类型"}
::

### 多色样式

使用 `theme: 'light'` 设置浅色填充背景；默认值是 `normal`。

::demo-block{demo="toast/zh-CN/Colored" title="多色样式"}
::

### 链接文本

配合 Typography 自定义单行或多行链接内容。

::demo-block{demo="toast/zh-CN/Links" title="链接文本"}
::

### 修改延时

使用 `duration` 设置自动关闭秒数，默认 3 秒，本例为 10 秒。

::demo-block{demo="toast/zh-CN/Delay" title="修改延时"}
::

### 手动关闭

设置 `duration: 0` 后不会自动关闭。示例保存返回的 id，重复展示时不会新增，手动关闭后可以再次打开。

::demo-block{demo="toast/zh-CN/ManualClose" title="手动关闭"}
::

### 更新消息内容

再次传入相同 id 会原位更新提示并重启关闭计时。本例先显示 info，1 秒后更新为 success。

::demo-block{demo="toast/zh-CN/Update" title="更新消息内容"}
::

### 销毁所有

`Toast.destroyAll()` 销毁当前命令式实例的全部提示与 wrapper。独立工厂实例需分别销毁。

### 消费 Context

在 `<script setup>` 中调用 `useToast()`，将返回的 holder 渲染在需要消费的 Vue 上下文中。示例通过独立内容组件的 `inject` 读取 `provide` 提供的 Light；并非提前拼接字符串。

::demo-block{demo="toast/zh-CN/Context" title="消费 Context"}
::

### 创建不同配置 Toast

需要不同默认值或容器时，使用 `ToastFactory.create(config)`。本例保持全局与自定义容器实例隔离，使用模板 ref 获取容器，卸载时销毁局部实例。

::demo-block{demo="toast/zh-CN/Factory" title="创建不同配置 Toast"}
::

自定义容器改变 DOM 父节点，并不自动改变 fixed 定位；如需局部排版，同时为容器和其 `.semi-toast-wrapper` 设置 `position: relative`。

中文上游有九项 live 示例，英文有十项，英文第 4 项为独立堆叠演示。示例保留上游共同的英文按钮文案；链接按语言显示。Bytedance 文案按独立品牌约束替换为 AIFUXI。工厂示例补充上游遗漏的 Toast 导入；Context 示例移除非公开的 `title` 字段，hook holder 就地渲染裸 Toast、不产生命令式 `innerWrapper`。Context 的两个依赖文件会随在线编辑器加载。九项示例与英文独有 Stacking 已完成双语、明暗与适用 RTL 的严格 React/Vue 视觉与行为验收。

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
| `onClose`               | `() => void`                | -               | 自动或关闭按钮触发的回调       |
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

## Config

`Toast.config(config)` 应在当前实例首次展示前调用，支持上表的 `top/right/bottom/left`、`duration`、`theme`、`zIndex` 和 `getPopupContainer`。wrapper 创建后，容器与 zIndex 不迁移；显式传入的位置仍会更新。

静态方法返回 string id；Vue 接受 string/number 输入并规范为 string。上游文档将 id 写为 number，而公开 React 类型是 string。`onClose` 由自动关闭或关闭按钮触发，外部 `close(id)` / `destroyAll()` 不额外触发它。holder 方法接收 options，每次调用创建新条目，额外提供 `open(options)`；不要把静态同 id 更新的契约套用到 holder。

## 可访问性与 SSR

每条 Toast 使用 `role="alert"` 与 `{type} type` 的 `aria-label`。关闭按钮复用 Button 的原生键盘和焦点能力；组件不捕获 Escape，也不改变当前焦点。

根入口和 `@aifuxi/semi-ui-vue/toast` 均可在 SSR 中安全导入。命令式方法只能在浏览器调用；holder 在服务端可安全渲染空列表。

## 文案规范

- 保持简洁，句尾不使用句号，使用“名词 + 动词”的格式。
- 操作消息只提供一个明确动作，例如 Retry，避免 OK、Got it、Dismiss、Cancel。

| 推荐                   | 不推荐                                   |
| ---------------------- | ---------------------------------------- |
| Language added         | New language has been added successfully |
| Ticket transfer failed | Can’t transfer ticket                    |
| Retry                  | Dismiss                                  |

固定上游此处的 ToastCard 是内部静态示意，不是公开导出；保留文案规则，不伪造公开组件。

## 设计变量

::token-table{component="toast"}
::

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
