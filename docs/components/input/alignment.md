# Input v2.102.0 对齐矩阵

## 选择与证据

固定文档顺序中 Checkbox 之后依次是 ColorPicker、DatePicker、Form、Input。前三者都直接依赖尚未公开验收的 Input，并进一步牵涉 InputNumber、Popover、Trigger、Locale 或日期体系；Input 自身只需要现有 Icon/ConfigProvider 基础设施即可独立闭环，也是 Cascader、ColorPicker、Form、InputNumber、PinCode、Select、TreeSelect 等组件的公共前置依赖。因此本切片先交付 `Input / InputGroup / TextArea`，不把多个未验收依赖域混入当前范围。

权威源码为只读 `vendor/semi-design` 的固定 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`：

- Adapter/API/DOM：`packages/semi-ui/input/{index,inputGroup,textarea}.tsx`
- 状态机与工具：`packages/semi-foundation/input/{foundation,textareaFoundation,constants}.ts`、`util/{calculateNodeHeight,getSizingData,truncateValue}.ts`
- 样式：`packages/semi-foundation/input/{input,textarea,variables,animation,rtl}.scss`、默认主题 Token；InputGroup label 结构取自 `packages/semi-ui/form/label.tsx`
- 文档/无障碍：`content/input/input/index.md`、`index-en-US.md`
- 行为语料：`packages/semi-ui/input/__test__/{input,textArea}.test.js`

## Vue 组件边界

| 文件                                           | 单一职责                                                                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `Input.vue`                                    | 单行输入公开 props/emits/slots/v-model、受控/非受控值、前后缀/附加内容、清除、密码可见性、IME、焦点和 ARIA |
| `TextArea.vue`                                 | 多行输入值、计数、清除、IME、可见长度截断、autosize、原生 resize、行号和 Observer 生命周期                 |
| `InputGroup.ts`                                | 组 DOM、label 和直接子 VNode 的 size/disabled/focus/blur 回退合并，不修改调用方原节点                      |
| `InputNodeRenderer.ts`                         | 渲染 prop 传入的 VNodeChild，不改变业务节点                                                                |
| `packages/foundation-integration/src/input.js` | 固定 Input/TextArea Foundation 的唯一运行时入口；公开构建内联且不泄漏 vendor/私有路径                      |

InputGroup 必须装饰直接子 VNode，模板无法准确表达 `React.Children + cloneElement`，因此使用范围受限的 Composition API render function；Input 与 TextArea 使用 `<script setup lang="ts">` SFC。

## API、默认值与 Vue 映射

### Input

| React v2.102.0                           | Vue API                                                                  | 默认值/结论                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `value` / `defaultValue`                 | `value`、`v-model` / `modelValue`、`defaultValue`                        | 按原始 VNode prop 是否存在判断受控；`value` 优先于 `modelValue`          |
| `addonBefore/After`                      | 同名 prop 或同名 slot                                                    | 空字符串；保留 prepend/append DOM 与 `x-semi-prop`                       |
| `prefix/suffix`、`insetLabel`            | 同名 prop 或同名 slot                                                    | prefix 优先于 insetLabel；点击不丢失输入焦点                             |
| `mode` / `type`                          | 同名 prop                                                                | mode=password 时由 eyeClosed 在 password/text 间切换                     |
| `showClear` / `hideSuffix` / `clearIcon` | 同名 prop，clearIcon 可用 slot                                           | false；有值且 hover/focus 时显示；mousedown 清除并阻止冒泡               |
| `size` / `validateStatus`                | 同名 prop                                                                | default；warning/error class，error 强制 `aria-invalid=true`             |
| `readonly` / `disabled` / `borderless`   | 同名 prop                                                                | false；保留原生 readOnly/disabled 与 wrapper 状态 class                  |
| `getValueLength`、`maxLength/minLength`  | 同名 prop                                                                | 自定义长度时由 Foundation 截断并换算原生 minLength                       |
| `composition`                            | 同名 prop                                                                | false；启用时 composition 期间只更新内部显示，结束后通知一次             |
| `onChange` 等回调                        | `change/input/focus/blur/key* / enterPress / clear / composition*` emits | change 载荷 `(value, event)`；另发 `update:value` 与 `update:modelValue` |
| React forwardRef                         | Vue ref                                                                  | 暴露 `focus()`、`blur()`、`select()` 和只读 `input`                      |

原生 input attrs（name、autocomplete、inputmode、aria/data 等）由 `inheritAttrs: false` 明确落到 input；class/style 仍落在 wrapper，`inputStyle` 落在 input。

### TextArea

| React v2.102.0                                   | Vue API                                           | 默认值/结论                                             |
| ------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------- |
| `value` / `defaultValue`                         | `value`、`v-model` / `modelValue`、`defaultValue` | 显式受控性与 Input 相同                                 |
| `rows/cols`                                      | 同名 prop                                         | 4 / 20                                                  |
| `autosize`                                       | boolean 或 `{ minRows, maxRows }`                 | false；客户端测量并发出 `resize({height})`              |
| `resize` / `textareaStyle`                       | 同名 prop                                         | resize 只有显式传入才覆盖原生 CSS；autosize 时强制 none |
| `showCounter/maxCount`                           | 同名 prop                                         | false / 无；计数可用 getValueLength，超限只加状态 class |
| `showClear`                                      | 同名 prop                                         | false；有值、hover/focus、非 disabled/readonly 时可清除 |
| `showLineNumber` / `lineNumberStart`             | 同名 prop                                         | false / 1；行号滚动和换行高度跟随 textarea              |
| `disabledEnterStartNewLine`                      | 同名 prop                                         | false；Enter 阻止换行，Shift+Enter 保留                 |
| `composition/getValueLength/maxLength/minLength` | 同名 prop                                         | 与固定 TextAreaFoundation 一致                          |
| React forwardRef                                 | Vue ref                                           | 暴露 `focus()`、`blur()`、`select()` 和只读 `textarea`  |

### InputGroup

| React v2.102.0        | Vue API                                     | 默认值/结论                                                    |
| --------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| `size`                | 同名 prop                                   | default；传给直接子组件并生成 group size class                 |
| `disabled`            | 同名 prop                                   | 仅当子节点没有显式 disabled 时回退给子项                       |
| `onFocus/onBlur`      | `focus/blur` emit                           | 子项显式监听优先，否则由组监听接收冒泡                         |
| `label/labelPosition` | 同名 prop；label text/extra 支持 VNodeChild | 有 text 时渲染固定 Form Label DOM；top/left wrapper class 保留 |
| `children`            | 默认 slot                                   | 仅装饰直接子组件；空节点保持为空，不修改调用方 VNode           |

保留 `Input.Group`、`Input.TextArea` 静态成员，同时公开具名 `InputGroup` 与 `TextArea` 供 Vue 模板使用。

## 状态、事件、DOM 与样式

| 维度               | 对齐结论                                                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Input DOM/class    | 根 `div.semi-input-wrapper`；顺序为 prepend、prefix、`input.semi-input`、clear、suffix、mode、append；状态 class 与 fixed Adapter 一致  |
| TextArea DOM/class | 根 `div.semi-input-textarea-wrapper`；可选 lineNumber、textarea、clear、counter；autosize/native resize 包装不改变目标 class            |
| 受控事件           | 受控组件先通知 change/update，但视觉值在父级回写前保持 prop；非受控先提交内部值再通知                                                   |
| 清除顺序           | Input/TextArea 先按 Foundation 处理值和必要 blur，再 change/update，随后 clear，最后阻止冒泡                                            |
| 密码按钮           | `role=button`、`tabindex=0`、动态英文 aria-label；click/Enter/Space 切换并把焦点留在 input                                              |
| 键盘/焦点          | 原生 Tab/Shift+Tab；keypress Enter 发 enterPress；TextArea Enter 同时支持禁换行门禁；公开 focus 支持 preventScroll                      |
| IME                | composition=false 沿用原生每次 change；composition=true 只在结束时发一次业务 change，composition 事件本身仍按顺序发出                   |
| ARIA               | 原生 input/textarea 接收 aria-*；error 覆盖 aria-invalid=true；InputGroup=`role=group` 并提供 aria-label/disabled                       |
| 动效               | 固定 hover/focus/clear/password transition token；不新增 Vue Transition                                                                 |
| 暗色/RTL           | 默认主题 Token 原样编译；固定 input/textarea RTL 选择器处理附加项、图标、计数和行号，不镜像 DOM                                         |
| 国际化             | Input/TextArea 自身无 Locale 文案；InputGroup label optional 文案不在本切片公开，避免伪造 57 Locale 的 Form 契约                        |
| Portal             | 不适用                                                                                                                                  |
| SSR                | import/setup 不访问 DOM；autosize、canvas、requestAnimationFrame、ResizeObserver 与 autofocus 只在客户端 mounted/事件路径运行并完整清理 |

## Vue Adapter 易错点门禁

- InputGroup 装饰子 VNode时，`disabled` 按“子节点是否存在该 prop”判断；SFC 裸 `disabled`（常见值 `''`）、`:disabled="false"`、render function true/false 都必须覆盖，不能使用普通 truthiness。
- 子项 size、disabled 与 focus/blur 合并不修改原 VNode；业务监听显式存在时先保留业务监听，组事件仍可通过原生 focusin/focusout 的 Vue group handler 观察。
- `value/modelValue` 受控性按原始 VNode key 存在判断，显式空字符串、0、undefined 重置和缺省必须区分。
- TextArea Observer、RAF 和节流回调只能在客户端存在；切换 showLineNumber/resize 与卸载后必须断开或取消，不得污染 SSR import。

## 测试与视觉矩阵

- 单元：Input 默认/受控/非受控、空值与数字、clear、prefix/suffix/addon、密码 click/键盘、readonly/disabled、三尺寸、status、borderless、max/min 自定义长度、IME、事件顺序、原生 attrs 与实例方法。
- 单元：TextArea 受控/非受控、rows/cols、clear/counter/maxCount、自定义长度截断、IME、Enter、autosize、native resize、行号/滚动/Observer 清理和实例方法。
- 单元：InputGroup label/top/left、空/单/多子项、size/disabled/listener 回退，以及 SFC template 与 `h()` 的 Boolean 显式性门禁。
- SSR/hydration：根/子路径 import、Input/TextArea/InputGroup DOM/ARIA/slots、无浏览器全局副作用与 hydration 无警告。
- Chromium：固定中文文档首个基础示例；default/value、prefix/suffix/addon、clear、password、disabled、error、InputGroup、TextArea counter/autosize/line number；桌面 `1440×900`、移动 `390×844`、light/dark 与 RTL。
- computed style/geometry：wrapper/input、prepend/prefix/suffix/clear/mode/append、group/label、textarea/counter/lineNumber 逐节点比较；bounding rect 各轴差值不超过 `0.5 CSS px`。
- 截图：组件最小完整裁剪，`threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`；通过后仍检查局部集中差异，并单独报告是否字节一致。
- 发布：根/`input` 子路径、声明、`input.css`、真实 tarball 安装、类型、tree-shaking、SSR-safe import、SBOM 与许可清单。

## Deviation

没有 accepted deviation。固定 React v2.102.0 与 Vue 场景已在同一 Chromium 进程中完成行为、ARIA、computed style、geometry、桌面/移动明暗主题及 RTL 对照；对应 React/Vue 截图字节一致。
