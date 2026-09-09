# Semi UI Vue

这是一个以 Semi Design `v2.102.0` 为固定参考基线、面向 Vue 3.5+ 的像素级复刻工程。

> 本项目是独立的 Vue 实现，不是 Semi Design 官方 Vue 版本，也不代表 DouyinFE 的授权、合作或品牌身份。当前发布线为 `0.1.0-alpha` 预览版，未完成组件和 API 在 `1.0.0` 前仍可能调整。

## npm 预览包

五个公开包统一使用 `next` dist-tag：

- `@aifuxi/semi-ui-vue`：Vue 主组件包。
- `@aifuxi/semi-theme-default`：根主题和逐组件编译 CSS。
- `@aifuxi/semi-icons-vue`：稳定图标。
- `@aifuxi/semi-icons-lab-vue`：实验图标。
- `@aifuxi/semi-illustrations-vue`：light/dark 插画。

```bash
pnpm add @aifuxi/semi-ui-vue@next @aifuxi/semi-theme-default@next
```

发布准备、首次人工引导和后续 GitHub OIDC 可信发布流程见 `docs/releasing.md`。

## 复刻进度

当前已完成 **85 / 85** 个上游公开根模块的完整垂直切片（**100%**）：

- 基础与布局：`_base`、`_utils`、Button、IconButton、Divider、Icon、Space、FloatButton、Layout、Grid、Resizable、Typography、ConfigProvider、Locale、DragMove、HotKeys、Lottie。
- 输入类：Switch、Tooltip、Select、AutoComplete、AIChatInput、Cascader、ColorPicker、DatePicker、Form、Checkbox、Input、InputNumber、PinCode、Radio、Rating、Slider、TagInput、TimePicker、Transfer、TreeSelect、Upload。
- 导航类：Anchor、BackTop、Breadcrumb、Navigation、Pagination、Steps、Tabs、Tree。
- 数据展示与容器：AIChatDialogue、Avatar、Badge、Calendar、Card、Carousel、Chat、Collapse、Collapsible、CodeHighlight、Descriptions、Dropdown、Empty、Highlight、Image、Cropper、JsonViewer、List、MarkdownRender、Modal、OverflowList、Popover、ScrollList、Sidebar、SideSheet、Table、Tag、Timeline。
- 反馈与引导类：Banner、Feedback、Notification、Popconfirm、Progress、Skeleton、Spin、Toast、UserGuide。
- 媒体类：AudioPlayer、VideoPlayer。

最新完成范围为 `_base` 与 `_utils`：`BaseComponent`/`BaseFoundation`、基础类型、Vue 组件与 VNode 判定、全局单例、事件/复制/媒体查询/焦点工具、Vue 命令式 render、SSR-safe 子路径与真实 tarball 消费均已闭合。至此 inventory 的 85 个公开根模块全部进入 `ready`；下一阶段是 1.0 发布审计，不再追加组件切片。可视组件切片均包含 Vue API、Foundation/主题、中英文文档、React/Vue 场景、单元/SSR/Chromium 对照、逐组件样式和真实 tarball 验证；`_base` / `_utils` 没有独立 DOM 或 SCSS，因此以行为、声明、SSR、许可和 tarball 证据验收。Locale 还覆盖固定基线的全部 57 个语言源，Icon 覆盖稳定图标、Lab 图标与生成漂移检查，插画包覆盖全部公开插画。

进度分母与剩余范围以 `docs/inventory/semi-v2.102.0.json` 的 `rootModuleCount` 为准；每完成一个 `ready` 垂直切片，必须在同一次提交中同步更新本节的数量、完成列表和下一项。唯一参考源码位于只读 submodule `vendor/semi-design`。

## 本地环境

文档门户已按 [Nuxt 迁移决策](docs/adr/0015-use-nuxt-for-component-documentation.md)统一为 Nuxt。构建使用 `pnpm --filter @workspace/docs build`，本地预览使用 `pnpm --filter @workspace/docs preview`（Node.js 24.18.0）。迁移状态与剩余范围见 [文档迁移记录](docs/documentation/README.md)；组件的 `ready` 状态不代表新文档已完成 859 个上游 Demo 的逐项复刻。根 `pnpm dev`、文档构建和门禁统一使用 Nuxt。

文档示例按 [双线计划](docs/documentation/batch-plan.md) 独立推进：

- **双语示例补齐：859/859 已映射**，剩余 0 项；AIComponent 最后 2 项双语示例已补齐，进入内容审阅与严格验收收尾。映射数不代表全部通过统一运行检查，补齐交付须包含实际加载运行证据。
- **严格视觉与行为验收：43/859 有效验收**（Button、Icon、ConfigProvider、Locale、Dark Mode、Navigation），当前有 816 项已映射待验收；下一批为 **Divider（2 项）**，随后 FloatButton、Grid，不等待补齐线完成。

