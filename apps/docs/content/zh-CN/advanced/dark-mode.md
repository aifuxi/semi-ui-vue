---
title: 'Dark Mode 暗色模式'
type: 'advanced'
order: 6
icon: 'doc-darkmode'
---

## 能力介绍

大多数情况下，深色模式是浅色模式的补充。默认选用值，更多取决于用户的审美选择或业务场景，用户可以根据自己的需要选择使用哪一个模式。

🤩 Semi 的默认主题或任意通过 [Semi DSM](https://semi.design/dsm) 配置的定制主题都自带了亮色模式与暗色模式，可以方便地进行切换。
🌒 Semi 也支持在页面的局部范围使用亮/暗色模式。

## 推荐设置

Semi 会自动在 body 元素上挂载全局色盘，我们内置了一些常用的 CSS Token，详细的 Token 详情可查阅 [设计变量](https://semi.design/zh-CN/basic/tokens)
我们推荐你在 body 上配置 `color`、`background-color`, 你的业务组件可从 body 自动继承获得默认的背景色、文本颜色，自适应亮/暗色切换

<DemoBlock id="zh-CN-advanced-dark-mode-1" title="推荐设置" kind="code" />

## 如何切换

Semi 暗色模式的切换是通过给 `body` 添加属性 `[theme-mode='dark']` 来实现的（我们在 body 下同时挂载了两套色盘）。你可以使用任何你喜欢的方式来进行切换。比如：

<DemoBlock id="zh-CN-advanced-dark-mode-2" title="如何切换" kind="code" />

这里也有一个🌰：

<DemoBlock id="zh-CN-advanced-dark-mode-3" title="如何切换" kind="code" />

## 和系统主题保持一致

如果你希望页面的亮色/暗色模式能自动和系统主题保持一致，可以参考 [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 属性。该媒体查询已被现代浏览器广泛支持；消费项目仍应按自身浏览器范围验证。

macOS 下的系统主题可以通过 `系统偏好设置 -> 通用 -> 外观` 来配置。

由于我们不建议直接修改 npm 主题包的内容，你可以通过 JS 的方式监听该属性的变化，这里也有一个🌰：

<DemoBlock id="zh-CN-advanced-dark-mode-4" title="和系统主题保持一致" kind="code" />

## 局部暗色/亮色模式

Semi 2.0 原生支持局部暗色/亮色模式。使用时，在顶级元素上添加 `.semi-always-dark` 或 `.semi-always-light` 类，这个类下的组件会使用对应模式的颜色变量。

注意：由于弹出层默认是插入到 body 中，局部暗色/亮色对弹出层元素不生效。若你希望对弹出层也生效，应通过 `ConfigProvider` 的 `getPopupContainer` prop（模板中使用 `:get-popup-container`）把弹出层挂载到带有 `.semi-always-dark` 或 `.semi-always-light` 的元素内部

<DemoBlock id="zh-CN-advanced-dark-mode-5" title="局部暗色/亮色模式" kind="code" />
