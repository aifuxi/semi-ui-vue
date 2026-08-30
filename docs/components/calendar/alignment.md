# Calendar v2.102.0 对齐矩阵

## 路线与权威来源

- 当前路线：最近完成 Badge；Calendar 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 固定基线：Semi Design `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter 与公开类型：`packages/semi-ui/calendar/index.tsx`、`interface.ts`、`dayCalendar.tsx`、`dayCol.tsx`、`timeCol.tsx`、`weekCalendar.tsx`、`rangeCalendar.tsx`、`monthCalendar.tsx`。
- Foundation 与事件算法：`packages/semi-foundation/calendar/foundation.ts`、`eventUtil.ts`、`constants.ts`。
- 默认样式与 RTL：`packages/semi-foundation/calendar/calendar.scss`、`variables.scss`、`rtl.scss`，以及默认主题 global/token。
- 文档与行为语料：`content/show/calendar/index.md`、`index-en-US.md`、`packages/semi-ui/calendar/__test__/calendar.test.js`、`_story/Demo.tsx`。
- Calendar 不依赖 DatePicker 公共组件；现有 ConfigProvider、Icon 与 date-fns 足以提供方向、Locale、日期计算和关闭按钮。Month 的“更多事件”卡片在 Calendar 边界内实现固定 Popover DOM/Portal 行为，不提前发布后续 Popover 组件，因此可独立形成完整切片。

## Vue 组件边界

| 文件                       | 单一职责                                    | 公开契约                             |
| -------------------------- | ------------------------------------------- | ------------------------------------ |
| `Calendar.vue`             | 解析默认值、Locale、方向并按 mode 组合视图  | props、emits、命名 slots、原生 attrs |
| `CalendarDay.vue`          | 单日表头、全天区、时间轴与滚动区            | Calendar 内部                        |
| `CalendarWeek.vue`         | 周/范围共享表头、全天事件与七列/范围列      | Calendar 内部                        |
| `CalendarMonth.vue`        | 月网格、折叠事件、Portal 卡片与显式关闭     | Calendar 内部                        |
| `CalendarDayColumn.vue`    | 半小时网格、当前时间线和日内事件定位        | Calendar 内部                        |
| `CalendarTimeColumn.vue`   | 24 小时时间刻度与 Locale 文案               | Calendar 内部                        |
| `CalendarNodeRenderer.ts`  | 原样承载 VNodeChild                         | Calendar 内部                        |
| `useCalendarFoundation.ts` | 私有 Foundation adapter、状态和完整资源清理 | Calendar 内部                        |
| `types.ts`                 | 公开联合类型、事件对象、props/emits/slots   | 根入口与 `calendar` 子路径           |

入口只负责视图组合；日期/事件算法由固定 Foundation facade 提供，DOM 和 Portal 副作用留在对应视图组件。没有跨组件复用需求的纯日期转换保持普通 utility，不制造额外 composable。

## 公开 API 与默认值

| React v2.102.0                             | Vue 契约                                    | 默认值 / 映射                                                          | 结论         |
| ------------------------------------------ | ------------------------------------------- | ---------------------------------------------------------------------- | ------------ |
| `mode`                                     | `mode`                                      | `week`；`day/week/month/range`                                         | 等价         |
| `displayValue`                             | `displayValue`                              | 组件实例创建时的当前日期                                               | 等价         |
| `events`                                   | `events`                                    | `[]`；`children` 改为 `content: VNodeChild`，并兼容事件 `content` slot | Vue 原生映射 |
| `range`                                    | `range`                                     | range 模式必需，左闭右开                                               | 等价         |
| `header`                                   | `header` prop 或 `#header`                  | slot 优先                                                              | Vue 原生映射 |
| `dateGridRender`                           | `#dateGrid="{ date, dateString }"`          | 命名 scoped slot                                                       | Vue 原生映射 |
| `renderDateDisplay`                        | `#dateDisplay="{ date }"`                   | 命名 scoped slot                                                       | Vue 原生映射 |
| `renderTimeDisplay`                        | `#timeDisplay="{ time }"`                   | 命名 scoped slot                                                       | Vue 原生映射 |
| `allDayEventsRender`                       | `#allDayEvents="{ events }"`                | 命名 scoped slot                                                       | Vue 原生映射 |
| `showCurrTime`                             | `showCurrTime`                              | `true`；缺省/显式 false/显式 true 均测试                               | 等价         |
| `markWeekend`                              | `markWeekend`                               | `false`                                                                | 等价         |
| `weekStartsOn`                             | `weekStartsOn`                              | `0`，联合类型 `0..6`                                                   | 等价         |
| `scrollTop`                                | `scrollTop`                                 | `400`                                                                  | 等价         |
| `minEventHeight`                           | `minEventHeight`                            | `Number.MIN_SAFE_INTEGER`                                              | 等价         |
| `width` / `height` / `style` / `className` | 同名 props，另接收 attrs class/style/data-* | `height=600`，数字转 CSS px                                            | 等价         |
| `onClick`                                  | `@click`                                    | `(event, date)`；日/周/范围为半小时，月为一天                          | Vue emit     |
| `onClose`                                  | `@close`                                    | `(event)`                                                              | Vue emit     |
| `onMoreClick`                              | `@more-click`                               | `(event, date, remaining)`                                             | Vue emit     |

