# Skeleton v2.102.0 对齐矩阵

状态：`ready`。唯一基线为本地 Semi Design `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 选择理由与组件边界

- 当前提交历史已完成 `Progress`；固定 `vendor/semi-design/content/order.js` 中其后的首个公开组件是 `Skeleton`。
- Skeleton 只依赖占位 DOM、Avatar 的尺寸/形状枚举、默认主题 Token 与动画 SCSS，不依赖尚未完成的 Spin/Toast，也不需要 Portal、Observer 或浏览器状态，因此可以独立闭环。
- `Skeleton.vue` 只负责 `loading` 内容切换、`active` 根 class、placeholder/default slot 与根 attrs；`SkeletonAvatar.vue`、`SkeletonImage.vue`、`SkeletonTitle.vue`、`SkeletonButton.vue`、`SkeletonParagraph.vue` 各自只负责一个公开占位结构。
- 固定源码没有 Skeleton Foundation class；常量仅用于 `.semi-skeleton` 前缀。Vue 实现持有 UI 自有常量，主题直接编译固定 SCSS，不建立无意义的私有运行时依赖。

## 固定源码证据

- Adapter、公开类型和 DOM：`vendor/semi-design/packages/semi-ui/skeleton/index.tsx`、`item.tsx`
- 行为测试：`vendor/semi-design/packages/semi-ui/skeleton/__test__/skeleton.test.js`
- 示例：`vendor/semi-design/packages/semi-ui/skeleton/_story/skeleton.stories.tsx`
- 常量/尺寸枚举：`vendor/semi-design/packages/semi-foundation/skeleton/constants.ts`、`avatar/constants.ts`
- 样式/动效/RTL：`vendor/semi-design/packages/semi-foundation/skeleton/skeleton.scss`、`variables.scss`、`animation.scss`、`rtl.scss`
- 中英文文档：`vendor/semi-design/content/feedback/skeleton/index.md`、`index-en-US.md`
- 默认主题 Token：`vendor/semi-design/packages/semi-theme-default/scss/index.scss`、`global.scss`、`animation.scss`

## 公开 API 与 Vue 映射

| React v2.102.0            | Vue 公开契约                                | 默认值/行为                                                                                                 | 结论                     |
| ------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------ |
| `active?: boolean`        | 同名 Boolean prop                           | `false`；只切换 `.semi-skeleton-active`                                                                     | 等价                     |
| `loading?: boolean`       | 同名 Boolean prop                           | `true`；true 渲染占位根，false 只渲染默认内容                                                               | 等价，三态门禁见下文     |
| `placeholder?: ReactNode` | 同名 `VNodeChild` prop；推荐 `#placeholder` | placeholder slot 优先于 prop                                                                                | Vue 原生增强，无能力损失 |
| `children`                | 默认 slot                                   | 只在 `loading=false` 时渲染，不额外包裹                                                                     | Vue 原生映射             |
| `className/style`         | 同名 prop，并支持原生 `class/style`         | 只在 loading 根存在时合并到 `.semi-skeleton`                                                                | Vue 原生映射             |
| 其余 DOM props            | Vue attrs                                   | loading 时透传到占位根；内容态不污染调用方子节点                                                            | 等价                     |
| `Skeleton.Avatar size`    | 同名 prop                                   | `'medium'`；枚举含 `extra-extra-small`、`extra-small`、`small`、`default`、`medium`、`large`、`extra-large` | 等价                     |
| `Skeleton.Avatar shape`   | 同名 prop                                   | `'circle'`；另支持 `square`                                                                                 | 等价                     |
| item `prefixCls`          | 同名 prop                                   | `'semi-skeleton'`                                                                                           | 等价                     |
| item `className/style`    | 同名 prop，并支持原生 `class/style`         | Avatar/Image/Title/Button 的其余 attrs 透传根 `div`                                                         | Vue 原生映射             |
| `Skeleton.Paragraph rows` | 同名 prop                                   | `4`；输出等量无内容 `li`                                                                                    | 等价                     |

Skeleton 没有受控/非受控状态、emits、`v-model`、公开 ref 方法或 ConfigProvider 默认值。

## 默认 true Boolean 与 slot 门禁

