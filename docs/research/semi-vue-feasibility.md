# Semi Design v2.102.0 Vue 完整复刻可行性调研

调研日期：2026-08-26

参考基线：`vendor/semi-design` @ `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`（`v2.102.0`）

> 当前结论用于立项和需求访谈。Vue 实现尚未开始；“完全复刻”需要先被定义成可验证的对齐契约，否则无法判断何时完成。

## 结论

技术上可行，而且 Semi 比一般 React 组件库更适合移植到 Vue；但“80+ 组件、全 API、全交互、全主题、全语言、RTL、SSR、无障碍和像素级视觉”是一项组件平台工程，不是普通的前端重写。

可行性的三个关键依据：

1. Semi 主动采用 Foundation/Adapter 分层。Foundation 承载框架无关的交互逻辑，Adapter 承担框架状态、生命周期和 DOM；官方源码明确说明可通过重写 Adapter 支持 Vue。
2. 默认主题、组件 SCSS、Token、RTL、动效、图标、插画、文档演示和测试资产都在固定源码中，可以建立可追溯的对照链。
3. 上游使用 MIT License，允许使用、修改和分发代码；直接复用代码或大量样式时必须保留版权与许可声明。项目名称、Logo 和商标是否可直接沿用仍应单独确认，MIT 本身不等于商标授权。

最大的风险不是静态像素，而是 React 与 Vue 的公开契约不同：`ReactNode`、render props、`children`、Context、ref/imperative API、受控组件语义、合成事件和 React 专属生态依赖不能机械翻译。必须先决定是追求“Vue 原生 API 下的等价体验”，还是“尽量保留 React API 名称的迁移兼容”。

## 固定源码的规模快照

以下数字来自本地 `v2.102.0` checkout，用于估算，不把目录或导出符号误当成最终组件数量：

| 维度 | 本地结果 | 说明 |
| --- | ---: | --- |
| 上游 workspace packages | 16 | 包括 UI、Foundation、主题、动效、图标、插画和构建插件 |
| README 声明的组件规模 | 80+ | 上游的产品口径 |
| `semi-ui` 一级目录 | 92 | 包含组件、内部基础设施和脚本 |
| `semi-ui/index.ts` 默认导出语句 | 104 | 包含子组件和基础对象，不等于 104 个独立组件 |
| `semi-foundation` 一级目录 | 85 | 包含 Foundation、样式、工具和脚本 |
| UI/Foundation 同名功能目录 | 79（计入 `sideBar/sidebar` 约 80） | 说明绝大多数用户侧模块有跨框架逻辑或样式入口 |
| 引用 Foundation 路径的 UI TS/TSX 文件 | 83 | 说明大量复杂交互具备复用入口 |
| 直接导入 React 的生产 UI 文件 | 339 | React 渲染层仍需系统性重写 |
| React/BaseComponent 类组件声明 | 144 | 生命周期、state 和 Adapter 桥接是迁移重点 |
| UI 生产 TS/TSX | 约 81,336 行 | 排除 `__test__` 与 `_story` |
| Foundation TS | 约 37,525 行 | 排除测试 |
| Foundation SCSS | 约 31,532 行 | 包含组件变量、布局、RTL 和动效 |
| 默认主题声明的 `--semi-*` 属性 | 375 个 | 运行时浅色/深色主题的核心公开变量 |
| Foundation + 主题唯一 SCSS 变量名 | 约 4,029 个 | 包含全局与组件级变量 |
| Foundation `rtl.scss` | 61 个 | RTL 不只是 ConfigProvider 的一个布尔值 |
| 普通图标公开导出 | 523 | 另有 84 个 Lab 图标公开导出 |
| 插画公开导出 | 16 | 需要转为 Vue SVG 组件或生成产物 |
| Locale 源文件 | 57 | 语言包与日期时间行为都需纳入验收 |
| 中英文 Markdown 文档 | 204 | 102 个主题各有中英文版本 |
| `jsx live=true` 演示 | 1,708 个 | 分布在 170 个文档文件中，可作为场景清单 |
| Semi UI 单元测试文件 | 91 | 原测试为 React/Jest/Enzyme 等栈，需转译断言意图 |
| Story 文件 | 578 | 是状态覆盖来源，不是可以直接复用的 Vue 测试 |
| Cypress E2E spec | 40 | 可提取真实交互场景和浏览器期望 |

