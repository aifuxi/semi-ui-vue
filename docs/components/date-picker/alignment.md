# DatePicker v2.102.0 对齐矩阵

## 基线与选择理由

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 公开入口：`packages/semi-ui/datePicker/index.tsx` 与 `datePicker.tsx`；状态机来自 `packages/semi-foundation/datePicker/`，样式来自 `datePicker.scss`、`animation.scss`、`rtl.scss` 与默认主题 Token。
- 文档与无障碍：`content/input/datepicker/index.md`、`index-en-US.md`；行为补充来自 `packages/semi-ui/datePicker/__test__/datePicker.test.js` 与 `cypress/e2e/datePicker.spec.js`。
- 当前 README 路线把 DatePicker 放在 ColorPicker 之后。Calendar、TimePicker、Popover、Input、Button、ScrollList、ConfigProvider、Icon 与 `date-fns`/时区依赖均已 ready，因此不再有公开依赖阻塞，可独立形成第 65 个根模块切片。

## 组件边界

| 模块                                    | 单一职责                                                 | 公开契约                                           |
| --------------------------------------- | -------------------------------------------------------- | -------------------------------------------------- |
| `DatePicker`                            | 受控/非受控值、输入、打开状态、事件顺序与面板编排        | props/emits/slots/v-model、`open/close/focus/blur` |
| `DatePickerPanel`                       | 单/双日期面板、月年导航、日期/范围/多选状态              | 只消费 UI 自有运行时类型，不公开私有 Foundation    |
| `DatePickerMonth`                       | 周标题与日期 grid DOM、ARIA、禁用及 hover/selected class | 内部组件                                           |
| 现有 `Popover` / `Input` / `TimePicker` | Portal/定位、触发输入、时间选择                          | 仅通过已发布子路径使用                             |

## 公开 API 与 Vue 映射

| React v2.102.0                                                                         | 默认值              | Vue 契约 / 验收                                                                                        |
| -------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------ |
| `value`, `defaultValue`                                                                | -                   | `modelValue`/`value` 为受控值，`defaultValue` 为非受控初值；发出 `update:modelValue` 与 `update:value` |
| `open`, `defaultOpen`                                                                  | `false`             | `open` 受控，`defaultOpen` 非受控；发出 `update:open`、`openChange`                                    |
| `type`                                                                                 | `date`              | `date/dateTime/dateRange/dateTimeRange/month/monthRange/year`                                          |
| `format`                                                                               | 随 type             | 使用固定 Foundation 的 date-fns token 和 `dateFnsLocale`                                               |
| `multiple`, `max`                                                                      | `false`, -          | 非范围 date 多选；达到 max 不再加入并触发 `maxSelect`                                                  |
| `showClear`                                                                            | 上游输入默认 true   | 保留 clear DOM、ARIA、事件与值清空顺序                                                                 |
| `onChangeWithDateFirst`                                                                | `true`              | 缺省、显式 false、显式 true 三态；false 时交换 `change` 两个参数                                       |
| `autoAdjustOverflow`, `stopPropagation`, `motion`, `autoSwitchDate`                    | `true`              | 从原始 VNode prop 判断显式性：显式值 > ConfigProvider 全局覆盖 > 固定默认值                            |
| `borderless`, `multiple`, `defaultOpen`, `syncSwitchMonth`, `insetInput`               | `false`             | 保留裸 Boolean、显式 false/true 语义                                                                   |
| `placeholder`                                                                          | Locale              | 单值字符串；范围值接受 `[start, end]`                                                                  |
| `presets`, `presetPosition`                                                            | `[]`, `bottom`      | function preset 延迟求值；`presetClick` 先于选择通知                                                   |
| `disabledDate`, `disabledTime`                                                         | 全可用              | 回调接收公开 Date/范围上下文；日期格和时间项同步 `aria-disabled`                                       |
| `renderDate`, `renderFullDate`                                                         | -                   | `#date` / `#fullDate` 插槽优先，保留函数 prop                                                          |
| `triggerRender`                                                                        | -                   | `#trigger` 插槽优先，作用域提供 value、inputValue、placeholder、open/close/clear                       |
| `topSlot/bottomSlot/leftSlot/rightSlot/prefix/insetLabel/clearIcon/rangeSeparatorNode` | -                   | 同名 Vue slot 优先，ReactNode prop 作为兼容入口                                                        |
| `getPopupContainer`                                                                    | ConfigProvider/body | 稳定容器在首次可见时就是 Portal 父节点；不为无证据的迟到容器增加轮询                                   |
| `timeZone`, `dateFnsLocale`, `locale`                                                  | ConfigProvider      | 固定时区解析/回调顺序与 zh-CN/en-US 文案                                                               |
| ref 方法                                                                               | -                   | `defineExpose({ open, close, focus, blur })`                                                           |

