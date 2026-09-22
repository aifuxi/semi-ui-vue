---
title: Getting Started 快速开始
description: 在 Vue 3 项目中安装并使用 Semi UI Vue 组件。
type: start
order: 2
icon: doc-gettingstarted
---

## 1、安装

组件库发布包为 `@aifuxi/semi-ui-vue`，默认主题、稳定/Lab 图标与插画包会作为同版本依赖自动安装。

```bash
pnpm add @aifuxi/semi-ui-vue
```

## 2、按需加载

在 Vite 或 Rspack 浏览器构建中，组件入口会自动关联对应的默认主题 CSS，无需增加样式配置或手工导入。
从旧版本升级时应删除 `@aifuxi/semi-theme-default/index.css` 全量导入，避免重复样式。

## 3、使用组件

组件可以从根入口或公开子路径导入，例如 `@aifuxi/semi-ui-vue/button`、`@aifuxi/semi-ui-vue/select`；
生产构建会移除未使用的组件代码与样式。

```vue
<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
</script>

<template>
  <Button type="primary">开始使用</Button>
</template>
```

## 4、Vue 版本与 SSR

组件面向 Vue 3.5 及以上版本，公开入口保持无 DOM 环境可导入；服务端渲染时组件不访问浏览器全局对象，
需要在 `onMounted` 之后才能获取到真实 DOM 的能力由组件自身处理。

## 5、暗色模式

主题包内置亮暗两套 token。给 `body` 增加 `theme-mode="dark"` 即可切换暗色，移除该属性回到亮色。

```ts
function setDarkMode(enabled: boolean) {
  if (enabled) document.body.setAttribute('theme-mode', 'dark');
  else document.body.removeAttribute('theme-mode');
}
```

## 6、国际化

组件文案通过 `@aifuxi/semi-ui-vue/locale` 的 `LocaleProvider` 提供，默认中文，
可以在应用根节点包一层 `LocaleProvider` 切换到其他语言。

## 7、与上游基线的对应关系

组件行为、公开契约与文档说明以只读基线 Semi Design v2.102.0 为准；本站说明内容由基线文档生成，
差异与实现状态记录在仓库的组件契约中。
