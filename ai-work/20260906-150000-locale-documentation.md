# AI 工作记录：Locale 示例补齐与严格视觉验收

- 日期：2026-09-06
- 状态：Locale 三项示例及消费者修复已完成严格验收；下方“前轮”保留诊断历史，当前结果见末尾续记。

## 目标与范围

按既定顺序继续 Locale 三个 live 示例。唯一基线为只读 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。工作区起始干净，不提交或发布。

## 实施

- 补齐 Internationalization、Custom、Components 三个双语示例；综合示例拆成语言入口、输入、展示和导航文件。使用公开子路径与 Vue props/slots。
- 保留中文 57、英文 54 个菜单项与各自初始 locale；语言切换用 key 重建消费者，匹配固定 React 内嵌组件生命周期。
- 原样读取固定 Markdown live React 代码，补齐 ESM 的 hooks/render 绑定、具名 Form/ImagePreview 导出和数字语言名 es_419；参考 date-fns 薄入口补齐固定语言数据使用的导出。
- 图片改为现有本地样本，Semi Logo 改为独立 IconApps 和导航标题；两端相同适配，许可、文件哈希及发布站点清单保留于 locale-examples.json。
- 更新双语章节、57 个语言源清单、API/迁移审阅、映射、批次矩阵和组件对齐记录。
- DOM/computed style 精确比较、rect 0.5px、截图 threshold 0.1 / ratio 0.001，不使用 mask，不更新旧截图基线。

## 前轮已确认差异与草稿

1. Pagination 仅读取 ConfigProvider，忽略 LocaleProvider。React 英文 `Total pages: 10` 对照 Vue `总页数：10` 已在 Chromium 复现。最小草稿为 `20260906-150000-locale-pagination-proposal.patch`，只补充缺少 ConfigProvider 时的 locale 注入。
2. Table 空数据的 pagination 外层应保留，但 info 与 Pagination 应为空；Vue 额外渲染零条文本和两个禁用分页箭头。证据：上游 TablePagination.tsx 的 total > 0 与 Foundation.formatPaginationInfo。
3. Table 固定头表无显式 role，普通 body 为 grid（树/分组/展开为 treegrid）；Vue 两者固定 role=table。
4. Typography 默认复制图标上游名称为 copy；Vue 用本地化 copyTip 覆盖。其 Tooltip 文案与图标名称是两个独立契约。

第二份 consumer-proposal.patch 是 Table/默认复制图标的待审阅草稿，尚未应用或验证；Table role/treegrid 差异暂未纳入草稿，正式修复时须完整对照分组、展开和树表格分支。

此前按 ai-change-workflow 第 3 节及根 AGENTS.md 请求了生产行为变更确认；用户随后明确要求移除此限制，两处规则已同步更新，当前任务内的修复不再等待额外确认。当前未修改 packages/ui 运行时，不以修改示例传入 ConfigProvider 绕过 LocaleProvider 缺陷。Select 的 prefix 是已存在的 Vue slot，示例适配已直接修正。

## 验证与证据

- Nuxt 静态生成、docs typecheck、React typecheck、工具 typecheck、范围 ESLint/Prettier、源码边界、196 页内容结构检查通过。
- 文档证据验证器 10 项通过。
- Custom 双语 × light/dark 四项通过，包含全部六行文本、节点样式/几何、截图与亮色编辑器；已人工查看暗色截图。
- 开发服务跨域字体 NetworkError 已定位为环境配置差异，正式检查使用既定静态预览，未替换字体。
- 参考入口变更使旧批次指纹失效，已重跑 ConfigProvider 正式验收 16/16，并以同一源码/构建检查刷新 Button 84/84、Icon 48/48 浏览器证据，均无重试/跳过。三份 acceptedBatch 校验均为 true；映射 710/859、有效严格验收 28/859。

## 前轮诊断结果

- 最终静态源码全矩阵：16 项，Custom 4 项通过，Internationalization 4 项及 Components 8 项失败；全部无重试，无跳过。没有生成 Locale accepted evidence。
- 原始报告及紧裁剪附件：`20260906-150000-locale-diagnostic.json.gz`；按节点整理的差异：`20260906-150000-locale-differences.json`。RTL 检查时 Vue 缺少 React 的 typography-ellipsis-expand 节点，尚需核验重挂载后的测量时序与稳定状态。
- 最终静态生成、兼容入口、REPL、许可/散列和 dist 检查通过。Button/Icon 复用 ConfigProvider 同源码的公共构建、类型和内容检查，重新执行完整浏览器矩阵；复用来源写入 evidence，日志分别归档。
- 最终映射 710/859，有效严格验收 28/859。README/文档总览/批次计划已同步；下一步仍是当前 Locale 的消费者差异修复与完整交互验收。
- 本次启动的静态预览、Nuxt dev、React 参考服务已清理，4321/4173 无监听。vendor 无修改，所有变更未暂存、未提交、未发布。

## 前轮未完成与边界

Locale 未生成 accepted evidence。Internationalization 受 Pagination 运行时差异阻塞；Components 受 Table/复制图标等差异阻塞。综合交互还需在默认结构通过后继续补充 Modal、语言切换消费者、Portal 与截图逐项验收。组件 ready 状态不代表这些文档 Demo 已通过。

