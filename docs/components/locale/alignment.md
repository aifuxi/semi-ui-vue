# Locale v2.102.0 对齐矩阵

## 基线与路线

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，commit
  `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 固定 `content/order.js` 在 ConfigProvider 后列出 Locale。此前 inventory 已确认 57 个
  `locale/source/*.ts`，但公开 `LocaleProvider`、`LocaleConsumer` 与语言源子路径尚未形成
  独立 Vue 发布切片，因此在 Lottie 后补齐该边界。
- Chat、MarkdownRender、JsonViewer 仍依赖较重的 Markdown/AI 或 Worker 链路；Locale
  只依赖既有 ConfigProvider、Vue provide/inject 和 `date-fns@2.30.0`，可独立验收。
- 源码证据：
  - Provider/Consumer/API：`packages/semi-ui/locale/{localeProvider,localeConsumer,context,interface}.tsx`。
  - 57 份语言数据：`packages/semi-ui/locale/source/*.ts`。
  - 中英文文档：`content/other/locale/`。
  - 固定基线没有 Locale Foundation、常量或专属 SCSS。

## Vue 组件边界

| 文件                            | 单一职责                                                                     | 公开边界                                  |
| ------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------- |
| `LocaleProvider.vue`            | 将响应式 locale 注入当前 Vue 子树，不增加 DOM                                | `locale` prop、默认 slot                  |
| `LocaleConsumer.vue`            | 按优先级解析 ConfigProvider/LocaleProvider，并向作用域 slot 暴露组件语言数据 | `componentName` prop、默认 scoped slot    |
| `locale-context.ts`             | 声明实例隔离的类型化 InjectionKey                                            | 私有上下文                                |
| `locale/source/*.ts`            | 暴露 57 个可 tree-shake 的公开语言源入口                                     | `./locale/source/*` 子路径                |
| `foundation-integration/locale` | 从只读 vendor 选择性编译固定语言数据                                         | 私有构建边界；tarball 内联且不泄漏 vendor |

Provider 与 Consumer 各自只有单一上下文职责，不再拆分 composable。语言数据与
`dateFnsLocale` 保持原对象身份，不进入 Vue 深层代理；生成器只维护薄 re-export/typed
facade，不复制语言内容形成第二份可编辑源码。

## 公开 API、默认值与 Vue 映射

| React v2.102.0                         | 默认值                                              | Vue 映射                                                       | 结论                                                             |
| -------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------- |
| `LocaleProvider.locale?: Locale`       | `zh_CN`                                             | 同名 prop                                                      | prop 更新立即驱动后代，嵌套 Provider 实例隔离                    |
| `LocaleProvider.children`              | `undefined`                                         | 默认 slot                                                      | Provider 不增加 DOM                                              |
| `LocaleConsumer.componentName: string` | 运行时 `''`                                         | 必填同名 prop                                                  | 读取 `locale[componentName]`，不存在时为 `undefined`             |
| Consumer render args                   | `(localeData, localeCode, dateFnsLocale, currency)` | `v-slot="{ localeData, localeCode, dateFnsLocale, currency }"` | 位置参数改为具名作用域 slot 字段                                 |
| 57 个 `lib/es/locale/source/*`         | 各语言对象                                          | `@aifuxi/semi-ui-vue/locale/source/*`                          | 文件名、默认导出、code/currency/dateFnsLocale 与数据保持固定基线 |

`SemiLocale` 是公开 Vue facade，保留任意组件键并显式包含 `code`、`currency`、
`dateFnsLocale`。语言源声明不暴露上游 `Locale`、私有 workspace 包或 `vendor/**` 路径。

## 优先级、状态与响应式行为

1. `LocaleConsumer` 位于实际 `ConfigProvider` 内时，优先使用其 `locale`；否则读取最近
   的 `LocaleProvider`；两者都不存在时使用固定 `zh_CN`。
2. 被选 locale 没有有效 `code` 时整体回退到 `zh_CN`，不把自定义局部字段与默认值
   深合并；这与固定 `renderChildren` 一致。
3. 有 `code` 但没有 `dateFnsLocale` 时只为该参数回退 `zh_CN.dateFnsLocale`；`currency`
   不补默认值，保持 `undefined`。
4. Provider prop、ConfigProvider prop 或 `componentName` 更新时，Consumer slot payload
   同一 Vue tick 响应更新；外层 Provider 更新不得越过内层 Provider。
5. ConfigProvider locale 即使是缺少 `code` 的 truthy 对象也先取得优先权，再触发整体
   `zh_CN` 回退；不会错误退回外层 LocaleProvider。

## DOM、样式、主题、键盘与可访问性

- Provider/Consumer 都是透明上下文组件，只渲染 slot 返回值，不创建 `.semi-*` DOM。
- 固定基线没有 Locale SCSS 或 Token。`locale.css` 只包含默认主题 Token/global，证明
  light/dark 入口完整；RTL 由 ConfigProvider/调用方负责，不由 Locale 修改 DOM。
- Locale 自身没有事件、键盘、焦点、ARIA、Portal/Teleport 或动效。slot 内容的语义由
  调用方负责；场景使用普通文本与 `output`，不制造上游不存在的交互。
- 浏览器矩阵覆盖 desktop/mobile light/dark、en-US RTL，并比较 slot 输出的 computed
  style、几何和截图；无动效或非确定内容，不使用 mask。

## 国际化、SSR 与发布

- 57 个语言源必须逐个通过：默认导出、非空 `code`、组件数据对象、可 SSR import、根
  `LocaleConsumer` 可渲染，以及与固定 vendor 的 code/currency/顶层键集合一致。
- 场景使用 `en_GB`、`ja_JP` 与自定义 locale，覆盖多 Provider、Consumer、ConfigProvider
  优先级和响应式切换；zh-CN/en-US URL locale 仍执行完整视觉矩阵。
- provide/inject 与语言数据不访问 DOM，根入口、`./locale` 和代表性/全部语言子路径均
  SSR-safe；SSR 输出只包含 slot DOM，hydration 不新增包装或产生 warning。
- Vite 从只读 submodule 通过私有集成层选择性编译并内联 57 份数据。真实 tarball 验证
  根/子路径 ESM、声明、逐组件 CSS、tree-shaking、SSR import、许可证/SBOM 与无
  `vendor/**`/私有包引用。

## React → Vue 差异与 Deviation

- React Consumer 的 children 函数使用四个位置参数；Vue 使用具名作用域 slot，这是
  Vue 原生等价映射，值和优先级不变。
- React Context 可以返回任意 ReactNode；Vue slot 可以返回任意 `VNodeChild`，包括多根
  Fragment。Provider/Consumer 均不添加 DOM。
- 无未解释的行为、视觉、国际化或公开发布差异。

## 验收门禁

- 单元：默认/自定义 locale、嵌套隔离、响应式切换、缺 code 整体回退、dateFns 单项
  回退、currency、缺少组件键、ConfigProvider 优先级与具名 slot payload。
- 语言数据：57 个生成 facade 与固定 vendor 清单无漂移，逐个默认导出、code/currency、
  顶层键和 Consumer 可渲染。
- SSR/hydration：透明 DOM、根与 `./locale`/语言子路径 import、Provider/Consumer 更新、
  hydration 无 warning。
- Chromium：固定 React/Vue 多语言场景；desktop/mobile light/dark、en-US RTL；computed
  style、`0.5 CSS px` 几何、截图阈值和独立解码像素比较。
- 发布：根/`./locale`/57 个 `./locale/source/*` 运行时与声明、`locale.css`、源码边界、
  tree-shaking、真实 tarball consumer、许可证与 SPDX SBOM。

## 完成证据

- `pnpm check:locales` 验证固定 vendor 清单与 57 个生成 facade 无漂移；组件单元和
  SSR/hydration 定向测试 7 项通过，受影响组件、应用与场景注册测试 187 项通过；最终
  lint、全仓类型检查和 139 个测试文件共 984 项通过。
- Locale Chromium spec 在更新基线和不更新基线两轮均为 7/7；共享 parity harness 4/4、
  workbench smoke 2/2。desktop/mobile 的 light/dark React/Vue PNG 均字节一致；RTL PNG
  元数据不同但独立解码像素比较通过，且代表性截图已经人工查看，无裁切或可见差异。
- React 与 Vue 生产构建、主题入口、全量 57 个语言子路径 SSR import 和真实 tarball
  consumer 均通过；发布声明只引用公开 `date-fns`，没有私有 workspace 或 vendor 路径。
- 本切片没有修改共享 Playwright 运行时、全局主题或截图比较基础设施，因此按分级策略未
  重跑全部组件浏览器回归；已覆盖当前场景、共享 harness 与工作台 smoke。
- 没有 accepted deviation 或未解释差异，Locale 垂直切片标记为 `ready`。
