---
title: 'Sidebar 侧边信息栏'
description: '展示 AI 场景下的配置和详情信息'
type: 'ai'
order: 103
icon: 'doc-sidebar'
---

## 使用场景

侧边信息栏主要用于在 AI 场景下，用于信息展示，功能配置。包括 MCP 配置、参考来源、代码预览、富文本预览及编辑等功能

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/sidebar` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 基础容器

侧边信息栏的基础容器，基础容器是[MCP 配置](#mcp-配置)、[参考来源](#参考来源)、以及[侧边消息栏](#侧边消息栏)的基础容器。

- `visible` 控制显示状态，`cancel` 事件处理关闭请求
- `title`设置标题
- `motion`设置是否有展开动画
- `resizable`设置宽度是否可伸缩，为 `true` 时候可通过 `minSize`，`maxSize` 设置最小，最大宽度

<DemoBlock id="zh-CN-ai-sidebar-1" title="基础容器" kind="live" />

### MCP 配置

使用 `MCPConfigure` 进行 MCP 工具的展示、启用/关闭、配置及搜索

- 通过 `options` 和 `customOptions` 设置内置的 MCP 工具和自定义 MCP 工具
- 通过 `visible` 设置组件的显示和隐藏, 监听 `cancel` 事件处理用户关闭行为
- 监听 `status-change` 事件处理 MCP 工具的启用/关闭
- 监听 `add-click` 事件处理自定义 MCP 页的新增操作
- 通过 `configure-click` 监听内置 MCP 工具配置，通过 `edit-click` 监听自定义 MCP 工具配置

其他 MCPConfigure 的 API 见 [MCPConfigureProps](#MCPConfigureProps)

传入 MCP 工具项的类型如下

<DemoBlock id="zh-CN-ai-sidebar-2" title="MCP 配置" kind="code" />

用例如下：

<DemoBlock id="zh-CN-ai-sidebar-3" title="MCP 配置" kind="live" />

### 参考来源

使用 `Annotation` 组件可以管理参考来源的展示

- `activeKey` 配合 `change` 事件管理当前展开项
- `info` 设置参考来源的具体内容

<DemoBlock id="zh-CN-ai-sidebar-4" title="参考来源" kind="live" />

### 代码展示

可通过 `Sidebar` 中的 `CodeItem` 展示代码，`CodeItem` 基于 [JsonViewer](/zh-CN/plus/jsonviewer) 以及 [CodeHighlight](/zh-CN/plus/codehighlight) 实现。

- `content`: 内容字符串
- `isJson`: 是否为 json
- `language`: 编程语言名称，同 `CodeHighlight` 的 language
- `JsonViewerProps`: 配置其他 JsonViewer 参数
- `CodeHighlightProps`: 配置其他 CodeHighlight 参数

<DemoBlock id="zh-CN-ai-sidebar-5" title="代码展示" kind="live" />

### 代码列表

用户可通过 `Sidebar` 中的 `CodeContent` 组件展示代码列表信息。

<DemoBlock id="zh-CN-ai-sidebar-6" title="代码列表" kind="live" />

### 富文本编辑器

可通过 `Sidebar` 中的 `FileItem` 查看、编辑富文本内容， `FileItem` 基于 [tiptap](https://tiptap.dev/docs/editor/getting-started/overview) 实现。

- `content`：富文本内容， 支持类型同 TiptapContent
- `editable`: 设置是否可编辑
- `imgUploadProps`： 设置图片上传路径以及图片上传后 src 的设置，通过 `action` 设置上传地址，通过 `getUploadImageSrc` 函数返回图片上传后地址，用于富文本中 img 节点的 src

<DemoBlock id="zh-CN-ai-sidebar-7" title="富文本编辑器" kind="live" />

### 富文本列表

用户可通过 `Sidebar` 中的 `FileContent` 组件展示富文本列表信息。

<DemoBlock id="zh-CN-ai-sidebar-8" title="富文本列表" kind="live" />

### 侧边信息栏

侧边信息栏 `Sidebar` 有主视图（`mode` 为 `main`）和详情视图（`mode` 为 `code`、`text` 及其他）。

主视图可以通过 `title` 配置标题，通过 `showClose` 决定是否展示关闭按钮，通过 `options` 设置顶部的按钮组。

对于主视图的内容渲染，可通过 `main-content` 作用域插槽提供主视图内容；迁移代码也可继续使用 `renderMainContent` callback prop。可使用 `Annotation` 中的 `AnnotationContent` 渲染参考来源，使用 `Sidebar` 中内置的 `FileContent` 渲染富文本, `CodeContent` 渲染代码。

对于详情视图，如果是富文本或者代码，分别设置 `mode` 为 `code`、`text`，通过 `detailContent` 设置显示内容，即可通过内置的代码显示组件， 富文本编辑器进行显示，如果想要自定义详情视图的展示，则通过 `detail-content` 作用域插槽自行处理；迁移代码也可继续使用 `renderDetailContent` callback prop。

<DemoBlock id="zh-CN-ai-sidebar-9" title="侧边信息栏" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/sidebar/types.ts`、`packages/ui/src/sidebar/index.ts` 的公开类型为准。

