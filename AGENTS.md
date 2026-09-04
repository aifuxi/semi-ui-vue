# 项目协作约束

## Semi Design 参考基线

- Semi Design 唯一参考基线是只读 Git submodule：`vendor/semi-design`。
- 参考版本固定为 `v2.102.0`，提交为 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`；不得用 `main`、在线最新文档或其他版本覆盖该基线。
- 开始任何 Semi 对齐实现前，按以下顺序检查本地源码：
  1. `vendor/semi-design/packages/semi-ui/<component>/`：React Adapter、公开类型、DOM 和 class 结构。
  2. `vendor/semi-design/packages/semi-foundation/<component>/`：Foundation、常量、SCSS、动效与 RTL。
  3. `vendor/semi-design/packages/semi-theme-default/scss/`：默认主题与全局 Token。
  4. `vendor/semi-design/content/`：中英文文档、演示、API 与无障碍说明。
  5. `vendor/semi-design/packages/semi-icons*` 与 `packages/semi-illustrations/`：图标和插画资源。
- 只有固定源码中不存在所需信息，或任务明确要求检查当前上游时，才查询在线资料；在线资料比 `v2.102.0` 更新时必须明确标注，不能作为复刻基线。
- `vendor/semi-design` 只用于阅读和验证，不得在其中修改、格式化或生成文件。
- 应在本项目的 lint、typecheck、test、build 和文件扫描配置中排除 `vendor/**`，避免把上游仓库当成本项目源码处理。
- Foundation、SCSS 与相关资产只从固定 submodule 读取；不得将上游源码复制到项目目录后独立修改。
- 项目通过自有的 Foundation 集成/隔离边界选择性编译上游逻辑；Vue 组件不应散落地跨目录依赖 `vendor/**`。
- 发布产物应内联所需 Foundation 逻辑并包含编译后样式；组件库使用者不需要初始化 submodule。

初始化与核验：

```bash
git submodule update --init --depth 1 vendor/semi-design
git submodule status vendor/semi-design
git -C vendor/semi-design describe --tags --exact-match
```

预期结果分别包含上述提交 SHA 和 `v2.102.0`。

## 复刻工作约束

- 公开 API 使用 Vue 原生 `props` / `emits` / `slots` / `v-model`；同时尽量保留 Semi 的组件名、枚举值和可自然保留的 prop 名，并为 React 专属语义提供逐项迁移表。
- “完全复刻”指视觉、行为、状态、可访问性和主题与参考基线对齐，不指在 Vue 中字面复制 `ReactNode`、render props、children 或 React ref 用法。
- 最终范围覆盖 v2.102.0 的全部公开组件与资产；先交付核心组件，再交付 AIChat、Markdown、音视频、Lottie、Cropper、JsonViewer 等长尾能力。分阶段只改变交付顺序，不缩小最终完成定义。
- “全部公开”以固定源码的公开导出、文档 API 和发布资产为准；内部模块只在公开能力依赖时纳入。
- 首个完整版本保留上游 `.semi-*` DOM class、状态 class、placement 属性和 `--semi-*` CSS Token，并将它们视为样式兼容契约。
- 不得为了“Vue 命名风格”更名 class/Token 或简化 SCSS 依赖的 DOM 结构；项目 npm 包名和品牌名可与 Semi 独立。
- 浏览器实现、验收和回归只覆盖项目锁定的 Playwright Chromium 构建；Firefox、WebKit 及其它 Chromium 衍生浏览器不在兼容性承诺内。
- 主视觉证据必须在同一 Chromium 进程环境中对照 React 参考场景与 Vue 场景，并固定浏览器构建、字体、viewport、DPR、Locale、主题、数据和动画时刻。
- 每个组件编码前必须建立基于本地源码的对齐矩阵，至少覆盖公开 API、默认值、受控/非受控状态、事件顺序、插槽或 render prop 映射、DOM/class、计算样式、键盘与焦点、ARIA、Portal、动效、暗色、RTL、国际化和 SSR（适用时）。
- 现有 Vue 实现、测试、快照和截图都不是正确性来源；它们必须独立对照固定源码和同环境浏览器结果。
- 未解释的 API、行为或视觉差异存在时，不得宣称组件完成像素级复刻。
- 每个组件只有在以下产物同时完成后才能标记完成：对齐矩阵、Vue 源码、中英文文档与 React→Vue 迁移表、类型验证、单元测试、Chromium 行为/无障碍/适用时 SSR 测试、React/Vue 计算样式与截图对照、真实发布包安装验证。
- 每完成一个 `ready` 垂直切片，必须在同一次提交中同步更新 `README.md` 的完成数量、完成列表和下一组件；README 未更新时不得提交该切片。
- 测试优先验证公开行为，不依赖私有 state/method 或 Foundation spy 证明正确性；结构快照和视觉截图不得是唯一断言。
- `apps/parity-vue` 的组件场景必须从公开组件子路径导入，不得从 `@aifuxi/semi-ui-vue` 根入口导入；浏览器工作台应只加载当前场景依赖，并以简单场景不超过 200 个请求作为回归门禁。
- 任何无法等价的差异必须在 deviation 记录中说明源码证据、原因、用户影响和验收结论；“暂未实现”不是可接受 deviation。
- 视觉回归对组件、Portal 弹层或最小完整场景单独裁剪，不用大页面面积稀释组件差异。
- 关键 computed style 逐项精确相等；对应节点的 bounding rect 各轴差值不超过 `0.5 CSS px`。
- Playwright 截图 `threshold` 不高于 `0.1`，`maxDiffPixelRatio` 不高于 `0.001`（0.1%）。数值通过不代表可见或局部集中差异可被接受，此类差异仍必须定位并消除或记录为 accepted deviation。
- 截图 mask 只能用于有源码/运行时证据的非确定内容，且必须使用最小范围并在测试中注明原因；禁止为让测试通过而扩大 mask 或盲目更新基线。
- 所有组件的默认视觉矩阵包含桌面 viewport `1440×900`、DPR 1、light/dark；不得因组件“看起来与主题无关”而跳过 dark。
- 项目定位为桌面端组件库，不作移动端兼容承诺。只有固定源码的公开 API、文档或实现明确依赖响应式断点、触摸输入或可视区域边界时，才增加窄视口 `390×844`、DPR 1 或触摸专项；窄视口只验证对应公开行为，不为所有组件复制完整 light/dark 视觉矩阵，也不构成移动端兼容承诺。方向敏感组件增加 RTL 场景。
- 国际化敏感组件对 zh-CN/en-US 执行视觉与行为对照；全部 57 个 Locale 必须通过数据完整性、公开导出和可渲染验证。
- 默认场景矩阵是最低门槛；每个组件仍须按对齐矩阵增加适用的 hover、active、focus-visible、disabled、loading、validation、open/close、键盘、Portal 和动画场景。

## 仓库与发布边界

- 项目使用 pnpm workspace 单仓库，统一 lockfile、脚本入口和内部包版本策略。
- Vue 组件、Foundation 集成层、默认主题、图标、插画与测试基础设施分包管理；参考 React 应用与 Vue 文档应用放在 `apps/` 下。
- 固定目录分别是：`apps/reference-react`、`apps/docs`、`apps/parity-vue`、`packages/ui`、`packages/foundation-integration`、`packages/theme-default`、`packages/icons`、`packages/icons-lab`、`packages/illustrations` 和 `packages/test-infra`；详细依赖方向见 `docs/architecture/workspace.md`。
- 对外发布主组件包和独立的默认主题、图标、插画包；Foundation 集成层和测试基础设施保持私有。
- 内部包的目录名不得被当成尚未确认的 npm scope 或品牌承诺。
- 首版发布契约是 ESM、TypeScript 声明、根 CSS 入口、逐组件样式入口和明确的 `exports`，并必须支持 tree-shaking 与 SSR-safe import。
- 暂不生成或发布 CJS/UMD；只有经真实消费环境证明必需时，才通过新的发布决策纳入。
- 每个发布包必须对 `npm pack` 结果执行安装、导入、类型、样式入口与 SSR import 验证，不得只验证 workspace 源码。
- 项目从首版起按可公开发布标准处理：保留 Semi Design MIT License 与适用的第三方声明，并对实际 `npm pack` 产物生成 SBOM/许可清单。
- 不复用 Semi Logo；对外品牌与 npm scope 使用独立名称。`.semi-*` / `--semi-*` 只是技术兼容契约，不得被表述为官方授权、合作或品牌身份。
- 新增、替换或内联任何第三方代码/资产时，必须同步更新归属、许可和 SBOM 证据，不得留到发布前补录。

## Vue 运行时与编码基线

- `vue >= 3.5` 是主组件包的 peer dependency；源码统一使用 TypeScript、Composition API 和 `<script setup lang="ts">`。
- 内部默认不使用 Options API 或 JSX；只在模板无法精确表达必需 DOM/VNode 行为时，才允许范围受限的 render function。
- 公开契约使用类型化 props/emits/slots、`v-model` 与 `InjectionKey`；props 不得由子组件修改，跨层状态必须保持 provider 实例隔离。
- React→Vue API 适配不得用普通 truthiness 代替“prop 是否显式传入”。默认值为 `true` 的 Boolean prop 必须分别验证缺省、显式 `false`、显式 `true`；读取子 VNode prop 时还必须同时覆盖 SFC 模板裸属性与 render function 输入。
- Foundation 实例、DOM、Observer、Map/Set 等外部或身份敏感对象不得被无意深层代理；根据契约使用 `shallowRef` / `shallowReactive` / `markRaw`。
- 所有公开包必须 SSR-safe import；适用组件必须验证 SSR render/hydration，DOM 查询、Portal、Observer 和全局事件只能在客户端生命周期内创建并完整清理。
- Portal、浮层和定位组件必须验证自定义容器首次挂载、Element/Document capture scroll 后重定位与卸载清理；不得在缺少上游证据时把事件目标收窄为 `Element`。

## 测试与门禁

- `failOnFlakyTests`（CI 环境已启用）和 `retries: 2` 是防抖基础配置。一个只在单独运行时通过的 spec 是 spec 的缺陷，不是 runner 不稳定——修复 spec 或添加确定性 fixture，而非增加 retries。
- 每个组件完成 = 对齐矩阵 + Vue 源码/类型 + 中英文文档与迁移表 + 黑盒单测 + Chromium 行为/键盘/焦点/ARIA/Portal/动效测试 + SSR 证据 + React/Vue computed style 与截图对照 + npm pack 验证。
- 测试优先公开行为，不把私有 state/method 或 Foundation spy 当主证据；快照必须与行为断言配对。
- Teleport/真实焦点/拖拽/ResizeObserver/computed style/动画不能用 jsdom 结果代替 Chromium 证据。
- 桌面优先矩阵（ADR 0013）：默认 1440×900 DPR1 light/dark；仅上游契约明确依赖时才加 390×844 narrow/触摸专项。

## Git
