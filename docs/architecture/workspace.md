# pnpm workspace 工程边界

## 目标

本骨架把“参考运行时、Vue 实现、可发布资产和验收证据”分开管理。目录建立本身不代表任何 Semi 组件已经完成复刻。

## 目录职责

```text
apps/
  reference-react/       承载固定 v2.102.0 React 参考场景的工作台
  docs-vue/              Vue 文档、演示与对照场景
packages/
  ui/                    Vue 主组件包（@aifuxi/semi-ui-vue）
  foundation-integration/唯一的 Foundation 运行时集成边界（私有）
  theme-default/         上游 SCSS 编译边界与根 CSS 入口（@aifuxi/semi-theme-default）
  icons/                 稳定图标（@aifuxi/semi-icons-vue）
  icons-lab/             实验图标（@aifuxi/semi-icons-lab-vue）
  illustrations/         插画（@aifuxi/semi-illustrations-vue）
  test-infra/            对照矩阵、阈值和共享测试工具（私有）
tests/browser/           只运行 Playwright 固定 Chromium 的跨应用测试
vendor/semi-design/      唯一、只读的 v2.102.0 参考源码
```

`@workspace/*` 只保留给文档/参考应用、Foundation 集成层和测试基础设施等永不发布的内部包。五个公开包统一使用 `@aifuxi/*` 最终身份和同步版本；公开产物不得残留 workspace 占位名。

## 依赖方向

- `apps/reference-react` 是唯一允许为参考运行读取本地固定上游的应用，后续负责提供真实 React 参考场景。
- `apps/docs-vue` 消费 Vue 侧包并承载文档和可复现演示。
- `packages/ui` 只通过 `packages/foundation-integration` 适配 Foundation 逻辑；不能在组件目录中散落导入 Foundation 源码。
- `packages/theme-default` 直接从只读上游 SCSS 编译样式；`packages/icons*` 与 `packages/illustrations` 各自通过生成脚本从固定上游 TSX AST 生成 Vue 资产，并由漂移检查锁定公开面。
- `packages/theme-default/src/index.scss` 只作为仓库内构建入口；发布文件只包含编译后的 CSS，消费者不依赖 submodule。
- 两个对照应用共用 `packages/test-infra/src/harness.css`，避免参考壳层的字体和布局环境发生漂移。
- `packages/foundation-integration` 和 `packages/test-infra` 永不发布；公开包构建后不能留下对它们或 `vendor/` 的运行时引用。
- `vendor/**` 必须始终排除在格式化、lint、类型检查、单测和项目构建扫描之外。

`apps/reference-react` 已建立只读源码解析/构建适配器，并以 Button 公开入口作为首个真实运行场景。Vite 直接编译固定 submodule 的 TSX；Sass 1.54.9 通过应用内构建插件生成虚拟 CSS，避免由 Vite 8 改用新版 Sass。浏览器测试还会核对真实模块请求来自 `vendor/semi-design`，不能只依赖页面中的版本文字。

React/Vue 两端通过 `packages/test-infra` 的共享场景契约接收相同 URL 参数、数据与目标定义。未完成的 Vue 场景保持 `pending`，`assertScenarioComparable` 会阻止其进入样式、几何和截图对照。详细扩展流程见 `docs/testing/react-vue-parity.md`。

Button 是首个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/button/` 提供 Button、ButtonGroup、SplitButtonGroup 根/子路径 ESM 与声明，`packages/theme-default/button.css` 提供逐组件样式。Button 没有运行时 Foundation 状态机；ButtonGroup 的子 VNode 合并和 SplitButtonGroup 的客户端 Observer 分别隔离在组件边界内。对齐矩阵与 React→Vue 迁移见 `docs/components/button/`。

IconButton 是第六十八个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/icon-button/` 通过范围受限的 Composition API render function 将 Vue `icon` slot 直接交给 Button，保留固定 Adapter 的 icon-only、图标位置、分方向去内边距、loading/disabled 与 colorful fill 契约；固定源码没有独立 JavaScript Foundation，`packages/theme-default/icon-button.css` 编译 Button/IconButton 与 Icon 样式。完整矩阵见 `docs/components/icon-button/`。

