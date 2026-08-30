# Slider v2.102.0 对齐矩阵

## 选择与源码证据

Slider 是固定 `vendor/semi-design/content/order.js` 中 Rating 之后、Switch 之前的表单组件；Rating、Select、Switch、Tooltip 与 ConfigProvider 已进入 `ready`，因此 Slider 的拖拽、键盘、RTL、受控状态和 Tooltip 依赖都能独立验收，不需要提前引入 Form、日期或 Tree 组件域。

- 公开 Adapter：`vendor/semi-design/packages/semi-ui/slider/index.tsx`
- Foundation：`vendor/semi-design/packages/semi-foundation/slider/{foundation,constants}.ts`
- 样式：`vendor/semi-design/packages/semi-foundation/slider/{slider,variables,animation,rtl}.scss`
- 中英文文档：`vendor/semi-design/content/input/slider/`
- 行为证据：`slider/__test__/slider.test.js`、`cypress/e2e/slider.spec.js` 与 `_story/`

## 组件边界

| Vue 模块                   | 单一职责                                                                   | 公开契约                |
| -------------------------- | -------------------------------------------------------------------------- | ----------------------- |
| `Slider.vue`               | 保留上游 DOM/class、Tooltip 组合、marks/boundary/handle 渲染与公开 Vue API | props、emits、`v-model` |
| `use-slider-foundation.ts` | 建立 Vue state、DOM 测量、拖拽/触摸监听、Foundation Adapter 与卸载清理     | 私有组合式函数          |
| Foundation integration     | 内联固定上游 Slider 状态机并隔离 `vendor/**`                               | 私有 Adapter 边界       |

## API、默认值与 Vue 映射

| React v2.102.0                      | 默认值               | Vue 契约                                            | 状态/门禁                                                                                           |
| ----------------------------------- | -------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `value` / `defaultValue`            | `undefined` / `0`    | 同名 props；增加 `modelValue` / `update:modelValue` | 显式 `value/modelValue` 为受控；非受控交互更新本地值；受控只通知并等待回写                          |
| `disabled`                          | `false`              | `disabled`                                          | handle `tabindex=-1`、`aria-disabled=true`，阻止点击、拖拽、触摸与键盘                              |
| `range`                             | `false`              | `range`                                             | 单 handle 或双 handle；双 handle 不穿越，ARIA min/max 随另一 handle 收窄                            |
| `min` / `max` / `step`              | `0 / 100 / 1`        | 同名 props                                          | 初值裁剪到闭区间；step 小数按位数稳定舍入；键盘支持 `step` 与 `10*step`                             |
| `included`                          | `true`               | `included`                                          | 必测缺省、显式 `false`、显式 `true`；false 时 track 无几何样式但 marks 仍可点击                     |
| `showMarkLabel`                     | `true`               | `showMarkLabel`                                     | 必测缺省、显式 `false`、显式 `true`；只影响 labels，不移除 dots                                     |
| `showArrow`                         | `true`               | `showArrow`                                         | 必测缺省、显式 `false`、显式 `true`；单值 Tooltip 按上游透传，range 保留固定 Adapter 行为           |
| `marks` / `tooltipOnMark`           | - / `false`          | 同名 props                                          | 仅渲染 `[min,max]` 中 marks；dot/label 点击走与 rail 相同的值变更链；可组合 Tooltip                 |
| `tipFormatter` / `tooltipVisible`   | `value => value` / - | 同名 props                                          | `tipFormatter=null` 禁止 hover/focus Tooltip；显式 visible 控制；内容支持 Vue `VNodeChild`          |
| `showBoundary`                      | `false`              | `showBoundary`                                      | wrapper hover 时切换 `semi-slider-boundary-show`，离开隐藏                                          |
| `vertical` / `verticalReverse`      | `false / false`      | 同名 props                                          | 纵向使用 top/height；reverse 保留旋转 class 与反向值映射；纵向不受 RTL 影响                         |
| `railStyle` / `style` / `className` | -                    | 同名 props；Vue `class/style` attrs 合并            | 仅根 wrapper 接收 class/style/data attr，railStyle 只应用于 rail                                    |
| `handleDot`                         | -                    | 对象或双元素数组                                    | 单值/范围分别渲染尺寸和颜色，不改变 handle 几何                                                     |
| `onChange`                          | noop                 | `change`、`update:modelValue`、`update:value`       | 交互值按升序通知；同值不重复通知                                                                    |
| `onAfterChange`                     | noop                 | `afterChange`                                       | track 点击在非受控 UI 更新后通知；handle mouse/touch/key up 通知；受控 prop 回写按固定 Adapter 通知 |
| `onMouseUp`                         | -                    | `mouseUp`                                           | 先通知原始事件，再清理临时监听并触发 afterChange                                                    |
| ARIA props / `getAriaValueText`     | -                    | camel prop 与原生 kebab attr 均支持                 | `role=slider`、value/min/max/orientation/disabled/label/valuetext 精确对齐                          |

