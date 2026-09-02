# React / Vue 对照基础设施

## 目标

对照基础设施在 Playwright 固定 Chromium 的同一个 BrowserContext 中运行 React 参考页和 Vue 对照页。场景共享版本、数据、主题、方向、Locale、viewport、DPR、目标选择器和计算样式字段，避免两端各自维护一套隐含约定。

React 页面只允许从只读 `vendor/semi-design` 的固定 v2.102.0 源码构建。Vue 页面只消费本项目 Vue 能力；未完成的 Vue 场景必须保持 `pending`，不能用手写镜像 DOM、旧截图或 React 组件冒充已对齐实现。

本项目与固定上游一样定位为桌面端组件库，不建立全组件移动端兼容矩阵。所有组件默认覆盖桌面 `1440×900`、DPR 1 的 light/dark；只有固定源码的公开 API、文档或实现明确依赖响应式断点、触摸输入或可视区域边界时，才增加 `390×844` 的 `narrow` 或触摸专项。`narrow` 只验证对应公开契约，不表示移动端兼容，也不要求复制完整主题矩阵。

## 代表场景

下表用于说明共享场景合同的覆盖方式，不是完整清单。机器可读的完整场景注册以 `packages/test-infra/src/index.ts` 为准，完整浏览器规格以 `tests/browser/components/*.spec.ts` 为准。

| 场景                  | React | Vue   | 用途                                                          |
| --------------------- | ----- | ----- | ------------------------------------------------------------- |
| `harness-calibration` | ready | ready | 校准字体、壳层、viewport、DPR、计算样式、几何和局部截图       |
| `button-types`        | ready | ready | 直接复现固定中文文档首个 Button 类型场景；五种类型逐节点对照  |
| `button-contract`     | ready | ready | 图标、loading、disabled、尺寸、ButtonGroup、Split 与 RTL 合同 |
| `divider`             | ready | ready | 水平/垂直、实线/虚线、边距、内容对齐、dark/RTL                |
| `icon`                | ready | ready | 尺寸、旋转、spin、颜色、AI fill、Lab、dark                    |
| `space`               | ready | ready | 预设/自定义 gap、方向、换行、四种对齐、dark/RTL               |
| `float-button`        | ready | ready | 尺寸、形状、Badge、Group 事件、dark/RTL                       |
| `layout`              | ready | ready | 三行/侧栏/嵌套布局、语义标签、响应断点、dark/narrow/RTL       |
| `grid`                | ready | ready | 24 栅格、Gutter、Flex、排序、六断点、dark/narrow/RTL          |
| `resizable`           | ready | ready | 单体八方向、尺寸约束、水平/垂直 Group、拖拽回调、dark         |
| `typography`          | ready | ready | 标题、装饰、链接、截断、Numeral、复制、dark                   |
| `config-provider`     | ready | ready | RTL、Locale、Consumer、嵌套配置、六断点、dark/narrow          |
| `switch`              | ready | ready | 受控/非受控、三尺寸、文本、disabled/loading、键盘、RTL        |
| `tooltip`             | ready | ready | 四向 Portal、箭头、hover/click、disabled trigger、dark/RTL    |
| `select`              | ready | ready | 基础/禁用/占位、多选、分组搜索、Portal、dark/RTL              |
| `auto-complete`       | ready | ready | 输入搜索、键盘选择、自定义候选、Portal、dark/RTL              |
| `checkbox`            | ready | ready | 单选/组合、Card/PureCard、Group/options、键盘、dark/RTL       |
| `input`               | ready | ready | 输入/组合/TextArea、清除、密码、行号、dark/RTL                |
| `input-number`        | ready | ready | 格式化、步进、限制、键盘与 dark/RTL                           |
| `pin-code`            | ready | ready | 分格输入、格式、粘贴、焦点与 dark/RTL                         |
| `radio`               | ready | ready | 普通/组合、Button/Card/PureCard、键盘、dark/RTL               |
| `rating`              | ready | ready | 半星、清除、Tooltip、键盘与 dark/RTL                          |
| `slider`              | ready | ready | 单值/范围、Marks、拖拽、键盘与 dark/RTL                       |
| `tag-input`           | ready | ready | 添加/删除、尺寸、校验、折叠、Portal、dark/RTL                 |
| `time-picker`         | ready | ready | 单值/范围、12 小时制、时区、Portal、dark/RTL                  |
| `anchor`              | ready | ready | 嵌套锚点、滚动激活、折叠、Tooltip、dark/RTL                   |
| `back-top`            | ready | ready | Window/Element 阈值、回顶动画、节流、dark                     |
| `breadcrumb`          | ready | ready | routes/Item、折叠 Popover、键盘、dark/RTL                     |
| `pagination`          | ready | ready | 基础/完整/小尺寸/禁用、跳转、键盘、dark/RTL                   |
| `steps`               | ready | ready | fill/basic/nav/vertical、状态、键盘、dark/RTL                 |
| `tabs`                | ready | ready | 四类型、横/竖、More/折叠、键盘、dark/RTL                      |
| `side-sheet`          | ready | ready | 稳定 Portal、mask、header/body/footer、dark/RTL               |

