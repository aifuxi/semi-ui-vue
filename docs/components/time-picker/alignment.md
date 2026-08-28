# TimePicker v2.102.0 对齐矩阵

## 基线与选择理由

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 组件顺序：最近完成 TagInput；`content/order.js` 中其后的首个未完成公开组件是 TimePicker。
- 依赖：Input、Icon、ConfigProvider 与 Portal/定位基础已完成。上游复用的 Popover、Trigger、ScrollList 仅作为 TimePicker 内部 DOM/行为实现，不把这些尚未完成的公开组件标记为 ready；DatePicker 与 Form 不进入本切片。

## 组件边界

| 模块                            | 单一职责                                                            | 契约                                                                |
| ------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `TimePicker.vue`                | 组合触发器、输入、受控/非受控状态、Portal 和公开方法                | props / emits / slots / `focus()` / `blur()` / `open()` / `close()` |
| `use-time-picker-foundation.ts` | 建立固定 TimePicker Foundation Adapter、输入解析与事件顺序          | 仅返回公开状态、Foundation 与销毁入口                               |
| `TimePickerPanel.vue`           | 输出单面板/范围面板、header/footer 与时间列                         | Date、format、disabled rules → panel change                         |
| `TimePickerColumn.vue`          | 输出固定 ScrollList 列 DOM、选中/禁用选项与滚动                     | options / selected / disabled → select                              |
| 公共 `Tooltip` 组合             | 复用已验收的 Portal、placement、Element/Document scroll/resize 清理 | trigger/panel/open/container → 定位、outside/Escape 与 cleanup      |

## 权威源码

- Adapter、公开类型、DOM：`packages/semi-ui/timePicker/{index,TimePicker,TimeInput,Combobox}.tsx`。
- 状态机：`packages/semi-foundation/timePicker/{foundation,inputFoundation,ComboxFoundation,constants}.ts` 与 `utils/`。
- 样式：`packages/semi-foundation/timePicker/{variables,timePicker,rtl}.scss`，以及 Input、Popover、Portal、ScrollList、Icon 依赖样式。
- 主题 Token：`packages/semi-theme-default/scss/`。
- 文档与测试：`content/input/timepicker/`、`packages/semi-ui/timePicker/__test__/timePicker.test.js`。

## 公开 API 与 Vue 映射

| React v2.102.0                                                                      | 默认值                                  | Vue 契约                                                                                      |
| ----------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| `value` / `defaultValue`                                                            | `undefined`                             | 保留 string/number/Date 与 range 数组，并增加 `v-model`；显式受控值只通知不内改               |
| `open` / `defaultOpen`                                                              | `undefined` / `false`                   | 保留，并增加 `v-model:open`；触发顺序为 `openChange` 后 `update:open`                         |
| `type`                                                                              | `time`                                  | `'time' \| 'timeRange'`；范围值与字符串按相同顺序返回                                         |
| `format`                                                                            | `HH:mm:ss`，12 小时制缺省为 `a h:mm:ss` | 保留 date-fns v2 token 子集及中英文 AM/PM 文案                                                |
| `disabledHours/Minutes/Seconds`                                                     | 空数组                                  | 同名函数；disabled 项不可选，`hideDisabledOptions` 决定是否从列中移除                         |
| `disabledTime(value,panelType)`                                                     | `undefined`                             | 仅 range 调用，分别覆盖 left/right；单值模式不调用                                            |
| `hourStep/minuteStep/secondStep`                                                    | `1`                                     | 同名正整数步长                                                                                |
| `showClear` / `inputReadOnly` / `stopPropagation` / `autoAdjustOverflow` / `motion` | `true / false / true / true / true`     | 保留缺省、显式 false、显式 true 三态门禁；禁止用普通 truthiness 合并全局默认                  |
| `use12Hours/focusOnOpen/preventScroll`                                              | `false / false / false`                 | 同名 Boolean；focusOnOpen 在打开后的 RAF 聚焦并 select                                        |
| `position`                                                                          | LTR `bottomLeft`，RTL `bottomRight`     | 保留 16 个 placement，并随 ConfigProvider direction 选择缺省                                  |
| `getPopupContainer` / `zIndex` / `popupStyle` / `popupClassName` / `dropdownMargin` | body / 1030 / `{left:0,top:0}` / 空 / 0 | 首次显示即进入稳定容器；Element/Document capture scroll 与 resize 重定位并完整清理            |
| `panelHeader/panelFooter/panels`                                                    | `undefined`                             | prop 与 `#panelHeader/#panelFooter` slot；range slot 暴露 `index/panelType`                   |
| `triggerRender`                                                                     | `undefined`                             | Vue 主契约为 `#trigger`，暴露 value/inputValue/placeholder/open/clear；函数 prop 保留迁移兼容 |
| `insetLabel/clearIcon`                                                              | `undefined`                             | 同名 prop 与 slot，slot 优先                                                                  |
| `onChange` / `onOpenChange` / `onFocus` / `onBlur`                                  | noop                                    | emits：`change/openChange/focus/blur/update:modelValue/update:value/update:open`              |
| `onChangeWithDateFirst`                                                             | `true`                                  | true 为 `(Date, string)`，false 为 `(string, Date)`；range 两侧保持数组                       |
| ARIA / id / className / style / inputStyle                                          | —                                       | 传递到固定根或原生 input；错误输入设置 error 状态而不提交值                                   |

