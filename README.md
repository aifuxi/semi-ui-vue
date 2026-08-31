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

当前已完成 **71 / 85** 个上游公开根模块的完整垂直切片（约 **83.5%**）：

- 基础与布局：Button、IconButton、Divider、Icon、Space、FloatButton、Layout、Grid、Resizable、Typography、ConfigProvider、DragMove、HotKeys。
- 输入类：Switch、Tooltip、Select、AutoComplete、Cascader、ColorPicker、DatePicker、Form、Checkbox、Input、InputNumber、PinCode、Radio、Rating、Slider、TagInput、TimePicker、Transfer、TreeSelect、Upload。
- 导航类：Anchor、BackTop、Breadcrumb、Navigation、Pagination、Steps、Tabs、Tree。
- 数据展示与容器：Avatar、Badge、Calendar、Card、Carousel、Collapse、Collapsible、CodeHighlight、Descriptions、Dropdown、Empty、Highlight、Image、Cropper、List、Modal、OverflowList、Popover、ScrollList、SideSheet、Table、Tag、Timeline。
- 反馈类：Banner、Notification、Popconfirm、Progress、Skeleton、Spin、Toast。

最新完成组件为 HotKeys；下一项按固定 `content/order.js` 转入其后的 Lottie，并在实现前先完成 `lottie-web` 运行时与公开依赖/许可边界审计。排在前面的 Chat、MarkdownRender 与 JsonViewer 分别仍依赖较重的 Markdown/AI 链路或独立 Worker 核心，继续按就绪度排队。每个已完成切片均包含 Vue API、Foundation/主题、中英文文档、React/Vue 场景、单元/SSR/Chromium 对照、逐组件样式和真实 tarball 验证。Icon 还覆盖稳定图标、Lab 图标与生成漂移检查，插画包覆盖全部公开插画。

进度分母与剩余范围以 `docs/inventory/semi-v2.102.0.json` 的 `rootModuleCount` 为准；每完成一个 `ready` 垂直切片，必须在同一次提交中同步更新本节的数量、完成列表和下一项。唯一参考源码位于只读 submodule `vendor/semi-design`。

## 本地环境

- Node.js `24.18.0`（支持 `20.19+`、`22.13+` 和 `24.x`）
- pnpm `11.19.0`
- Playwright 固定 Chromium 构建

```bash
corepack enable
pnpm install
pnpm playwright:install
pnpm check:vendor
pnpm check:full
```

Linux CI 需要在镜像准备阶段执行 `pnpm exec playwright install --with-deps chromium`；普通 `pnpm install` 不会下载浏览器。当前首份截图校准基线生成于 macOS（Darwin），Linux 在纳入 `check:full` 前必须单独生成并人工审核对应平台基线，不能自动更新覆盖。

## 常用命令

```bash
pnpm dev             # Vue 文档/对照应用
pnpm dev:reference   # React 参考应用
pnpm inventory:generate # 从固定 vendor 重建组件/API/文档/依赖 inventory
pnpm check           # 格式、lint、类型、单测、构建、SSR 与真实包安装
pnpm test:browser    # 受控并发的 Chromium React/Vue 对照基础设施
```

目录职责、依赖方向和新增组件流程见 `docs/architecture/workspace.md`；组件文档与对齐矩阵见 `docs/components/`；上游全量清单见 `docs/inventory/README.md`；真实 React/Vue 场景注册与验收流程见 `docs/testing/react-vue-parity.md`。