CodeHighlight 是第六十九个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/code-highlight/` 保留固定 `pre > code` DOM、缺省为真的行号/主题配置、Prism token 与固定的 code-only 更新语义；`packages/foundation-integration/src/code-highlight.js` 隔离固定 CodeHighlight Foundation，`packages/theme-default/code-highlight.css` 编译默认 Token、global 与 CodeHighlight 样式。`prismjs@1.29.0` 与 `classnames@2.5.1` 作为精确锁定的运行时依赖纳入许可、SBOM、SSR 和真实 tarball 验证。完整矩阵见 `docs/components/code-highlight/`。

DragMove 是第七十个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/drag-move/` 通过范围受限的单 VNode renderer 合并调用方 ref，并由 Composition API 生命周期接通 absolute/relative、handler、constrainer、input guard、mouse/touch 与 customMove；`packages/foundation-integration/src/drag-move.js` 隔离固定 DragMove Foundation。固定源码没有专属 SCSS，`packages/theme-default/drag-move.css` 只编译默认 Token 与 global 暗色模式，不伪造组件选择器。完整矩阵见 `docs/components/drag-move/`。

Divider 是第二个进入 `ready` 的垂直切片：`packages/ui/src/divider/` 提供根/`divider` 子路径 ESM 与声明，`packages/theme-default/divider.css` 提供逐组件样式。它没有运行时 Foundation 状态机；纯文本与自定义 VNode 的 slot DOM 分支隔离在内容 renderer 中。完整矩阵见 `docs/components/divider/`。

Icon 是第三个进入 `ready` 的横向基础设施切片：`packages/icons` 提供 Icon 基座、`convertIcon` 与稳定版 523 个图标，`packages/icons-lab` 独立提供 Lab 84 个图标，`packages/ui/src/icon/` 只转发稳定版基座。两套图标均从固定 submodule 的 TSX AST 生成 Vue `h()` 源码并由 `check:icons` 阻止漂移；`packages/theme-default/icon.css` 提供逐组件样式。完整矩阵与 React→Vue 迁移见 `docs/components/icon/`。

Illustrations 是进入 `ready` 的横向资产切片：`packages/illustrations` 提供 `convertIllustration`、固定 v2.102.0 的全部 16 个 light/dark Vue 插画，以及根入口、工厂入口和逐插画 ESM/声明子路径。源码由 `scripts/generate-illustrations.mjs` 从只读上游 TSX AST 生成，`check:illustrations` 阻止公开导出、SVG 属性和生成文件漂移；桌面/移动、light/dark 的 React/Vue 逐插画与全画廊 PNG 已直接字节一致。完整矩阵与 React→Vue 迁移见 `docs/assets/illustrations/`。

Space 是第四个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/space/` 提供根/`space` 子路径 ESM 与声明，`packages/theme-default/space.css` 提供逐组件样式。组件保持固定 Adapter 的 flex DOM、预设/数字/数组 gap、vertical、wrap 和 RTL 契约，不需要 Foundation 运行时实例。完整矩阵见 `docs/components/space/`。

FloatButton 是第五个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/float-button/` 同时提供 FloatButton 与 FloatButtonGroup，并在内部复现其公开 `badge` 配置所需 DOM；`packages/theme-default/float-button.css` 独立包含 FloatButton、Badge 与 Icon 样式。完整矩阵见 `docs/components/float-button/`。

Layout 是第六个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/layout/` 提供 Layout、Header、Content、Footer 与响应式 Sider，使用类型化上下文让 Sider 只注册到最近的嵌套 Layout；`packages/theme-default/layout.css` 提供逐组件样式。完整矩阵见 `docs/components/layout/`。

Grid 是第七个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/grid/` 提供 Row 与 Col，使用类型化上下文传播水平/垂直 Gutter，并在客户端监听固定六断点；`packages/theme-default/grid.css` 提供 24 栅格、Flex、响应式与 RTL 样式。完整矩阵见 `docs/components/grid/`。

