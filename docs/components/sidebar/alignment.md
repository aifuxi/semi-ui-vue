# Sidebar v2.102.0 对齐矩阵

## 固定源码证据

- React Adapter：`vendor/semi-design/packages/semi-ui/sideBar/`，覆盖主 Sidebar、Container、Annotation、MCPConfigure、Code/File widgets 与 ImageUploadNode。
- Foundation：`vendor/semi-design/packages/semi-foundation/sidebar/`，覆盖 Container 显隐/Escape、MCP 搜索与状态切换、常量和 SCSS。
- 主题：`vendor/semi-design/packages/semi-theme-default/scss/` 与 Sidebar Foundation 的 `variables.scss`、`animation.scss`、`sidebar.scss`。
- 文档：`vendor/semi-design/content/ai/sidebar/index.md` 与 `index-en-US.md`。
- 固定版本：Semi Design `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 组件边界

- `SidebarContainer`：只负责显隐、滑入/滑出终态、可调整宽度、标题/关闭按钮和全局 Escape 监听。
- `Sidebar`：只负责主/详情模式编排、选项导航、详情头部、复制与 Code/File detail 分发。
- `SidebarAnnotation` / `SidebarAnnotationContent`：只负责引用分组、文本/视频引用项和 Collapse 交互。
- `SidebarMCPConfigure` / `SidebarMCPConfigureContent`：只负责内置/自定义 MCP 选项、搜索、启停和配置动作。
- `SidebarCodeContent` / `SidebarCodeItem`：只负责代码/JSON 预览与展开动作。
- `SidebarFileContent` / `SidebarFileItem`：只负责富文本预览/编辑与展开动作；编辑器复用项目已锁定的 Tiptap Vue 运行时。

## API 与 Vue 映射

| 上游能力                                  | v2.102.0 默认值/行为                                                                          | Vue 公开契约                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Container `visible`                       | 未提供时不渲染；motion leave 结束后移除 DOM                                                   | `visible?: boolean`；`afterVisibleChange` 映射为 `after-visible-change` emit |
| `motion` / `resizable` / `showClose`      | 均默认为 `true`                                                                               | 保留同名 Boolean props；测试缺省、显式 `false`、显式 `true`                  |
| `minWidth` / `maxWidth` / `defaultSize`   | `minWidth=150`，只在 resizable 时使用                                                         | 同名 props，数字转为 CSS px；复用已完成 Resizable                            |
| `renderHeader` / `title` / children       | render prop / ReactNode                                                                       | `#header` / `#title` / 默认 slot；同名函数 prop 作为迁移兼容备选             |
| Sidebar `mode` / `fileEditable`           | `main` / `true`                                                                               | 同名 props；`fileEditable` 三态门禁                                          |
| `renderMainContent(activeKey)`            | 主视图内容                                                                                    | `#main-content="{ activeKey }"`，同名函数 prop兼容                           |
| `renderDetailHeader(mode, detailContent)` | truthy 时替代默认详情头                                                                       | `#detail-header`，同名函数 prop兼容                                          |
| `renderDetailContent(mode)`               | truthy 时替代内置 code/file                                                                   | `#detail-content`，同名函数 prop兼容                                         |
| Options `renderOptionItem`                | 自定义每个 option                                                                             | `#option="{ option, onChange }"`                                             |
| Annotation `renderItem`                   | 自定义引用项                                                                                  | `#item="{ annotation }"`                                                     |
| MCP `renderItem`                          | 自定义 MCP 行                                                                                 | `#item="{ option, custom }"`                                                 |
| React callbacks                           | MouseEvent + payload                                                                          | kebab-case emits；保留原事件顺序与 payload                                   |
| Compound members                          | `Sidebar.Container/FileContent/CodeContent/FileItem/CodeItem`，`Annotation.AnnotationContent` | 根导出、`./sidebar` 子路径与同名 compound 静态成员                           |

## 状态、事件与受控语义

- Container 从 `visible=false` 到 `true` 时先挂载再进入；从 `true` 到 `false` 时 motion 开启则保留到动画结束，motion 关闭则立即移除；完成时触发 `afterVisibleChange(visible)`。
- Container 可见期间监听 `window.keydown`；只有显式 `closeOnEsc=true` 且 Escape 时触发 `cancel`，隐藏或卸载必须清理。
- MCP mode 初始为 `inner`；输入值保留，切换 mode 后重新筛选对应 options；默认筛选对 label/desc 做小写包含匹配，自定义 filter 收到小写输入。
- MCP status 切换不修改调用方数组，克隆对应数组并发出 `(newOptions, custom)`；disabled 不触发；configure/edit/add 保持点击事件在前、payload 在后。
- Collapse 的 `activeKey` 沿用受控语义；Code/File/Annotation 只转发公开 `change`，不读取内部 Foundation state。
- Sidebar 详情默认 close 触发 `back-ward(event, 'main')`；copy 先尝试剪贴板，再触发 `detail-content-copy(event, content, result)`，成功提示挂在当前 Sidebar 容器内。
- FileItem `editable` 缺省为 true；编辑更新发出 HTML 字符串；只读模式不渲染工具栏。