- `loading` 默认 `true`，必须分别验证缺省、显式 `false`、显式 `true`。缺省和 true 均渲染 placeholder；false 完全移除 `.semi-skeleton` 并只显示默认 slot。
- Vue 模板裸属性 `<Skeleton loading>` 与 `:loading="true"` 都保持 true；`:loading="false"` 不得被 `withDefaults` 或普通 truthiness 覆盖。
- `#placeholder` 是 React `placeholder` Node 的推荐 Vue 映射；同名 VNode prop 仍保留，二者并存时 slot 优先。
- loading 根存在时保留 `x-semi-prop="placeholder"`；内容态没有额外根节点，也不把 Skeleton 的 class/style/data attrs克隆到子内容。

## DOM、class、样式与几何

- loading 根固定为 `div.semi-skeleton`；`active=true` 追加 `.semi-skeleton-active`。
- Avatar 固定为 `div.semi-skeleton-avatar.semi-skeleton-avatar-{size}.semi-skeleton-avatar-{shape}`；默认 medium/circle 为 48×48px、50% 圆角。
- Image/Title/Button 分别是单个 `div.semi-skeleton-image|title|button`。Title 为 100%×24px，Button 为 115×32px，Image 为父容器 100%×100%。
- Paragraph 固定为 `ul.semi-skeleton-paragraph > li*n`；每行 100%×16px、下边距 10px，最后一行宽 60% 且无下边距，单行时同时命中 first/last，最终宽 100%。
- item 背景使用 `--semi-color-fill-0`；active 后变为 90deg 渐变，background-size 400% 100%，`skeleton-loading 1400ms ease infinite`。
- light/dark 由 `--semi-color-fill-0/1` 驱动。RTL 外围 `.semi-rtl` 或 `.semi-portal-rtl` 只令 `.semi-skeleton` 的 `direction: rtl`；结构本身无左右非对称间距。
- 关键 computed style 覆盖尺寸、圆角、背景、animation name/duration/timing、Paragraph margin/list-style 和 RTL direction；对应 bounding rect 各轴差值不超过 0.5 CSS px。

## 键盘、焦点、ARIA、Portal、动效、国际化与 SSR

- Skeleton 是非交互视觉占位，不创建 tabindex、键盘/指针事件、焦点管理或强加 ARIA role；调用方传入的合法 DOM attrs 在 loading 根存在时原样透传。
- 无 Portal、Teleport、Observer、全局事件、Locale 或文案。场景需覆盖 desktop/mobile、light/dark 与 RTL；无需 zh-CN/en-US 双份视觉截图。
- active CSS 动画持续运行；行为测试验证真实 animation computed style，截图通过 Playwright `animations: 'disabled'` 固定采样，不扩大 mask。
- SSR 只按 props/slots 输出静态 HTML，不读取 window/document；根导入和子路径导入均须 SSR-safe。

## 测试与发布门禁

- 单元：loading 三态、placeholder slot/prop 优先级、内容态无包装、root attr/class/style、active、五种 item DOM、Avatar 全尺寸/形状、Paragraph 默认/自定义行数及 attrs 边界。
- SSR：loading/内容态、compound item、placeholder VNode/slot 可渲染，产物不含私有路径。
- Chromium：真实 vendor source 请求、DOM/attrs、computed style、几何、active 动画、desktop/mobile light/dark、RTL，以及成对独立 PNG 的直接字节比较。
- 发包：根导出与 `@workspace/ui/skeleton` 子路径、复合静态成员、公开类型、`@workspace/theme-default/skeleton.css`、tree-shaking、SSR-safe import、许可证/SBOM 和隔离 tarball 消费。
- 最终证据：`pnpm check` 通过（104 个测试文件、743 条单元/SSR 测试，并覆盖 vendor/inventory、格式、lint、typecheck、build、主题、SSR dist 与真实 tarball）；Skeleton 专项 Chromium 7/7、共享工作台 2/2 通过。
- 五组 Skeleton React/Vue 截图分别从两个运行时独立生成，并经 `cmp` 直接验证 PNG bytes；desktop light/dark、mobile light/dark、desktop RTL 均逐字节相等。关键 computed style 精确相等，bounding rect 各轴差值均在 `0.5 CSS px` 以内。

## Deviation

- 当前没有 accepted deviation。`#placeholder` 是对 React Node prop 的 Vue 原生补充，同名函数/节点 prop 仍保留，不构成能力差异。
- 没有未解释的 API、DOM、attrs、动画、几何、主题或像素差异。