默认值为 `true` 的 Boolean prop 使用 Vue 原生 Boolean 归一化与 `withDefaults`：缺省采用上游默认，裸属性/显式 true 为 true，显式 false 必须优先。测试分别覆盖三态，不以普通 truthiness 推断“是否传入”。

`tooltipVisible` 的上游缺省语义与显式 `false` 不同：缺省时由 hover/focus 控制，显式 `false` 才关闭 Tooltip。Vue 运行时通过显式 `undefined` 默认值保留 missing/false/true 三态，并由单元与 Chromium hover 场景共同验证。

## 状态与事件顺序

- 初值优先级为显式 `modelValue` → 显式 `value` → `defaultValue` → 单值 `0` / range `[0,0]`，Foundation mount 时裁剪到 min/max。
- rail/track/mark 点击：忽略 disabled、拖拽中和 handle 来源；选择最近 handle，计算 step 对齐值；`change/update:*` 后，非受控更新 DOM 并触发 `afterChange`，受控保持原位置。
- handle 拖拽：pointer down 记录 handle 中心偏移并注册 body mousemove/touchmove 与 window mouseup；move 先通知 change，再按受控规则更新；up 的顺序为 `mouseUp` → 清理临时监听 → 结束拖拽/隐藏 Tooltip → `afterChange`。
- 键盘：LTR 的 right/up 增加、left/down 减少；RTL 水平反转；PageUp/PageDown 为 10 倍 step，Home/End 到允许边界；有效变化通知 change 并阻止默认行为，keyup 触发 afterChange。
- 所有 document/body/window 监听均在 mouseup 或卸载时清理；组件不新增 ResizeObserver、scroll capture listener 或轮询。

## DOM / class / 样式

- 水平根为 `div.semi-slider > div.semi-slider-wrapper`；纵向根直接为 `div.semi-slider-vertical-wrapper`，并增加 `semi-slider-reverse`（适用时）。
- wrapper 子节点顺序固定为 rail → track → dots → handle 容器 → marks → boundary。
- handle 为 `span.semi-slider-handle`，拖拽时增加 `semi-slider-handle-clicked`；内点为 `.semi-slider-handle-dot`。
- 水平 LTR 使用 left/width；水平 RTL 使用 right/width 并由 `.semi-rtl` 镜像 transform；纵向使用 top/height。
- 默认水平 wrapper 高 32px、rail/track 高 4px、handle 24×24；关键 computed style 与 bounding rect 每轴误差不得超过 0.5 CSS px。

## 可访问性、Portal、主题、国际化与 SSR

- 每个 handle 可聚焦并有完整 slider ARIA；disabled 仍保留 role 但从 Tab 顺序移除。range wrapper 生成可读的 `Range: min to max` label。
- Tooltip 复用已经 ready 的 Tooltip Portal；场景使用首次显示前已稳定存在的容器语义。Slider 本身不承诺动态 popup container，也不新增定位 Observer。
- 视觉矩阵覆盖 desktop/mobile、light/dark；方向敏感场景增加 RTL，垂直与 verticalReverse 作为行为/几何场景。Slider 无 Locale 文案依赖，zh-CN/en-US 共用数值数据。
- SSR 输出 rail/track/marks/handles/ARIA，不访问 DOM、不注册全局监听且不插入 Portal；根入口与 `@aifuxi/semi-ui-vue/slider` 必须 SSR-safe import。

## 测试与完成门禁

- 单元：默认 DOM、单值/range、受控/非受控、三个默认 true Boolean 三态、marks/included、边界、handleDot、ARIA、disabled、键盘 LTR/RTL、点击/拖拽/触摸事件顺序与监听清理。
- SSR：默认/range/vertical/disabled/marks/ARIA 且无 Portal 与浏览器副作用。
- Chromium：同 BrowserContext 中来源、运行时错误、track/handle computed style、bounding rect、点击、真实 mouse drag、键盘、Tooltip、desktop/mobile light/dark 与 RTL 截图。
- 视觉取证：Slider 场景只在测试基建中将依赖 Tooltip 固定到动画最终帧；不使用 mask、不放宽阈值，React/Vue 裁剪图及场景图要求原始 PNG 字节相同。
- 发布：根/子路径导入、公开类型、`slider.css`、tree-shaking/SSR import、真实 tarball 安装及许可/SBOM。

完成证据：Slider 单元与 SSR 共 13 项通过，Slider Chromium 7 项通过；全仓 34 个测试文件、274 项单测和 147 项 Chromium 回归通过；全量构建、主题产物、SSR import 与真实 tarball 安装验证通过。

## Deviation

当前无 accepted deviation。状态：`ready`。
