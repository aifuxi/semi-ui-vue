# InputNumber v2.102.0 对齐矩阵

## 选择与证据

固定文档顺序中已完成的 `Input` 后首个未交付组件是 `InputNumber`。它直接复用已完成的 Input、Icon 与 ConfigProvider locale 上下文，不依赖尚未验收的 Portal/Trigger/Form，因此可独立完成完整垂直切片。

权威源码为只读 `vendor/semi-design` 的固定 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`：

- Adapter/API/DOM：`packages/semi-ui/inputNumber/index.tsx`
- 状态机与常量：`packages/semi-foundation/inputNumber/{foundation,constants}.ts`
- 样式与 RTL：`packages/semi-foundation/inputNumber/{inputNumber,variables,animation,rtl}.scss`
- 默认主题：`packages/semi-theme-default/scss/`
- 中英文文档：`content/input/inputnumber/{index,index-en-US}.md`
- 行为语料：`packages/semi-ui/inputNumber/__test__/inputNumber.test.js`

## Vue 组件边界

| 文件                                                  | 单一职责                                                                            |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `InputNumber.vue`                                     | Vue props/emits/slots/v-model、Input 组合、步进按钮、焦点/鼠标/键盘/ARIA 与受控同步 |
| `types.ts`                                            | 不泄漏 React/vendor 的公开 Vue 类型、事件、slot 与实例方法                          |
| `packages/foundation-integration/src/input-number.js` | 固定 InputNumberFoundation 的唯一运行时边界；公开构建时内联                         |

组件本身只有一个状态机与一组展示按钮，不再拆分业务子组件；步进按钮直接保留在 SFC 模板中，Input 负责已验收的输入 DOM。

## API、默认值与 Vue 映射

| React v2.102.0                                 | Vue API                                             | 默认值/结论                                                           |
| ---------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------- |
| `value/defaultValue`                           | `value`、`modelValue`/`v-model`、`defaultValue`     | 按原始 VNode prop 是否存在判断受控；`value` 优先于 `modelValue`       |
| `min/max/step/shiftStep`                       | 同名 prop                                           | `-Infinity / Infinity / 1 / 10`；方向键与按钮共用 Foundation 精度运算 |
| `precision`                                    | 同名 prop                                           | 可选；显示和步进按固定源码舍入                                        |
| `formatter/parser`                             | 同名 prop                                           | 成对映射；首次渲染 number 也执行 formatter/parser                     |
| `currency/defaultCurrency/localeCode`          | 同名 prop；缺省 locale/currency 读取 ConfigProvider | `false`；支持 Intl currency、display 与小数位配置                     |
| `scientificNotation`                           | boolean 或 `{ threshold? }`                         | `false`；仅失焦显示，聚焦恢复完整数字；currency 下不启用              |
| `hideButtons/innerButtons/keepFocus`           | 同名 prop                                           | 均 `false`；inner buttons 仅 hover/focus 出现                         |
| `pressTimeout/pressInterval`                   | 同名 prop                                           | `250 / 250`；长按定时器与 document mouseup 在卸载时清理               |
| `showClear/prefix/suffix/insetLabel/clearIcon` | 复用 Input 同名 prop/slot                           | slot 优先，InputNumber 只接管 innerButtons 时的 suffix                |
| `onChange/onNumberChange`                      | `change/numberChange` emit                          | change 可为 number/string；另发 `update:value/update:modelValue`      |
| `onUpClick/onDownClick`                        | `upClick/downClick` emit                            | 载荷为格式化值字符串和 MouseEvent                                     |
| React forwardRef                               | Vue ref                                             | 暴露 `input`、`focus()`、`blur()`、`select()`                         |

继承的 Input 原生 attrs（name、placeholder、aria/data 等）显式传给内部 Input；`class/style` 落在 `.semi-input-number` 根，`inputStyle` 落在 input。

## 状态、事件、DOM 与样式

| 维度        | 对齐结论                                                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| DOM/class   | 根 `div.semi-input-number.semi-input-number-size-*`；内部 Input；非隐藏/非 inner 时追加 `.semi-input-number-suffix-btns`                             |
| 受控/非受控 | 非受控先更新显示/number 再通知；受控通知后等待父级回写；显式 `undefined`、空串、0 与缺省分离                                                         |
| 输入/失焦   | 输入期允许中间字符串；失焦时执行 parser、precision、min/max、currency/scientific 格式化                                                              |
| 步进与顺序  | mousedown 先增减与 change/numberChange，再 upClick/downClick；mouseup/全局 mouseup 停止长按                                                          |
| 键盘/焦点   | ArrowUp/Down 阻止默认并步进；Shift 使用 shiftStep；按钮不可 Tab 聚焦；keepFocus/innerButtons 阻止 mousedown 默认                                     |
| ARIA        | input=`role=spinbutton`，设置 `aria-disabled`、`step`，有限边界设置 value min/max；按固定 Adapter 的 truthy 判断保留 0 不输出 `aria-valuenow` 的行为 |
| 动效        | 使用固定 inputNumber background/border transition；无额外 Vue Transition                                                                             |
| 暗色/RTL    | 原样编译 Token；RTL 只交换步进器 margin 与 clear/suffix 间距，不镜像 DOM 顺序                                                                        |
| 国际化      | props 优先；否则读取 ConfigProvider `locale.code/currency`；Intl 只在 currency 事件/挂载路径使用                                                     |
| Portal      | 不适用                                                                                                                                               |
| SSR         | import/setup 不访问 document；document mouseup、focus 与定时器只在客户端事件/生命周期创建并在卸载销毁                                                |

## Vue Adapter 易错点门禁

- `value/modelValue` 受控性必须检查原始 VNode key，不能用 truthiness；覆盖缺省、显式 `undefined`、空串、0 与 NaN。
- InputNumber 把受控显示值传给已完成 Input，必须避免 Input 的受控回滚吞掉 Foundation 的同步格式化；父级回写前保持外部值契约。
- document `mouseup` 只能在客户端注册；鼠标离开按钮后的全局清理、重复注册覆盖与卸载销毁必须测试。
- `innerButtons` 替换 suffix 只发生在 hover/focus；普通 suffix slot/prop 在其余状态完整保留。

## 测试与视觉矩阵

- 单元：默认/受控/非受控、0/空串/undefined/NaN、min/max、整数/小数 step、shiftStep、precision、formatter/parser、输入/失焦事件顺序。
- 单元：外部/内部/隐藏按钮、左右键、右键忽略、disabled/readonly、keepFocus、长按注册清理、showClear 与 suffix slot。
- 单元：currency 多 locale/display/小数位/隐藏符号、scientificNotation 聚焦/失焦，以及 ConfigProvider locale/currency 回退。
- SSR：根/子路径 import、默认/格式化/ARIA/slot 输出，无浏览器全局副作用。
- Chromium：基础、上下界、三尺寸、disabled、precision、formatter、currency、scientific、inner/hide buttons；桌面与移动端 light/dark，RTL，zh-CN/en-US 行为。
- computed style/geometry：根、Input wrapper/input、外部/内部步进器与按钮逐节点比较；bounding rect 各轴差值不超过 `0.5 CSS px`。
- 截图：组件最小完整裁剪，`threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`；另行报告是否字节一致。
- 发布：根/`input-number` 子路径、声明、`input-number.css`、真实 tarball 安装/类型/tree-shaking/SSR-safe import、SBOM 与许可。

## Deviation

- **React 开发态 warning（accepted）**：固定 `packages/semi-ui/inputNumber/index.tsx` 的 render 解构未移除 `scientificNotation`，因此它经 `...rest` 落到原生 input，React 开发构建会报告未知 DOM prop；Vue Adapter 消费该 prop 而不把它写入 DOM。用户可见 DOM、展示值和行为不受影响，浏览器门禁只接受这一条精确匹配的上游 warning，Vue 侧仍要求零 runtime error。

## 验收结论

- 单元与 SSR 行为已纳入全仓测试；全量单元测试 `222/222` 通过。
- 同一 Playwright Chromium 进程中的行为、computed style 与 geometry 对照通过；全量浏览器测试 `120/120` 通过。
- 桌面/移动、light/dark 与 RTL 的 10 张 React/Vue 组件截图逐对字节一致。
- 真实 tarball 的根/子路径导入、类型声明、逐组件样式、tree-shaking、SSR-safe import、SBOM 与许可清单验证通过。