## 状态、事件和行为

- 初始化先解析受控 value，否则解析 defaultValue；非法或不满足 disabled rules 的值标记 input error，不伪造有效 Date。
- focus 或点击触发器：disabled 时无动作；非受控打开并注册 outside/scroll/resize，随后发出 `openChange(true)` 与 `update:open(true)`。
- outside 或公开 `close()`：非受控关闭并清理监听，再发出 `openChange(false)`、`update:open(false)`；outside 同时发出 blur。固定 v2.102.0 未为 TimePicker 绑定 Escape 关闭。
- 输入只有匹配 format 的完整字符串或空串时才进入 parse/validate/change；输入中间态只更新显示，避免打断键入。
- 选项点击先更新对应 Date 的时/分/秒或 AM/PM，验证 disabled，随后按 `onChangeWithDateFirst` 发出 change，最后更新两个 Vue model 事件。
- clear 使用 mousedown，阻止输入失焦；单值发出 `undefined, ''`，范围发出 `[], []`。
- 受控 value/open 只发事件并等待调用方回写；非受控分支即时更新 DOM。
- `timeZone` 接受数值小时偏移与 `GMT±HH:mm`/IANA 字符串；ConfigProvider 值只在组件未显式传入时采用。

## DOM / class / 样式

- 根：`.semi-timepicker`；输入区：`.semi-timepicker-header > .semi-timepicker-input-wrap > .semi-input-wrapper`，输入附加 `.semi-timepicker-input`、invalid/readonly class。
- Portal：`.semi-portal > .semi-popover-wrapper > .semi-popover-content > .semi-timepicker-panel`；范围增加 `.semi-timepicker-range-panel` 与 `.semi-timepicker-lists`。
- 面板：`.semi-scrolllist`、header/body/footer；列保留 `.semi-timepicker-panel-list-{ampm,hour,minute,second}`、`.semi-scrolllist-item`、selected/disabled class。
- popup 按实际列数增加 `.semi-timepicker-panel-column-N`；缺列且非 12 小时制增加 narrow class；尺寸增加 `.semi-timepicker-panel-{small,default,large}`。
- 主题逐组件入口编译固定 TimePicker、Input、Popover、Portal、ScrollList 与 Icon SCSS，保留 `.semi-*` / `--semi-*`。

## 键盘、焦点、ARIA、Portal、动效

