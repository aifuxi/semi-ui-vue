---
title: Getting Started 快速开始
description: 在 Vue 3 项目中安装并使用 Semi UI Vue 组件。
type: start
order: 2
icon: doc-gettingstarted
---

## 1、安装

组件库发布包为 `@aifuxi/semi-ui-vue`，默认主题为 `@aifuxi/semi-theme-default`，两者版本同步发布。

<DemoBlock title="安装依赖" kind="import" />

## 2、引入样式

组件样式来自 `@aifuxi/semi-theme-default`。整包引入使用 `@aifuxi/semi-theme-default/index.css`；
只需要部分组件时，可以按组件引入对应样式文件，例如按钮使用 `@aifuxi/semi-theme-default/button.css`。

<DemoBlock title="引入样式" kind="import" />

## 3、使用组件

组件从公开子路径导入，例如 `@aifuxi/semi-ui-vue/button`、`@aifuxi/semi-ui-vue/select`。
根入口 `@aifuxi/semi-ui-vue` 会加载全量组件，业务代码建议使用子路径以保留按需加载能力。

<DemoBlock title="使用组件" kind="import" />

## 4、Vue 版本与 SSR

组件面向 Vue 3.5 及以上版本，公开入口保持无 DOM 环境可导入；服务端渲染时组件不访问浏览器全局对象，
需要在 `onMounted` 之后才能获取到真实 DOM 的能力由组件自身处理。

## 5、暗色模式

主题包内置亮暗两套 token。给 `body` 增加 `theme-mode="dark"` 即可切换暗色，移除该属性回到亮色。

<DemoBlock title="切换暗色模式" kind="import" />

## 6、国际化

组件文案通过 `@aifuxi/semi-ui-vue/locale` 的 `LocaleProvider` 提供，默认中文，
可以在应用根节点包一层 `LocaleProvider` 切换到其他语言。

## 7、与上游基线的对应关系

组件行为、公开契约与文档说明以只读基线 Semi Design v2.102.0 为准；本站说明内容由基线文档生成，
差异与实现状态记录在仓库的组件契约中。