关键证据入口：

- [`packages/semi-foundation/README.md`](../../vendor/semi-design/packages/semi-foundation/README.md)：Foundation/Adapter 跨框架设计。
- [`content/start/introduction/index.md`](../../vendor/semi-design/content/start/introduction/index.md)：多框架、主题、国际化、A11y 与兼容性说明。
- [`packages/semi-ui/index.ts`](../../vendor/semi-design/packages/semi-ui/index.ts)：公开导出面。
- [`packages/semi-theme-default/scss/global.scss`](../../vendor/semi-design/packages/semi-theme-default/scss/global.scss)：浅色、暗色和 CSS variables。
- [`packages/semi-foundation`](../../vendor/semi-design/packages/semi-foundation)：Foundation、组件 SCSS、RTL 和动效。
- [`content`](../../vendor/semi-design/content)：固定版本文档、API 和演示。
- [`LICENSE`](../../vendor/semi-design/LICENSE)：MIT 许可与上游引用的第三方声明。

## 哪些资产可以复用，哪些必须重写

| 上游资产 | 建议 | 可行性 | 主要风险 |
| --- | --- | --- | --- |
| Foundation 业务逻辑 | 优先复用，编写 Vue Adapter | 高 | 并非每个行为都已经下沉；Adapter 仍可能很大 |
| 默认主题与组件 SCSS | 保持同一 Token 值、class 和 DOM 结构后编译 | 高 | Sass 版本、浏览器、字体和 DOM 差异会改变最终像素 |
| React Adapter | 作为公开 API、DOM、事件顺序和生命周期参考 | 中 | 不能直接运行于 Vue，需逐组件重写 |
| 文档 live demos | 转成对齐场景清单，再写 Vue 示例 | 高 | React JSX/render prop 不能自动无损转换 |
| React 单元测试与 Cypress | 迁移测试意图，不复制实现细节 | 中高 | 原测试可能遗漏行为，也可能固化 React 特性 |
| 图标、Lab 图标、插画 | 用 AST/生成器转为 Vue SVG 组件 | 高 | 需保留名称、尺寸、颜色继承、可访问性和 License |
| Locale | 复用数据并验证 Vue 注入与日期组件 | 高 | 日期、时区、复数与 RTL 需要真实浏览器验证 |
| React 专属依赖 | 为 Vue 选择等价实现或自行适配 | 中低 | DOM、滚动、虚拟化、拖拽和焦点行为容易偏离 |

特别需要替换或封装的 React 机制包括：ReactDOM Portal、Context、class component 生命周期、hooks、`react-window` / `react-virtualized`、React DnD、React Resizable、Tiptap React 和 React 动画封装。替代库不能只比较功能名称，必须比较实际 DOM、事件时序、滚动、定位、焦点和 SSR 行为。

React 语义不是少数边角：排除 Story/Test 后，静态扫描仍找到 38 个使用 `cloneElement` 的文件、28 个使用 `Children.*` 的文件、33 个使用 `forwardRef` 的文件和 22 个创建 Context 的文件。这些都需要先定义 Vue slots/VNode、attrs 合并、template ref 和 provide/inject 的等价规则，不能逐处临时决定。

Foundation 也不是可以不经审查直接接入 Vue 的“纯逻辑黑盒”。固定源码中有 8 个文件残留 React 类型或引用，另有 45 个文件使用 DOM/browser global；还存在 SyntheticEvent `persist` 语义、callback 式异步 `setState` 假设，以及 Form 对 `Symbol(react.element)` 的判断。Vue Adapter 必须显式定义这些行为如何映射到 Vue 批处理、`nextTick`、VNode、受控状态和回调顺序。

## 视觉链的硬约束

