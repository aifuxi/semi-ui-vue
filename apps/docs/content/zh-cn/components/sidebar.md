---
title: '侧边信息栏'
description: '展示 AI 场景下的配置和详情信息'
locale: 'zh-CN'
slug: 'sidebar'
category: 'ai'
order: 103
englishTitle: 'Sidebar'
icon: 'doc-sidebar'
upstream: 'ai/sidebar'
---

`Sidebar` 对齐 Semi Design `v2.102.0`，用于 AI 工作区中的代码、文件、引用来源与 MCP 配置。该切片同时导出 `Sidebar.Container`、`Sidebar.CodeContent`、`Sidebar.CodeItem`、`Sidebar.FileContent`、`Sidebar.FileItem`、`Annotation` 与 `MCPConfigure`。

::demo-block{demo="sidebar/zh-CN/Example1" title="侧边信息栏"}
::

## Vue API

### Sidebar / Container

| 属性                                    | 说明                                    | 默认值        |
| --------------------------------------- | --------------------------------------- | ------------- |
| `visible`                               | 是否显示                                | `false`       |
| `motion`                                | 是否执行固定 Sidebar 滑入/滑出动效      | `true`        |
| `resizable`                             | 是否允许从左边缘调整宽度                | `true`        |
| `showClose`                             | 是否显示默认关闭按钮                    | `true`        |
| `minWidth` / `maxWidth` / `defaultSize` | 调整尺寸约束                            | `150` / - / - |
| `closeOnEsc`                            | 可见时按 Escape 触发关闭                | `false`       |
| `title`                                 | 主标题，可由 `#title` 替代              | -             |
| `mode`                                  | `main`、`code`、`file` 或自定义详情模式 | `main`        |
| `activeKey` / `options`                 | 主视图当前选项及列表                    | -             |
| `detailContent`                         | Code/File 详情数据                      | -             |
| `fileEditable`                          | File 详情是否可编辑                     | `true`        |

事件为 `cancel`、`after-visible-change`、`active-option-change`、`back-ward`、`detail-content-copy` 与 `file-content-change`。React render props 分别映射为 `#header`、`#option`、`#main-content`、`#detail-header`、`#detail-content` scoped slots；同名函数 prop 也保留用于渐进迁移。

### Code / File

- `Sidebar.CodeContent`：`activeKey`、`codes`、`onChange`、`onExpand`。
- `Sidebar.CodeItem`：`name`、`isJson`、`language`、`content`、`jsonViewerProps`、`codeHighlightProps`。
- `Sidebar.FileContent`：`activeKey`、`files`、`onChange`、`onExpand`。
- `Sidebar.FileItem`：`name`、`editable`、`content`、`extensions`、`imgUploadProps`、`onContentChange`。

File 编辑器固定使用 Tiptap `3.10.7`；`extensions` 接收 Vue Tiptap extension。传入的 HTML 应来自可信来源或在业务层完成清洗。

### Annotation

`Annotation` 继承 Container 属性；`info` 是 `{ header, key, annotations }[]`，引用项支持 `text` / `video`、标题、详情、URL、封面、站点 Logo、序号和秒数时长。`#item="{ annotation }"` 可替换默认引用卡片。

### MCPConfigure

`MCPConfigure` 继承 Container 属性；`options` / `customOptions` 中每项包含 `value`、`label`、`desc`、`icon`、`active`、`disabled`、`configure`。支持 `filter`、`onSearch`、`onStatusChange`、`onAddClick`、`onConfigureClick`、`onEditClick` 和 `#item`。

## SSR 与可访问性

隐藏状态 SSR 不输出容器；可见主视图可稳定渲染。Tiptap、剪贴板和全局键盘监听只在客户端创建。默认关闭、返回、复制和展开按钮具有 aria-label。固定 React 基线中的引用卡片是 clickable `div`；需要更强键盘语义时请用 `#item` 自定义。

完整 API、DOM/class、事件顺序、暗色/RTL/SSR 与 deviation 证据见 [alignment.md](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/sidebar/alignment.md)，迁移说明见 [react-to-vue.md](#react-vue)。

## React → Vue

| Semi React v2.102.0                       | Vue 3.5+                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| `renderHeader()`                          | `#header`                                                                 |
| `renderOptionItem(option, onChange)`      | `#option="{ option, onChange }"`                                          |
| `renderMainContent(activeKey)`            | `#main-content="{ activeKey }"`                                           |
| `renderDetailHeader(mode, detailContent)` | `#detail-header="{ mode, detailContent }"`                                |
| `renderDetailContent(mode)`               | `#detail-content="{ mode }"`                                              |
| `renderItem(annotation)`                  | `Annotation` 的 `#item`                                                   |
| `renderItem({ option, custom })`          | `MCPConfigure` 的 `#item`                                                 |
| `onActiveOptionChange`                    | `@active-option-change`                                                   |
| `onBackWard`                              | `@back-ward`                                                              |
| `onDetailContentCopy`                     | `@detail-content-copy`                                                    |
| `onFileContentChange`                     | `@file-content-change`                                                    |
| `containerRef` RefObject                  | 模板 `ref` + `getContainerElement()`；也支持 `containerRef(element)` 回调 |
| React Tiptap `Extension[]`                | Vue Tiptap `Extensions`；React node view 不能直接复用                     |

默认值为 `true` 的 `motion`、`resizable`、`showClose`、`fileEditable` 在 Vue 中保留原名，并区分缺省与显式 `false`。Compound API 可以继续写成 `Sidebar.Container` / `Sidebar.CodeContent` / `Sidebar.FileItem`，也可以使用同名具名导出。

`CodeItemProps` / `FileItemProps` 的上游 `key` 在 React 中同时承担列表 key；Vue 的 `key` 是保留 VNode 属性，列表使用组件自身数组项的 `key`，不要期望它作为子组件普通 prop 读取。
