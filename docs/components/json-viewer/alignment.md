# JsonViewer v2.102.0 对齐矩阵

## 固定证据

- React Adapter：`vendor/semi-design/packages/semi-ui/jsonViewer/index.tsx`
- Foundation：`vendor/semi-design/packages/semi-foundation/jsonViewer/foundation.ts`
- Core：`vendor/semi-design/packages/semi-json-viewer-core/src/`
- Worker 构建：`vendor/semi-design/packages/semi-json-viewer-core/script/compileLib.js`
- 样式：`vendor/semi-design/packages/semi-foundation/jsonViewer/jsonViewer.scss`
- 中英文文档：`vendor/semi-design/content/plus/jsonviewer/`
- 行为证据：`vendor/semi-design/cypress/e2e/jsonViewer.spec.js` 与 `_story/`

固定基线为 Semi Design `v2.102.0`（`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`）。

## 组件边界

- `JsonViewer.vue`：公开 props/emits/expose、core 生命周期、尺寸变化重排和自定义 VNode 挂载。
- `JsonViewerSearchControls.vue`：查找、匹配选项、导航、替换以及输入法组合态。
- 私有 Worker manager：保持上游请求协议，以 Vite `?worker&inline` 生成 Blob Worker，并在销毁时终止。

## 公开 API

| React v2.102.0                          | Vue 映射                                                                                           | 默认值与门禁                                            |
| --------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `value: string`                         | 同名 prop；编辑器仍为非受控，prop 改变时按上游销毁并重建                                           | `''`；验证输入编辑和 `change` 事件                      |
| `width`, `height`                       | `number \| string`，数字转为 CSS px                                                                | 各 `400`；验证根节点与编辑器几何                        |
| `showSearch`                            | 同名 Boolean prop                                                                                  | `true`；覆盖缺省、显式 `false`、显式 `true`             |
| `className`, `style`, data attrs        | `class`/`className`、`style` 与 attrs 合并到根节点                                                 | 验证透传且不落到内部编辑器                              |
| `options`                               | `JsonViewerOptions` 自包含 Vue 类型                                                                | `readOnly: false, autoWrap: true`；options 深变化后重建 |
| `limitSearchButtonBounds`               | 同名 prop，传给 `DragMove.constrainer='parent'`                                                    | `false`；验证拖拽边界和拖后不误触                       |
| `renderSearchButton(default, controls)` | 同名函数，返回 `VNodeChild`；另提供 `#searchButton` scoped slot                                    | 验证默认节点、控制方法和显隐态                          |
| `renderTooltip`                         | 同名函数保留类型                                                                                   | 固定 Foundation 未订阅 `hoverNode`，见 deviation        |
| `onChange`                              | `change(value)` 与 `update:value(value)` emit，支持 `v-model:value`                                | 内容改变后、重新搜索前触发                              |
| ref methods                             | `defineExpose`：`getValue/format/search/getSearchResults/prevSearch/nextSearch/replace/replaceAll` | 真实 Worker 下逐项行为验证                              |

`SearchControls` 保持 `showSearchBar`、`onToggleSearchBar`、`onSearch`、`onPrevSearch`、`onNextSearch`、`onReplace`、`onReplaceAll`。自定义 token 的 `render` 可返回 Vue `VNodeChild` 或原生 `HTMLElement`；VNode 由 Vue renderer 挂入 core 提供的占位元素并在重排/卸载时清理。

## 状态与事件顺序

- 初始状态：搜索栏关闭；大小写、正则、全词匹配均为 `false`。
- 打开/关闭搜索栏时同步重置三项搜索选项；关闭不销毁编辑器。
- 搜索输入在非 composition 阶段即时搜索；composition end 后搜索并恢复输入焦点。
- 切换搜索选项先更新状态，再用当前输入重新搜索。
- 内容改变顺序：core 更新 model → `change` / `update:value` emit → 若搜索栏打开则用当前文本重新搜索。
- `readOnly` 时 `replace/replaceAll` 无操作，按钮为 disabled。
- `value` 或 options 深变化：dispose 旧 core/Worker → 清理自定义渲染 → 创建新 core → 重新连接 ResizeObserver。

