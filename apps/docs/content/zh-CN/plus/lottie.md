---
title: 'Lottie 动画'
description: '在网页中展示 Lottie 动画'
type: 'plus'
order: 34
icon: 'doc-lottie'
---

## 使用场景

Lottie 组件能够便捷简单地渲染 Lottie 动画，同时提供方式获取到全局 Lottie 和 动画实例满足更广泛的配置需求。内部基于 `lottie-web` 渲染 Lottie 动画。
相较于直接使用 `lottie-web`，使用 Semi Lottie 组件的优势在于

- 无需关心动画容器的创建与销毁
- 无需关心动画本身的生命周期
- 更易和 Vue 项目结合使用

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/lottie` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

Lottie 从 v2.62.0 开始支持

<DemoBlock id="zh-CN-plus-lottie-1" title="如何引入" kind="code" />

### 基本用法

**当 Lottie 动画资源 JSON 在 CDN 上时**

向 `params` props 里传入 path= 你的 lottie json 的 URL 即可

<DemoBlock id="zh-CN-plus-lottie-2" title="基本用法" kind="live" />

**当 Lottie 动画资源 JSON 需要被打包到网站代码中时**

向 `params` props 里传入 animationData= 你的 lottie json 对象即可 (下方 Demo 请求 JSON 是仅作为演示，实际项目中 json 应当被手动 import，而不是通过网络请求获取，这样 JSON 动画资源才会被打包进网站代码)

<DemoBlock id="zh-CN-plus-lottie-3" title="基本用法" kind="live" />

### Params 其他常用参数

`params` 会被组件传入 `lottie-web` 的 `lottie.loadAnimation` 中，可以参考 `lottie-web` [文档](https://github.com/airbnb/lottie-web?tab=readme-ov-file#usage)

常用参数

<DemoBlock id="zh-CN-plus-lottie-4" title="Params 其他常用参数" kind="code" />

### 获取当前动画实例

使用 `getAnimationInstance` 获取当前播放的动画的 animation 实例，实例上含有许多方法用于调整动画的各项参数，例如播放暂停，获取当前帧序号，调整播放速度等。

关于动画实例上含有的方法，更多信息可以参考 `lottie-web` [文档](https://github.com/airbnb/lottie-web?tab=readme-ov-file#usage)

<DemoBlock id="zh-CN-plus-lottie-5" title="获取当前动画实例" kind="live" />

### 获取全局 Lottie

使用 `getLottie` prop 获取全局 lottie，也可以使用 Semi Lottie 组件上的静态方法 `Lottie.getLottie` 来获取全局 lottie

关于全局 lottie 上含有的方法，更多信息可以参考 `lottie-web` [文档](https://github.com/airbnb/lottie-web?tab=readme-ov-file#usage)

<DemoBlock id="zh-CN-plus-lottie-6" title="获取全局 Lottie" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/lottie/types.ts`、`packages/ui/src/lottie/index.ts` 的公开类型为准。

#### Vue 用法

- `getAnimationInstance` 与 `getLottie` 是实例通知 callback props，不是组件事件。
- SSR 仅输出空的内部容器；`lottie-web` 在客户端挂载后加载并在卸载时销毁。

#### Vue 静态方法

**Lottie**

| 方法        | 签名                  | 说明                           |
| ----------- | --------------------- | ------------------------------ |
| `getLottie` | () =&gt; LottiePlayer | 返回全局 lottie-web 播放器对象 |

| 属性                 | 说明                       | 类型                                         | 默认值 |
| -------------------- | -------------------------- | -------------------------------------------- | ------ |
| params               | 用于配置动画相关参数       | LottieParams（必填）                         | -      |
| width                | 内部动画容器宽度           | string                                       | —      |
| height               | 内部动画容器高度           | string                                       | —      |
| class                | Vue 原生类名               | HTMLAttributes['class']                      | —      |
| className            | 类名                       | HTMLAttributes['class']                      | -      |
| style                | 样式                       | StyleValue                                   | -      |
| getAnimationInstance | 获取当前动画 AnimationItem | (instance: AnimationItem \| null) =&gt; void | -      |
| getLottie            | 获取全局 Lottie            | (lottie: LottiePlayer) =&gt; void            | -      |