- 最稳妥的边界是：原样复用默认主题、Foundation SCSS、常量和可用的 Foundation 算法；用 Vue 重写渲染器、Adapter、Portal、Context、动画挂载和运行时基础设施。
- SCSS 复用要求 Vue 输出相同的节点、兄弟关系、状态 class、placement 属性和 ARIA。Button 的 content span、Switch 覆盖全控件的原生 checkbox、Tooltip 的 Portal 嵌套与 `x-placement` 都会被选择器直接依赖，不能为“Vue 风格”随意简化 DOM。
- 源码构建顺序是 theme index → global → animation → component SCSS；只按需引入组件而漏掉 `_base/base.scss` / global token 会得到未定义 CSS variables。
- 建议首版固定 `.semi-*` 和 `--semi-*`。虽然 Sass `$prefix` 可以替换，但 Foundation JS 常量仍硬编码 `semi`；改前缀意味着同时迁移所有常量、DOM 和测试，不只是一次 CSS 搜索替换。
- 全局普通 transition 在默认主题中大量为 `0ms`，不能凭观感统一添加缓动；Tooltip、Modal、Switch、Spin 等组件各自有明确时长和离场回调顺序，必须逐组件读取。
- Portal 默认追加到 `body`，并有 `.semi-portal` / `.semi-portal-rtl`、自定义容器、滚动/缩放测量和固定层级。局部暗色区域 Teleport 到 body 后可能丢失主题作用域，需要明确主题传播规则。
- Dark 由 `body[theme-mode="dark"]`、`.semi-always-light/.semi-always-dark` 与 Shadow DOM `:host` 共同驱动，不是 ConfigProvider 中一个简单 theme ref。
- RTL 同时存在 61 份 SCSS 和至少 22 个 UI 运行时方向分支；Badge、Notification、Slider、Select 等组件会改变默认方位或计算逻辑。
- Semi 只声明 Inter 优先的字体栈，并不把 Inter 字体文件打进组件包。像素基线必须自行固定字体文件、加载完成时机、reset、body 14px/20px 和 margin。
- 图标/插画要保留 span 外壳、`currentColor`、`1em`、size/spin/rotate/fill、attrs/ref 落点和内联 SVG。多次渲染时还要处理 `mask/clipPath` id 冲突；含 CSS variables 的插画不能无损改成外部 `<img>`。
- 上游使用 `:has()`、`backdrop-filter` 和 `max-content` 等浏览器特性，目标浏览器范围会直接影响“像素级”的可达性。

## 对齐维度的实际可行性

| 目标 | 判断 | 达成条件 |
| --- | --- | --- |
| 默认主题静态视觉 | 高 | 同字体、同浏览器、同 DOM/class、同 SCSS 和同 viewport |
| light/dark 与主题 Token | 高 | 保留 Token 语义和局部主题作用域，验证计算样式 |
| hover/active/focus/disabled/loading | 高 | 真实指针与键盘测试，不能只断言 class |
| 弹层位置、遮罩、动效、焦点 | 中高 | Vue Teleport、同定位算法、同 Portal 容器与动画时序 |
| 受控/非受控状态与事件顺序 | 中高 | 逐项定义 React props 到 Vue props/emit/`v-model` 的映射 |
| React API 原样兼容 | 低且部分无意义 | `ReactNode`、render props、children/ref 必须有 Vue 等价契约 |
| Vue 原生 API 下的行为等价 | 高 | Slot、emit、provide/inject、template ref 的规则先冻结 |
| 键盘、ARIA 与焦点管理 | 中高 | 黑盒行为测试 + 浏览器 accessibility tree 检查 |
| 57 个 Locale 与 RTL | 中高 | 语言数据复用，方向敏感 DOM/SCSS 和日期场景全覆盖 |
| SSR / hydration | 中 | 禁止模块级浏览器副作用，Portal/ID/测量逻辑需双端验证 |
| 80+ 全组件与 AI/音视频等长尾 | 可行但昂贵 | 分阶段、按组件垂直验收，不能按文件批量“翻译” |

“像素级”只能在冻结的渲染环境里成立。字体文件、字体加载完成时机、操作系统抗锯齿、浏览器引擎、DPR 和截图阈值必须固定；跨所有操作系统和浏览器要求逐像素完全一致是不现实的。建议把它定义为：同一浏览器镜像、viewport、DPR、字体和数据下，关键计算样式精确相等，组件截图差异低于约定阈值，并且交互、ARIA 和事件契约另行全部通过。

## 需要先准备的决策

这些决策会改变仓库结构和公开 API，编码前必须完成：

