# Checkbox v2.102.0 对齐矩阵

## 选择与证据

固定文档顺序中 `Cascader` 位于 AutoComplete 之后，但它直接依赖尚未公开验收的 Input、Popover、Trigger、Tag、TagInput、Spin、Locale、Checkbox，并复用 Tree 工具链。Checkbox 是其后的核心输入组件，也是 Cascader 与 Form 的前置依赖，因此本切片先交付 `Checkbox / CheckboxGroup`，不把多个未验收依赖域混入 Cascader。

权威源码为只读 `vendor/semi-design` 的固定 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`：

- Adapter/API/DOM：`packages/semi-ui/checkbox/{checkbox,checkboxInner,checkboxGroup,index}.tsx`、`context.ts`
- 状态机：`packages/semi-foundation/checkbox/{checkboxFoundation,checkboxGroupFoundation,constants}.ts`
- 样式：`packages/semi-foundation/checkbox/{checkbox,variables,animation,rtl}.scss` 与默认主题 Token
- 文档/无障碍：`content/input/checkbox/index.md`、`index-en-US.md`
- 行为语料：`packages/semi-ui/checkbox/__test__/checkbox.test.js`、`checkboxGroup.test.js`

## Vue 组件边界

| 文件                                              | 单一职责                                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `Checkbox.vue`                                    | 单项公开 props/emits/slots/v-model、受控/非受控状态、原生 input、ARIA、焦点与组上下文消费        |
| `CheckboxGroup.ts`                                | 组级受控/非受控值、Foundation、provide、options/default slot 与直接子 VNode `role=listitem` 装饰 |
| `checkbox-context.ts`                             | 类型化 InjectionKey；每个 Group 独立，嵌套组只消费最近实例                                       |
| `CheckboxNodeRenderer.ts`                         | 渲染 options/prop 传入的 VNodeChild，不修改调用方节点                                            |
| `packages/foundation-integration/src/checkbox.js` | 固定 Checkbox/CheckboxGroup Foundation 的唯一运行时入口；公开构建内联且不泄漏 vendor/私有路径    |

Group 需要装饰直接子 VNode，模板无法准确表达 `React.Children.toArray + cloneElement`，因此 Group 使用范围受限的 Composition API render function；Checkbox 继续使用 `<script setup lang="ts">` SFC。

## API、默认值与 Vue 映射

### Checkbox

| React v2.102.0               | Vue API                                               | 默认值/结论                                                            |
| ---------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| `checked` / `defaultChecked` | `checked`、`v-model` / `modelValue`、`defaultChecked` | `false`；checked 优先于 modelValue；按原始 VNode prop 是否存在判断受控 |
| `disabled` / `indeterminate` | 同名 prop                                             | `false`；indeterminate 只控制 class/icon，不改 checked 值              |
| `value`                      | 同名 prop                                             | 只有调用方显式传入 value 时才加入最近 CheckboxGroup                    |
| `type`                       | 同名 prop                                             | `default`；支持 `card` / `pureCard`                                    |
| `extra`                      | `extra` slot，兼容同名 VNodeChild prop                | 无；生成 extra DOM 与 `aria-describedby`                               |
| `children`                   | 默认 slot                                             | 生成 addon DOM 与 `aria-labelledby`                                    |
| `addonId` / `extraId`        | 同名 prop                                             | 未传时在客户端 mount 后生成 SSR-safe id                                |
| `preventScroll`              | 同名 prop                                             | 透传公开 `focus()` 方法                                                |
| `className` / `style`        | Vue 原生 class/style attrs                            | 落在根 `.semi-checkbox`                                                |
| `role` / `tabIndex` / `id`   | 同名 Vue prop                                         | 落在根 span；原生 input 保持可聚焦                                     |
| `aria-*`                     | camelCase props                                       | 按固定 Adapter 分配到根或 input                                        |
| `onChange`                   | `change` emit                                         | 载荷为含 target/传播控制方法的 `CheckboxEvent`                         |

额外发出 Vue 原生 `update:checked` 与 `update:modelValue`。组件实例暴露 `focus()`、`blur()` 和只读 `input`。

### CheckboxGroup

| React v2.102.0           | Vue API                                           | 默认值/结论                                                                       |
| ------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------- |
| `value` / `defaultValue` | `value`、`v-model` / `modelValue`、`defaultValue` | `[]`；按原始 VNode prop 是否存在判断受控                                          |
| `options`                | 同名 prop                                         | 支持 primitive 或 `{ label, value, disabled, extra, className, style, onChange }` |
| `disabled`               | 同名 prop                                         | `false`；组禁用覆盖子项可用状态                                                   |
| `direction`              | 同名 prop                                         | `vertical`；支持 `horizontal`                                                     |
| `type`                   | 同名 prop                                         | `default`；组上下文统一 card/pureCard                                             |
| `name`                   | 同名 prop                                         | 缺省时固定 Foundation 生成 `default`，传给组内 input                              |
| `children`               | 默认 slot                                         | 保留上下文穿透；仅直接子 VNode 补 `role=listitem`                                 |
| `onChange`               | `change` emit                                     | 返回新数组；非受控先更新，受控等待父级回写                                        |

额外发出 `update:value` 与 `update:modelValue`。保留 `Checkbox.Group = CheckboxGroup` 脚本静态成员，同时公开具名 `CheckboxGroup` 供 Vue 模板使用。

## 状态、事件、DOM 与样式

| 维度      | 对齐结论                                                                                                                                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DOM/class | 根 `span.semi-checkbox`；内部 `span.semi-checkbox-inner > input.semi-checkbox-input + span.semi-checkbox-inner-display`；内容为 `div.semi-checkbox-content > addon + extra`；Group 根为 `div.semi-checkboxGroup.semi-checkboxGroup-wrapper` |
| 单项事件  | 点击/Enter 经 Foundation：先聚焦 input；非受控先更新 checked，再发 item change/update；受控只通知；disabled 不通知                                                                                                                          |
| 组事件    | item 先发 change，再由 Group 计算数组并发 group change/update；非受控提交数组，受控保持旧视觉直至父级回写                                                                                                                                   |
| 焦点/键盘 | 原生 input 支持 Tab/Shift+Tab/Space；固定 Adapter 额外支持 Enter；只在 `:focus-visible` 时添加 focus class，鼠标点击不留下 focus-visible                                                                                                    |
| ARIA      | input 保留 checkbox 原生语义、aria-checked/disabled/labelledby/describedby；Group=`list`，直接子节点=`listitem`；disabled input 不可聚焦                                                                                                    |
| 卡片      | card/pureCard 保留固定 class；pureCard 仅将 inner 设为透明零宽，input 仍参与焦点与无障碍                                                                                                                                                    |
| 动效      | 固定 transition token 默认 0ms，不新增 Vue Transition                                                                                                                                                                                       |
| 暗色/RTL  | 默认主题 Token 原样编译；`.semi-rtl` / `.semi-portal-rtl` 使用固定 RTL 选择器，不自行镜像 DOM                                                                                                                                               |
| 国际化    | 组件没有 Locale 文案；中英文文档和场景使用相同业务数据                                                                                                                                                                                      |
| Portal    | 不适用                                                                                                                                                                                                                                      |
| SSR       | import/setup 不访问 DOM；input/addon/extra 可 SSR render；自动 id 与 focus Foundation 行为仅在客户端 mounted 后发生                                                                                                                         |

## Vue Adapter 易错点门禁

- 子 VNode：CheckboxGroup 默认 slot 的直接子节点同时覆盖真实 SFC 模板与 `h()` 宿主；裸 `disabled`、`:disabled="false"`、render function true/false 的最终 input.disabled、class、ARIA 与点击事件必须一致。Group 只补 role，不用普通 truthiness 改写子 prop。
- Group 归属：Checkbox 是否入组按其原始 VNode 上是否存在 `value` 键判断；`value=""`、`0`、`false` 均必须入组，缺省 value 的 Checkbox 保持独立状态。
- 受控显式性：`checked/value/modelValue` 均按原始 VNode 键是否存在判断，不能用值的 truthiness；显式 false、空数组与 `undefined` 重置分别测试。
- VNode 装饰不修改原节点；options 的 onChange 仍先于 Group change，默认 slot 的业务监听不被覆盖。

## 测试与视觉矩阵

- 单元：单项默认/受控/非受控、checked/modelValue 优先级、disabled、indeterminate、extra/addon id、事件对象/顺序、Enter/Space、focus-visible、focus/blur 暴露、card/pureCard；Group options/slot、value 存在性、受控/非受控、disabled、name、方向、嵌套隔离、template/render VNode Boolean 门禁与 role。
- SSR/hydration：根/子路径 import、单项和 Group DOM/ARIA、slot/extra/options、无浏览器全局副作用与 hydration 无警告。
- Chromium：固定中文文档首个基础示例；defaultChecked、disabled、indeterminate、带 extra、horizontal options、card、pureCard；桌面 `1440×900`、移动 `390×844`、light/dark 与 RTL。
- computed style/geometry：root/inner/display/addon/extra、checked/disabled/indeterminate、Group gap、card/pureCard 逐节点比较；bounding rect 各轴差值不超过 `0.5 CSS px`。
- 截图：组件最小完整裁剪，`threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`；通过后仍检查局部集中差异，并单独报告是否字节一致。
- 发布：根/`checkbox` 子路径、声明、`checkbox.css`、真实 tarball 安装、类型、tree-shaking、SSR-safe import、SBOM 与许可清单。

## Deviation

没有 accepted deviation。固定 React v2.102.0 与 Vue 场景已在同一 Chromium 进程中完成行为、ARIA、computed style、geometry、桌面/移动明暗主题及 RTL 对照；对应 React/Vue 截图字节一致。
