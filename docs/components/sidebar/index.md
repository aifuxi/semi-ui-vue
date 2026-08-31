# Sidebar 侧边信息栏

`Sidebar` 对齐 Semi Design `v2.102.0`，用于 AI 工作区中的代码、文件、引用来源与 MCP 配置。该切片同时导出 `Sidebar.Container`、`Sidebar.CodeContent`、`Sidebar.CodeItem`、`Sidebar.FileContent`、`Sidebar.FileItem`、`Annotation` 与 `MCPConfigure`。

```vue
<script setup lang="ts">
import { h, ref } from 'vue';
import { IconCodeStroked } from '@aifuxi/semi-icons-vue';
import { Sidebar, type SidebarCodeItemProps } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/sidebar.css';

const activeKey = ref('code');
const codes: SidebarCodeItemProps[] = [
  { key: 'main', name: 'main.ts', language: 'ts', content: 'const ready = true' },
];
</script>

<template>
  <Sidebar
    visible
    :motion="false"
    :resizable="false"
    title="Agent 工作区"
    :active-key="activeKey"
    :options="[{ key: 'code', icon: h(IconCodeStroked), name: '代码' }]"
    @active-option-change="(_, key) => (activeKey = key)"
  >
    <template #main-content>
      <Sidebar.CodeContent active-key="main" :codes="codes" />
    </template>
  </Sidebar>
</template>
```

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

完整 API、DOM/class、事件顺序、暗色/RTL/SSR 与 deviation 证据见 [alignment.md](./alignment.md)，迁移说明见 [react-to-vue.md](./react-to-vue.md)。
