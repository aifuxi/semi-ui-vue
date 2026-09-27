---
title: 'Notification 通知'
description: '通知用于主动向用户发出消息通知'
type: 'feedback'
order: 88
icon: 'doc-notification'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/notification` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-feedback-notification-1" title="如何引入" kind="import" />

### 普通通知

最基本的用法，3s 后自动关闭

<DemoBlock id="zh-CN-feedback-notification-2" title="普通通知" kind="live" />

### 不同位置弹出

可以从多个不同位置弹出：默认右上角 `topRight`。可选值：`top`、`bottom`、`topLeft`、`topRight`、`bottomLeft`、`bottomRight`。

<DemoBlock id="zh-CN-feedback-notification-3" title="不同位置弹出" kind="live" />

### 带有图标的通知

包括成功、失败、警告、提示

<DemoBlock id="zh-CN-feedback-notification-4" title="带有图标的通知" kind="live" />

### 多色样式

可以使用 `theme` 设置浅色填充样式提高与界面的对比，默认为 'normal' 的白色模式。

<DemoBlock id="zh-CN-feedback-notification-5" title="多色样式" kind="live" />

### 链接文本

配合 Typography 可以自定义操作区链接文本，用来配合更复杂的场景的使用。

<DemoBlock id="zh-CN-feedback-notification-6" title="链接文本" kind="live" />

### 修改延时

自定义时长 10s，默认时长为 3s

<DemoBlock id="zh-CN-feedback-notification-7" title="修改延时" kind="live" />

### 手动关闭

设置 duration 为 0 时，通知将不会自动关闭，此时只能手动关闭。

<DemoBlock id="zh-CN-feedback-notification-8" title="手动关闭" kind="live" />

### 更新内容

可以通过唯一的 id 来更新内容。 >=2.45.0

<DemoBlock id="zh-CN-feedback-notification-9" title="更新内容" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/notification/types.ts`、`packages/ui/src/notification/index.ts`、`packages/ui/src/notification/use-notification.ts` 的公开类型为准。

#### Vue 用法

- `useNotification()` 可直接导入，也可通过 `Notification.useNotification()` 调用。
- 返回元组第二项是 Vue `Component`；请在调用组件的模板中渲染该 holder，使 Notification 继承当前位置的 provide / inject 上下文。

#### Vue 静态方法

**Notification**

| 方法                                                   | 签名                                                | 说明               |
| ------------------------------------------------------ | --------------------------------------------------- | ------------------ |
| `Notification.open / info / error / warning / success` | (options: NotificationOptions) =&gt; NotificationId | 展示对应类型的通知 |
| `Notification.close`                                   | (id: NotificationId) =&gt; NotificationId           | 关闭指定通知       |
| `Notification.config`                                  | (config: NotificationConfig) =&gt; void             | 设置全局默认配置   |
| `Notification.destroyAll`                              | () =&gt; void                                       | 销毁全部通知       |

#### Vue Composable

**useNotification**

| 方法                                              | 签名                                                | 说明                         |
| ------------------------------------------------- | --------------------------------------------------- | ---------------------------- |
| `useNotification`                                 | () =&gt; readonly [NotificationMethods, Component]  | 创建局部方法集与 holder 组件 |
| `methods.open / info / error / warning / success` | (options: NotificationOptions) =&gt; NotificationId | 展示对应类型的局部通知       |
| `methods.close`                                   | (id: NotificationId) =&gt; NotificationId           | 关闭指定局部通知             |

组件提供的静态方法，使用方式如下：

展示：可以直接传入 options 对象，返回值为`id`：`const id = Notification.open({ /*...options*/ })`

- `Notification.open({content: 'message', duration: 3})`
- `Notification.info({content: 'message', duration: 3})`
- `Notification.error({content: 'message', duration: 3})`
- `Notification.warning({content: 'message', duration: 3})`
- `Notification.success({content: 'message', duration: 3})`

手动关闭 （id 为展示方法的返回值）

- `Notification.close(id)`

