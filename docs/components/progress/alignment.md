# Progress v2.102.0 对齐矩阵

状态：`ready`。唯一基线为本地 Semi Design `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 选择理由与边界

- 当前提交历史已完成 `Popconfirm`；固定 `vendor/semi-design/content/order.js` 中其后的首个公开组件是 `Progress`。
- Progress 只依赖既有 ConfigProvider RTL、默认主题 Token、Semi Animation 与私有颜色计算，不需要提前发布后续 Skeleton、Spin 或 Toast，能够独立完成源码、文档、浏览器和真实 tarball 验收。
- 组件边界：`Progress.vue` 负责公开 props、数字动画、百分比钳制、颜色选择和 line/circle 分派；`ProgressLine.vue` 与 `ProgressCircle.vue` 只负责各自 DOM/几何；`ProgressNodeRenderer.ts` 安全承载 `format` 返回的 `VNodeChild`。
- 固定 `generateColor` 与 Semi Animation 通过 `@workspace/foundation-integration` 私有边界接入并在发布时内联，公开源码与声明不泄漏 `vendor/**` 或私有 workspace 路径。

## 固定源码证据

- Adapter/公开类型/DOM：`vendor/semi-design/packages/semi-ui/progress/index.tsx`
- 行为测试：`vendor/semi-design/packages/semi-ui/progress/__test__/progress.test.js`
- 常量与颜色算法：`vendor/semi-design/packages/semi-foundation/progress/constants.ts`、`generates.ts`
- 样式/RTL：`vendor/semi-design/packages/semi-foundation/progress/progress.scss`、`variables.scss`、`rtl.scss`
- 中英文文档：`vendor/semi-design/content/feedback/progress/index.md`、`index-en-US.md`
- 默认主题 Token：`vendor/semi-design/packages/semi-theme-default/scss/index.scss`、`global.scss`

## 公开 API 与 Vue 映射

| React v2.102.0                              | Vue 公开契约                                  | 默认值/行为                                                                | 结论                     |
| ------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------- | ------------------------ |
| `percent?: number`                          | 同名 prop                                     | `0`；视觉值钳制到 `[0, 100]`                                               | 等价                     |
| `type?: 'line' \| 'circle'`                 | 同名 prop                                     | `'line'`                                                                   | 等价                     |
| `direction?: 'horizontal' \| 'vertical'`    | 同名 prop                                     | `'horizontal'`；只影响 line                                                | 等价                     |
| `size?: 'default' \| 'small' \| 'large'`    | 同名 prop                                     | `'default'`；small 只改变 circle 默认宽度，large 只增加 line class         | 等价                     |
| `showInfo?: boolean`                        | 同名 Boolean prop                             | `false`；circle small 即使为 true 也不显示文字                             | 等价                     |
| `format(percent)`                           | 同名函数 prop；另提供 `#format="{ percent }"` | 默认 `${percent}%`；slot 优先                                              | Vue 原生增强，无能力损失 |
| `motion?: Motion`                           | `boolean \| object \| function`               | `true`；只有显式 `false` 关闭 300ms 数字动画，其余值按上游 truthiness 启用 | 等价                     |
| `stroke?: string \| StrokePoint[]`          | 同名 prop                                     | 缺省由 SCSS 使用 `--semi-color-success`；数组复用固定 `generateColor`      | 等价                     |
| `strokeGradient?: boolean`                  | 同名 Boolean prop                             | `false`；数组区间不插值，true 时逐通道插值                                 | 等价                     |
| `orbitStroke?: string`                      | 同名 prop                                     | 缺省由 SCSS 使用 `--semi-color-fill-0`                                     | 等价                     |
| `strokeLinecap?: 'round' \| 'square'`       | 同名 prop                                     | `'round'`；只影响 circle                                                   | 等价                     |
| `strokeWidth?: number`                      | 同名 prop                                     | `4`；circle 半径为 `(width - strokeWidth) / 2`                             | 等价                     |
| `width?: number`                            | 同名 prop                                     | circle default 为 72，small 为 24；显式 width 优先                         | 等价                     |
| `className/style/id`                        | 同名 prop，并支持 Vue 原生 `class/style`      | 合并到根节点                                                               | Vue 原生映射             |
| `aria-label/aria-labelledby/aria-valuetext` | 原生 attrs                                    | 透传根 `role=progressbar`                                                  | 等价                     |
| `data-*`                                    | 原生 attrs                                    | 只把 data attrs 透传根节点                                                 | 等价                     |

Progress 没有受控/非受控状态、emits 或 `v-model`。`percent` 是单向 prop；组件内部的 `percentNumber` 只服务于可观察的文本/ARIA 数字动画，不回写调用方。

## 默认值与动画门禁

- `motion` 是默认值为 `true` 的可选 Boolean-like prop。必须分别验证缺省、显式 `false`、显式 `true`：缺省/true 使用 300ms 线性数字动画，false 在 prop 更新后立即显示新数字。
- `showInfo` 默认 `false`，另验证缺省、裸 `show-info`、显式 false；它不受 ConfigProvider 覆盖。
- percent 更新为 `NaN` 时固定 Adapter 在 `componentDidUpdate` 抛出 `[Semi Progress]:percent can not be NaN`；Vue watcher 对更新保持同一错误。初始 NaN 不额外扩张契约。
- 动画每帧按上游 `parseInt(value)` 截断，rest 恢复精确目标值；更新和卸载都会销毁旧动画。

## DOM、class、样式与几何

- line 根：`div.semi-progress.semi-progress-horizontal|vertical[role=progressbar]`；large 追加 `.semi-progress-large`。内部固定为 `.semi-progress-track > .semi-progress-track-inner`，信息文字为 `.semi-progress-line-text`。
- horizontal 用 inner `width: ${percent}%`；vertical 用 `height`。轨道 `orbitStroke` 写入 `background-color`，进度 `stroke` 写入 inner `background`。
- circle 根：`div.semi-progress-circle[role=progressbar]`，内部 `svg.semi-progress-circle-ring` 含 track/inner 两个 circle；两者共享半径、周长、dasharray，inner 的 dashoffset 为 `(1 - percent / 100) * circumference`。
- circle 的 track/inner 保留 `aria-hidden`，SVG 不参与辅助树；文字为绝对定位 `.semi-progress-circle-text`。
- 关键 computed style：line 的尺寸/圆角/transition/文字间距，circle 的 stroke/transform/transition/文字定位；对应 bounding rect 各轴差值不超过 0.5 CSS px。
- 默认主题直接编译固定 progress SCSS。light/dark 由 `--semi-color-fill-0`、`--semi-color-success`、`--semi-color-text-0`、`--semi-color-mode-minor-text` 驱动。

## 键盘、焦点、ARIA、Portal、动效与环境矩阵

- Progress 是只读状态组件，不创建 tabindex、键盘/指针事件或焦点管理。
- 根固定为 `role=progressbar`、`aria-valuemin=0`、`aria-valuemax=100`。line 的 `aria-valuenow` 是钳制后的 prop percent；circle 是钳制后的动画数字。显式 `aria-valuetext` 与标签属性透传。
- 无 Portal、Teleport、Observer、全局事件、国际化文案或 Locale 依赖。
- CSS 进度几何动画持续 0.3s；数字动画由 Semi Animation 线性执行 300ms。截图场景固定 `motion=false` 并禁用 CSS animations/transitions，避免采样时刻漂移。
- RTL 由外围 `.semi-rtl` 驱动：line 文字 margin 从左切到右，circle 文本从 left 50% 切到 right 50%；圆环仍从顶部开始。
- SSR 只输出静态 line/circle DOM，不读取 window/document；数组中的 Semi Token 在 SSR 无 DOM 时按固定算法返回 undefined，最终回退到 SCSS 默认 stroke。
- 视觉最低矩阵：桌面 1440×900 与移动 390×844、DPR 1、light/dark；方向敏感布局另验 RTL。组件无 locale 文案，因此无需 zh-CN/en-US 双份截图。

## 测试与发布门禁

- 单元：默认 line、vertical/large、circle 尺寸/几何、percent 上下界、showInfo/format slot、stroke 字符串与数组/渐变、ARIA/data attrs、motion 三态/销毁与 NaN 更新。
- SSR：line/circle/format VNode 可渲染，产物不含私有路径且不访问浏览器全局。
- Chromium：真实 vendor source 请求、DOM/ARIA、computed style、几何、颜色数组、桌面/移动 light/dark、RTL；成对 PNG 独立生成后直接比较字节。
- 发包：根导出与 `@aifuxi/semi-ui-vue/progress` 子路径、公开类型、`@aifuxi/semi-theme-default/progress.css`、SSR-safe import、tree-shaking、合规/SBOM 与隔离 tarball 消费。
- 最终证据：`pnpm check` 通过（102 个测试文件、733 条单元/SSR 测试，并覆盖 lint、typecheck、build、主题、SSR dist 与真实 tarball）；`pnpm test:browser` 389/389 通过，其中 Progress 7 项覆盖源码、行为、桌面/移动 light/dark 与 RTL。
- 五组 Progress React/Vue 截图分别从两个运行时独立读取 PNG bytes，并以 Buffer 直接比较；desktop light/dark、mobile light/dark、desktop RTL 均逐字节相等。关键 computed style 精确相等，bounding rect 各轴差值均在 `0.5 CSS px` 以内。

## Deviation

- 当前没有 accepted deviation。`#format` 是对 React render prop 的 Vue 原生补充，函数 prop 仍保留，不构成行为差异。
- 没有未解释的 API、DOM、ARIA、动画、颜色、几何或像素差异。
