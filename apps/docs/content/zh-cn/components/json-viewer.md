---
title: 'Json编辑器'
description: '用于展示和编辑 JSON 数据'
locale: 'zh-CN'
slug: 'json-viewer'
category: 'plus'
order: 32
englishTitle: 'JsonViewer'
icon: 'doc-jsonviewer'
upstream: 'plus/jsonviewer'
---

## 代码演示

### 如何引入

```typescript
import { JsonViewer } from '@aifuxi/semi-ui-vue/json-viewer';
import '@aifuxi/semi-theme-default/json-viewer.css';
```

## 编辑与搜索

::demo-block{demo="json-viewer/Showcase" title="JsonViewer"}
::

`change` 与 `update:value` 在编辑内容变化时返回完整 JSON 文本。`options` 提供只读、自动换行、格式化、静态补全和自定义 token 渲染。Worker 已内联到发布产物，消费方无需复制 worker 文件或初始化 vendor submodule。

## React → Vue

| React                                      | Vue                                          |
| ------------------------------------------ | -------------------------------------------- |
| `value` + `onChange`                       | `v-model:value`                              |
| `renderSearchButton(node, controls)`       | `renderSearchButton` prop 或 `#searchButton` |
| `customRenderRule[].render` 返回 ReactNode | 返回 Vue VNodeChild 或 HTMLElement           |
| `ref.current.foundation...`                | 组件 ref 的公开方法                          |

## 无障碍与 SSR

搜索选项支持点击、Enter 与 Space，并使用 `aria-pressed` 表示状态。SSR 只输出稳定容器；core、ResizeObserver 和 Worker 在客户端挂载后创建并在卸载时清理。

## API

::api-table{slug="json-viewer"}
::
