# React / Vue 对照基础设施

## 目标

对照基础设施在 Playwright 固定 Chromium 的同一个 BrowserContext 中运行 React 参考页和 Vue 对照页。场景共享版本、数据、主题、方向、Locale、viewport、DPR、目标选择器和计算样式字段，避免两端各自维护一套隐含约定。

React 页面只允许从只读 `vendor/semi-design` 的固定 v2.102.0 源码构建。Vue 页面只消费本项目 Vue 能力；未完成的 Vue 场景必须保持 `pending`，不能用手写镜像 DOM、旧截图或 React 组件冒充已对齐实现。

## 当前场景

| 场景                  | React | Vue   | 用途                                                           |
| --------------------- | ----- | ----- | -------------------------------------------------------------- |
| `harness-calibration` | ready | ready | 校准字体、壳层、viewport、DPR、计算样式、几何和局部截图        |
| `button-types`        | ready | ready | 直接复现固定中文文档首个 Button 类型场景；五种类型逐节点对照   |
| `button-contract`     | ready | ready | 图标、loading、disabled、尺寸、ButtonGroup、Split 与 RTL 合同  |
| `divider`             | ready | ready | 水平/垂直、实线/虚线、边距、内容对齐、dark/mobile/RTL          |
| `icon`                | ready | ready | 尺寸、旋转、spin、颜色、AI fill、Lab、dark/mobile              |
| `space`               | ready | ready | 预设/自定义 gap、方向、换行、四种对齐、dark/mobile/RTL         |
| `float-button`        | ready | ready | 尺寸、形状、Badge、Group 事件、dark/mobile/RTL                 |
| `layout`              | ready | ready | 三行/侧栏/嵌套布局、语义标签、响应断点、dark/mobile/RTL        |
| `grid`                | ready | ready | 24 栅格、Gutter、Flex、排序、六断点、dark/mobile/RTL           |
| `resizable`           | ready | ready | 单体八方向、尺寸约束、水平/垂直 Group、拖拽回调、dark/mobile   |
| `typography`          | ready | ready | 标题、装饰、链接、截断、Numeral、复制、dark/mobile             |
| `config-provider`     | ready | ready | RTL、Locale、Consumer、嵌套配置、六断点、dark/mobile           |
| `switch`              | ready | ready | 受控/非受控、三尺寸、文本、disabled/loading、键盘、RTL         |
| `tooltip`             | ready | ready | 四向 Portal、箭头、hover/click、disabled trigger、dark/RTL     |
| `select`              | ready | ready | 基础/禁用/占位、多选、分组搜索、Portal、dark/mobile/RTL        |
| `auto-complete`       | ready | ready | 输入搜索、键盘选择、自定义候选、Portal、dark/mobile/RTL        |
| `checkbox`            | ready | ready | 单选/组合、Card/PureCard、Group/options、键盘、dark/mobile/RTL |
| `input`               | ready | ready | 输入/组合/TextArea、清除、密码、行号、dark/mobile/RTL          |
| `input-number`        | ready | ready | 格式化、步进、限制、键盘与 dark/mobile/RTL                     |
| `pin-code`            | ready | ready | 分格输入、格式、粘贴、焦点与 dark/mobile/RTL                   |
| `radio`               | ready | ready | 普通/组合、Button/Card/PureCard、键盘、dark/mobile/RTL         |
| `rating`              | ready | ready | 半星、清除、Tooltip、键盘与 dark/mobile/RTL                    |
| `slider`              | ready | ready | 单值/范围、Marks、拖拽、键盘与 dark/mobile/RTL                 |
| `tag-input`           | ready | ready | 添加/删除、尺寸、校验、折叠、Portal、dark/mobile/RTL           |
| `time-picker`         | ready | ready | 单值/范围、12 小时制、时区、Portal、dark/mobile/RTL            |
| `anchor`              | ready | ready | 嵌套锚点、滚动激活、折叠、Tooltip、dark/mobile/RTL             |
| `back-top`            | ready | ready | Window/Element 阈值、回顶动画、节流、dark/mobile               |
| `breadcrumb`          | ready | ready | routes/Item、折叠 Popover、键盘、dark/mobile/RTL               |
| `pagination`          | ready | ready | 基础/完整/小尺寸/禁用、跳转、键盘、dark/mobile/RTL             |
| `steps`               | ready | ready | fill/basic/nav/vertical、状态、键盘、dark/mobile/RTL           |
| `tabs`                | ready | ready | 四类型、横/竖、More/折叠、键盘、dark/mobile/RTL                |
| `side-sheet`          | ready | ready | 稳定 Portal、mask、header/body/footer、dark/mobile/RTL         |

