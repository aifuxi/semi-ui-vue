---
title: 'Toast 提示'
description: 'Toast 提示是对用户的操作做出及时反馈，由用户的操作触发，反馈信息可以是操作的结果状态，如成功、失败、出错、警告等。'
type: 'feedback'
order: 94
icon: 'doc-toast'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/toast` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-feedback-toast-1" title="如何引入" kind="import" />

### 普通提示

通过调用 Toast的相关 method 可以实现弹出提示。
推荐设置 stack 属性应用堆叠样式到同屏多个 Toast，Hover 展开，可有效防止一次性弹出多个并列 Toast 对用户造成干扰 (该 API在 v2.42.0 后支持)

<DemoBlock id="zh-CN-feedback-toast-2" title="普通提示" kind="live" />

### 其他提示类型

包括成功、失败、警告

<DemoBlock id="zh-CN-feedback-toast-3" title="其他提示类型" kind="live" />

### 多色样式

可以使用 `theme` 设置浅色填充样式提高与界面的对比，默认为 'normal' 的白色模式。

<DemoBlock id="zh-CN-feedback-toast-4" title="多色样式" kind="live" />

### 链接文本

配合 Typography 可以自定义链接文本，用来配合更复杂的场景的使用。

<DemoBlock id="zh-CN-feedback-toast-5" title="链接文本" kind="live" />

### 修改延时

自定义时长 10s，默认时长为 3s

<DemoBlock id="zh-CN-feedback-toast-6" title="修改延时" kind="live" />

### 手动关闭

当 `duration` 设置为 0 时，toast 不会自动关闭，此时必须通过手动关闭。

<DemoBlock id="zh-CN-feedback-toast-7" title="手动关闭" kind="live" />

### 更新消息内容

可以通过唯一的 `id` 来更新内容。

<DemoBlock id="zh-CN-feedback-toast-8" title="更新消息内容" kind="live" />

### 销毁所有

全局销毁：

- `Toast.destroyAll()`

### 局部上下文

通过 `useToast()` 创建可读取 Vue provide / inject 上下文的 holder 组件；局部 Toast 会渲染在 holder 所在位置。

<DemoBlock id="zh-CN-feedback-toast-9" title="消费 Context" kind="live" />

### 创建不同配置 Toast

常用于覆盖全局配置

- `ToastFactory.create(config) => Toast`
  如果您的应用中需要使用不同 config 的 Toast，可以使用 ToastFactory.create(config)创建新的 Toast (>= 1.23):

<DemoBlock id="zh-CN-feedback-toast-10" title="创建不同配置 Toast" kind="live" />

全局销毁：

- `Toast.destroyAll()`

局部上下文：

- `Toast.useToast()`
  需要继承局部上下文时，在 `setup` 中调用 `useToast()`，并在模板中渲染返回的 holder 组件。局部方法集包含 `open`、`info`、`success`、`warning`、`error` 和 `close`。

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/toast/types.ts`、`packages/ui/src/toast/index.ts`、`packages/ui/src/toast/use-toast.ts` 的公开类型为准。

#### Vue 用法

- `useToast()` 可直接导入，也可通过 `Toast.useToast()` 调用。
- 返回元组第二项是 Vue `Component`；请在调用组件的模板中渲染该 holder，使 Toast 继承当前位置的 provide / inject 上下文。

#### Vue 静态方法

**Toast**

| 方法                                     | 签名                                            | 说明                          |
| ---------------------------------------- | ----------------------------------------------- | ----------------------------- |
| `Toast.info / error / warning / success` | (options: ToastInput) =&gt; ToastId             | 展示对应类型的 Toast          |
| `Toast.close`                            | (id: ToastInputId) =&gt; ToastId                | 关闭指定 Toast                |
| `Toast.config`                           | (config: ToastConfig) =&gt; void                | 设置当前 Toast 实例的默认配置 |
| `Toast.destroyAll`                       | () =&gt; void                                   | 销毁当前 Toast 实例的全部消息 |
| `Toast.getWrapperId`                     | () =&gt; string \| null                         | 获取当前 Toast 容器 id        |
| `ToastFactory.create`                    | (config?: ToastConfig) =&gt; ToastStaticMethods | 创建独立配置的 Toast 实例     |

