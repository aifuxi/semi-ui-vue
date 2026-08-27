# PinCode v2.102.0 对齐矩阵

## 选择与证据

固定文档顺序中 `PinCode` 紧随 `InputNumber`，其直接 UI 依赖 `Input`、ConfigProvider 默认值能力与默认主题均已公开验收；后续 `Radio` 排在其后，因此本切片按既定顺序交付 PinCode，不引入尚未完成的表单聚合能力。

权威源码为只读 `vendor/semi-design` 的固定 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`：

- Adapter/API/DOM：`packages/semi-ui/pincode/index.tsx`
- 状态机：`packages/semi-foundation/pincode/foundation.ts`、`constants.ts`
- 样式：`packages/semi-foundation/pincode/{pincode,variables}.scss` 与默认主题 Token
- 文档：`content/input/pincode/index.md`、`index-en-US.md`
- 行为语料：`packages/semi-ui/pincode/__test__/pincode.test.js`

## Vue 组件边界

| 文件                                              | 单一职责                                                                   |
| ------------------------------------------------- | -------------------------------------------------------------------------- |
| `PinCode.vue`                                     | 多格 Input 编排、受控/非受控值、字符校验、焦点、键盘与粘贴公开行为         |
| `types.ts`                                        | 公开 props/emits/v-model/ref 类型，不泄漏 React 或私有 Foundation 类型     |
| `packages/foundation-integration/src/pin-code.js` | 固定 PinCode Foundation 的唯一运行时入口；公开构建内联且不泄漏 vendor 路径 |

组件只有一个呈现与交互职责，不需要拆分子组件或 composable；每格复用已经验收的 Vue `Input`，并保留上游 `.semi-input-*` DOM/class。

## API、默认值与 Vue 映射

| React v2.102.0         | Vue API                                         | 默认值/结论                                                                                                |
| ---------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `value / defaultValue` | `value`、`v-model / modelValue`、`defaultValue` | 受控性按原始 VNode key 判断；`value` 优先于 `modelValue`，受控输入后等待父级回写                           |
| `count`                | 同名 prop                                       | `6`；决定 Input 数量，运行期变更不额外改写已有 valueList                                                   |
| `format`               | 同名 prop                                       | `number`；公开类型为 `number / mixed / RegExp / (char) => boolean`，固定实现对其它运行时字符串按不限制处理 |
| `autoFocus`            | 同名 prop                                       | `true`；缺省、显式 `false`、显式 `true` 必须分开验证，只在客户端聚焦第一格                                 |
| `disabled`             | 同名 prop                                       | `false`；传给每个 Input                                                                                    |
| `size`                 | 同名 prop                                       | `default`；沿用 Input 的 `small/default/large`                                                             |
| `className / style`    | 同名 prop并兼容 Vue class/style attrs           | 落在 `.semi-pincode-wrapper` 根节点                                                                        |
| `onChange`             | `change` emit                                   | 每次接受字符、Backspace/Delete 或粘贴分步通知完整字符串                                                    |
| `onComplete`           | `complete` emit                                 | 最后一格完成后，在 change/update emits 之后通知并使最后一格失焦                                            |
| React ref              | Vue ref                                         | 暴露 `focus(index)`、`blur(index)`；focus 同步把选区放到字符末尾                                           |

Vue 额外发出 `update:value` 与 `update:modelValue`，顺序为 `change → update:value → update:modelValue`；`complete` 仅在最后一格接受字符时随后发出。

## 状态、事件、DOM 与样式

| 维度        | 对齐结论                                                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| DOM/class   | 根 `div.semi-pincode-wrapper`；每格完整复用 `div.semi-input-wrapper > input.semi-input`；不增加中间包装层                                          |
| 初始化      | 固定 Adapter 使用 `value                                                                                                                           |     | defaultValue` 初始化；因此空字符串受控值与非空 defaultValue 同时出现时初始展示 defaultValue，后续 value 变化再同步 |
| 输入        | 只取本次 Input 值的最后一个字符；组合输入期间忽略 change；校验成功后更新对应下标并前移焦点                                                         |
| 受控/非受控 | 普通输入在受控模式只通知，等待父级回写；非受控先通知再提交 valueList。固定 Foundation 的 Backspace/Delete 无条件更新本地 valueList，此行为原样保留 |
| 粘贴        | 入口立即 `preventDefault`；从当前格逐字符校验与完成，遇到首个非法字符停止，超过 count 截断                                                         |
| 键盘/焦点   | Backspace 清当前格并前移；Delete 清当前格并后移；ArrowLeft/Right 仅移动；边界按固定 valueList 长度计算；其它键不拦截                               |
| ARIA        | PinCode 本身没有额外 role/label 语义；每格保留原生 textbox、disabled 和调用方可传给根的 aria/data attrs，不伪造上游不存在的组合控件语义            |
| 动效        | PinCode 不增加 Vue Transition；复用 Input 固定的 0ms/Token 状态样式                                                                                |
| 暗色/RTL    | 默认主题 Token 原样编译；PinCode 固定源码没有专用 RTL 文件，输入框 DOM 顺序与 margin-right 规则不镜像                                              |
| 国际化      | 无内置文案；number 使用 `inputmode=numeric`，其它格式使用 `text`，中英文场景行为一致                                                               |
| Portal      | 不适用                                                                                                                                             |
| SSR         | import/setup 不访问 document；自动聚焦、selection、clipboard 和 activeElement 只在客户端事件/生命周期发生                                          |

## Vue Adapter 易错点门禁

- `autoFocus` 默认 `true`：真实模板覆盖缺省、显式 `false`、显式 `true`，并验证只有允许时第一格在 mounted 后获得焦点。
- `value/modelValue` 受控性：按当前 VNode 的 camelCase/kebab-case 原始 key 判断；覆盖缺省、显式空串、显式 `undefined`、值更新与 value 优先级。
- Foundation 的异步 Adapter：`currentActiveIndex/valueList` 提交后等待 `nextTick`，保证粘贴的逐字符父级回写和下一格 ref 已经可用。
- 组合输入：`InputEvent.isComposing=true` 不得触发校验、change、焦点迁移或 complete。
- SSR：服务端不得访问 input ref、document、selection 或 clipboard；客户端卸载后不保留全局监听（本组件不注册全局监听）。

## 测试与视觉矩阵

- 单元：默认数量/尺寸/禁用、defaultValue、value/modelValue 受控优先级与更新、空串/undefined、autoFocus 三态。
- 单元：number/mixed/RegExp/function、非法字符、已有值覆盖、组合输入、事件顺序、complete 与 focus/blur 暴露。
- 单元：Backspace/Delete/ArrowLeft/ArrowRight 边界、其它键、完整/部分/非法/空粘贴和 count 截断。
- SSR：根/子路径 import、默认/指定 count/value/disabled DOM，无浏览器全局副作用。
- Chromium：固定中文文档首个 small/default/large 示例，以及空值、禁用、mixed、四位码；桌面 `1440×900`、移动 `390×844`、light/dark 与 RTL。
- computed style/geometry：根、三尺寸 wrapper/input、disabled 与间距逐节点比较；bounding rect 各轴差值不超过 `0.5 CSS px`。
- 截图：组件最小完整裁剪，`threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`；通过后仍单独检查是否字节一致。
- 发布：根/`pin-code` 子路径、声明、`pin-code.css`、真实 tarball 安装/类型/tree-shaking/SSR-safe import、SBOM 与许可。

## Deviation

没有 accepted deviation。Vue Adapter 显式把格式映射为原生 `inputmode`，避免 Vue 组件 fallthrough 把 camelCase prop 序列化为非标准 `input-mode`；最终 DOM、输入行为与固定 React 源码一致。

## 验收结论

- 全仓静态门禁、类型检查、全量构建、主题和源码边界检查通过；单元与 SSR 共 `236/236` 通过。
- 同一 Playwright Chromium 进程中的输入、自动聚焦、键盘、粘贴、disabled、computed style 与 geometry 对照通过；全量浏览器回归 `126/126` 通过。
- 桌面/移动、light/dark 与 RTL 的 10 张 React/Vue 场景截图逐对 SHA-1 相同；六个最小组件目标的即时截图也逐字节相同。
- 真实 tarball 的根/`pin-code` 子路径、类型声明、`pin-code.css`、tree-shaking、SSR-safe import、SBOM 与许可清单验证通过。
