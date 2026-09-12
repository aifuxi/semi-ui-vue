# Calendar 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

9 项双语示例均覆盖 light/dark 与 LTR/RTL，共 72 项。选中范围为 `[class*="semi-"], input, svg path, br`，因此组件节点、原生单选输入与图标路径都在比较内。逐节点比较 class、属性（含 role/aria-*/input 的 name 与 value）、文本、`checked` property、关键计算样式（盒模型、flex/grid、定位、字体、颜色）与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，并对视图根、单选组与 DatePicker 分别裁剪比较。

## 时钟与确定性

固定上游的日/周/月视图只传 `mode`，缺省 `displayValue` 与 `showCurrTime` 由运行时的当前日期和时钟决定。矩阵在两侧页面导航前调用 `clock.setFixedTime(2024-08-15T10:24:30+08:00)`：只固定 `Date`，计时器、编辑器与动效仍使用真实时钟（与 Typography 批次一致）。迁移版本曾在示例里注入 `displayValue` 并关闭 `showCurrTime`，本批按固定上游逐字恢复，确定性改由矩阵提供。

## 本批修复与对齐

- **组件**：普通 gridcell 始终输出 `aria-current`（当天 `date`、其余 `false`），折叠单元格的 Popover 触发器 `<li>` 去掉重复的 `role="gridcell"`/`aria-label`/`aria-current`，两处均与固定 Adapter 输出逐属性一致；契约记录在 `docs/components/calendar/alignment.md`。
- **示例**：日/周/月/多日视图恢复缺省 `displayValue` 与 `showCurrTime`；WeekStart 补回固定上游的 `name="demo-radio-group-vertical"` 与英文 `aria-label="StartOfWeek"`；英文 WeekStart 去掉中文示例才有的 `margin-top: 20px`。
- **参考适配器**：直接编译固定 Markdown，只把匿名箭头示例命名为默认导出；另外把“自定义日期文案”示例的 `{date.getDate()}` 写成 `{String(date.getDate())}`——Vue 模板插值必然把数字转成字符串，会走 Avatar 的字符串 label 分支，而固定 React 片段的数字子节点不满足 `typeof children === 'string'`，只渲染裸文本节点；写成同一字符串形式后两侧渲染同一示例。

## 限定等价项

- 生成 id（React `getUuidShort`、Vue `useId`）按根内 `[id]`/`[data-popupid]` 的定义顺序归一为 `id-N`，`id`、`data-popupid`、`for` 与 aria 引用一起解析；缺项、重复或改序仍会失败。
- Vue 3.5 的 `patchProp` 会把模板 `:checked` 绑定同时写入属性与 property，React 只写 property；矩阵删除该属性、改比较 `checked` property，布尔状态与跨端一致性仍被逐节点断言。
- `aria-disabled`/`aria-invalid`/`aria-required` 的 ARIA 1.2 默认值为 false，显式 `"false"` 与省略等价；示例内嵌的 DatePicker 目前显式输出三者，其自身批次仍会审阅该形式。

除上述来源明确的等价项外，没有放宽裁剪、容差或门槛，也没有其它未解释差异。

## 交互覆盖

- WeekStart：点击「周一 / Mon」，断言该项获得 `semi-radio-checked`，月视图首列表头随之变化后比较截图。
- Events：默认周视图断言 7 个日列，切到月视图比较，再切到多日视图断言日列变为 3（2019-07-23 起左闭右开）后比较。
- 双语 light/LTR 另执行源码展开/收起、重置与在线编辑 iframe 内的实际渲染与退出恢复。

## 章节/API/迁移审阅

双语保留固定上游章节与顺序（中文 17 个、英文 17 个），另补 Accessibility/FAQ 与 React→Vue 迁移表。API 以真实公开类型为准：`displayValue` 缺省当前日期、`height` 600、`mode` week、`range` 左闭右开、`scrollTop` 400、`showCurrTime` true、`weekStartsOn` 0、`markWeekend` false、`minEventHeight` 为 `Number.MIN_SAFE_INTEGER`；`dateGridRender`/`renderDateDisplay`/`renderTimeDisplay`/`allDayEventsRender` 映射为 `#dateGrid`/`#dateDisplay`/`#timeDisplay`/`#allDayEvents` 插槽，`events[].children` 映射为 `events[].content`，`onClick`/`onClose`/`onMoreClick` 映射为 `@click`/`@close`/`@more-click`。

正式状态以 evidence/calendar.json 的完整矩阵与输入指纹为准，诊断不计入 accepted。