## 状态、事件与事件算法

- 日/周/范围点击半小时格时，先用展示日替换年月日，再合并时分秒，随后同步 emit `click(event, Date)`。
- 月单元点击 emit 当日；点击“还有 N 项”必须先 `stopPropagation()`，打开事件卡片，再 emit `moreClick(event, date, remaining)`，不得额外触发日期 click。
- 关闭按钮关闭卡片后同步 emit `close`；固定 custom-trigger Popover 不因 outside mousedown 或 Esc 改变受控 visible。切换 mode 或卸载必须清理 Portal/listener。
- 事件解析保留固定 Foundation 规则：起止倒序时交换；仅一端时补一小时/日边界；跨日不足 24 小时拆成两段；超过 24 小时按全天事件；相同时间段水平错列；月/周/范围全天事件按行和跨度定位。
- 事件响应不能只比较 key：Vue 受控 props 更新时，`events`、日期、range、weekStartsOn、height 或 slot 内容变化均重算公开输出，避免固定 React 缓存遗漏原地内容变化。
- Month 根据实际周行高度计算 `itemLimit = max(0, ceil((height - 60) / 24))`；首次挂载、显式 height 变化和 `ResizeObserver` 尺寸变化重算，并在卸载时断开 Observer。

## DOM / class / style

- 根 class 分别为 `.semi-calendar-day`、`.semi-calendar-week`、`.semi-calendar-month`；range 沿用 week DOM/class。
- 日/周/范围保留 sticky top/left、`.semi-calendar-time`、`.semi-calendar-grid`、48 个半小时点击格、全天 skeleton/event-items 和 `role="gridcell"` 等结构。
- 月保留 `role="grid"` / `row` / `columnheader` / `gridcell`、周行、日期文字、today/weekend/same-month 状态 class、绝对定位事件与折叠入口。
- 数字 `width`/`height`、事件 top/height 必须输出显式 `px`；百分比和 `em` 与固定 Adapter 相同。
- React 在 mounted 后解析全天事件，浏览器滚动锚定会把初始滚动量增加到最终全天区相对单行的高度；Vue 根据真实行高复现该挂载结果，不硬编码主题尺寸。
- 逐组件 CSS 编译主题/global、Calendar SCSS 与内部卡片实际依赖的 Popover/Icon/Button 样式；不改 `.semi-*` 或 `--semi-*`。

## 键盘、焦点、ARIA