本轮未改公开包运行时或全局样式；不运行全仓单测、全仓浏览器与 npm pack，只验证文档与参考入口相关链路。后续应用运行时草稿时须新增公开行为回归并执行受影响组件、SSR/发布验证。

## 续记：规则提交与消费者修复

用户要求先提交限制调整，再继续修复。仅 AGENTS.md 与 ai-change-workflow/SKILL.md 已提交为 `a23e256 docs(workflow): 移除已授权任务的额外确认限制`；运行时与文档修复保持未提交。前轮两个 proposal.patch 是历史草稿，本轮已实施并扩展验证。

- Pagination 在缺少 ConfigProvider 时消费 LocaleProvider，保持 ConfigProvider 优先、缺 code 整体回退和响应更新；增加独立 Provider 与 SSR 回归。
- Table 空分页保留外容器，隐藏默认文案与页码，保留自定义格式化函数；固定表头移除多余 role，body 按普通 grid/树、分组、展开 treegrid 区分。
- Typography 默认/自定义 VNode 图标不覆盖原 aria-label，copyTip 使用真实 Tooltip；更新旧的本地化图标名称断言，验证复制反馈随 locale 更新。
- Select 只为字符串内容添加 option-text，VNode 直接渲染；稳定 optionList 监听源，避免仅 value 更新误触发焦点重置。语言菜单重复打开的 RTL 差异提供独立 Chromium 证据。
- RTL 截断入口短暂缺失是重挂载与滚动后的测量状态；在定位后等待公开折叠入口，无截断算法变更。页大小菜单也在既定动画时刻比较，未放宽阈值。
- 综合验收增加完整 57/54 语言选项、日语切换后全体消费者、局部截图、分页重置、文本展开/收起、Modal 位置/ARIA/截图/关闭、copy Tooltip（含箭头），并比较在线编辑器初始消费者文本与数量。

验证过程中出现过两处旧 Copy aria-label 断言失败，更新为固定源码契约后相关 77 项复跑通过；其余当时 1178 项通过。新增 Select 焦点单测 13 项定向通过。中途一份 trace 出现文件流错误（发生在运行期间格式化源码时，原因尚未独立确认），不计作通过证据；最终完整矩阵在输入冻结后重跑。最终运行结果另记于下方。

追加定位：Select 原先未接入打开浮层后的选中项滚动，长语言菜单 React/Vue 存在 63/27 px 偏移；补齐 visibleChange 回调与父容器 offsetTop。英文 copy 图标截图差异来自菜单点击后的鼠标位置，在滚动截图时意外触发 hover；统一移开鼠标，不调整图片或阈值。

## 本轮验证状态

- 全仓 Vitest：174 个文件、1181 项通过；最后补充菜单打开滚动后 Select 13 项再通过。
- 全 workspace typecheck 通过；后续 Select 修复再执行 UI typecheck 通过。
- 全仓 ESLint、source boundaries、vendor 固定版本检查通过。
- 全仓 Prettier 仅报告既有 `ai-work/20260906-114000-config-provider-consumers-verification.md`，本任务未修改该文件；因此不宣称全仓 format:check 通过。
- 最新 UI dist 的真实 tarball 安装/exports/类型/样式/SSR 与 SSR-safe import 通过。
- 综合示例八个双语/明暗/RTL 组合完整交互通过，无重试；已人工查看英文暗色日语 Modal、复制 Tooltip 箭头和展开文本。

- 全仓 Chromium：442 项全部通过（3.6 分钟），无重试；覆盖受影响消费者、Tooltip 定位/卸载和工作台依赖加载门禁。回归原始日志归档为 `20260906-160000-locale-regression.json.gz`。

- Locale 正式批次：16/16 通过，无重试、跳过或失败；机器证据为 `docs/documentation/evidence/locale.json` 和压缩原始报告。正式公共包/主题/Nuxt 构建、类型和内容检查通过，前后 source fingerprint 相同。

## 最终交付

- Button 84/84、Icon 48/48、ConfigProvider 16/16 全部重新执行并通过，无重试或跳过；复用本次 Locale 同源码的公共构建/类型/内容检查，来源写入 checksReusedFrom，原始浏览器报告重新压缩归档。
- 当前双语映射 710/859，有效严格验收 31/859；下一批为 Dark Mode 两项。README、文档总览和批次计划同步更新。
- 仅规则调整已提交 `a23e256`。组件修复、示例、测试与证据均留在工作区，未提交、未发布；vendor 未修改。

最终核验：四个 acceptedBatch 均为 true；覆盖账本为 31/859。4173/4174/4321 无监听，本次浏览器服务已清理；暂存区为空，最终 diff 无空白错误。

## 提交前路径核验

用户随后授权提交本轮代码。Git 暂存时沿用了既有 en-US/zh-CN 目录大小写，与实际验收目录 en-us/zh-cn 不一致；通过两次 git mv 显式记录大小写归一化，文件内容不变。该调整改变 Locale 输入路径指纹，因此重新执行正式 Locale 批次验收后再完成提交。历史 Pagination 草稿改为零上下文补丁，以保留相同修改内容并消除补丁空白上下文的格式告警。

路径归一化后正式验收 16/16 通过，无重试或跳过，四个批次证据均有效，覆盖账本仍为 31/859。Button/Icon/ConfigProvider 的源码指纹和浏览器报告未变；其共享构建检查来源同步指向此次 Locale 正式验收。提交包含目录大小写修正及更新后的证据。
