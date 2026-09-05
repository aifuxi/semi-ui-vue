---
title: 'Sidebar'
description: 'Display configuration and detail information in AI scenarios'
locale: 'en-US'
slug: 'sidebar'
category: 'ai'
order: 103
englishTitle: 'Sidebar'
icon: 'doc-sidebar'
upstream: 'ai/sidebar'
---

`Sidebar` is aligned with Semi Design `v2.102.0` for AI workspaces that expose code, files, citations, and MCP configuration. The slice exports `Sidebar.Container`, `Sidebar.CodeContent`, `Sidebar.CodeItem`, `Sidebar.FileContent`, `Sidebar.FileItem`, `Annotation`, and `MCPConfigure`.

::demo-block{demo="sidebar/en-US/Example1" title="Sidebar"}
::

## Vue API

### Sidebar / Container

| Prop                                    | Description                                     | Default       |
| --------------------------------------- | ----------------------------------------------- | ------------- |
| `visible`                               | Whether the container is shown                  | `false`       |
| `motion`                                | Use the pinned slide transition                 | `true`        |
| `resizable`                             | Resize from the left edge                       | `true`        |
| `showClose`                             | Render the default close button                 | `true`        |
| `minWidth` / `maxWidth` / `defaultSize` | Resize constraints                              | `150` / - / - |
| `closeOnEsc`                            | Emit cancel on Escape while visible             | `false`       |
| `title`                                 | Main title; replaceable with `#title`           | -             |
| `mode`                                  | `main`, `code`, `file`, or a custom detail mode | `main`        |
| `activeKey` / `options`                 | Active main-view option and option list         | -             |
| `detailContent`                         | Code/File detail payload                        | -             |
| `fileEditable`                          | Whether File detail is editable                 | `true`        |

Events are `cancel`, `after-visible-change`, `active-option-change`, `back-ward`, `detail-content-copy`, and `file-content-change`. React render props map to the typed `#header`, `#option`, `#main-content`, `#detail-header`, and `#detail-content` slots. Function props remain available for incremental migrations.

### Code / File

- `Sidebar.CodeContent`: `activeKey`, `codes`, `onChange`, and `onExpand`.
- `Sidebar.CodeItem`: `name`, `isJson`, `language`, `content`, `jsonViewerProps`, and `codeHighlightProps`.
- `Sidebar.FileContent`: `activeKey`, `files`, `onChange`, and `onExpand`.
- `Sidebar.FileItem`: `name`, `editable`, `content`, `extensions`, `imgUploadProps`, and `onContentChange`.

The file editor pins Tiptap `3.10.7`; `extensions` accepts Vue Tiptap extensions. Sanitize untrusted HTML before passing it to the component.

### Annotation

`Annotation` inherits Container props. `info` is an array of `{ header, key, annotations }`; each citation supports text/video type, title, detail, URL, image, logo, site, order, and duration. Use `#item="{ annotation }"` for custom semantics or rendering.

### MCPConfigure

`MCPConfigure` inherits Container props. `options` and `customOptions` contain `value`, `label`, `desc`, `icon`, `active`, `disabled`, and `configure`. It supports filtering, search/status/add/configure/edit callbacks, and an `#item` slot.

## SSR and accessibility

A hidden Sidebar emits no container during SSR; visible main content renders deterministically. Tiptap, clipboard access, and global key listeners are client-only. Default close, back, copy, and expand controls have aria-labels. The pinned React citation item is a clickable `div`; use the custom item slot when stronger keyboard semantics are required.

See [alignment.md](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/sidebar/alignment.md) for the full parity evidence and [react-to-vue.md](#react-vue) for migration details.

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
