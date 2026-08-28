# Steps v2.102.0 对齐矩阵

状态：`ready`。

## 固定证据

- React 公开入口与类型：`vendor/semi-design/packages/semi-ui/steps/index.tsx`、`step.tsx`、`basicSteps.tsx`、`basicStep.tsx`、`fillSteps.tsx`、`fillStep.tsx`、`navSteps.tsx`、`navStep.tsx`。
- DOM/事件回归：`vendor/semi-design/packages/semi-ui/steps/__test__/steps.test.js`。
- class、样式、动效、RTL：`vendor/semi-design/packages/semi-foundation/steps/{constants,steps,bacisSteps,fillSteps,navSteps,animation,rtl}.{ts,scss}`。
- 默认 Token：`vendor/semi-design/packages/semi-theme-default/scss/index.scss`。
- 中英文 API、演示与无障碍：`vendor/semi-design/content/navigation/steps/index.md`、`index-en-US.md`。

## 组件边界

- `Steps`：过滤并克隆合法 Step VNode，推导状态、序号、布局与 `change` 事件；不修改调用方 VNode/props。
- `Step`：按 `fill/basic/nav` 渲染一个步骤的固定 DOM/class、图标、点击及 Enter 行为。
- `StepsNodeRenderer`：只把 `VNodeChild` 安全转成 Vue 渲染输出，不承担业务状态。
- `Row`/`Col`：fill 模式复用已经完成的 Grid，保持上游 `.semi-row-flex/.semi-col` DOM 与几何。

## Steps 公开契约

| 维度                | v2.102.0 React                                       | Vue 映射/门禁                                                                        |
| ------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `type`              | `'fill' \| 'basic' \| 'nav'`，默认 `fill`            | 同名 prop；三类根 class 与 DOM 独立断言                                              |
| `current`           | number，默认 `0`                                     | 同名受控展示 prop；切换后立即重算子项状态                                            |
| `initial`           | number，默认 `0`                                     | 参与 fill/basic 的序号和 `change` 返回值；nav 保留上游仅影响返回值的行为             |
| `status`            | 当前项状态，默认 `process`                           | `wait/process/finish/error/warning`；子 Step 显式 status 优先                        |
| `direction`         | fill/basic 支持 horizontal/vertical，默认 horizontal | nav 按上游忽略；class、Row 方向和几何验证                                            |
| `size`              | basic/nav 支持 default/small                         | fill 按上游忽略；small class/字体验证                                                |
| `hasLine`           | basic 默认 true                                      | 必须区分缺省、显式 `false`、显式 `true`；模板与 `h()` 均覆盖                         |
| `prefixCls`         | 默认 `semi-steps`                                    | 保留同名高级兼容 prop与派生 item prefix                                              |
| `className/style`   | 根节点透传                                           | 同名兼容，同时支持 Vue `class/style` fallthrough                                     |
| `aria-label`/data-* | 根节点透传                                           | 精确保留；其它未知 attrs 不扩散                                                      |
| `onChange(index)`   | 仅点击/Enter 非当前项时调用，值为 `index + initial`  | `change` emit；先执行 Step 自身 click/keyDown，再发父 change；不在内部改变 `current` |
| children            | 只处理合法 React Element                             | 默认 slot；过滤注释、空白文本与非 VNode，递归展开 Fragment                           |

## Step 公开契约

| 维度                     | v2.102.0 React                          | Vue 映射/门禁                                                                |
| ------------------------ | --------------------------------------- | ---------------------------------------------------------------------------- |
| `title/description/icon` | ReactNode props                         | 同名 `VNodeChild` props，并提供 `#title/#description/#icon` slots；slot 优先 |
| `status`                 | 可覆盖父级推导；直接单独使用默认 `wait` | 同名 prop；是否显式传入必须从原始 VNode prop 判断，不能用 truthiness         |
| `className/style`        | item 根节点                             | 同名兼容并合并 Vue `class/style`                                             |
| `role/aria-label`        | item 根节点                             | 同名透传；固定 `tabindex=0`、`aria-current="step"` 与上游一致                |
| `onClick`                | 每次点击先调用                          | `click` emit；父 `change` 随后调用                                           |
| `onKeyDown`              | 仅 Enter 时调用，然后触发 change        | `keyDown` emit；非 Enter 不发 `keyDown`（按固定源码，而非原生全键事件语义）  |

## 状态与 DOM/class

