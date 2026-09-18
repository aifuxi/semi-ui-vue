# AI 工作记录：Calendar 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

接续 Badge 批次，完成展示类第三个组件 Calendar 9 项固定上游示例的双语、明暗与 LTR/RTL 严格验收（共 72 项）。起始提交 a7536b3，已有 24 批证据有效、175 项 accepted；本批同时修复月视图两处与固定 Adapter 不一致的 DOM。

## 验收标准

- 完整矩阵一次通过，无重试、跳过或失败；逐节点比较 class、属性、文本、`checked` property、关键计算样式与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，并对视图根、单选组与 DatePicker 单独裁剪。
- 交互覆盖示例中真实存在的路径：日/周/月/多日视图切换、周起始日切换、双语 light/LTR 的源码/重置/在线编辑。
- 固定 vendor 不变；按真实依赖核对历史证据有效性，不改旧指纹。

## 风险与假设

- 固定上游的日/周/月视图只传 `mode`，缺省 `displayValue` 与 `showCurrTime` 依赖运行时日期与时钟；迁移版本曾在示例里注入 `displayValue` 并关闭 `showCurrTime` 以规避不确定性。
- Events 示例内嵌 DatePicker（输入类，尚未验收），其 DOM/ARIA 细节会进入本批比较范围。
- Vue 3.5 的 `patchProp` 对模板 `:checked` 绑定同时写属性与 property；React 只写 property。Vue 模板插值必然把 `date.getDate()` 字符串化，React 的数字子节点走不到 Avatar 的字符串 label 分支。

## 修改范围

- 新增批次配置、72 项矩阵、参考适配器、映射审阅与验收记录。
- 示例按固定上游恢复：日/周/月/多日视图去掉注入的 `displayValue` 与 `showCurrTime=false`；WeekStart 补回 `name="demo-radio-group-vertical"` 与英文 `aria-label="StartOfWeek"`；英文 WeekStart 去掉中文示例才有的 `margin-top: 20px`。
- 组件修复 `packages/ui/src/calendar/CalendarMonth.vue`：普通 gridcell 始终输出 `aria-current`（当天 `date`、其余 `false`）；折叠单元格（“还有 N 项”）的 Popover 触发器去掉重复的 `role="gridcell"`/`aria-label`/`aria-current`。契约记录在 `docs/components/calendar/alignment.md`。
- 文档正文与映射同步说明：示例沿用固定上游参数，确定性由验收矩阵固定 `Date` 提供。
- 工具测试期望修正：`documentation-inputs.test.mjs` 中“Table 仅影响 Locale”的期望已过期——Skeleton 的 Table 示例同样消费 Table，期望改为 `['locale', 'skeleton']`。

## 关键决策与权衡

- **固定时钟而非改写示例**：用 `clock.setFixedTime('2024-08-15T10:24:30+08:00')` 固定两侧 `Date`（Typography/visual 批次先例），只固定日期、计时器与编辑器仍用真实时钟；示例保持与固定上游逐字一致，未在适配器里注入 `displayValue`。
- **数字子节点按字符串对齐**：Vue 模板插值无法产生数字文本节点，文档示例的等价写法就是字符串形式；参考适配器把该示例写成 `String(date.getDate())`，两侧因此渲染同一 label 分支（否则 React 渲染裸文本节点、Vue 渲染 `.semi-avatar-content/.semi-avatar-label`，节点数 249 vs 263）。
- **折叠单元格回归固定 DOM**：Vue 曾把普通单元格语义重复到触发器上；按固定 `renderCollapsed` 输出移除，不保留“更好的”额外 ARIA，因为验收契约以固定基线为准。
- **限定等价项显式记录**：生成 id 按 `[id]`/`[data-popupid]` 定义顺序归一；Vue 双写的 `checked` 属性改比较 property；`aria-disabled/invalid/required` 的显式 `false` 与省略按 ARIA 1.2 默认值等价——三者均在本批验收记录中说明，其余断言与门槛未放宽。
- **不扩张到未验收组件**：DatePicker 显式输出 `aria-disabled="false"` 等形式属于其自身批次的范围，本批只按 ARIA 默认值等价处理，不修改其实现。

## 验证证据

- 诊断迭代定位并修复 6 类差异：月份 gridcell 的 `aria-current`、折叠单元格触发器语义、Vue `checked` 属性双写、`data-popupid`/`aria-controls` 生成 id、DatePicker 的 `aria-*="false"`、英文 WeekStart 的多余 `margin-top`。
- 用例集合核对：`expectedCaseTitles` 72 项与 `playwright --list` 实际发现 72 项一致。
- 组件门禁：`rstest run packages/ui/src/calendar` 9 项通过（单元 + SSR）；`playwright test tests/browser/components/calendar.spec.ts` 5/5 通过（含 desktop light/dark 与 RTL 截图）。
- 冻结后 `accept:nuxt:batch calendar --affected`：3 批 136/136 一次通过（badge 48、calendar 72、locale 16），unexpected=0、flaky=0、skipped=0，3 workers，浏览器 108.9s，整轮 130.9s；resources/site/checks 均按内容缓存复用。
- `prepare-coverage --batch=calendar` 退出码 0；账本 184/859，Calendar `accepted`、章节全部 `reviewed`；验收后只读核验 25/25 批证据有效。
- 工具测试 `check:nuxt:evidence` 73/73 通过；Prettier、ESLint、`git diff --check` 通过。

## 未验证事项与剩余风险

- 剩余 675 项已映射示例待严格验收，下一批为同分类的 Card 14 项。
- 组件变更只执行了 Calendar 单元/SSR、组件 Chromium 与文档矩阵；未执行全仓 `pnpm check:full`、发布包（tarball/主题）回归与其他浏览器，发布前按发布入口补齐。
- Badge 证据在本批开始前失效，原因是其验收文档在正式验收后补写“本批结论”一节（验收文档属于批次输入）；已随本批一并重验。
