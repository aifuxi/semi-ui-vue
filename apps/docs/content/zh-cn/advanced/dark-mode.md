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

## 能力介绍

默认主题同时提供亮色与暗色，也支持局部容器固定明暗模式。本站使用独立品牌示例，未嵌入上游 DSM 平台截图。

## 推荐设置

在 body 设置文本和背景颜色，使业务内容跟随主题变量：

```css
body {
  color: var(--semi-color-text-0);
  background-color: var(--semi-color-bg-0);
}
```

## 如何切换

通过 `document.body.setAttribute('theme-mode', 'dark')` 开启暗色，移除属性恢复亮色。本站显式存储 `light` 时，也将其视为亮色。DOM 操作放在用户事件或客户端生命周期中，不在 SSR 模块顶层执行。

::demo-block{demo="dark-mode/zh-cn/Global" title="全局切换"}
::

示例发出 `themeChange`，仅供本站同步页头、偏好及编辑器主题；独立使用时无需监听。

## 和系统主题保持一致

通过 `prefers-color-scheme` 读取并监听系统偏好。下面的 Vue 示例会立即应用当前偏好，并在卸载时移除监听；用户手动选择后可停止自动跟随。

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
let media: MediaQueryList | undefined;
function syncMode() {
  if (media?.matches) document.body.setAttribute('theme-mode', 'dark');
  else document.body.removeAttribute('theme-mode');
}
onMounted(() => {
  media = window.matchMedia('(prefers-color-scheme: dark)');
  syncMode();
  media.addEventListener('change', syncMode);
});
onUnmounted(() => media?.removeEventListener('change', syncMode));
</script>
```

首屏主题初始化可在页面绘制前完成；保证 SSR 与 hydration 的 DOM 结构一致。

## 局部暗色/亮色模式

使用 `.semi-always-dark` / `.semi-always-light` 固定局部颜色变量。普通 div 的 `theme-mode="dark"` 不等同于局部主题 class。

```html
<div class="semi-always-dark">局部暗色内容</div>
<div class="semi-always-light">局部亮色内容</div>
```

弹层默认插入 body，不继承局部主题。需要局部主题的弹层应通过 `getPopupContainer` 挂载到对应容器内。下例的 Group3 菜单挂载在内容区，Popover、Tooltip 和分页菜单保留默认 body 容器，可分别观察它们的颜色。

::demo-block{demo="dark-mode/zh-cn/Local" title="局部明暗模式"}
::

## React → Vue 迁移

| 固定上游用法                 | Vue 对应                                        |
| ---------------------------- | ----------------------------------------------- |
| `useState` / `setMode`       | `ref` 与事件函数                                |
| `className`                  | `class` / `:class`，保留原 `.semi-*` class      |
| `onClick`                    | `@click`                                        |
| `icon={<Icon />}`            | `#icon` 插槽；items 中使用 `h(Icon)`            |
| `getPopupContainer` 查询节点 | 模板 ref，用户触发弹层时读取真实容器            |
| `window.setMode` 官网回调    | 可选 `themeChange` 事件，独立示例无全局函数依赖 |

本页没有独立组件 API；主题属性、局部 class、CSS Token 和弹层容器的契约来自固定 v2.102.0。默认桌面明暗均验证；本例未配置响应式断点或触摸契约。
