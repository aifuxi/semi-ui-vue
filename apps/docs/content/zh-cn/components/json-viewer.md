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
| `value` + `onChange`                       | `:value` + `@change`                         |
| `renderSearchButton(node, controls)`       | `renderSearchButton` prop 或 `#searchButton` |
| `customRenderRule[].render` 返回 ReactNode | 返回 Vue VNodeChild 或 HTMLElement           |
| `ref.current.format()`                     | 组件 ref 的公开方法                          |

## 无障碍与 SSR

搜索选项支持点击、Enter 与 Space，并使用 `aria-pressed` 表示状态。SSR 只输出稳定容器；core、ResizeObserver 和 Worker 在客户端挂载后创建并在卸载时清理。

## 固定上游示例

这些示例保留固定上游的非受控编辑方式：value 是初始文本，change 用于读取修改结果。不要在每次 change 中写回 value，否则会重建编辑器。自定义渲染示例以站内图片替换远程封面，并相应匹配 /demos/ 路径；字符串、数值、路径与正则四种规则仍分别演示。

### 基本用法

::demo-block{demo="json-viewer/zh-CN/Basic" title="基本用法"}
::

### 设置行高

::demo-block{demo="json-viewer/zh-CN/LineHeight" title="设置行高"}
::

### 自动换行

::demo-block{demo="json-viewer/zh-CN/AutoWrap" title="自动换行"}
::

### 格式化配置

::demo-block{demo="json-viewer/zh-CN/Format" title="格式化配置"}
::

### 自定义渲染规则

::demo-block{demo="json-viewer/zh-CN/CustomRender" title="自定义渲染规则"}
::

### 自定义搜索按钮

::demo-block{demo="json-viewer/zh-CN/CustomSearch" title="自定义搜索按钮"}
::

## API

::api-table{slug="json-viewer"}
::
