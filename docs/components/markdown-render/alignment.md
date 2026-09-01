# MarkdownRender 对齐矩阵

## 固定证据

- 基线：`vendor/semi-design` `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter：`packages/semi-ui/markdownRender/index.tsx` 与 `components/*.tsx`。
- Foundation：`packages/semi-foundation/markdownRender/foundation.ts`、`constants.ts`。
- 主题：`packages/semi-foundation/markdownRender/markdownRender.scss`、`variables.scss`。
- 文档与测试：`content/plus/markdownrender/`、`packages/semi-ui/markdownRender/__test__/markdown.test.js`。

## 组件边界

- `MarkdownRender.vue`：公开根容器、异步求值生命周期、原始 VNode prop 显式性和数据属性转发。
- `runtime.ts`：把 MDX automatic JSX runtime 映射为 Vue VNode；这是模板无法表达的动态语法树边界。
- `components.ts`：上游默认 `h1`–`h6`、`p`、`a`、`img`、`table`、`code` 适配，复用现有 Typography、Image、Table、CodeHighlight。
- `@workspace/foundation-integration/markdown-render`：固定 `@mdx-js/mdx@3.0.1`、`remark-gfm@4.0.0` 的 compile/evaluate 选项与 Foundation 隔离入口。

## 公开 API

| React v2.102.0                     | Vue                                                    | 默认值/映射                                                              |
| ---------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| `raw: string`                      | `raw: string`                                          | 必填；挂载后异步求值，变化时重新求值                                     |
| `format`                           | `format?: 'md' \| 'mdx'`                               | `mdx`                                                                    |
| `components`                       | `components?: MarkdownRenderComponents`                | 与内置组件浅合并；调用方覆盖同名 tag，也可注册 MDX 自定义组件            |
| `remarkPlugins`                    | 同名 prop                                              | `[]`，透传给 MDX                                                         |
| `rehypePlugins`                    | 同名 prop                                              | `[]`，透传给 MDX                                                         |
| `remarkGfm`                        | 同名 Boolean prop                                      | 显式 prop → ConfigProvider 全局覆盖 → `true`；必须区分缺省和显式 `false` |
| `className` / `style`              | `class`、`className` / `style`                         | 合并到 `.semi-markdownRender` 根节点                                     |
| `data-*`                           | fallthrough `data-*`                                   | 根节点转发                                                               |
| `MarkdownRender.defaultComponents` | 同名静态字段，另导出 `markdownRenderDefaultComponents` | Vue Component 记录                                                       |

## 状态与事件顺序

1. SSR 和首次客户端 render 输出根 `div.semi-markdownRender`，内容为空；与上游构造时 `MDXContentComponent: 'div'`、仅在 `componentDidMount` 求值的语义一致。
2. `onMounted` 启动 `evaluate(raw)`；完成后在根容器内渲染 MDX VNode。
3. `raw`、`format`、插件或 `remarkGfm` 变化时重新求值。虽然上游只监听 `raw`，Vue 对配置 prop 的响应式更新属于 Vue 原生 prop 语义；不会改变首次渲染结果。
4. 以递增 revision 丢弃过期异步结果，避免快速更新时旧内容覆盖新内容。
5. 组件没有公开 emits、焦点或键盘状态机；链接、按钮等交互由生成节点或自定义组件按原生事件执行。

## DOM、class 与样式

- 根：`div.semi-markdownRender`，合并 `class` / `className` / `style` / `data-*`。
- 标题：现有 Typography Title，保留 `semi-markdownRender-component-header` 与对应 `.semi-typography-h*`。
- 段落：Typography Paragraph + `semi-markdownRender-component-p`。
- 链接：Typography Text 的 link 契约，最终为 `<a>`。
- 行内代码：`span.semi-markdownRender-simple-code`。
- fenced code：CodeHighlight，`lineNumber=true`，语言取 `className` 最后一个 `-` 分段。
- 图片：`div.semi-markdownRender-component-image`，Image 宽 `100%`，下方 alt 文本。
- 表格：把 MDX `thead/tbody/tr/th/td` VNode 归一化为现有 Table 的 columns/dataSource；覆盖单列与仅表头。
- 主题直接编译固定 Foundation SCSS；light/dark 颜色由 `--semi-*` token 驱动。RTL 无方向专属逻辑，但仍执行 RTL 视觉矩阵。

## 可访问性、国际化、Portal 与动效

- 保留 Markdown 生成的原生 heading/list/link/table 语义；默认 Table 使用既有可访问性实现。
- 不创建 Portal、Observer、全局事件或动效，无额外清理边界。
- 文本完全来自 `raw`，Locale 不改变解析结果；以 zh-CN 场景验证中文内容，以 en-US 文档证明 API。
- 自定义组件可包含事件表达式；与上游文档一致，只应求值可信 MDX。组件不承诺净化可信输入。

## SSR 与发布门禁

- SSR import 不访问 DOM；SSR render 只包含空根容器，hydration 后异步填充。
- 根导出、`./markdown-render` 子路径、主题 `./markdown-render.css`、Vite entry、声明、source-boundary、许可证/SBOM 和真实 tarball consumer 均需验证。
- 新依赖固定为上游实际解析版本 `@mdx-js/mdx@3.0.1` 与 `remark-gfm@4.0.0`，同步 lockfile 和合规证据。

## 行为与视觉门禁

- 单元：基础 Markdown/MDX、GFM 表格（普通/仅表头/单列/粗体）、自定义组件与事件、默认组件覆盖、raw 更新竞态、data/class/style。
- Boolean：`remarkGfm` 缺省、显式 `false`、显式 `true`，以及全局默认覆盖下显式值优先。
- SSR：空根容器、无私有路径/DOM 访问，客户端挂载后内容出现。
- Chromium：同一 BrowserContext 比较 React/Vue runtime error、请求来源、computed style、几何与截图；桌面/移动 light/dark 及 RTL。

## deviation

- `format='mdx'` 的自定义组件使用 Vue Component，而不是 React Component；事件属性映射为 Vue `onXxx`。这是框架原生迁移，不改变调用方可观察交互。
- Vue 会在 `format`、插件和 `remarkGfm` 动态变化时重新求值；React v2.102.0 仅在 `raw` 变化时重新求值。Vue 调用方无需通过额外改变 `raw` 才能应用新配置，验收为可接受的框架响应性增强。