#### Vue 用法

- renderHeader、renderOptionItem、renderMainContent、renderDetailHeader、renderDetailContent 与各 renderItem 是保留的迁移 callback props；Vue 代码优先使用对应插槽。
- `containerRef`、MCP filter、SidebarImageUploadOptions.getUploadImageSrc 与 SidebarAnnotationItem.onClick 是真实 callback props，不是组件事件。
- Sidebar 提供 Container、CodeContent、CodeItem、FileContent、FileItem 静态成员；Annotation 提供 AnnotationContent 静态成员，MCPConfigure 作为具名组件导出。

#### Vue 实例方法

**SidebarContainerExposed**

| 方法                  | 签名                            | 说明         |
| --------------------- | ------------------------------- | ------------ |
| `getContainerElement` | () =&gt; HTMLDivElement \| null | 获取容器元素 |

#### Vue 事件

**Sidebar.Container**

| 事件                 | 参数                                 | 说明                  |
| -------------------- | ------------------------------------ | --------------------- |
| cancel               | [event: MouseEvent \| KeyboardEvent] | 点击关闭或按下 Escape |
| after-visible-change | [visible: boolean]                   | 显隐动画完成          |

**MCPConfigure**

| 事件                 | 参数                                           | 说明                  |
| -------------------- | ---------------------------------------------- | --------------------- |
| cancel               | [event: MouseEvent \| KeyboardEvent]           | 点击关闭或按下 Escape |
| after-visible-change | [visible: boolean]                             | 显隐动画完成          |
| status-change        | [options: SidebarMCPOption[], custom: boolean] | MCP 状态变化          |
| search               | [inputValue: string, custom: boolean]          | 搜索输入变化          |
| add-click            | [event: MouseEvent]                            | 点击新增              |
| configure-click      | [event: MouseEvent, option: SidebarMCPOption]  | 点击配置              |
| edit-click           | [event: MouseEvent, option: SidebarMCPOption]  | 点击编辑              |

**Annotation**

| 事件                 | 参数                                             | 说明                  |
| -------------------- | ------------------------------------------------ | --------------------- |
| cancel               | [event: MouseEvent \| KeyboardEvent]             | 点击关闭或按下 Escape |
| after-visible-change | [visible: boolean]                               | 显隐动画完成          |
| change               | [activeKey: SidebarActiveKey]                    | 展开项变化            |
| click                | [event: MouseEvent, item: SidebarAnnotationItem] | 点击参考来源          |

**Sidebar**

