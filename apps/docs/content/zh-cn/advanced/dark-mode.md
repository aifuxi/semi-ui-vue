---
title: '暗色模式'
englishTitle: 'Dark Mode'
description: '在全局或局部容器中切换暗色主题。'
slug: 'dark-mode'
locale: 'zh-CN'
category: 'advanced'
order: 1
upstream: 'advanced/dark-mode'
---

## 全局切换

```ts
document.body.setAttribute('theme-mode', 'dark');
document.body.removeAttribute('theme-mode');
```

DOM 操作只能在客户端生命周期或用户事件中执行，不能放在 SSR 模块顶层。

## 局部暗色

```html
<div theme-mode="dark">
  <!-- 使用 Semi 组件的内容 -->
</div>
```

局部暗色需要同时处理 Portal 容器。弹层默认挂载到 body 时不会自动继承局部主题。

## 系统偏好与首屏

通过 prefers-color-scheme 读取系统偏好，在用户显式选择后优先保留其选择。为避免首屏闪烁，主题初始化应在页面绘制前完成，并保持 SSR 与 hydration 的 DOM 结构一致。

## 验证

本站右上角的主题切换同时作用于正文、示例及编辑预览。修改主题后检查文本、边框、阴影、禁用状态和键盘焦点。