1. **API 目标**：Vue 原生 API，还是尽量保留 Semi React prop/callback 名称；render props 如何映射为 slots。
2. **完整范围**：80+ 基础与业务组件是否全部包含；AIChat、Markdown、音视频、Lottie、Cropper、JsonViewer、Sidebar 等 Plus/AI 组件是否属于首个完整版本。
3. **分发方式**：单一 npm 包、多个 packages，还是另加按需源码分发；包名和 npm scope 是什么。
4. **Foundation 策略**：精确依赖 `@douyinfe/semi-foundation@2.102.0`、从 submodule 构建并随包内联，或在保留 License 的前提下维护项目内副本。
5. **样式兼容**：是否保留 `.semi-*` class 和 `--semi-*` Token 作为公开契约；这直接决定像素复用效率与未来命名边界。
6. **平台矩阵**：Vue 最低版本、现代浏览器范围、Electron、Nuxt/SSR、移动端、RTL 和完整 Locale 是否首版必须支持。
7. **合规与品牌**：是否允许直接复用 Foundation、SCSS、图标、插画和文档片段；如何保留 MIT/第三方声明；是否避免使用 Semi 名称与 Logo 作为产品品牌。
8. **发布契约**：是否需要同时提供 ESM、CJS、UMD、类型声明、独立/汇总 CSS、深路径 exports 和构建插件；“组件完整”与“包产物兼容”要分开定义。
9. **完成定义**：视觉阈值、API 覆盖率、文档 demo 覆盖率、测试门槛以及哪些已知差异允许写入 deviation 清单。

## 需要先准备的工程基础

建议在实现第一个组件前建立以下结构；具体包名要等待上述决策确认：

```text
apps/
  reference-react/       # 只运行 v2.102.0 参考场景
  docs-vue/              # Vue 文档与演示
packages/
  vue/                   # Vue 组件与 Adapter
  theme-default/         # 发布用主题 CSS/SCSS 产物
  icons/                 # Vue 图标生成物
  illustrations/         # Vue 插画生成物
  test-harness/          # React/Vue 同场景夹具
scripts/
  parity/                # API、demo、样式和截图清单生成
tests/
  unit/                  # props/slots/emits/state 的快速黑盒测试
  browser/               # computed style、原生事件、焦点和 Teleport
  e2e/                   # 完整用户交互与跨浏览器验证
```

工程准备清单：

- Node.js 至少满足上游声明的 `>=20.0.0`；实现仓库再固定 package manager 和 lockfile。
- 将 `vendor/**` 从 lint、typecheck、test、build、watch 和 IDE 扫描中排除。
- 固定 React 参考应用和 Vue 应用使用同一套字体、reset、主题、测试数据、viewport、DPR 与浏览器镜像。
- 建立组件 inventory：公开导出、props/defaults、事件、子组件、方法、样式入口、docs demos、tests、依赖和风险等级。
- 先断言关键 computed styles 和行为，再生成截图；禁止用更新截图来掩盖错误基线。
- 单元测试用 Vitest + Vue Test Utils 做公开契约黑盒验证；真实 CSS、焦点、拖拽、ResizeObserver、Teleport 和动画放到浏览器测试；端到端用 Playwright。
- 上游测试只作为场景语料，不能原样当作正确性证明：固定源码未使用 Playwright；Jest 运行在 jsdom/Enzyme 且 CSS 被 mock；仅发现极少结构快照，没有逐像素截图断言；Cypress CI 主要覆盖 Chrome，并全局抑制未捕获异常。Vue 版必须补上真实 CSS、多浏览器、console error 和可访问性门槛。
- CI 保存失败时的 React/Vue 双侧截图、DOM、computed style、console、trace 和 accessibility 信息。
- 每个组件采用独立、可回滚的垂直切片，不批量生成几十个组件后再统一补测试。

## 推荐的先导验证

在承诺全量周期前，先用一个横向基础设施和两个组件证明技术路线：

1. **ConfigProvider 子集**：验证 provide/inject、Locale、direction、默认 props、Portal 容器和全局配置边界。
2. **Switch**：验证 Foundation/Vue Adapter、受控与非受控、loading/disabled、attrs/ref/event 合并、键盘和真实状态样式。
3. **Tooltip**：验证 Teleport、定位、hover/focus、延迟、动效、箭头、z-index、清理和可访问性。