| 事件                 | 参数                                                  | 说明                  |
| -------------------- | ----------------------------------------------------- | --------------------- |
| cancel               | [event: MouseEvent \| KeyboardEvent]                  | 点击关闭或按下 Escape |
| after-visible-change | [visible: boolean]                                    | 显隐动画完成          |
| active-option-change | [event: MouseEvent, activeKey: string]                | 导航项变化            |
| file-content-change  | [content: string]                                     | 详情文件内容变化      |
| back-ward            | [event: MouseEvent, mode: SidebarMode]                | 返回主视图            |
| detail-content-copy  | [event: MouseEvent, content: string, result: boolean] | 复制详情内容          |

**Sidebar.CodeContent**

| 事件   | 参数                                                          | 说明         |
| ------ | ------------------------------------------------------------- | ------------ |
| change | [activeKey: SidebarActiveKey]                                 | 展开项变化   |
| expand | [event: MouseEvent, code: SidebarCodeItemProps, mode: 'code'] | 打开代码详情 |

**Sidebar.FileContent**

| 事件   | 参数                                                          | 说明         |
| ------ | ------------------------------------------------------------- | ------------ |
| change | [activeKey: SidebarActiveKey]                                 | 展开项变化   |
| expand | [event: MouseEvent, file: SidebarFileItemProps, mode: 'file'] | 打开文件详情 |

**Sidebar.FileItem**

| 事件           | 参数              | 说明           |
| -------------- | ----------------- | -------------- |
| content-change | [content: string] | 富文本内容变化 |

#### Vue 插槽

**Sidebar.Container**

| 插槽    | 作用域参数 | 说明           |
| ------- | ---------- | -------------- |
| default | {}         | 容器内容       |
| title   | {}         | 标题内容       |
| header  | {}         | 完整自定义头部 |

**Sidebar**

| 插槽           | 作用域参数                                                          | 说明       |
| -------------- | ------------------------------------------------------------------- | ---------- |
| title          | {}                                                                  | 主视图标题 |
| option         | { option: SidebarOption; onChange(event, activeKey): void }         | 导航项     |
| main-content   | { activeKey?: string }                                              | 主视图内容 |
| detail-header  | { mode: SidebarMode; detailContent: SidebarProps['detailContent'] } | 详情头部   |
| detail-content | { mode: SidebarMode }                                               | 详情内容   |

**Annotation.AnnotationContent**

| 插槽 | 作用域参数                            | 说明       |
| ---- | ------------------------------------- | ---------- |
| item | { annotation: SidebarAnnotationItem } | 参考来源项 |

**MCPConfigureContent**

| 插槽 | 作用域参数                                    | 说明       |
| ---- | --------------------------------------------- | ---------- |
| item | { option: SidebarMCPOption; custom: boolean } | MCP 配置项 |

### Container

| 属性         | 说明                                                    | 类型                                         | 默认值 |
| ------------ | ------------------------------------------------------- | -------------------------------------------- | ------ |
| title        | 标题内容；title 插槽优先                                | VNodeChild                                   | -      |
| visible      | 是否显示侧边栏                                          | boolean                                      | false  |
| motion       | 是否启用显隐动画                                        | boolean                                      | true   |
| minWidth     | 可调整宽度时的最小宽度                                  | string \| number                             | 150    |
| maxWidth     | 可调整宽度时的最大宽度                                  | string \| number                             | -      |
| resizable    | 是否允许调整宽度                                        | boolean                                      | true   |
| defaultSize  | 可调整宽度时的默认尺寸                                  | SidebarSize                                  | -      |
| showClose    | 是否显示关闭按钮                                        | boolean                                      | true   |
| closeOnEsc   | 是否允许按 Escape 请求关闭                              | boolean                                      | false  |
| class        | Vue class 入口                                          | HTMLAttributes['class']                      | —      |
| className    | 兼容 className 入口                                     | HTMLAttributes['class']                      | -      |
| style        | 自定义内联样式                                          | StyleValue                                   | -      |
| renderHeader | 头部渲染 callback prop；header 插槽优先                 | () =&gt; VNodeChild                          | -      |
| containerRef | 容器元素回调 ref；模板 ref 另暴露 getContainerElement() | (element: HTMLDivElement \| null) =&gt; void | -      |

