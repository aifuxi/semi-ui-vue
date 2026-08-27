# Radio v2.102.0 对齐矩阵

## 选择与源码证据

Radio 是固定 `content/order.js` 中 PinCode 之后的下一项。Cascader、ColorPicker、DatePicker 与 Form 仍属于更大的依赖域；Radio 的图标、布局、主题和输入基础设施已经进入 `ready`，可以独立形成可发布、可验证的垂直切片。

- 公开入口：`vendor/semi-design/packages/semi-ui/radio/index.tsx`、`radio.tsx`、`radioGroup.tsx`
- 内部 Adapter：`radioInner.tsx`、`context.ts`
- Foundation：`packages/semi-foundation/radio/{constants,radioFoundation,radioInnerFoundation,radioGroupFoundation}.ts`
- 样式：`packages/semi-foundation/radio/{radio,variables,mixin,animation,rtl}.scss`
- 中英文文档：`vendor/semi-design/content/input/radio/`
- 行为证据：`radio/__test__/{radio,radioGroup}.test.*` 与 `cypress/e2e/radio.spec.js`

## 组件边界

| Vue 模块               | 单一职责                                                            | 公开契约                                     |
| ---------------------- | ------------------------------------------------------------------- | -------------------------------------------- |
| `Radio.vue`            | 单个 Radio 的受控/非受控状态、原生 input、内容 DOM、焦点和事件顺序  | props、emits、slots、`v-model`、`focus/blur` |
| `RadioGroup.ts`        | 组值状态、options/slot 子项渲染、上下文与组级 ARIA                  | props、emits、默认 slot、`v-model`           |
| `radio-context.ts`     | 以实例隔离的 InjectionKey 传播组值、禁用、类型、尺寸、名称与 change | 私有上下文                                   |
| `RadioNodeRenderer.ts` | 输出 options/extra 中的 Vue VNodeChild                              | 私有渲染边界                                 |

三个固定 Foundation 只经 `packages/foundation-integration/src/radio.js` 接入，公开声明使用 UI 自有类型，不泄漏 `vendor/**` 或私有包路径。

## API、默认值与 Vue 映射

### Radio

| 固定 React API                       | 默认值                | Vue API                                              | 对齐说明                                            |
| ------------------------------------ | --------------------- | ---------------------------------------------------- | --------------------------------------------------- |
| `checked` / `defaultChecked`         | `undefined` / `false` | `checked`、`modelValue`、`defaultChecked`、`v-model` | 原始 VNode prop 判断受控性，缺省与显式 `false` 分离 |
| `value`                              | `undefined`           | `value`                                              | 组内用严格相等判断；事件 target 保留该值            |
| `disabled`                           | `false`               | `disabled`                                           | 子项禁用与组禁用取或                                |
| `autoFocus`                          | `false`               | `autoFocus`                                          | 传给原生 input；SSR 仅输出属性                      |
| `mode`                               | `''`                  | `'' \| 'advanced'`                                   | advanced 使用 checkbox input，允许取消选择          |
| `type`                               | `'default'`           | `'default' \| 'button' \| 'card' \| 'pureCard'`      | 保留固定 class/DOM 分支                             |
| `displayMode`                        | `''`                  | `'' \| 'vertical'`                                   | 保留 `semi-radio-vertical`                          |
| `children` / `extra`                 | -                     | 默认 slot / `extra` slot 或 prop                     | 内容和辅助信息分别生成 ARIA id                      |
| `addonClassName/addonStyle`          | -                     | 同名 camelCase props                                 | 作用于 addon span                                   |
| `addonId/extraId`                    | 自动生成              | 同名 camelCase props                                 | 显式值优先；缺省用 `useId` 稳定生成                 |
| `name`                               | group name            | `name`                                               | 子项显式 name 优先于组 name                         |
| `preventScroll`                      | `undefined`           | `preventScroll`                                      | `focus()` 原样传入                                  |
| `className/style/data-*`             | -                     | `className`、原生 class/style/data-*                 | 根 label 透传固定允许范围                           |
| `onChange/onMouseEnter/onMouseLeave` | noop                  | `@change/@mouseenter/@mouseleave`                    | group change 先于 Radio change；随后更新 Vue model  |

### RadioGroup