PoC 必须同时交付 API 映射、Vue 源码、文档示例、单元测试、浏览器行为/样式测试、React/Vue 对照截图和残余差异清单。通过后再以 **Select** 作为第二道复杂度门槛，验证搜索、多选、虚拟化、键盘、焦点和弹层组合；不建议一开始就用 Form/Table 等超大组件探索基础架构。

粗略工作量（不是承诺排期）：

- 三组件 PoC：约 3–6 工程师周。
- 30–40 个常用生产级组件：约 8–15 工程师月。
- 80+ 全组件，加主题、图标/插画、57 Locale、RTL、SSR、完整文档与多浏览器证据：约 30–60 工程师月；3–5 人团队通常仍需约 9–18 个月。

Foundation 的实际复用率、API 兼容目标和 Plus/AI 组件范围会显著改变估算。若只要求视觉相似而不要求公开 API、事件时序、A11y、RTL 和 SSR，周期会短很多，但那不应称为“完全复刻”。

## 推荐路线

1. 完成需求访谈，冻结 API、范围、分发、命名、License、平台和完成定义。
2. 生成全量 inventory 和逐组件对齐矩阵，建立复杂度与依赖图。
3. 完成 ConfigProvider 子集 → Switch → Tooltip PoC，再以 Select 做复杂度门槛；用真实浏览器证据决定 Foundation、样式和浮层方案。
4. 先交付主题、ConfigProvider、Locale、Portal、Animation、Icon 等横向基础设施。
5. 按“基础展示 → 表单输入 → 导航反馈 → 浮层 → 数据密集 → Plus/AI”分批完成垂直切片。
6. 最后做全组件组合、SSR、RTL、多 Locale、多浏览器、按需加载和包体积回归；不要把这些留成没有门槛的尾项。

## 已确认的 API 目标

项目已确认：**视觉、行为、状态、可访问性和主题与 Semi v2.102.0 对齐；公开 API 使用 Vue 原生 props / emits / slots / `v-model`，同时尽量保留 Semi 的组件名、枚举值和可自然保留的 prop 名，并提供逐项迁移表。**

`ReactNode`、render props、children、Context 和 React ref 不追求字面兼容，而是在逐组件对齐矩阵中定义 Vue 等价映射。

## 已确认的范围目标

最终目标包含 v2.102.0 的全部公开组件与资产。实施上先交付核心组件与横向基础设施，再交付 AIChat、Markdown、音视频、Lottie、Cropper、JsonViewer 等长尾能力。分阶段只改变交付顺序，不改变最终范围和验收标准。

完整范围由固定源码的公开导出、文档 API 和发布资产共同确定，不用一级目录数或主观的“常用组件”列表代替。

## 已确认的 Foundation 集成方式

只读 submodule 是 Foundation、SCSS 和相关资产的唯一源码输入。项目在构建期选择性编译并内联可复用的 Foundation/SCSS，只在项目内维护 Vue Adapter 和必要的隔离层，不复制或修改 `vendor/semi-design`。

发布产物必须包含运行所需的 Foundation 逻辑和编译后样式，消费者不需要获取 submodule。上游深层导入集中收敛在项目自有的集成边界，便于处理 React 类型、DOM global 和 Foundation Adapter 差异。

## 已确认的样式兼容边界

首个完整版本保留上游 `.semi-*` DOM/state class、placement 属性和 `--semi-*` CSS Token，以直接复用固定 SCSS、主题和下游样式扩展。新项目的 npm 包名和品牌名仍然独立。

这些 class、属性与 Token 是显式兼容面，不是可随意重命名的内部细节。如未来要更换前缀，必须作为破坏性改动重新评估 Foundation 常量、全部 DOM、主题、用户覆盖与对齐证据。

## 已确认的 Chromium 验收环境

实现、验收与回归只覆盖项目锁定的 Playwright Chromium 构建；Firefox 和 WebKit 不在兼容性范围内，Chrome、Edge 等其他 Chromium 衍生浏览器也不单独承诺。

主视觉基线是同一 Chromium 环境中的 React/Vue 同场景对照。浏览器构建、字体、viewport、DPR、Locale、主题、测试数据和动画时刻都必须固定；开发者本机不受控的 Chrome 截图不构成最终证据。

## 已确认的仓库与发布结构

