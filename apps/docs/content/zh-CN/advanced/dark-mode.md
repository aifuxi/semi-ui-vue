---
title: 'Dark Mode 暗色模式'
type: 'advanced'
order: 6
icon: 'doc-darkmode'
---

## 能力介绍

大多数情况下，深色模式是浅色模式的补充。默认选用值，更多取决于用户的审美选择或业务场景，用户可以根据自己的需要选择使用哪一个模式。

Semi UI Vue 的默认主题同时提供亮色与暗色模式，固定对齐 Semi Design `v2.102.0`。独立颜色生成器也会生成深浅两套品牌主题，使用方式及交互预览见[定制主题](./customize-theme)。

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

仅使用强制模式类而未声明 `data-semi-theme` 时，默认 body 弹层仍按其物理宿主取色，可通过 `ConfigProvider` 的 `getPopupContainer` prop（模板中使用 `:get-popup-container`）选择对应的局部容器。对于带有 `data-semi-theme` 的主题边界，默认声明式弹层会桥接触发源的颜色、排版与模式；显式 `getPopupContainer` 仍优先使用实际容器的主题。

<DemoBlock id="zh-CN-advanced-dark-mode-5" title="局部暗色/亮色模式" kind="code" />

### 生成品牌主题的局部模式

颜色生成器的局部边界同时设置 `data-semi-theme` 与 `theme-mode`，并为深浅模式输出明确的 CSS 选择器。只在普通容器添加 `theme-mode` 不会自动创建局部色盘；默认局部模式使用上面的强制模式类，生成品牌主题则使用与输出 CSS 匹配的模式属性。

```html
<!-- 此边界需加载匹配的品牌主题 CSS；不会修改 body 或文档站全局模式。 -->
<section data-semi-theme="brand" theme-mode="dark">
  <!-- 内部强制浅色使用同一品牌的浅色色盘，排版设置继续继承。 -->
  <div class="semi-always-light">局部浅色内容</div>
</section>
```

嵌套的品牌边界也明确指定模式。模式选择及系统偏好由应用管理，生成器不读取 `prefers-color-scheme`。完整生成方式与可切换预览见[定制主题](./customize-theme#交互预览)。