Resizable 是第八个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/resizable/` 提供单体八方向缩放与 ResizeGroup、ResizeItem、ResizeHandler，`packages/foundation-integration/src/resizable.js` 是固定单体/组合 Foundation 的唯一运行时入口，公开构建将其内联且不泄漏 vendor 路径；`packages/theme-default/resizable.css` 提供逐组件样式与默认手柄图标。完整矩阵见 `docs/components/resizable/`。

Typography 是第九个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/typography/` 提供 Typography、Title、Text、Paragraph 与 Numeral，覆盖装饰嵌套、链接、复制、CSS/JS 截断、展开收起、Tooltip/Popover、尺寸继承和六类数值格式化；`packages/foundation-integration/src/typography.js` 是固定 FormatNumeral 的唯一运行时入口，`packages/theme-default/typography.css` 提供逐组件样式。完整矩阵见 `docs/components/typography/`。

ConfigProvider 是第十个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/config-provider/` 提供 ConfigProvider、ConfigConsumer、实例隔离的类型化上下文、懒注册断点观察和 semiGlobal 单例，并将 Typography locale 接入统一配置；`packages/theme-default/config-provider.css` 保留固定主题 Token/global，而上游没有 ConfigProvider 专属 Foundation SCSS。完整矩阵见 `docs/components/config-provider/`。

Switch 是第十一个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/switch/` 提供受控/非受控与原生 `v-model`、固定 checkbox/ARIA DOM、三尺寸、文本、disabled/loading 和 focus-visible；`packages/foundation-integration/src/switch.js` 是固定 Switch Foundation 的唯一运行时入口，`packages/theme-default/switch.css` 包含 Switch 与内部 loading Spin 样式。完整矩阵见 `docs/components/switch/`。

Tooltip 是第十二个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/tooltip/` 提供五种 trigger、16 个 placement、Teleport Portal、默认/自定义箭头、受控 `v-model:visible`、延迟、outside/Escape、焦点守卫与 SSR-safe trigger；`packages/foundation-integration/src/tooltip.js` 是固定 Tooltip Foundation 的唯一运行时入口，`packages/theme-default/tooltip.css` 包含主题、Portal、箭头、动效和 RTL 样式。完整矩阵见 `docs/components/tooltip/`。

Select 是第十三个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/select/` 提供单选、多选、搜索、创建、分组、虚拟列表、标签折叠、键盘/焦点与 Portal，`packages/foundation-integration/src/select.js` 是固定 Select Foundation 的唯一运行时入口，`packages/theme-default/select.css` 包含 trigger、Input、Tag、Spin、Popover、候选项和 RTL 样式。完整矩阵见 `docs/components/select/`。

AutoComplete 是第十四个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/auto-complete/` 提供受控/非受控输入、动态候选、对象数据、自定义候选、键盘/焦点与 Portal，`packages/foundation-integration/src/auto-complete.js` 是固定 AutoComplete Foundation 的唯一运行时入口，`packages/theme-default/auto-complete.css` 包含 Input、Spin、Popover、候选项、动效和 RTL 样式。完整矩阵见 `docs/components/auto-complete/`。

Checkbox 是第十五个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/checkbox/` 提供 Checkbox、CheckboxGroup、原生 `v-model`、受控/非受控状态、字符串与对象 options、键盘/focus-visible、ARIA 和 RTL；`packages/foundation-integration/src/checkbox.js` 是固定 Checkbox 与 CheckboxGroup Foundation 的唯一运行时入口，`packages/theme-default/checkbox.css` 包含 Checkbox、Card、PureCard、Addon、Extra、禁用/悬浮/选中状态和 RTL 样式。完整矩阵见 `docs/components/checkbox/`。

Input 是第十六个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/input/` 提供 Input、InputGroup 与 TextArea，覆盖受控/非受控与 `v-model`、前后缀/附加项、清除、密码键盘、IME、自定义长度、Group VNode 回退、计数、autosize、native resize、行号、ARIA 与 RTL；`packages/foundation-integration/src/input.js` 是固定 Input/TextArea Foundation 的唯一运行时入口，`packages/theme-default/input.css` 包含 Input、TextArea、Group Label 与 Icon 样式。完整矩阵见 `docs/components/input/`。

InputNumber 是第十七个进入 `ready` 的 Vue 垂直切片，PinCode 是第十八个；两者分别覆盖数字格式/步进与分格验证码输入，完整矩阵见 `docs/components/input-number/` 和 `docs/components/pin-code/`。

Radio 是第十九个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/radio/` 提供 Radio、RadioGroup、原生 `v-model`、字符串/对象 options、普通/advanced、button/card/pureCard、焦点、ARIA 与 RTL；`packages/foundation-integration/src/radio.js` 是固定 Radio、RadioInner 与 RadioGroup Foundation 的唯一运行时入口，`packages/theme-default/radio.css` 包含 Radio 与 IconRadio 样式。完整矩阵见 `docs/components/radio/`。

