---
title: '回到顶部'
description: 'BackTop 在页面或指定滚动容器超过阈值后显示回顶入口。本实现以本地 Semi Design v2.102.0 为唯一基线。'
locale: 'zh-CN'
slug: 'back-top'
category: 'navigation'
order: 55
englishTitle: 'BackTop'
icon: 'doc-backtop'
upstream: 'navigation/backtop'
---

## 代码演示

### 如何引入

```ts
import { BackTop } from '@aifuxi/semi-ui-vue/back-top';
import '@aifuxi/semi-theme-default/back-top.css';
```

### 基本用法

BackTop 预设了基本的返回按钮，可以直接调用。

::demo-block{demo="back-top/zh-cn/Basic" title="基本用法"}
::

### 自定义样式

BackTop 预设了默认样式，包括：距离底部 50px，距离右侧 100px，`box-sizing` 为 `border-box`，内容水平居中。样式可以覆盖。

::demo-block{demo="back-top/zh-cn/Custom" title="自定义样式"}
::

## API 参考

| 属性             | 说明                                                | 类型                                             | 默认值       |
| ---------------- | --------------------------------------------------- | ------------------------------------------------ | ------------ |
| class            | 类名                                                | string                                           | -            |
| duration         | 滚动到顶部的时间                                    | number                                           | 450          |
| style            | 样式名                                              | CSSProperties                                    | -            |
| target           | 返回值为需要监听其滚动事件的元素对应 DOM 元素的函数 | () => Window \| HTMLElement \| null \| undefined | () => window |
| visibilityHeight | 出现 BackTop 需要达到的滚动高度                     | number                                           | 400          |
| @click           | 点击事件的回调函数                                  | (e: MouseEvent) => void                          | -            |

## 设计变量

::token-table{component="backtop"}
::

## Accessibility

默认内容使用 Button。自定义图标内容时保留原生按钮及可访问名称，确保 Enter/Space 可以触发返回操作。

## FAQ

**为什么按钮没有出现？**

确认 target 返回实际滚动元素，且该元素的 scrollTop 已超过 visibilityHeight；默认监听 window，而非任意内部滚动区域。

## React → Vue 迁移

| React                  | Vue                                              |
| ---------------------- | ------------------------------------------------ |
| children               | 默认插槽，用于自定义返回控件                     |
| target={() => element} | `:target="() => element"`，通过模板 ref 取得目标 |
| onClick                | @click，参数 MouseEvent                          |
| className              | class，兼容 className                            |

默认目标是 window，服务端导入不会访问 window。组件挂载后监听目标滚动，卸载后清理监听与节流回调。duration 的单位为毫秒；不提供 v-model。示例需要向下滚动文档所在窗口超过 visibilityHeight 才显示按钮。