- fill 根：`.semi-steps.semi-steps-{direction}` → `.semi-row-flex.semi-row-flex-start` → 等宽 `.semi-col` → `.semi-steps-item`。
- basic 根：`.semi-steps-basic.semi-steps-{direction}`，按 `size/hasLine` 增加 `.semi-steps-small/.semi-steps-hasline`。
- nav 根：`.semi-steps-nav`，small 时增加 `.semi-steps-small`。
- fill/basic：`stepNumber = initial + index + 1`；`stepNumber === current` 用父 status，之前 finish，之后 wait。子项显式 status 覆盖。
- 父 status=error 时，紧邻当前项之前的 child class 由上游覆盖为 `.semi-steps-next-error`；保留这一历史行为。
- basic 额外产生 `active/done`；nav 额外产生 `active/index/total` 和非末项 Chevron。
- icon 是否存在必须按原始 prop/slot 的“键存在”判断：显式空 icon 抑制默认图标；不能把空字符串等同于缺省。

## 交互、键盘、焦点与 ARIA

- 所有 item 固定可聚焦 `tabindex=0`，与上游相同；不额外发明 roving tabindex、方向键或 Home/End。
- Click：Step `click` → 非当前项父 `change`；当前项仍发 `click` 但不发 `change`。
- Enter：Step `keyDown` → 非当前项父 `change`；Space/其它键无回调。
- 固定源码把每个 item 都标为 `aria-current="step"`，Vue 保留而不擅自纠正；`role` 和 `aria-label` 原样透传。

## Vue VNode 行为门禁

- 真实 SFC 模板宿主覆盖：默认 slot、裸 `has-line`、`:has-line="false"`、Step 显式 status/icon。
- `h()` 宿主覆盖：Fragment/注释/空白过滤、显式 status、slot VNode、事件顺序。
- 克隆时不得把父级合成 click 监听与原 child 监听交给 Vue 自动数组合并，以免顺序/重复不确定；通过内部 `onStepChange` 单一回调衔接。
- props/slots 是只读输入；所有派生结果使用 computed，不维护重复 current 状态。

## 主题、动效、暗色与 RTL

- 根 CSS 继续由 v2.102.0 完整主题入口提供；新增 `steps.css` 独立入口只编译默认 Token、global/animation、Grid、Steps 与 Icon 样式。
- 关键 style/rect：根 display/direction、item height/padding/border/background/color、title/description font、icon size、Col width、basic line、nav Chevron。
- 上游 steps transition duration Token 为 `none`，无需等待动画稳定帧；hover/active 仍做真实 Chromium 行为比较。
- 桌面 `1440x900` light/dark、移动 `390x844` light/dark、light RTL 必测；Steps 不含文案 Locale 逻辑，zh-CN/en-US 数据完整性由 ConfigProvider 总门禁覆盖，本切片场景文字保持一致。

## Portal、国际化与 SSR

- 无 Portal/Teleport、Observer、全局监听或 popup container。
- 无组件内 Locale 文案或日期格式化；国际化维度不适用。
- SSR 必须能从根入口与 `@workspace/ui/steps` 子路径安全 import，并稳定渲染 fill/basic/nav；不得访问 DOM。

## 发布与合规

- 根导出与 `@workspace/ui/steps` 子路径同时导出 `Steps`、`Step` 及公开类型。
- `@workspace/theme-default/steps.css` 必须指向 `dist/steps.css`；真实 tarball 消费者验证运行时导入、类型、根/逐组件样式与 SSR import。
- 构建产物不得泄漏 `vendor/**`、私有 Foundation 或 React 运行时；实际使用上游 SCSS，许可/SBOM 走现有生成门禁。

## Deviation

无 accepted deviation。

## 验收证据

- `packages/ui/src/steps/Steps.test.ts` 与 `Steps.ssr.test.ts`：公开 DOM、三种类型、状态/序号、模板裸 Boolean、render function/Fragment、显式 status/icon、Click/Enter 顺序、ARIA 与 SSR 全部通过。
- 两个工作台的 typecheck/build 通过；React 场景直接请求 `vendor/semi-design/packages/semi-ui/steps/index.tsx`。
- Chromium 专项 7 项通过：5 个 computed-style/rect 目标、点击/Enter/hover、桌面与移动 light/dark、RTL；阈值沿用仓库 `threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`。
- 10 张 Steps 基线图逐对 React/Vue PNG 字节完全一致；5 个场景 SHA-256 分别为 `72d46af8…`、`3bae486d…`、`30d207d…`、`621e977d…`、`0babc2ba…`。
- 默认主题根入口与 `steps.css` 独立入口验证通过；真实 tarball 的 exports、ESM、类型、根/逐组件样式、SSR-safe import、SBOM 与许可验证通过。