Rating、Slider 与 TagInput 分别是第二十至第二十二个进入 `ready` 的 Vue 垂直切片。TagInput 在 `packages/ui/src/tag-input/` 提供受控/非受控标签与输入、批量分隔、限制、清空、折叠 Popover、自定义标签 slot、原生拖放排序、键盘/焦点、ARIA 与 RTL；`packages/foundation-integration/src/tag-input.js` 是固定 TagInput Foundation 的唯一运行时入口，`packages/theme-default/tag-input.css` 包含 Input、Tag、Typography、Popover、Tooltip、Portal 和 Icon 样式。完整矩阵见 `docs/components/tag-input/`。

TimePicker 是第二十三个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/time-picker/` 提供单值/范围、12 小时制、格式与时区、步长与禁用项、受控/非受控 value/open、自定义 panel/trigger slot、键盘/焦点、ARIA、Portal 与 RTL；`packages/foundation-integration/src/time-picker.js` 是固定 TimePicker/Input/Combobox Foundation 的唯一运行时入口，`packages/theme-default/time-picker.css` 包含 Input、Popover、Tooltip、Portal、ScrollList 与 Icon 样式。完整矩阵见 `docs/components/time-picker/`。

Anchor 是第二十四个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/anchor/` 提供嵌套锚点、滚动激活、点击定位、自动折叠、Tooltip、键盘/焦点、ARIA 与 RTL；`packages/foundation-integration/src/anchor.js` 是固定 Anchor/Link Foundation 的唯一运行时入口，`packages/theme-default/anchor.css` 包含 Anchor、Typography、Tooltip、Popover 与 Portal 样式。完整矩阵见 `docs/components/anchor/`。

BackTop 是第二十五个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/back-top/` 提供 Window/Element 滚动阈值、Foundation 回顶动画、节流点击、默认 IconButton 与自定义 slot；`packages/foundation-integration/src/back-top.js` 是固定 BackTop Foundation 的唯一运行时入口，`packages/theme-default/back-top.css` 包含 BackTop、Button/IconButton、Icon 与 RTL 样式。完整矩阵见 `docs/components/back-top/`。

Breadcrumb 是第二十六个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/breadcrumb/` 提供 routes/Item、活跃项、折叠与内置 Popover，保留链接、图标、Tooltip 省略、事件顺序、键盘、ARIA 和 RTL；`packages/foundation-integration/src/breadcrumb.js` 是固定 Breadcrumb/BreadcrumbItem Foundation 的唯一运行时入口，`packages/theme-default/breadcrumb.css` 包含 Breadcrumb、Typography、Tooltip、Popover、Portal 与 Icon 样式。完整矩阵见 `docs/components/breadcrumb/`。

Pagination 是第二十七个、Steps 是第二十八个进入 `ready` 的 Vue 垂直切片，分别在 `packages/ui/src/pagination/` 与 `packages/ui/src/steps/` 提供分页输入/选择、四类步骤条、键盘/ARIA、RTL 和完整主题入口；对齐矩阵见 `docs/components/pagination/` 与 `docs/components/steps/`。

Tabs 是第二十九个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/tabs/` 提供 Tabs、TabPane、TabItem、四种类型、横/竖布局、受控/非受控状态、More/可收起 OverflowList、Dropdown Portal、键盘/焦点、ARIA、动效与 RTL；`packages/foundation-integration/src/tabs.js` 是固定 Tabs Foundation 的唯一运行时入口，`packages/theme-default/tabs.css` 包含 Tabs、Button、OverflowList、Dropdown、Portal 与 Icon 样式。完整矩阵见 `docs/components/tabs/`。

Tree 是第三十个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/tree/` 提供单选/多选、搜索、受控展开、异步加载、拖拽、虚拟滚动、目录/连接线、键盘、ARIA 与 RTL；`packages/foundation-integration/src/tree.js` 是固定 Tree Foundation 与数据工具的唯一运行时入口，`packages/theme-default/tree.css` 包含 Tree、Input、Checkbox、Spin、Highlight 与 Icon 样式。完整矩阵见 `docs/components/tree/`。