## 状态、事件和受控语义

- 单值选择：有效日期点击后更新非受控值，依次发出 `change(date, text)`、`update:modelValue`、`update:value`；无 `needConfirm` 时关闭面板。
- 范围选择：第一次点击只缓存开始值并聚焦结束输入；第二次完成范围后排序、通知并关闭。`dateRange/dateTimeRange` 未完成时不发 `change`。
- `needConfirm` 仅对 `dateTime/dateTimeRange` 生效；选择写入缓存，确认后提交，取消恢复已提交值并分别触发 `confirm/cancel`。
- 受控 `value`/`open` 只通知，不在父组件未回写时永久改变公开状态；prop 回写重新同步 Foundation/面板。
- 输入 Enter/blur 使用固定 parser；非法文本回退至最后合法值。clear 先清值并发 `clear`，再发 change/update。
- `onChangeWithDateFirst=false` 时仅交换 change 参数，不改变 `confirm/cancel/panelChange` 语义。

## DOM、class、样式与动效

- 触发器保留 `.semi-datepicker`、`.semi-datepicker-range`、`.semi-input-wrapper-*`、日历/清除图标及 `x-type`/`x-insetinput` 属性。
- Popup 保留 `.semi-datepicker-month-container`、`.semi-datepicker-months`、`.semi-datepicker-month`、`.semi-datepicker-navigation`、`.semi-datepicker-weeks`、`.semi-datepicker-week`、`.semi-datepicker-day` 及 selected/today/disabled/range/hover 状态 class。
- 日期面板按 type 输出一或两个 month；范围/日期时间场景保留固定宽高、preset 布局、header/footer 与 time picker 区域。
- 逐组件 CSS 直接编译固定 SCSS；不更名 `.semi-*`、`--semi-*` 或简化 SCSS 依赖的结构。
- `motion=false` 无过渡；缺省/true 使用现有 Popover motion。截图在最终帧采集，不使用扩大 mask。

## 键盘、焦点与 ARIA

- 触发 input 支持 Enter 打开/提交、Escape 关闭、Tab 正常离开；公开 `focus/blur` 直接作用于当前输入。
- month 使用 `role=grid`，week 使用 `role=row`，day 使用 `role=gridcell`；多选 grid 提供 `aria-multiselectable=true`，选中 day 提供 `aria-selected=true`。
- 禁用 day 提供 `aria-disabled=true` 且不响应点击；装饰图标 `aria-hidden=true`。
- 未选中 trigger `aria-label=Choose date`，已选中为 `Change date`；调用方 ARIA 属性透传到真实 input。
- 范围输入依 `rangeStart/rangeEnd` 记录焦点，异步更新 focus record，避免首个选择立即关闭双输入面板。

## Portal、滚动、RTL、国际化与 SSR

- Popup 使用已 ready 的 Popover/Tooltip 定位链；稳定自定义容器、Element/Document capture scroll 后几何重算、关闭/卸载清理纳入浏览器门禁。
- 方向来自 ConfigProvider；RTL 输出 `.semi-rtl`/`.semi-popover-rtl` 并翻转导航与间距，不修改日期排序语义。
- zh-CN/en-US 验证月份、星期、placeholder、preset/footer 文案；所有 Locale 数据完整性继续由 ConfigProvider 既有门禁覆盖。
- import 不访问 `window/document`；SSR 仅输出 trigger，Portal/全局监听在客户端打开后创建并在关闭/卸载时销毁。

## 验收矩阵

- 单元：单值/范围/多选、禁用、输入解析、清除、预设、受控/非受控、事件顺序、ref、三态 Boolean、插槽与 ARIA。
- SSR：根/子路径安全 import、默认与范围 trigger 渲染、无浏览器全局访问。
- Chromium：同一 BrowserContext 下 React/Vue 的请求来源、运行时错误、computed style、bounding rect 与局部截图；desktop `1440x900`、mobile `390x844`、light/dark、RTL，并覆盖打开面板、选择、键盘、自定义容器和滚动重定位。
- 发布：根导出、`@workspace/ui/date-picker`、`@workspace/theme-default/date-picker.css`、声明、SSR import、tree-shaking、真实 tarball consumer、License/SBOM。

## Deviation

- RTL 单日期场景在计算样式、全部目标几何与独立截图基线一致的前提下，React/Vue 成对 PNG 仍有不可见的抗锯齿通道差异；其中触发器 ImageMagick AE 为 `0.278431`（约 `0.0000398` 像素比）。该差异低于项目 `0.001` 门槛，因此 RTL 触发器与弹层按共享 React 参考截图执行阈值比较，不宣称字节相等；桌面/移动 light/dark 的触发器和弹层仍执行独立字节相等断言。