## DOM / class / 样式

- 根节点仅承载调用方 class/style/data attrs，并固定 `position: relative` 与尺寸。
- 内层 editor 保持 `.semi-json-viewer.semi-json-viewer-background` 及相同尺寸。
- core 保留 `.json-viewer-container`、`.semi-json-viewer-content-container`、`.lines-content`、`.line-scroll-container`、token/line-number/fold/error/completion class。
- 搜索 UI 保留 `.semi-json-viewer-search-bar-trigger`、`-search-bar-container`、`-search-bar`、`-replace-bar`、`-search-options*`。
- 默认主题直接编译固定 `jsonViewer.scss`，逐组件入口为 `json-viewer.css`；light/dark 逐项比较 token computed style。

## 键盘、焦点与 ARIA

- 可编辑 content 容器保留 core 的 `contentEditable`、selection、Enter、Backspace、方向键、undo/redo 和补全键盘逻辑。
- 搜索输入处理 composition，搜索/替换按钮为真实 button；图标按钮补充与本地化文案一致的 `aria-label`。
- 搜索选项为可聚焦 button 语义，`aria-pressed` 表达激活态；这是 Vue 原生可访问映射，不改变上游 class/视觉结构。
- 验证关闭按钮、前后结果、读只替换禁用、编辑区与搜索输入的焦点行为。

## Worker、SSR、清理与响应式

- 上游 `compileLib.js` 会 bundle `json.worker.ts` 并替换 `%WORKER_RAW%`；源码直连会产生无效 Worker。本项目在唯一允许的 Foundation 边界使用 Vite `?worker&inline`，保持消息协议与 Worker 逻辑来自固定 vendor，同时让 tarball 内的 JS 产物自包含。
- 模块导入不得访问 `window/document/Worker`；core 只在 `onMounted` 创建，因此 SSR import/render 安全。
- `dispose()` 必须 terminate Worker、清空 callback、移除 core DOM/事件 emitter；卸载与 prop 重建均验证。
- `autoWrap=true` 时观察 editor 宽度；变化小于 `0.5px` 忽略，RAF 合并 layout，卸载/关闭时 disconnect/cancel。

## 主题、RTL、国际化与视觉矩阵

- 桌面 `1440x900` DPR 1：light/dark，默认可编辑、搜索打开/匹配、readOnly 自定义渲染。
- 移动 `390x844` DPR 1：固定窄宽 autoWrap 与搜索面板。
- RTL：根场景注入 direction，验证 token、行号、搜索面板与交互不发生未记录漂移；core 固定内联 left/right 结构保持上游结果。
- zh-CN/en-US：使用 LocaleProvider 的 `JsonViewer.search/replace/replaceAll`；验证文案和搜索行为。
- React/Vue 同一 BrowserContext 比较 runtime error、Worker 请求来源、computed style、bounding rect 与组件裁剪截图。

## 发布与门禁

- 根导出与 `@aifuxi/semi-ui-vue/json-viewer` 子路径导出；声明不得出现 `vendor/**`、`@workspace/**` 或 `@douyinfe/**`。
- 主题根入口和 `@aifuxi/semi-theme-default/json-viewer.css` 均包含 JsonViewer 样式。
- 真实 tarball 消费验证根/子路径导入、类型、SSR import、Worker 内联（无额外 vendor/worker 文件请求）、编辑/搜索 API 与许可证/SBOM。
- 定向单测覆盖公开 DOM、emits、expose、Boolean 三态、composition、readOnly、custom render、resize/清理；Chromium 覆盖真实 Worker、编辑、折叠、搜索/替换、主题、移动、RTL 与 i18n。

## Deviation

### `renderTooltip` 为基线兼容 no-op

固定 React Adapter 把 `renderTooltip` 放入 `notifyHover`，但固定 Foundation 的 `init()` 只订阅 `customRender` 和 `contentChanged`，没有订阅 core 的 `hoverNode`，因此该回调在 v2.102.0 实际不会触发。Vue 保留同名公开类型且不额外接通，避免超出固定基线；用户影响与上游一致。如未来基线升级接通该事件，必须重新建立行为与 Portal/清理门禁。
