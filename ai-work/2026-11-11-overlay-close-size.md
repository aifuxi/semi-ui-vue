# BUG-000139：Modal / SideSheet 原生关闭按钮尺寸配置

## 问题现象

工作项描述：Modal / SideSheet 原生关闭按钮固定为 24px，缺少独立尺寸配置。业务使用 2.1.5 包，期望通过公开 API 获得 32×32px 按钮和 20px 图形；直接传入 `closeIcon: h(IconClose, { size: 'large' })` 后按钮仍为 24×24px。

在本仓库新增公开入口测试，分别覆盖有标题 Modal、无标题 Modal、SideSheet、全局默认和命令式 Modal。修改前 7 项新测试均失败，关闭按钮仍带 `semi-button-size-small`。

## 已确认根因

`ModalInnerContent.vue` 的有标题/无标题关闭分支和 `SideSheetContent.vue` 都硬编码 Button `size="small"`。ModalProps / SideSheetProps 没有独立按钮尺寸属性；closeIcon 只负责图形 VNode，不能控制外层点击区域。

只读基线 `vendor/semi-design` 为 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21；其 ModalContent / SideSheetContent 也使用 small，因此保留默认 small，新增 Vue 能力扩展，不把默认值视为上游缺陷，也不修改 vendor。

## 修复方案

- 新增 `closeButtonSize?: ButtonSize`，接受 small/default/large，默认 small。复用现有 Button / IconButton 样式，默认主题分别为 24/32/40px 方形点击区域。
- 从公开组件传递到实际内容层；Modal 的两个关闭分支及命令式创建/更新都生效。
- 遵循显式实例值 > `semiGlobal.config.overrideDefaultProps.Modal/SideSheet` > small 的现有优先级；undefined 回退到全局配置。
- closeIcon prop/slot 继续独立控制图形，默认 16px。`closeButtonSize="default"` 配合 `<IconClose size="large" />` 达到 32px/20px。
- 不改变关闭事件、Portal、动效、焦点或键盘实现；保留自定义 header 的现有所有权。新增中英文 API、迁移/对齐说明及 minor Changeset。

## 实际验证

- `pnpm test:unit packages/ui/src/modal packages/ui/src/side-sheet`：9 文件、51 项通过，包含 7 项新增回归、SSR 与 hydration。
- `pnpm typecheck:public`、`pnpm typecheck:root`：通过。
- 受影响源码、测试与真实包 TSX fixture 的定向 ESLint：通过。
- `pnpm check:artifacts`：六包构建、83 个组件主题入口、全部公开 JavaScript SSR import，以及真实 tarball 的安装、exports、ESM、声明、样式、tree-shaking 验证通过。TSX 同时覆盖根入口/子路径合法档位及 medium 的类型拒绝。使用已有外部依赖，未执行隔离联网安装。
- `pnpm test:consumer tests/consumer/overlay-close-size.spec.ts`：10 项通过。锁定 Playwright 1.62.1、完整 Chromium 新 headless、DPR 1；配置最大 3 workers，单个 spec 实际 1 worker，0 retries。
- 浏览器覆盖 Modal 两个关闭分支与 SideSheet、light/dark、省略/undefined、自定义 prop/slot 图形、small/default/large、鼠标/Enter/Esc、真实入退场动效，以及 Modal 关闭后焦点返回。实测 24/16、24/20、32/16、32/20、40/20；宽高均精确匹配。
- 390×844 视口、公开 width=320 的窄容器在两种主题下验证标题与按钮不重叠，人工审阅 4 张截图。证据保存在本地忽略目录 `test-results/consumer/overlay-close-size-*/`，不提交截图。

SideSheet 保留固定基线不自动聚焦/不自动返回焦点的行为；未扩展成 Modal 的焦点陷阱。未运行整库回归或其他主题的像素对照。业务原页面仍使用已安装的 2.1.5；本次没有发布、升级业务依赖或修改其全局配置，业务接入新版本后需配置上述公开属性才能统一 32/20。