- 固定 Calendar Adapter 只声明静态 grid 角色，没有 roving tabindex、方向键导航或焦点状态机；Vue 不虚构额外键盘行为。
- 月视图根 `role="grid"`，表头 `role="columnheader"`，日期 `role="gridcell"`，使用本地化日期 `aria-label`，今天设置 `aria-current="date"`。
- “还有 N 项”保留上游静态 div 结构、class 与鼠标事件顺序；关闭卡片按钮增加本地化可访问名称。

## Portal、尺寸与清理门禁

- Month 事件卡片使用 Teleport；默认容器为 `document.body`，若 ConfigProvider 提供稳定 `getPopupContainer`，首次可见时必须直接挂入该容器。
- 卡片只在用户显式打开后解析容器，因此不会在父 ref 尚未可用的子 mounted 时序中错误回退；固定契约不承诺已打开期间动态迁移容器。
- 固定 Tooltip/Popover 基础设施仍完整清理 custom trigger 注册的 document、scroll、resize 与焦点 listener；关闭、mode 切换和卸载不保留 Portal。
- `ResizeObserver`、`requestAnimationFrame` 当前时间线、document listener 和 Teleport 状态全部仅在客户端创建并完整清理；SSR import/render 不访问 DOM。

## Locale、暗色、RTL 与 SSR

- 默认 zh-CN：全天、上午/下午、日期后缀、剩余项；en-US 使用固定 en-US 文案。ConfigProvider `locale.Calendar` 和 `locale.dateFnsLocale` 可覆盖；缺失字段回退到语言默认。
- zh-CN/en-US 分别验证表头月份/星期、时间轴、全天和剩余项；ConfigProvider Locale 更新后响应式重渲染。
- 日期格式通过 date-fns locale，`weekStartsOn` 对周/月生效；range 按传入起点计算。
- `.semi-rtl` 驱动固定 RTL SCSS；Portal 卡片增加 `.semi-portal-rtl`，并在 RTL 下校验 sticky、边框、日期和关闭按钮方向。
- light/dark 复用同一主题 Token；Calendar 没有额外主题状态。
- SSR 默认/四种 mode 均可 import/render；当前时间线、滚动、尺寸、Observer 与 Portal 只在客户端挂载后启动。

## 发布与验证门禁

- 根与 `@aifuxi/semi-ui-vue/calendar` 子路径导出 Calendar、`CalendarProps`、`CalendarMode`、`CalendarEvent`、`CalendarLocale`、`CalendarSlots`、`CalendarEmits` 和 `WeekStartsOn`。
- `@aifuxi/semi-theme-default/calendar.css` 与根 CSS 均包含 Calendar；真实 tarball 验证根/子路径 ESM、声明、样式、tree-shaking、SSR-safe import、许可证与 SPDX SBOM。
- 单元测试覆盖四 mode、默认值显式性、事件解析/重算、点击日期、周起始日、custom slots、Locale、Month 折叠卡片、custom container、显式 close、ResizeObserver 与清理。
- Chromium 行为覆盖日/周/月/范围、点击/卡片/Portal、ARIA、zh-CN/en-US、RTL；视觉覆盖桌面与移动、light/dark 及 RTL，关键 computed style 精确相等、几何误差 `<= 0.5px`、截图阈值 `<= 0.1` / `0.001`。

## Deviation

- `events[].children` 是 ReactNode；Vue 公开契约改为 `events[].content: VNodeChild`，同时 `#event` scoped slot 可按事件对象渲染。迁移表逐项说明，用户能力不减少。
- `dateGridRender`、`renderDateDisplay`、`renderTimeDisplay`、`allDayEventsRender` 改为命名 scoped slots；这是 Vue 原生 API 映射。
- 月事件卡片关闭按钮增加 `aria-label`，属于不影响 DOM class、布局和事件顺序的无障碍补强。
- 无其他 accepted deviation；任何未解释的 API、行为、ARIA、样式或截图差异均阻止 `pending -> ready`。