| 固定 React API       | 默认值           | Vue API                                          | 对齐说明                                                   |
| -------------------- | ---------------- | ------------------------------------------------ | ---------------------------------------------------------- |
| `value/defaultValue` | `undefined`      | `value`、`modelValue`、`defaultValue`、`v-model` | 支持 string/number/boolean/undefined；原始 prop 判断受控性 |
| `options`            | `undefined`      | 字符串或对象数组                                 | 对象保留 label/value/disabled/extra/style/class/addon 字段 |
| `direction`          | `'horizontal'`   | 同名                                             | 输出固定 Group 方向 class                                  |
| `type`               | `'default'`      | 四种固定类型                                     | button 忽略方向 class；card/pureCard 保留对应状态          |
| `buttonSize`         | `'middle'`       | `'small' \| 'middle' \| 'large'`                 | 传播到子项 class                                           |
| `mode`               | `''`             | `'' \| 'advanced'`                               | 已选项可取消并发出 `undefined`                             |
| `name`               | `'default'` 回退 | 同名                                             | 传播到 input；子 Radio 显式 name 优先                      |
| `disabled`           | `false`          | 同名                                             | 与 option/child disabled 合并                              |
| group ARIA/id/data-* | -                | camelCase ARIA props与原生 aria/data attrs       | 根 div 保留固定属性集合                                    |
| `onChange`           | noop             | `@change`、`update:value`、`update:modelValue`   | 未改变的普通模式值不重复通知；advanced 每次通知            |

`Radio.Group` 脚本静态成员与具名 `RadioGroup` 同时导出。React `children`/`ReactNode` 分别迁移为 Vue 默认 slot 与 `VNodeChild`；React 回调字段迁移为类型化 emits。

## 状态、事件与子 VNode 门禁

- Radio 缺省、显式 `checked=false`、显式 `checked=true`、`modelValue` 与 `defaultChecked` 分别测试；受控点击不得漂移 DOM。
- Group 缺省、显式 `value=undefined`、`value=false`、`value=0`、`NaN → NaN` 分别测试，不能用 truthiness 判断。
- 原生 change 事件先进入 group Foundation；组回调先发出，随后单个 Radio 的 change/model 更新。
- advanced 模式再次点击已选项时 `checked=false`、group value 变为 `undefined`。
- options 渲染和默认 slot 渲染都覆盖；真实 SFC 模板裸 `disabled` / `:disabled="false"` 与 `h()` true/false 均验证最终 input、class、ARIA 和事件落点。
- options 中 `disabled` 与 group disabled 合并，显式子 Radio name 覆盖 group name。

## DOM、class 与样式

- Radio 根为 `label.semi-radio`，内部依次为 `span.semi-radio-inner > input + span.semi-radio-inner-display` 与可选 `div.semi-radio-content`。
- addon 是 `span.semi-radio-addon[x-semi-prop=children]`；extra 是 `div.semi-radio-extra[x-semi-prop=extra]`。
- Group 根为 `div.semi-radioGroup.semi-radioGroup-wrapper`，保留 horizontal/vertical、default/card、buttonRadio class。
- button、card、pureCard、disabled、checked、hover、三尺寸与 focus-visible class 完整保留。
- 默认主题逐组件入口编译固定 theme/global、Radio SCSS 与 IconRadio 样式；light/dark 共享 `--semi-*` token。

## 键盘、焦点、ARIA、RTL、国际化、SSR

- 原生 radio 的同 name 箭头键与 Space 行为由 Chromium 提供；advanced 因固定源码使用 checkbox，不伪造 radio roving tabindex。
- `focus()` / `blur()` 暴露真实 input；`preventScroll` 传给 focus；`:focus-visible` 只在键盘焦点时增加固定 focus class。
- input 输出 `aria-label`，有 addon/extra 时分别输出 `aria-labelledby` / `aria-describedby`；Group 输出固定五项 ARIA 与 id。
- Radio 没有 Portal、Observer 或浮层；无额外动效时序，样式 transition 使用固定零时长 token。
- RTL 由固定 `.semi-rtl` / `.semi-portal-rtl` SCSS 控制 input 左右位置和 Group direction；不改变逻辑值顺序。
- 组件没有 Locale 文案；以 zh-CN/en-US 场景文案证明任意 VNode 内容可渲染，不新增 locale 依赖。
- import 必须 SSR-safe；SSR 覆盖 standalone、Group options、slot、button/card/pureCard、ARIA 与受控值，不触碰 DOM global。

## 验收矩阵

| 维度          | 最低证据                                                                                                              |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| 单元          | 受控/非受控、advanced、事件顺序、options/slot、disabled、类型/尺寸、focus、ARIA、模板与 render Boolean                |
| SSR           | 根/子路径 import 与主要 DOM/class/ARIA 场景                                                                           |
| Chromium 行为 | 点击、受控回写、advanced 取消、键盘/focus-visible、disabled、RTL                                                      |
| 视觉          | 1440×900 light/dark、390×844 light/dark、1440×900 RTL；computed style 精确相等、rect 轴差 ≤0.5px、截图阈值 ≤0.1/0.001 |
| 发布          | 根/`radio` ESM/types、根/`radio.css`、tree-shaking、SSR import、真实 tarball 安装与许可/SBOM                          |

## Deviation

当前无 accepted deviation。Radio 已通过同环境 React/Vue 行为、computed style、几何、截图、SSR 与真实发布包验证，状态为 `ready`。
