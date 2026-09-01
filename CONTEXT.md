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

**组件文档门户（Component Documentation Portal）**:
面向 Vue 移植版使用者的首期文档产品，范围包括组件发现、使用说明、交互示例、示例代码与公开 API，并支持双语、主题和搜索体验。
_Avoid_: 完整官网、对照工作台、Demo 合集

**完整官网门户（Full Website Portal）**:
在组件文档门户之外，还承载首页、设计原则、设计资源、生态与版本信息等完整产品叙事的未来扩展范围。
_Avoid_: 首期组件文档、仅组件列表

**对照工作台（Parity Workbench）**:
供维护者运行固定场景并收集 React/Vue 对齐证据的内部工具，不承担面向组件使用者的文档职责。
_Avoid_: 组件文档门户、官网

**完整文档迁移（Complete Documentation Port）**:
把参考基线中对 Vue 移植版仍适用的全部组件说明和示例转换为 Vue 表达，并补充 Vue 公开 API 与迁移差异，而不是只挑选常用场景。
_Avoid_: 精选文档、核心示例集、直接展示 React 示例

**正式文档内容源（Canonical Documentation Source）**:
由本项目维护、面向 Vue 使用者的双语文档内容；参考源码只用于核对范围和语义，不作为门户直接发布的内容源。
_Avoid_: 运行时读取 vendor、直接渲染上游 React MDX、把参考源码当成可编辑文档

**文档体验对齐（Documentation Experience Parity）**:
组件文档门户在信息层级、布局、排版、主题、导航和组件页面交互上对齐参考官网，但不复制其品牌身份或官方宣传内容。
_Avoid_: 品牌复制、只换 Logo 的官网镜像、使用默认主题即宣称复刻

**独立站点身份（Independent Site Identity）**:
组件文档门户以 Semi UI Vue 和 `@aifuxi/*` 标识自身，并持续说明它是基于固定参考基线的独立 Vue 实现。
_Avoid_: Semi 官方 Vue 版、复用 Semi Logo、隐藏非隶属关系

**双语页面对（Bilingual Page Pair）**:
中文与英文中表达同一主题、共享同一非语言路径的两份正式页面；缺少任一成员都表示该主题尚未达到可发布状态。
_Avoid_: 自动回退即完成、只有标题被翻译、两个语言版本使用无关路径

**正式文档 URL（Canonical Documentation URL）**:
带有显式 `zh-CN` 或 `en-US` 前缀，并保留参考官网分类层级的稳定页面地址；无语言前缀或简写地址只作为跳转入口。
_Avoid_: 根据浏览器语言产生不确定根页面、把重定向别名当正式地址

**文档 API 契约（Documentation API Contract）**:
由公开 TypeScript 类型定义成员与类型、由结构化双语元数据定义说明和默认值的组件 API 文档事实；两部分必须完整对应才能发布。
_Avoid_: 手写整张 API 表、只展示类型名、从内部运行时类型推断公开 API

**组件文档完成门槛（Component Documentation Completion Gate）**:
组件页面进入正式导航前必须满足的双语内容、上游覆盖、API、示例、浏览器体验、链接与搜索证据集合；任一部分缺失都表示页面未完成。
_Avoid_: 页面能打开、先上线再补、用待办提示代替完整内容

**文档覆盖清单（Documentation Coverage Ledger）**:
逐项记录参考基线章节与示例在 Vue 文档中的迁移结果或有证据的排除理由，用于证明完整文档迁移没有静默遗漏。
_Avoid_: 只比较页面数量、凭印象判断完整、删除不适用内容但不说明

**正式站点源（Canonical Site Origin）**:
公开组件文档门户被索引、分享和生成正式链接时使用的唯一域名源，即 `https://semi.fuxiaochen.com`。
_Avoid_: GitHub Pages 临时地址、开发服务器地址、同时发布多个 canonical origin

**文档发布产物（Documentation Distribution Artifact）**:
由仓库构建并验证、可部署到任意静态 Web 服务器的完整站点文件集合；它是仓库交付边界，不包含云服务器凭据或上线操作。
_Avoid_: 本地开发目录、GitHub Pages 专用产物、把服务器配置当成站点源码