## DOM / class / 样式

- 保留 `.semi-sidebar-container`、`-header`、`-content`、`.semi-sidebar-main/detail`、`.semi-sidebar-options`、`.semi-sidebar-collapse*`、`.semi-sidebar-file*`、`.semi-sidebar-annotation*` 与 `.semi-sidebar-mcp-configure-content*`。
- 主模式结构：Container → header → content → `main-content-wrapper` → options + `main-content`。
- 详情模式结构：Container → detail header → code/file/custom content；CodeItem/JsonViewer 高度为 100%。
- Foundation 主题编译顺序：全局 token/mixin → Sidebar `sidebar.scss`（其内部引入 variables 与 animation）。根主题和 `sidebar.css` 子入口都必须产出。
- 桌面与移动场景固定 DPR 1；检查 light/dark、RTL、关键 computed style 与 geometry（每轴差不超过 0.5 CSS px），截图阈值沿用仓库上限。

## 键盘、焦点、ARIA、动效

- 默认关闭按钮使用现有 Button，保留 `aria-label="close"`；详情返回与复制按钮增加本地化 aria-label，点击顺序与 React 对齐。
- Container 本身不创建 focus trap；交互按钮沿用 Button 的键盘/焦点行为。
- `closeOnEsc` 只在 visible 期间生效，Escape 需要 `stopPropagation()`；隐藏和卸载后不得继续响应。
- 动效名称/时长/曲线来自固定 `animation.scss`；断言 enter/leave class 和终态，不比较不同中间帧。
- Annotation item 固定源码使用 clickable div 且无键盘 role，这是上游可访问性缺口；Vue 保留 class/点击/链接行为，同时使用 `button` 语义会改变 DOM，故此切片保持 div 并在 deviation 中记录。

## 国际化、RTL、SSR

- 文案从现有 `LocaleProvider` 的 Sidebar locale 读取：MCP 标题/搜索/空态/计数、复制成功、链接操作等；缺省继承 zh_CN。
- 固定 SCSS 未提供 Sidebar 专用 RTL 翻转；场景仍在 `dir=rtl` 下验证排版、文本和交互，不擅自翻转右侧滑入方向。
- SSR import 不访问 window/document/navigator/clipboard；keydown、ResizeObserver、Tiptap 编辑器和复制只在客户端生命周期/事件中创建。
- SSR render：visible=false 不输出容器；visible=true 输出稳定 Container/主内容；FileItem 在 SSR 输出外壳与内容降级，不实例化浏览器编辑器。

## 行为门禁

- `motion`、`resizable`、`showClose`、`fileEditable`：缺省 / 显式 false / 显式 true。
- Container：show/hide、afterVisibleChange、关闭、Escape、卸载清理、无 motion 即时隐藏、resizable wrapper。
- MCP：默认/自定义 mode、300ms 搜索、custom filter、controlled status clone、disabled、configure/edit/add、空态与 Locale。
- Annotation：文本/视频、时长格式、链接打开、item payload、custom item slot、受控 collapse。
- Code/File：JSON/代码路径、展开 payload、HTML 更新、只读工具栏、主/详情模式、copy 成败回调。
- Chromium：desktop/mobile light/dark + RTL；React/Vue computed style、geometry、截图；工作台 smoke。
- 发布：root/subpath runtime、声明、主题子入口、SSR-safe import、tree-shaking、许可证/SBOM 与隔离 tarball consumer。

## Deviation

- Vue 将 React render props 映射为类型化 scoped slots，并保留同名函数 prop 兼容；这是框架原生适配，不改变可表达内容。
- React `containerRef` 映射为 Vue `ref` 暴露的 `getContainerElement()`，并提供 `containerRef` 回调 prop；React RefObject 不原样复刻。
- 上游 Container Foundation 读取未声明/未透传的 `closeOnEsc`，固定文档也没有列出该 prop；Vue 将它作为显式可选 prop 提供并默认 `false`，以保留可验证行为而不改变默认值。
- 上游 Annotation item 为无键盘语义的 clickable div；本切片保持相同 DOM/class/点击行为以满足样式契约，并在文档中提示业务方通过自定义 item slot 提供更强语义。
- Tiptap extension 类型属于框架运行时；Vue 公开 `extensions` 使用 `Extension[]` 的 Vue Tiptap 类型，不能直接接收 React extension/node-view 实例。