#### Vue Composable

**useToast**

| 方法                                       | 签名                                        | 说明                         |
| ------------------------------------------ | ------------------------------------------- | ---------------------------- |
| `useToast`                                 | () =&gt; readonly [ToastMethods, Component] | 创建局部方法集与 holder 组件 |
| `methods.open`                             | (options: ToastOptions) =&gt; ToastId       | 展示默认类型 Toast           |
| `methods.info / error / warning / success` | (options: ToastOptions) =&gt; ToastId       | 展示对应类型的局部 Toast     |
| `methods.close`                            | (id: ToastInputId) =&gt; ToastId            | 关闭指定局部 Toast           |

组件提供的静态方法，使用方式和参数如下：展示：可以直接传入 `options` 对象或 `string`：

**全局配置, 在调用前提前配置，全局一次生效**

- `Toast.config(config)`

**直接展示 Toast**

- `Toast.info(options || string)`
- `Toast.error(options || string)`
- `Toast.warning(options || string)`
- `Toast.success(options || string)`

**`info` `error` `warning` `success` 返回值为`toastId`, 可用于手动关闭 **

`const toastId = Toast.info({ /*...options*/ })`

- `Toast.close(toastId)` 手动关闭

## Options

**Toast Options 支持以下 API 及 Config 中的 API**

| 属性         | 说明                 | 类型                    | 默认值 | 版本   |
| ------------ | -------------------- | ----------------------- | ------ | ------ |
| className    | —                    | HTMLAttributes['class'] | —      |        |
| content      | 提示内容             | VNodeChild              | ''     |        |
| direction    | —                    | ConfigDirection         | —      |        |
| icon         | 自定义图标           | VNodeChild              | —      | -      |
| id           | 自定义 ToastId       | ToastInputId            | —      |        |
| motion       | —                    | boolean                 | —      |        |
| onClose      | toast 关闭的回调函数 | () =&gt; void           | —      |        |
| showClose    | 是否展示关闭按钮     | boolean                 | true   | -      |
| stack        | 是否堆叠 Toast       | boolean                 | false  | 2.42.0 |
| style        | —                    | StyleValue              | —      |        |
| textMaxWidth | 内容的最大宽度       | number \| string        | 450    | -      |
| type         | —                    | ToastType               | —      |        |

## Config

**以下 API 支持全局配置，用于更改当前 Toast 的默认配置**

| 属性              | 说明                                                                                                                                                                  | 类型                         | 默认值                 | 版本   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------- | ------ |
| bottom            | 弹出位置 bottom                                                                                                                                                       | number \| string             | -                      | -      |
| duration          | 自动关闭的延时，单位 s，设为 0 时不自动关闭                                                                                                                           | number                       | 3                      |        |
| getPopupContainer | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 container 和 内部的 .semi-toast-wrapper `position: relative`, 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。 | () =&gt; HTMLElement \| null | () =&gt; document.body | -      |
| left              | 弹出位置 left                                                                                                                                                         | number \| string             | -                      | -      |
| right             | 弹出位置 right                                                                                                                                                        | number \| string             | -                      | -      |
| theme             | 填充样式，支持 `light`, `normal`                                                                                                                                      | ToastTheme                   | `normal`               | 2.54.0 |
| top               | 弹出位置 top                                                                                                                                                          | number \| string             | -                      | -      |
| zIndex            | 弹层 z-index 值                                                                                                                                                       | number                       | 1010                   |        |

## Accessibility

### ARIA

- Toast 的 role 为 alert

## 文案规范

- 保持简洁
- 句尾不使用句号
- 使用 名词 + 动词 的格式进行说明

| ✅ 推荐用法            | ❌ 不推荐用法                            |
| ---------------------- | ---------------------------------------- |
| Language added         | New language has been added successfully |
| Ticket transfer failed | Can't transfer ticket                    |

- 提供动作的提示消息
- 只提供一个动作
- 不使用类似于「已读」类的动作，例如 OK, Got it, Dismiss, Cancel

| ✅ 推荐用法 | ❌ 不推荐用法 |
| ----------- | ------------- |
