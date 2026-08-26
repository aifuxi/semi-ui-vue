# Semi Vue Port

本上下文描述把固定版本 Semi Design 移植到 Vue 时使用的共同语言，避免把“相似”“兼容”和“对齐”混为一谈。

## Language

**参考基线（Reference Baseline）**:
用于判定复刻结果的唯一、精确且不可漂移的 Semi Design 官方版本。
_Avoid_: 最新版 Semi、线上当前版

**参考源码（Reference Source）**:
参考基线在本仓库中的只读源码副本，所有对齐判断都应能追溯到它。
_Avoid_: 在线源码、参考实现

**Vue 移植版（Vue Port）**:
使用 Vue 实现 Semi Design 已声明契约的组件库；它不依赖 React 运行时来渲染组件。
_Avoid_: React 包装层、Semi 皮肤

**Foundation**:
Semi 中与前端框架无关的组件业务与交互逻辑，可由不同框架的 Adapter 驱动。
_Avoid_: Vue 状态、React 组件

**Adapter**:
连接 Foundation 与具体框架的边界，负责框架状态、生命周期、事件和 DOM 渲染。
_Avoid_: 业务逻辑层、样式层

**Foundation 集成边界（Foundation Integration Boundary）**:
项目内唯一可以选择性引用、适配和编译固定 Foundation 源码的内部边界；它隔离 React 类型、浏览器全局假设和 Adapter 差异。
_Avoid_: 复制 Foundation、直接修改 vendor、组件随意深层导入

**对齐契约（Parity Contract）**:
某个组件需要与参考基线保持等价的一组可验证维度；未进入契约的维度不能被默认为已兼容。
_Avoid_: 看起来一样、大致兼容

**Vue 原生 API 对齐（Vue-native API Parity）**:
使用 Vue 原生 `props`、`emits`、`slots` 和 `v-model` 表达与参考基线等价的能力，并保留可自然兼容的组件名、prop 名和枚举值。
_Avoid_: React API 字面翻译、为视觉相似而改变行为

**完整公开面（Complete Public Surface）**:
参考基线中由公开导出、文档 API 或发布资产承诺给用户的全部组件与资产，包含长尾能力。
_Avoid_: 仅常用组件、按目录数猜测范围

**分阶段交付（Phased Delivery）**:
在最终范围不变的前提下，先交付核心组件与横向基础设施，再交付 AI、内容渲染与媒体等长尾能力。
_Avoid_: 缩减范围、长尾永久延后

**样式兼容面（Style Compatibility Surface）**:
为直接复用参考基线的 SCSS、主题和用户样式扩展而保留的 `.semi-*` DOM/state class、placement 属性与 `--semi-*` CSS Token。
_Avoid_: 只保留颜色、重命名前缀、把 class 当私有实现细节

**Chromium 验收环境（Chromium Acceptance Environment）**:
项目锁定的 Playwright Chromium 构建及其固定字体、viewport、DPR、Locale、主题、数据与动画时刻；React/Vue 对照必须共享该环境。
_Avoid_: 本机随机 Chrome、跨引擎逐像素相等、未锁定字体的截图

**发布面（Published Surface）**:
组件库用户可直接安装和导入的主组件包、默认主题、图标和插画包；其导出、类型和样式入口属于版本契约。
_Avoid_: 全部 workspace 包都发布、暴露 Foundation 深层路径

**发布产物契约（Distribution Artifact Contract）**:
发布包对消费者承诺的 ESM、TypeScript 声明、样式入口、`exports`、tree-shaking 与 SSR-safe import 能力，必须通过实际 `npm pack` 产物验证。
_Avoid_: 只跑源码测试、未声明的深层导入、默认兼容 CJS

**可公开发布标准（Public-release Standard）**:
从开发首日就持续保留归属与许可证据，并对真实发布产物生成 SBOM/许可清单的合规基线。
_Avoid_: 仅内部使用所以不记录、发布前一次性补 License

**技术兼容标识（Technical Compatibility Identifier）**:
为实现样式与迁移兼容而保留的 `.semi-*` 和 `--semi-*`；它们不表示项目获得 Semi 品牌或商标身份。
_Avoid_: 官方 Vue 版、Semi Logo 复用、将 class 兼容写成品牌隶属

**私有集成包（Private Integration Package）**:
workspace 中为主组件包服务、但不向使用者承诺 API 的 Foundation 集成层或测试基础设施。
_Avoid_: 用户直接依赖、发布深层导入

**SSR-safe import**:
在没有 `window` / `document` 的 Node/SSR 环境导入任意公开包或导出时不产生浏览器全局访问、DOM 创建或其他客户端副作用。
_Avoid_: 仅在 Nuxt 中动态导入规避错误、把 import-safe 误称为 hydration-safe

**SSR render/hydration 对齐**:
适用组件在服务端输出稳定 HTML，并能在 Chromium 客户端无 mismatch 地激活；Portal、测量与随机 ID 必须有明确的双端策略。
_Avoid_: 只验证 import、屏蔽 hydration warning

**对齐证据（Parity Evidence）**:
能独立证明 Vue 移植版满足对齐契约的源码依据、自动化断言和同环境浏览器结果。
_Avoid_: 主观目测、仅有快照

**组件完成门槛（Component Completion Gate）**:
组件可被标记完成前必须同时具备的源码、文档、类型、黑盒行为、Chromium 真实渲染、无障碍、SSR、对照和发布包证据集。
_Avoid_: 代码写完、截图通过、单元测通过

**可接受差异（Accepted Deviation）**:
确实无法在 Vue 契约下等价、且已记录固定源码证据、原因、用户影响和验收结论的差异。
_Avoid_: 待办项、没时间实现、用户应该感觉不到

**视觉数值门槛（Visual Numeric Gate）**:
在锁定 Chromium 环境的最小裁剪场景中，要求关键 computed style 精确相等、bounding rect 差值不超过 `0.5 CSS px`、Playwright `threshold <= 0.1` 且 `maxDiffPixelRatio <= 0.001`。
_Avoid_: 用整页面稀释差异、只看全局比例、扩大 mask

**默认对照场景矩阵（Default Parity Scenario Matrix）**:
每个组件的最低对照环境集：桌面 light/dark，并根据组件契约增加移动 viewport、RTL、zh-CN/en-US 以及全 Locale 完整性验证。
_Avoid_: 只测文档默认例、用一张截图代表全部状态
