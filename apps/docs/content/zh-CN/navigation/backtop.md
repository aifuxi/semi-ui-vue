---
title: 'BackTop 回到顶部'
type: 'navigation'
order: 55
icon: 'doc-backtop'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/back-top` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-navigation-backtop-1" title="如何引入" kind="import" />

### 基本用法

BackTop 预设了基本的返回按钮，可以直接调用。

<DemoBlock id="zh-CN-navigation-backtop-2" title="基本用法" kind="live" />

### 自定义样式

BackTop 预设了默认样式，包括：距离底部 50px，距离右侧 100px，`box-sizing` 为 `border-box`，内容水平居中。样式可以覆盖。

<DemoBlock id="zh-CN-navigation-backtop-3" title="自定义样式" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/back-top/types.ts` 的公开类型为准。

#### Vue 事件

**BackTop**

| 事件  | 参数                | 说明                   |
| ----- | ------------------- | ---------------------- |
| click | [event: MouseEvent] | 点击回到顶部按钮时触发 |

#### Vue 插槽

**BackTop**

| 插槽    | 作用域参数 | 说明               |
| ------- | ---------- | ------------------ |
| default | {}         | 自定义回到顶部按钮 |

| 属性             | 说明                                                | 类型                                        | 默认值          |
| ---------------- | --------------------------------------------------- | ------------------------------------------- | --------------- |
| className        | 类名                                                | string                                      | -               |
| duration         | 滚动到顶部的时间                                    | number                                      | 450             |
| style            | 样式名                                              | CSSProperties                               | -               |
| target           | 返回值为需要监听其滚动事件的元素对应 DOM 元素的函数 | () =&gt; BackTopTarget \| null \| undefined | () =&gt; window |
| visibilityHeight | 出现 BackTop 需要达到的滚动高度                     | number                                      | 400             |