Badge 是第三十一个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/badge/` 提供计数、圆点、溢出、自定义内容、四角定位、方向缺省与根/`badge` 子路径 ESM 和声明；固定源码没有 JavaScript Foundation，`packages/theme-default/badge.css` 提供逐组件样式。完整矩阵见 `docs/components/badge/`。

SideSheet 是第四十七个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/side-sheet/` 提供四向滑动、受控/非受控可见性、mask/close/Escape、稳定自定义 Portal、body scroll、keepDOM、动效、SSR 与 RTL；`packages/foundation-integration/src/side-sheet.js` 是固定 SideSheet Foundation 的唯一运行时入口，`packages/theme-default/side-sheet.css` 包含 Portal、Button/IconButton、Icon 与 SideSheet 样式。完整矩阵见 `docs/components/side-sheet/`。

Table 是第四十八个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/table/` 提供 columns/`Table.Column`、排序过滤、分页、选择、展开树与分组、横纵滚动、固定列、resize、虚拟列表和可替换 DOM 组件，根/`table` 子路径同时发布 ESM 与声明；`packages/foundation-integration/src/table.js` 只暴露固定 Table 常量，`packages/theme-default/table.css` 编译 Table 及公开依赖样式。完整矩阵见 `docs/components/table/`。

Tag 是第四十九个、Timeline 是第五十个进入 `ready` 的 Vue 垂直切片。Timeline 在 `packages/ui/src/timeline/` 提供 Timeline、TimelineItem、四类布局、dataSource/slot、五类节点、自定义 dot/extra/time、点击、ARIA、SSR 与 RTL；固定源码没有 JavaScript Foundation，`packages/theme-default/timeline.css` 编译 Timeline 固定样式。完整矩阵见 `docs/components/tag/` 与 `docs/components/timeline/`。

Banner 是第五十一个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/banner/` 提供四种状态、full/container/bordered 布局、缺省/自定义/隐藏图标与关闭按钮、额外操作、关闭事件顺序、ARIA、SSR 与 RTL；`packages/foundation-integration/src/banner.js` 是固定 Banner Foundation 的唯一运行时入口，`packages/theme-default/banner.css` 编译 Banner、Button、Typography 与 Icon 样式。完整矩阵见 `docs/components/banner/`。

Notification 是第五十二个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/notification/` 提供静态 service、局部 context holder、六个 placement、timer/更新/关闭顺序、ARIA、SSR-safe import 与 RTL；`packages/foundation-integration/src/notification.js` 隔离固定单条/列表 Foundation，`packages/theme-default/notification.css` 编译 Notification、Button/IconButton 与 Icon 样式。完整矩阵见 `docs/components/notification/`。

Popconfirm 是第五十三个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/popconfirm/` 提供受控/非受控显隐、同步/Promise 确认取消、独立 loading、locale、焦点与 Portal/定位/RTL；`packages/foundation-integration/src/popconfirm.js` 隔离固定 Popconfirm Foundation，`packages/theme-default/popconfirm.css` 编译 Popconfirm、Popover、Button、Portal 与 Icon 样式。完整矩阵见 `docs/components/popconfirm/`。

Foundation 集成包已建立 Resizable、Typography、Switch、Tooltip、Select、AutoComplete、Checkbox、Input、Rating、Slider、TagInput、TimePicker、Anchor、BackTop、Breadcrumb、Pagination、Tabs、Table、Banner、Notification 与 Popconfirm 入口，并通过独立 declaration facade 隔离固定上游较旧的 TypeScript 编译设置。Anchor 精确锁定并内联 `scroll-into-view-if-needed@2.2.31`；BackTop 首次接通固定 `semi-animation` 并精确锁定 `bezier-easing@2.1.0`。两项第三方依赖均纳入许可与 SBOM 验证。后续仍必须逐组件处理 `semi-json-viewer-core` Worker、第三方依赖与 SSR 延迟加载；公开类型若引用 Foundation 符号，应由 `ui` 提供自包含 facade，发布声明不得泄漏私有包路径。

