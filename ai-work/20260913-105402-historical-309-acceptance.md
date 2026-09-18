# 恢复 309 个历史示例严格验收

- 状态：完成
- 起点：2026-09-13 10:54:02 +0800。
- 授权：恢复其余 40 批、309 个历史示例，不扩展 527 个首次验收队列。
- 起始工作区干净，当前已验收四批 23 项保持有效。WebStorm 确认实际项目、无 Run Configuration，使用 IDE 终端；vendor 指定 commit/tag 正确。

## 准备与冻结

使用 parallel-documentation-acceptance 与 ai-change-workflow。三个子 agent 按 13/13/14 批只读复核已有章节/API/迁移审阅及固定参考前提；不改源码或启动共享构建/runner。主 agent 核对实际用例清单、分组和统一诊断/正式验收。有效历史语义审阅按当前指纹复用，不自动重签。

约 10:57 全部只读复核完成并收到冻结回执；40 批当前 review 均有效。核对固定语言差异、Portal/焦点、真实动效、时钟隔离及既有裁剪例外，无新增阻塞。历史 Typography 限定三行/四行、Skeleton Table 不合成 RTL、Navigation/Spin 英文独有例内嵌矩阵继续按既有范围。List 三个排除示例不属于本轮。两项旧说明精度问题（Highlight 警告未限定参考侧、List 记录误把 excluded DragSort 文案修正写成 Basic）不涉及本次新增输入或运行失败，保留事实，不借历史恢复扩大工具/文档维护。

正式前全体 `--preflight` 退出 0。实际 Playwright `--list` 与每批预期标题精确匹配，共 2348 项；代表集合 936 项。只读清单校验曾因 endsWith 将 float-button 同计入 button 而报错，改为完整文件名边界后一致，未改仓库测试。无浏览器返工。

## 调度与证据

初始 `accept:nuxt:batch --affected --plan` 退出 0；40 批待恢复共 2348 项用例。按实际用例数和旧压缩报告的解压体积分组，Image/Table 等大报告单独运行，不把全部报告堆入一次 JSON。

实际分 13 组，分组清单及大小在 ignored `groups.json`：1 accessibility/avatar/badge/banner；2 button/calendar；3 carousel；4 card/collapse/collapsible/config-provider/cropper；5 dark-mode/descriptions/dropdown/empty/feedback；6 image；7 float-button/grid/highlight/icon/layout；8 list/locale/modal；9 navigation/overflow-list/popover/progress；10 resizable/scroll-list/side-sheet/skeleton；11 table-1；12 space/spin/tag/timeline；13 typography。单组通常不超过 256 用例/160 MiB 旧解压报告，超过的 Carousel/Image/Table 单独运行。每组先代表诊断，退出 0 后正式完整矩阵；诊断或正式失败均停止后续组。

本轮日志、实际退出状态、诊断/正式计时与清单保留在 `apps/docs/.data/documentation-smoke/historical-309-20260913/`，正式证据仅由现有 runner 生成。首个失败停止后续调度、核对进程/端口并保留现场，依据根因进行最小完整复现；无重试、无门槛下调或旧指纹改写。

## 结果与计时

13 组全部诊断及正式命令退出 0：936 项代表诊断、2348 项完整历史用例全部通过，零失败/跳过/重试。每组只有诊断通过才启动正式矩阵，完整报告统计与分组预期逐项一致，没有从中断报告抽取通过项认证。报告由正式入口在冻结校验后写入 `docs/documentation/evidence/` 下 40 批的 JSON 与 `.report.json.gz`。

| 组   | 历史示例 | 代表用例 | 完整用例 | 结果     |
| ---- | -------: | -------: | -------: | -------- |
| 01   |       26 |       82 |      208 | 通过     |
| 02   |       26 |       67 |      156 | 通过     |
| 03   |        8 |       25 |       64 | 通过     |
| 04   |       32 |       99 |      248 | 通过     |
| 05   |       28 |       87 |      216 | 通过     |
| 06   |       10 |       31 |       80 | 通过     |
| 07   |       34 |      103 |      256 | 通过     |
| 08   |       26 |       79 |      200 | 通过     |
| 09   |       35 |      102 |      252 | 通过     |
| 10   |       29 |       90 |      228 | 通过     |
| 11   |       15 |       46 |      120 | 通过     |
| 12   |       30 |       94 |      240 | 通过     |
| 13   |       10 |       31 |       80 | 通过     |
| 合计 |      309 |      936 |     2348 | 全部有效 |

最终 `accept:nuxt:batch --affected --preflight` 与 `--affected --plan` 均退出 0，44 批审阅有效、44 批浏览器证据有效、待恢复 0 批。逐批覆盖/章节检查使用最终生成账本，核对每批全部声明示例为 accepted、章节全部 reviewed，40 批均通过；与正式 runner 的证据校验及当前审阅门禁合并证明有效状态。覆盖 332/859，剩余 527 个首次验收示例；本轮首次新增验收 0，历史恢复 309。前一轮四批 23 项证据字节未变，仍由 runner 判定有效。

所有 resources/site/checks 内容校验均命中，没有实际重建或重复执行 Nuxt 类型/产物检查；复用的是 runner 核验过全部产物内容的既有成功证据。两轮命令合计 4416.641 秒（73.61 分钟）：代表命令 1414.215 秒、正式命令 3002.426 秒。净浏览器合计 3822.487 秒（63.71 分钟），其中代表 1217.478 秒、正式 2605.009 秒；其余约 9.90 分钟为命令内缓存/指纹核验、覆盖生成和服务等开销。失败排查 0、浏览器返工 0、源码修复 0。三个只读 agent 准备墙钟约 3 分钟，不能相加作为串行耗时。

起点 10:54:02，全部浏览器与最终证据核验在 12:17 左右完成，收尾提交约 12:20，整轮约 86 分钟，包含准备、调度等待、各组门禁与最终整理。分组耗时、用例清单、实际退出码、日志及汇总保留于本轮 ignored 目录的 `summary.json`、`NN-diagnostic/acceptance-timing.json`、`.log`、`.exit`；没有失败现场需要保留。IDE 终端等待超时时只读取运行状态与日志，不重复启动命令。

## 交付与剩余边界

本轮仅更新 40 批正式证据、覆盖账本、README、双线计划、工作记录与空 Changeset；未修改组件、示例、参考适配、测试、映射或审阅指纹。共享源码未变化，无额外历史回归。保持既有限定差异与排除范围，未执行全仓 check:full 或发布包检查，也没有扩展到 527 个未验收示例。接下来按原队列从 Table 第 16–30 项开始首次严格验收。

最终 Prettier、`pnpm check:changesets`、`git diff --check` 均退出 0；新增工作记录链接目标存在。diff 自审核对账本仅 40 篇变化、accepted 净增 309，证据仅 40 批 80 个文件，前轮四批原样保留。空 Changeset 不改已有版本计划。按授权只暂存本轮文件并创建独立提交。