场景契约定义在 `packages/test-infra/src/index.ts`。`assertScenarioComparable()` 只有在 React/Vue 均为 `ready` 时才返回场景，否则立即失败。所有已完成组件的固定源码矩阵、Vue API 与迁移表见 `docs/components/`。Icon 场景覆盖尺寸、旋转、暂停后的 spin、单色、双色、四色渐变、Lab 和自定义 SVG 基座；Space 场景覆盖预设/数字/数组 gap、方向、换行、交叉轴对齐和 RTL；FloatButton 场景覆盖尺寸、形状、colorful、disabled、Badge 与 Group 委托事件；Layout 场景覆盖语义标签、嵌套 Sider 注册与桌面/移动断点回调；Grid 场景覆盖 24 栅格、水平/垂直/响应式 Gutter、Flex 对齐与排序、响应式 Col 和 RTL；Resizable 场景覆盖单体八方向手柄、受约束拖拽、水平/垂直 Group、默认 IconHandle、相邻 Item 回调与桌面/移动明暗主题；Typography 场景覆盖标题层级、七类文本颜色、装饰顺序、段落、链接、复制和数值格式化；ConfigProvider 场景覆盖 RTL、Locale、Consumer、嵌套配置和桌面/移动断点；Switch、Tooltip、Select、AutoComplete、Checkbox、Input、TagInput 与 TimePicker 分别覆盖其公开输入、状态、键盘/焦点、ARIA、Portal 和适用主题矩阵。Tabs 场景覆盖四种 type、top/left、disabled/closable、More、可收起 OverflowList、点击/键盘、Dropdown Portal、桌面/移动明暗主题和 RTL，成对局部截图要求字节完全一致。

## 运行入口

两个应用使用相同查询参数：

- `scenario`：共享场景 ID。
- `theme`：`light` 或 `dark`，同步写入 `body[theme-mode]`。
- `direction`：`ltr` 或 `rtl`，同步写入文档与场景根节点。
- `locale`：`zh-CN` 或 `en-US`，同步写入文档语言。

示例：

```text
http://127.0.0.1:4173/?scenario=button-types&theme=dark&direction=ltr&locale=zh-CN
http://127.0.0.1:4174/?scenario=button-types&theme=dark&direction=ltr&locale=zh-CN
```

## React 固定源码适配

`apps/reference-react/vite.config.ts` 将 `@semi-v2.102.0/button` 精确解析到：

```text
vendor/semi-design/packages/semi-ui/button/index.tsx
```

Button 的运行依赖使用固定版本，并通过 alias 保证从参考应用解析。样式由 Sass 1.54.9 将主题 Token、global、Button、IconButton 和 icons SCSS 编译为虚拟 CSS 模块；上游 TSX 的对应副作用样式导入仅做去重。这样既不修改 vendor，也不要求 Vite 8 调用已移除的旧 Sass API。

浏览器测试监听真实模块请求，要求 Button 公开入口的请求 URL 落在上述 vendor 路径；同时独立断言 `.semi-button-*` 公开 class、32px 默认高度、3px 圆角、字体、内边距与点击行为。

Vue 文档应用从 `@aifuxi/semi-ui-vue` 源码入口消费 Button，并通过 `packages/theme-default/vite-plugin.ts` 使用 Sass 1.54.9 编译逐组件样式。插件只存在于主题构建边界，Vue 组件源码没有 `vendor/**` 引用。React/Vue 的 Button 类型与合同截图在全部样式、几何、状态和来源断言通过后生成；同场景对应图片的 SHA-256 完全一致。

## 新增组件场景

1. 从 Inventory 和固定源码确认公开入口、文档场景、Foundation/SCSS、依赖与测试证据。
2. 在 `PARITY_SCENARIOS` 注册场景、源码证据、稳定目标和要比较的 computed-style 字段；初始 `vueStatus` 必须为 `pending`。
3. 在 `apps/reference-react/src/scenarios/` 复现确定性 React 场景，并把公开入口加入只读源码解析适配。
4. 在 `apps/docs-vue/src/` 使用 Vue 公共包实现同场景；不得从 Vue 运行时读取 vendor。
5. 先增加公开行为、键盘/焦点、ARIA、Portal/动效等适用断言，再将 `vueStatus` 改为 `ready`。
6. 使用 `expectComparableTarget()` 比较对应目标的计算样式、几何和像素；复杂场景可在同一共享契约上增加专用行为步骤。
7. 按组件矩阵补齐桌面/移动、light/dark、适用时 RTL 与 zh-CN/en-US 截图。

## 验证

```bash
pnpm check
pnpm test:browser
```

更新截图只能在独立源码/行为/计算样式断言通过并人工检查实际图片后执行：

```bash
pnpm exec playwright test tests/browser --update-snapshots
```

不得并行启动多个使用固定 4173/4174 端口的 Playwright 命令。