项目采用 pnpm workspace 单仓库，将 Vue 组件、Foundation 集成层、默认主题、图标、插画和测试基础设施分包管理。React 参考应用与 Vue 文档应用作为 workspace app 共享锁定工具链。

对外发布一个主组件包以及独立的默认主题、图标和插画包。Foundation 集成层和测试基础设施是私有 workspace 包，不向使用者承诺深层 API。npm scope 与最终品牌名留待单独确认。

## 已确认的发布产物格式

首版发布 ESM、TypeScript 声明、根 CSS 入口、逐组件样式入口和明确 `exports`，支持 tree-shaking 与 SSR-safe import。暂不承诺 CJS 和 UMD，除非后续确定有实际消费环境需要。

验收以真实 `npm pack` 产物为准，必须在临时消费项目中验证安装、根/深层导入、类型、样式、tree-shaking 和 SSR import，不以 workspace 内源码可运行代替发布证据。

## 已确认的 Vue 运行时基线

`vue >= 3.5` 是主组件包的 peer dependency。源码统一使用 TypeScript、Composition API 和 `<script setup lang="ts">`，内部默认不使用 Options API 或 JSX；只在模板无法精确表达必需 DOM/VNode 行为时使用范围受限的 render function。

公开包必须 SSR-safe import，适用组件还需要通过 SSR render/hydration 验证。DOM、Observer、Portal 与全局事件必须在客户端生命周期内创建和清理；Foundation 实例与身份敏感对象不交给 Vue 深层代理。

## 已确认的合规与品牌边界

项目从第一个版本起按可公开发布标准处理，完整保留 Semi Design MIT License 和适用的第三方声明，并对实际发布产物生成 SBOM/许可清单。许可证据在引入代码或资产时同步维护，不留到发布前一次性补录。

项目不复用 Semi Logo，对外品牌和 npm scope 使用独立名称。保留 `.semi-*` / `--semi-*` 只表示技术与迁移兼容，不得暗示官方授权、合作关系或品牌身份。

## 已确认的组件完成门槛

每个组件在标记完成前，必须同时交付对齐矩阵、Vue 源码、中英文文档与迁移表、类型验证、单元测试、Chromium 行为/无障碍/适用时 SSR 测试、React/Vue 计算样式与截图对照、真实发布包安装验证，且没有未解释的 API、行为、ARIA 或视觉差异。

测试以公开黑盒行为为主，不依赖 Vue 内部 state/method 或 Foundation spy。结构快照与视觉截图是回归证据而非唯一正确性证明。无法等价的差异只有在说明源码证据、原因、用户影响和验收结论后，才能进入 accepted deviation。

## 已确认的视觉数值门槛

视觉回归对组件、Portal 弹层或最小完整场景本身进行裁剪截图。关键 computed style 逐项精确相等，对应节点 bounding rect 各轴差值不超过 `0.5 CSS px`；Playwright 截图 `threshold <= 0.1`，`maxDiffPixelRatio <= 0.001`（0.1%）。

数值门槛只用于吸收抗锯齿等少量噪声。任何肉眼可见或局部集中的差异，即使全局比例低于 0.1%，也必须定位并消除或形成 accepted deviation。Mask 只能覆盖有证据的非确定内容，且必须最小化并注明原因；禁止用大页面、扩大 mask 或盲目更新基线规避差异。

## 已确认的默认对照场景矩阵

所有组件执行桌面 viewport `1440×900` / DPR 1 的 light/dark 对照。响应式、输入和浮层类组件增加移动 viewport `390×844` / DPR 1；方向敏感组件增加 RTL；国际化敏感组件对 zh-CN/en-US 做视觉与行为对照，并对全部 57 个 Locale 执行数据完整性、公开导出和可渲染验证。

该矩阵是最低要求，不代替逐组件的状态矩阵。每个组件还必须根据参考源码增加适用的 hover、active、focus-visible、disabled、loading、validation、open/close、键盘、Portal、动画与清理场景。

## 调研阶段结论

启动工程骨架、全量 inventory 与 React/Vue 参考测试基础设施所需的关键技术、范围、发布和验收决策已确认。对外品牌名与 npm scope 仍需在首次公开发布前由项目所有者命名，但不阻塞使用私有 workspace 名称启动工程。