场景契约定义在 `packages/test-infra/src/index.ts`。`assertScenarioComparable()` 只有在 React/Vue 均为 `ready` 时才返回场景，否则立即失败。所有已完成组件的固定源码矩阵、Vue API 与迁移表见 `docs/components/`。Layout、Grid、ConfigProvider 与 List 保留响应式断点的 `narrow` 视觉专项；UserGuide 保留固定弹层超出窄 viewport 时的可视边界专项。其余组件只运行桌面 light/dark，并按契约补充 RTL、Locale、Portal、键盘、焦点、动效或触摸行为。React/Vue 成对截图统一解码为像素后比较，门禁保持 `threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`。历史垂直切片记录中的 `mobile` 与逐字节 `cmp` 是当时验收证据，不是当前移动端兼容承诺，也不作为跨宿主 CI 的通过条件。

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
4. 在 `apps/parity-vue/src/` 使用 Vue 公共包实现同场景；不得从 Vue 运行时读取 vendor。
5. 先增加公开行为、键盘/焦点、ARIA、Portal/动效等适用断言，再将 `vueStatus` 改为 `ready`。
6. 使用 `expectComparableTarget()` 比较对应目标的计算样式、几何和像素；复杂场景可在同一共享契约上增加专用行为步骤。
7. 默认补齐桌面 light/dark；仅在固定上游有明确契约时增加 `narrow`、触摸、RTL 与 zh-CN/en-US 专项。

## 验证

```bash
pnpm check
pnpm test:browser
```

浏览器测试按组件放在 `tests/browser/components/*.spec.ts`，组件内部保持串行，组件之间由 Playwright worker 并发执行。默认本地与 CI 都使用 3 个 worker；资源受限或排查时可通过 `PARITY_WORKERS=1` 退回串行，也可用任意正整数临时覆盖。开发单个垂直切片时可直接定向运行，例如：

```bash
pnpm test:browser tests/browser/components/button.spec.ts
```

2026-08-30 在 M3 Max（16 个可用 CPU、64 GB）上以 CI 严格模式、相同代码与完整 482 项 Chromium 套件连续基准，所有档位均为 482/482 通过且无 retry：

| Worker | 墙钟时间 | 相对 3 workers |
| ------ | -------- | -------------- |
| 2      | 363.49s  | +26.4%         |
| 3      | 287.46s  | 基准           |
| 4      | 327.52s  | +13.9%         |
| 6      | 366.00s  | +27.3%         |
| 8      | 362.08s  | +26.0%         |

因此本机默认由 4 调整为 3，发布 CI 默认由 2 调整为 3。[GitHub 标准 hosted runner 规格](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)显示 `macos-15` arm64 runner 为 3 核 M1、7 GB 内存；CI 选择同时保留 `PARITY_WORKERS` 覆盖，以便 runner 规格或套件负载变化后重新基准。基准命令为：

```bash
CI=1 PARITY_IGNORE_HOST_BASELINES=1 PARITY_WORKERS=<数量> \
  pnpm --config.verify-deps-before-run=false exec playwright test tests/browser --reporter=dot
```

截图基线统一位于 `tests/browser/snapshots/`，不再依赖 spec 文件名，因此测试拆分或移动不会导致整批基线失效。

React 与 Vue 必须使用独立的快照名，不得共用同一个预期 PNG。发布 CI 设置 `PARITY_IGNORE_HOST_BASELINES=1` 时，Playwright 会直接跳过 `toHaveScreenshot()`；因此不得依赖该断言等待动画、稳定布局或证明 React/Vue 一致。涉及动画或 Portal 的局部对照必须额外独立截取两端图片，显式使用 `animations: 'disabled'`，再按项目视觉阈值比较像素。不允许用非空 Buffer、共享快照或宽松的几何容差代替这个证据。

更新截图只能在独立源码/行为/计算样式断言通过并人工检查实际图片后执行：

```bash
pnpm exec playwright test tests/browser --update-snapshots
```

不得并行启动多个使用固定 4173/4174 端口的 Playwright 命令。