单元测试与源码共置在各 workspace 的 `src/` 下；Vue 包使用 `.test.ts` / `.spec.ts`，React 参考应用额外允许 `.test.tsx` / `.spec.tsx`。该约定保证 Vitest 能发现的测试同时纳入对应 workspace 的 TypeScript 检查。

## 固定运行环境

- Node.js 开发版本：`24.18.0`；支持范围：`^20.19.0 || ^22.13.0 || ^24.0.0`。
- pnpm：`11.19.0`，统一 lockfile，依赖精确锁定。
- Vue：`3.5.41`，主包 peer 范围 `>=3.5.0`。
- React 参考运行时：`16.14.0`，与上游固定版本保持一致。
- Sass：主题包独占 `1.54.9`，避免新版 Sass 改变上游旧 SCSS 的编译行为。
- 浏览器：Playwright `1.62.1` 自带的 Chromium；不建立 Firefox/WebKit 项目。
- 首份 CSS 校准截图以 macOS（Darwin）为平台基线。Playwright 保留平台后缀；Linux CI 必须审核并并存自己的基线，不能跨平台盲目更新。

## 新增组件的最小流程

1. 先从 `docs/inventory/semi-v2.102.0.json` 定位公开导出、子路径、Adapter、Foundation、主题、文档、依赖与测试资产，再回到固定上游核对原始源码。
2. 在组件文档目录建立完整对齐矩阵和 React→Vue API 映射。
3. 在两个应用中建立同数据、同字体、同 viewport、同动画时刻的参考场景。
4. 实现 Vue 源码、类型、样式入口、中英文文档和迁移说明。
5. 增加公开行为单测、Chromium 行为/无障碍/视觉测试，以及适用时的 SSR 与 hydration 测试。
6. 构建真实包并检查安装、导入、类型、样式、SSR、许可证与 SBOM，全部证据齐全后才标记完成。

## 当前质量入口

- `pnpm check:vendor`：确认 submodule 的 tag 和 SHA。
- `pnpm check:inventory`：重建并逐字核对固定上游的组件、API、文档、依赖与资产 inventory，防止生成物漂移。
- `pnpm check:boundaries`：阻止 Vue 运行时源码通过静态、动态、require 或样式导入绕过上游边界。
- React 参考应用的依赖清单同样被精确锁定；真实场景接通后还必须断言模块解析结果来自本地 `vendor/semi-design`，不能安装线上 `@douyinfe/semi-ui` 替代。
- `pnpm format:check`：检查仓库自有文件格式，跳过 `vendor/**`。
- `pnpm lint`：检查自有 JavaScript、TypeScript、TSX 和 Vue 文件。
- `pnpm typecheck`：逐 workspace 执行 TypeScript/Vue 类型检查。
- `pnpm test:unit`：Vitest + jsdom 的公开行为单测入口。
- `pnpm build`：构建两个应用、ESM/声明包和默认主题 CSS。
- `pnpm test:theme`：从只读上游重建完整根 CSS，并核对 v2.102.0 的组件导入顺序与代表性选择器。
- `pnpm test:ssr`：先重建拟公开 JavaScript 包，再在无 DOM 的 Node 环境导入并扫描私有边界泄漏。
- `pnpm test:pack`：构建真实 tarball，在临时消费者中离线安装并验证 exports、ESM、类型、样式和 SSR import。
- 每个公开包的构建都会写入 Semi Design 完整许可证、第三方声明和 SPDX 2.3 SBOM；项目自身使用 MIT License，并在包根携带 LICENSE。
- SBOM 默认记录实际构建时间；可复现发布必须传入标准的 `SOURCE_DATE_EPOCH`，该值也参与文档命名空间指纹。
- `pnpm test:browser`：启动 React/Vue 两个服务，按组件 spec 受控并发；每个测试仍在同一 BrowserContext 中执行 React/Vue 来源、行为、计算样式、几何与视觉对照。默认本地 4 个 worker、CI 2 个，可通过 `PARITY_WORKERS` 覆盖。
- `pnpm check:full`：执行以上完整本地门禁。