### MCPConfigure

支持 [Container](#Container) 的所有参数

| 属性          | 说明                                                    | 类型                                                                    | 默认值 |
| ------------- | ------------------------------------------------------- | ----------------------------------------------------------------------- | ------ |
| title         | 标题内容；title 插槽优先                                | VNodeChild                                                              | —      |
| visible       | 是否显示侧边栏                                          | boolean                                                                 | false  |
| motion        | 是否启用显隐动画                                        | boolean                                                                 | true   |
| minWidth      | 可调整宽度时的最小宽度                                  | string \| number                                                        | 150    |
| maxWidth      | 可调整宽度时的最大宽度                                  | string \| number                                                        | —      |
| resizable     | 是否允许调整宽度                                        | boolean                                                                 | true   |
| defaultSize   | 可调整宽度时的默认尺寸                                  | SidebarSize                                                             | —      |
| showClose     | 是否显示关闭按钮                                        | boolean                                                                 | true   |
| closeOnEsc    | 是否允许按 Escape 请求关闭                              | boolean                                                                 | false  |
| class         | Vue class 入口                                          | HTMLAttributes['class']                                                 | —      |
| className     | 兼容 className 入口                                     | HTMLAttributes['class']                                                 | -      |
| style         | 自定义内联样式                                          | StyleValue                                                              | -      |
| renderHeader  | 头部渲染 callback prop；header 插槽优先                 | () =&gt; VNodeChild                                                     | —      |
| containerRef  | 容器元素回调 ref；模板 ref 另暴露 getContainerElement() | (element: HTMLDivElement \| null) =&gt; void                            | —      |
| options       | 基础选项列表                                            | SidebarMCPOption[]                                                      | -      |
| customOptions | 自定义选项列表                                          | SidebarMCPOption[]                                                      | -      |
| filter        | 筛选函数，用于根据输入值过滤选项                        | (inputValue: string, option: SidebarMCPOption) =&gt; boolean            | -      |
| placeholder   | 输入框占位提示文字                                      | string                                                                  | 请输入 |
| renderItem    | MCP 项渲染 callback prop；item 插槽优先                 | (props: { option: SidebarMCPOption; custom: boolean }) =&gt; VNodeChild | -      |

#### SidebarMCPOption

| 属性      | 说明                                               | 类型       | 默认值 |
| --------- | -------------------------------------------------- | ---------- | ------ |
| icon      | 图标元素                                           | VNodeChild | -      |
| label     | 标签文本                                           | string     | -      |
| value     | 对应的值                                           | string     | -      |
| desc      | 描述内容                                           | VNodeChild | -      |
| active    | 是否处于激活状态                                   | boolean    | false  |
| disabled  | 是否禁用，为 true 时用户无法更改配置的激活与否状态 | boolean    | false  |
| configure | 是否显示配置相关操作/标识                          | boolean    | false  |

### Annotation

支持 [Container](#Container) 的所有参数

| 属性         | 说明                                                    | 类型                                                 | 默认值 |
| ------------ | ------------------------------------------------------- | ---------------------------------------------------- | ------ |
| title        | 标题内容；title 插槽优先                                | VNodeChild                                           | —      |
| visible      | 是否显示侧边栏                                          | boolean                                              | false  |
| motion       | 是否启用显隐动画                                        | boolean                                              | true   |
| minWidth     | 可调整宽度时的最小宽度                                  | string \| number                                     | 150    |
| maxWidth     | 可调整宽度时的最大宽度                                  | string \| number                                     | —      |
| resizable    | 是否允许调整宽度                                        | boolean                                              | true   |
| defaultSize  | 可调整宽度时的默认尺寸                                  | SidebarSize                                          | —      |
| showClose    | 是否显示关闭按钮                                        | boolean                                              | true   |
| closeOnEsc   | 是否允许按 Escape 请求关闭                              | boolean                                              | false  |
| class        | Vue class 入口                                          | HTMLAttributes['class']                              | —      |
| className    | 兼容 className 入口                                     | HTMLAttributes['class']                              | -      |
| style        | 自定义内联样式                                          | StyleValue                                           | -      |
| renderHeader | 头部渲染 callback prop；header 插槽优先                 | () =&gt; VNodeChild                                  | —      |
| containerRef | 容器元素回调 ref；模板 ref 另暴露 getContainerElement() | (element: HTMLDivElement \| null) =&gt; void         | —      |
| info         | 注解信息列表，包含头部、键值、参考来源详情等内容        | SidebarAnnotationGroup[]                             | -      |
| renderItem   | 参考来源渲染 callback prop；item 插槽优先               | (annotation: SidebarAnnotationItem) =&gt; VNodeChild | -      |

#### AnnotationItem

| 属性     | 说明                                                      | 类型                                                        | 默认值 |
| -------- | --------------------------------------------------------- | ----------------------------------------------------------- | ------ |
| type     | 内容类型                                                  | 'video' \| 'text'                                           | -      |
| title    | 内容标题                                                  | string                                                      | -      |
| url      | 资源链接，点击参考来源将跳转此地址                        | string                                                      | -      |
| detail   | 内容详情/补充说明（如视频简介、文本备注等）               | string                                                      | -      |
| logo     | 站点/内容所属平台的 logo 图片地址                         | string                                                      | -      |
| siteName | 内容所属的站点/平台名称                                   | string                                                      | -      |
| order    | 引用序号（用于内容排序/标注序号展示）                     | number                                                      | -      |
| img      | 图片地址（如视频封面图、文本配图地址）                    | string                                                      | -      |
| duration | 时长（通常为视频时长，单位：秒）                          | number                                                      | -      |
| onClick  | 数据项点击 callback；未提供 Annotation click 监听器时使用 | (event: MouseEvent, item: SidebarAnnotationItem) =&gt; void | -      |

### Sidebar

| 属性                | 说明                                                    | 类型                                                                                                     | 默认值 |
| ------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------ |
| title               | 标题内容；title 插槽优先                                | VNodeChild                                                                                               | —      |
| visible             | 是否显示侧边栏                                          | boolean                                                                                                  | false  |
| motion              | 是否启用显隐动画                                        | boolean                                                                                                  | true   |
| minWidth            | 可调整宽度时的最小宽度                                  | string \| number                                                                                         | 150    |
| maxWidth            | 可调整宽度时的最大宽度                                  | string \| number                                                                                         | —      |
| resizable           | 是否允许调整宽度                                        | boolean                                                                                                  | true   |
| defaultSize         | 可调整宽度时的默认尺寸                                  | SidebarSize                                                                                              | —      |
| showClose           | 是否显示关闭按钮                                        | boolean                                                                                                  | true   |
| closeOnEsc          | 是否允许按 Escape 请求关闭                              | boolean                                                                                                  | false  |
| class               | Vue class 入口                                          | HTMLAttributes['class']                                                                                  | —      |
| className           | 兼容 className 入口                                     | HTMLAttributes['class']                                                                                  | -      |
| style               | 自定义内联样式                                          | StyleValue                                                                                               | -      |
| renderHeader        | 头部渲染 callback prop；header 插槽优先                 | () =&gt; VNodeChild                                                                                      | —      |
| containerRef        | 容器元素回调 ref；模板 ref 另暴露 getContainerElement() | (element: HTMLDivElement \| null) =&gt; void                                                             | —      |
| mode                | 主视图、代码、文件或自定义详情模式                      | SidebarMode                                                                                              | `main` |
| activeKey           | 当前导航项                                              | string                                                                                                   | —      |
| options             | 主视图导航项                                            | SidebarOption[]                                                                                          | —      |
| detailContent       | 内置 code/file 详情数据                                 | SidebarCodeItemProps \| SidebarFileItemProps \| Record&lt;string, unknown&gt;                            | —      |
| fileEditable        | 文件详情是否可编辑                                      | boolean                                                                                                  | true   |
| imgUploadProps      | 文件详情中的图片上传配置                                | SidebarImageUploadOptions                                                                                | -      |
| renderOptionItem    | 导航项渲染 callback prop；option 插槽优先               | ( option: SidebarOption, onChange: (event: MouseEvent, activeKey: string) =&gt; void, ) =&gt; VNodeChild | —      |
| renderMainContent   | 主内容渲染 callback prop；main-content 插槽优先         | (activeKey?: string) =&gt; VNodeChild                                                                    | -      |
| renderDetailHeader  | 详情头渲染 callback prop；detail-header 插槽优先        | ( mode: SidebarMode, detailContent: SidebarProps['detailContent'], ) =&gt; VNodeChild                    | —      |
| renderDetailContent | 详情区渲染 callback prop；detail-content 插槽优先       | (mode: SidebarMode) =&gt; VNodeChild                                                                     | -      |

### Code

| 属性      | 说明                                                         | 类型                    | 默认值 |
| --------- | ------------------------------------------------------------ | ----------------------- | ------ |
| activeKey | 当前激活项的标识，支持单个字符串（单选）或字符串数组（多选） | SidebarActiveKey        | -      |
| class     | Vue class 入口                                               | HTMLAttributes['class'] | —      |
| className | 自定义类名，用于覆盖组件样式                                 | HTMLAttributes['class'] | -      |
| style     | 自定义内联样式                                               | StyleValue              | -      |
| codes     | 代码详情列表                                                 | SidebarCodeItemProps[]  | -      |

#### CodeItemProps

| 属性               | 说明                     | 类型               | 默认值 |
| ------------------ | ------------------------ | ------------------ | ------ |
| name               | 展示名称                 | string             | —      |
| key                | 唯一标识                 | string             | —      |
| isJson             | 是否使用 JsonViewer 展示 | boolean            | -      |
| language           | 代码语言                 | string             | -      |
| content            | 代码或 JSON 内容         | string             | -      |
| jsonViewerProps    | JsonViewer 配置          | JsonViewerProps    | -      |
| codeHighlightProps | CodeHighlight 配置       | CodeHighlightProps | —      |

### File

#### FileContent

| 属性      | 说明                                                         | 类型                    | 默认值 |
| --------- | ------------------------------------------------------------ | ----------------------- | ------ |
| activeKey | 当前激活项的标识，支持单个字符串（单选）或字符串数组（多选） | SidebarActiveKey        | -      |
| class     | Vue class 入口                                               | HTMLAttributes['class'] | —      |
| className | 自定义类名，用于覆盖组件样式                                 | HTMLAttributes['class'] | -      |
| style     | 自定义内联样式，用于调整组件样式                             | StyleValue              | -      |
| files     | 文件信息列表                                                 | SidebarFileItemProps[]  | -      |

#### FileItemProps

| 属性           | 说明                   | 类型                      | 默认值 |
| -------------- | ---------------------- | ------------------------- | ------ |
| key            | 唯一标识               | string                    | -      |
| class          | Vue class 入口         | HTMLAttributes['class']   | —      |
| className      | 自定义类名             | HTMLAttributes['class']   | -      |
| name           | 展示名称               | string                    | —      |
| style          | 自定义内联样式         | StyleValue                | —      |
| editable       | 是否允许编辑           | boolean                   | true   |
| content        | 富文本 HTML 内容       | string                    | -      |
| extensions     | 附加 Tiptap extensions | Extensions                | -      |
| imgUploadProps | 富文本图片上传配置     | SidebarImageUploadOptions | -      |