| 属性              | 说明                                                                                                                         | 类型                            | 默认值                 | 版本 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------------------- | ---- |
| className         | —                                                                                                                            | HTMLAttributes['class']         | —                      |      |
| content           | 通知内容                                                                                                                     | VNodeChild                      | ''                     |      |
| direction         | —                                                                                                                            | ConfigDirection                 | —                      |      |
| duration          | 自动关闭的延时，单位 s，设为 0 时不自动关闭                                                                                  | number                          | 3                      |      |
| getPopupContainer | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。 | () =&gt; HTMLElement            | () =&gt; document.body | -    |
| icon              | 左上角 icon                                                                                                                  | VNodeChild                      | —                      |      |
| id                | —                                                                                                                            | NotificationId                  | —                      |      |
| onClick           | 点击通知的回调函数                                                                                                           | (event: MouseEvent) =&gt; void  | —                      | -    |
| onClose           | 通知关闭的回调函数(主动关闭、延时到达关闭都会触发)                                                                           | () =&gt; void                   | —                      |      |
| onCloseClick      | 主动点击关闭按钮时的回调函数                                                                                                 | (id: NotificationId) =&gt; void | —                      |      |
| position          | 弹出位置，可选 `top`、`bottom`、`topLeft`、`topRight`、`bottomLeft`、`bottomRight`                                           | NotificationPosition            | `topRight`             |      |
| showClose         | 是否展示关闭按钮                                                                                                             | boolean                         | true                   | -    |
| style             | —                                                                                                                            | StyleValue                      | —                      |      |
| theme             | 填充样式，支持`light`, `normal`                                                                                              | NotificationTheme               | `normal`               | -    |
| title             | 通知标题                                                                                                                     | VNodeChild                      | ''                     |      |
| type              | —                                                                                                                            | NotificationType                | —                      |      |
| zIndex            | 弹层 z-index 值，首次设置一次生效                                                                                            | number                          | 1010                   |      |

全局配置在调用前提前配置，全局一次生效：

- `Notification.config(config)`

| 属性      | 说明                                                                               | 类型                 | 默认值     | 版本 |
| --------- | ---------------------------------------------------------------------------------- | -------------------- | ---------- | ---- |
| bottom    | 弹出位置 bottom                                                                    | number \| string     | -          | -    |
| direction | —                                                                                  | ConfigDirection      | —          |      |
| duration  | 自动关闭的延时，单位 s，设为 0 时不自动关闭                                        | number               | 3          | -    |
| left      | 弹出位置 left                                                                      | number \| string     | -          | -    |
| position  | 弹出位置，可选 `top`、`bottom`、`topLeft`、`topRight`、`bottomLeft`、`bottomRight` | NotificationPosition | `topRight` | -    |
| right     | 弹出位置 right                                                                     | number \| string     | -          | -    |
| top       | 弹出位置 top                                                                       | number \| string     | -          | -    |
| zIndex    | 弹层 z-index 值                                                                    | number               | 1010       | -    |

## Accessibility

### ARIA

- 组件的 `role` 为 'alert'
- 通知的 `aria-labelledby` 标记为对应通知标题

## 文案规范

400 tasks succeed and 600 failed

}
/>

- 标题
- 使用简洁明了的语言进行说明
- 避免使用逗号，句号等标点符号
- 正文
- 在信息传递完整的前提下，尽可能地将正文压缩至 1 -2 句话
- 对标题进行详尽地描述或者解释，而不是对标题的重复说明
- 使用正确的标点符号，句子内使用逗号，句子间使用句号
- 操作
- 文案需要展示操作的具体含义

| ✅ 推荐用法 | ❌ 不推荐用法 |
| ----------- | ------------- |

全局销毁：

- `Notification.destroyAll()`

局部上下文：

- `Notification.useNotification`
  需要继承局部上下文时，在 `setup` 中调用 `useNotification()`，并在模板中渲染返回的 holder 组件。局部方法集包含 `open`、`info`、`success`、`warning`、`error` 和 `close`。