两条线只拆分交付顺序，不降低最终验收标准；批次入口与证据失效规则见 [分批验收说明](docs/documentation/README.md#分批验收)。Navigation 中文 10 个、英文 12 个示例已补齐，52 项双语明暗及适用 RTL 验收全部通过；导航、浮层与 Worker 请求隔离差异已修复，六批共 224 项正式矩阵已刷新证据，见 [当前工作记录](ai-work/20260906-200000-navigation-documentation.md)。

OverflowList 四项双语示例已补齐，内容/类型/静态产物检查与八个示例的实际加载、宽度调整、恢复、源码和编辑器运行检查已完成。发现 collapse 与 scroll 的溢出标签计数未同步更新，已记录待对齐问题；本轮未执行严格视觉验收，也未增加 accepted。见 [补齐工作记录](ai-work/20260907-103119-overflow-list-documentation-content.md)。

ScrollList 一项双语示例已恢复三列滚轮、循环选择、禁用分钟和底部按钮，文档联合检查及双语页面/编辑器运行检查通过。分钟随机禁用改为固定交替序列；编辑器 Emmet/Pug Web 支持警告已记录，无页面异常或 console error。本批未执行严格验收，见 [ScrollList 补齐记录](ai-work/20260907-110551-scroll-list-documentation-content.md)。

Transfer 14 项双语示例已补齐，28 个示例均完成主要操作、源码及编辑器修改运行检查。修复自定义已选项的拖放接收边界与函数式把手内容，补齐英文 Provider；14 项单元/SSR、5 项组件 Chromium 对照、真实 tarball 和 SSR import 通过。受影响 Locale 16 项正式矩阵重验通过，43 项有效验收保持不变；本批不计入严格文档验收。见 [Transfer 补齐记录](ai-work/20260907-113702-transfer-documentation-content.md)。

Feedback 7 项双语示例已补齐，14 个示例的主要操作、源码及编辑器修改运行检查通过。修复 SSR 动画关闭后重开丢失内容、Modal 动态空 footer 未隐藏的问题，英文示例使用完整 locale；69 项单元/SSR、15 项组件 Chromium 对照和真实包验证通过。ConfigProvider、Locale 共 32 项正式矩阵重验通过，43 项有效验收保持不变；本批不计入严格文档验收。见 [Feedback 补齐记录](ai-work/20260907-161013-feedback-documentation-content.md)。

文档验收已完成一次端到端提速：同一六批 224 项冷启动从 17 分 49 秒降至 9 分 03 秒（减少 49.24%），全部一次通过；准备复用命令实测 9.5 秒。默认使用 3 workers、按实际依赖判定失效，并限制 REPL 模块请求，后续有效批次直接跳过。详见 [性能工作记录](ai-work/20260906-211800-documentation-performance.md)。

- Node.js `24.18.0`（支持 `20.19+`、`22.13+` 和 `24.x`）
- pnpm `12.3.4`；Node 与 pnpm 由根 `mise.toml` 统一管理
- Playwright 固定 Chromium 构建

```bash
mise trust
mise install
mise exec -- pnpm install --frozen-lockfile
mise exec -- pnpm playwright:install
mise exec -- pnpm check:vendor
mise exec -- pnpm check:full
```

终端启用 `mise activate zsh` 后可直接使用下列 pnpm 命令；自动化和未激活的终端使用 `mise exec -- pnpm …`。WebStorm 解释器与包管理器分别选用 `mise which node`、`mise which pnpm` 返回的路径，个人路径不提交。详见 [工具链管理](docs/architecture/toolchain.md)。

Linux CI 需要在镜像准备阶段执行 `pnpm exec playwright install --with-deps chromium`；普通 `pnpm install` 不会下载浏览器。当前首份截图校准基线生成于 macOS（Darwin），Linux 在纳入 `check:full` 前必须单独生成并人工审核对应平台基线，不能自动更新覆盖。

## 常用命令

```bash
pnpm dev             # Vue 文档/对照应用
pnpm dev:reference   # React 参考应用
pnpm inventory:generate # 从固定 vendor 重建组件/API/文档/依赖 inventory
pnpm check           # 日常静态检查、源码类型、单测与工具测试
pnpm check:artifacts # 构建、文档检查、主题、SSR 与真实包安装
pnpm test:browser    # 受控并发的 Chromium React/Vue 对照基础设施
pnpm test:browser:built # 与 CI 一致的预构建开发环境对照，保留全部门禁
```

目录职责、依赖方向和新增组件流程见 `docs/architecture/workspace.md`；组件文档与对齐矩阵见 `docs/components/`；上游全量清单见 `docs/inventory/README.md`；真实 React/Vue 场景注册与验收流程见 `docs/testing/react-vue-parity.md`。