**活动文档版本（Active Documentation Version）**:
正式站点当前唯一描述的组件库发布线；预发布阶段需要明确标识，但页面 URL 不包含版本前缀。
_Avoid_: 参考基线版本、默认代表所有历史版本、每次发包复制整站

**语言隔离搜索（Locale-scoped Search）**:
只在当前语言的正式页面中检索标题、正文语义、示例用途和公开 API 名称的静态搜索体验；示例源码正文不参与普通全文排名。
_Avoid_: 中英文结果混排、索引开发中页面、让通用代码词淹没文档结果

**门户基础指南（Portal Foundation Guides）**:
让使用者能够正确安装、导入、主题化、国际化、SSR 渲染、迁移和理解支持边界的双语全站说明；它们与组件页面共同构成首期组件文档门户。
_Avoid_: 只有组件 API、营销内容、用 README 代替站点指南

**文档体验对照证据（Documentation Experience Comparison Evidence）**:
在代表页面中证明站点导航、布局、排版、主题、示例和 API 区域与参考官网关键样式及几何一致的局部证据。
_Avoid_: 复制品牌资产、只比较整页截图、用本站基线代替上游对照

**文档站回归证据（Documentation Portal Regression Evidence）**:
以 Semi UI Vue 独立品牌和实际 Starlight 页面为对象，保护双语、主题、桌面/移动、键盘、可访问性和整页视觉稳定性的本站证据。
_Avoid_: 上游 React/Vue 组件对照、只测一个桌面中文页面

**公开文档内容（Published Documentation Content）**:
组件门户直接发布给使用者的双语指南、组件说明、迁移内容、示例和 API 解释，由文档应用拥有并进入站点质量门禁。
_Avoid_: 对齐矩阵、覆盖审计、内部测试结论

**文档维护证据（Documentation Maintenance Evidence）**:
供维护者证明上游覆盖、组件对齐和页面完成状态的矩阵、清单与验收记录，不作为面向使用者的站点正文。
_Avoid_: 用户指南、公开 API 说明、把内部验收记录直接发布

**文档参考批次（Documentation Reference Cohort）**:
在批量迁移前用于验证并冻结站点壳、页面模板、示例、API、搜索、视觉和发布产物约定的一组差异化组件页面。
_Avoid_: 随机挑一个简单组件、试点未闭环就批量复制、把参考批次缩小为视觉样稿

**文档来源记录（Documentation Provenance Record）**:
把迁移后的公开内容追溯到固定上游文档、示例、样式或资产路径及版本的记录，并标明改编或排除结果。
_Avoid_: 只写灵感来自 Semi、无法定位原文件、用在线最新页面替代固定来源

**站点归属声明（Portal Attribution Notice）**:
随静态文档产物公开提供的项目、Semi Design 和实际第三方依赖许可与归属说明。
_Avoid_: 只在源码仓库保留 License、把非隶属声明当成许可证、遗漏文档运行时依赖

**文档影响链（Documentation Affected Chain）**:
由一次内容、示例、站点壳、生成器、组件源码或共享基础设施变更实际触达的文档检查与组件对照集合。
_Avoid_: 每次文案修改都跑全部组件、只构建当前页面、凭文件名猜测影响范围

**混合文档壳（Hybrid Documentation Shell）**:
由 Starlight 提供内容、路由、双语和搜索基础，由 Semi UI Vue override 提供接近参考官网的可见导航与页面壳体验的门户结构。
_Avoid_: Starlight 默认主题换色、完全脱离 Starlight 的自研文档系统、直接迁移 Gatsby React 壳

**无跟踪静态门户（Tracking-free Static Portal）**:
不依赖分析、监控、Cookie、用户标识或外部运行时服务即可完整浏览、搜索和运行本地示例的组件文档门户。
_Avoid_: 迁移上游监控、默认接入统计、核心资源依赖第三方 CDN