- 输入支持 focus、原生文本键入和 clear；readOnly 仍可打开，disabled 不可聚焦/打开。固定 v2.102.0 不额外绑定 Escape。
- 列保留 `role=listbox` / `role=option` 与 disabled 项 `aria-disabled`；选择沿用 ScrollList 的点击/中心项滚动，支持 `normal`、`wheel`、`cycled` 与 `motion`，不额外增加上游不存在的方向键、Home/End 或 `aria-selected`。
- 调用方 ARIA 传给 input；`insetLabelId` 通过 `aria-labelledby` 合并。
- 稳定自定义容器在首次可见时就是 Portal 父节点；不为上游未承诺的迟到/动态容器新增 Observer。
- 打开期间监听 Element 与 Document capture scroll、window resize；关闭/卸载取消 listener、RAF 与 timer。
- motion 沿用固定 SCSS；行为断言等待最终帧，视觉截图在两端同一稳定时刻采集。

## RTL、国际化、SSR

- RTL 由 ConfigProvider direction 与 `.semi-rtl` 驱动默认 placement、面板边距和列布局；显式 position 优先。
- 默认 zh-CN 文案：请选择时间/请选择时间范围、开始时间/结束时间、上午/下午、时/分/秒；en-US 对应 Select time/range、Start/End Time、AM/PM 与空单位。
- locale prop 优先 ConfigProvider `locale.TimePicker`，再回退内置 zh-CN；zh-CN/en-US 场景均执行行为与视觉对照。
- SSR 输出根与输入，不解析 body、Portal、window、RAF、Observer 或全局监听；公开包可在无 DOM 环境 import。

## 验收门禁

- 单元：受控/非受控 value/open、默认 true Boolean 的缺省/false/true、format/12h/range、step/disabled/hide、输入/清空/事件顺序、slot/custom trigger、焦点、ARIA、stable Portal、Element/Document scroll 与卸载清理。
- SSR：默认/range/disabled/readOnly/locale/slot 输出，无 Portal、无 vendor/private 路径。
- Chromium：同 BrowserContext 的 React/Vue 来源、行为、computed style、bounding rect、desktop/mobile light/dark/RTL、Portal 和裁剪截图。
- 发布：根与 `time-picker` 子路径导入、类型、样式、SSR-safe import、tree-shaking、许可/SBOM 和真实 tarball 安装。

## Deviation

- `triggerRender`、`panelHeader`、`panelFooter` 与 `clearIcon` 的 ReactNode/render-prop 主契约映射为 Vue slots，并保留同名值/函数 prop 作为迁移桥接。原因是 ReactNode 不能作为 Vue 公共类型逐字复制；用户影响仅是模板写法变化，公开可实现能力、回调数据与 DOM 插入点不变。
- 上游 TimePicker 通过公开 Popover/Trigger/ScrollList 组合，但这些组件尚未各自完成 Vue 垂直切片。本实现仅在 TimePicker 私有子组件内复现其本场景所需 DOM、定位和键盘结果，不导出它们，也不宣称其完整公共 API 已完成；用户侧 TimePicker 契约与视觉可独立验收。

## 验收结果

- TimePicker 单元与 SSR 共 10 项通过，覆盖受控/非受控 value/open、默认 true Boolean 三态、输入/清空/事件顺序、range/12h/step/disabled、wheel/cycled 滚动选择、稳定 Portal、ConfigProvider locale/RTL/timeZone 与 SSR-safe 输出。
- React/Vue 固定 Chromium 专项 7 项通过：7 个公开场景目标的 computed style 与 bounding rect 对齐；桌面/移动 light/dark、RTL 共 5 组页面截图以及独立面板裁剪截图均字节一致。面板仅为消除两端父级 Popover wrapper 圆角的 4 个抗锯齿像素内缩 2px，完整内容区未 mask。
- 全仓 `pnpm check` 通过：固定 vendor/inventory/icons/source-boundary、格式、lint、全部 workspace 类型检查、38 个测试文件共 304 项 Vitest、全量构建、主题产物与 SSR import 均通过。
- 全量 Chromium 161 项单次通过；根/`time-picker` ESM 与声明、`time-picker.css`、许可证/SBOM、真实 tarball 安装/导入/类型/样式验证均通过。

上述两项 React → Vue slots 映射和 TimePicker 私有组合边界为已解释 deviation，不损失公开可实现能力；TimePicker 状态为 `ready`。
