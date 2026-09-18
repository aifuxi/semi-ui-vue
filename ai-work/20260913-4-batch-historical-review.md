# 四批历史审阅缺项恢复

- 状态：完成
- 起点：2026-09-13，本轮首次工具核验工作区干净；WebStorm 确认项目，无 Run Configuration，使用 IDE 终端。
- 准备调度：北京时间约 10:12 开始派发三名子 agent；10:13:15 首次单独读取本地时钟。任务最初数分钟未单独计时，整轮耗时据此注明边界。
- 范围：Divider、Notification、Popconfirm、Toast，共 23 个历史示例；最多三个子 agent 准备，主 agent 统一冻结、诊断、正式验收与提交。
- 初始影响计划：44 批浏览器证据因此前工具改动失效，40 批审阅有效，指定四批缺少章节/API/迁移审阅字段与指纹。其余 40 批保持历史待恢复，不纳入新增进度。

## 准备与冻结

分工：Notification、Toast 各一名负责人；Divider 与 Popconfirm 由第三名负责人顺序准备。各自仅修改本批内容、映射、验收记录与必要本批适配/矩阵，不修改共享源码、账本、队列或最终证据。不启动共享构建、浏览器服务和 runner。

Toast 10:15:58 冻结，Divider/Popconfirm 约 10:17 冻结；Notification 10:15:54 首轮完成，跨审发现 API 表遗漏后在浏览器启动前补齐，约 10:18 再次冻结。并行准备墙钟约 6 分钟（派发起点为近似值），不能把各 agent 时间相加作为串行基准。没有浏览器失败返工；Notification 跨审补齐约 2 分钟包含在准备墙钟中。Toast→Notification→Divider/Popconfirm→Toast 完成交叉只读审阅，主 agent 复核最终 diff、固定参考适配、真实 Playwright 标题及门槛。三名负责人全部确认停止写入，检查进程均已退出。

本轮仅修改双语正文、审阅映射/记录与 Toast adapter 的旧注释。补足 Notification/Toast 的公开字段、回调/返回值、holder 与静态方法边界；明确 Notification.config 不消费类型声明中的 direction。Popconfirm 修正中文默认按钮文案及英文 prop/motion 说明。所有固定双语片段前提记录在对应 acceptance 中，无共享组件或测试断言改动。

## 验证与计时

初始 `accept:nuxt:batch --affected --plan` 退出 0。诊断、正式验收与退出状态保留于本轮 ignored smoke 目录及既有 runner 计时报告；完成后填写。

固定 vendor submodule 核验为指定 commit/tag。实际 Playwright `--list --reporter=json` 退出 0：Divider 16、Notification 64、Popconfirm 32、Toast 72，共 184 项，逐标题与 runner 的预期集合一致；诊断 grep 在实际清单中完整匹配 73 项。清单保留于 `apps/docs/.data/documentation-smoke/historical-review-20260913/`。每个 spec 都先独立打开并确认固定 React，再加载 Vue；正式矩阵包含适用的 Portal 几何、重开、焦点、异步和真实动效终态，Toast 英文 Stacking 内嵌于 Basic 英文用例。

四批最终 `--preflight`、定点 Prettier、Toast adapter ESLint、`git diff --check` 均退出 0。IDE build_project 返回成功但提示无法收集构建消息，不据此声称完成产物检查；实际构建/类型/内容/产物检查交由统一 runner。正式冻结前 `pnpm changeset --empty` 退出 0。

统一诊断使用 73 项代表集合（四批可共用输入及输出），日志 `diagnostic.log`、实际退出状态 `diagnostic.exit`，既有 runner 写入 diagnostic-timing.json；正式预定为四批 184 项，日志 `acceptance.log` 与 `acceptance.exit`。首次失败即停止，不增加重试，不改变阈值；仅在新证据说明失效范围后恢复。

代表诊断实际退出 0，73 passed、0 skipped/unexpected/flaky。总耗时 295.208 秒，浏览器阶段 178.956 秒；公开包/资源、静态站、Nuxt typecheck、内容与 dist 检查均通过，三阶段缓存因当前输入变化重建。计时已复制到本轮 smoke 目录。IDE 等待超时后核对运行进程及日志，没有重启；完成时诊断进程与 4321/4173 端口已释放。

正式前再次运行四批 `--preflight` 和全局 `--affected --plan`，均退出 0：44 批审阅有效，浏览器证据仍待恢复；本轮没有新增共享源码失效。正式仅选指定四批 184 项，输入无变更，按 runner 内容校验复用刚通过的准备证据，不附加其余 40 批旧工具失效范围。

## 正式结果与交付

正式 runner 退出 0：184 passed，0 failed/skipped/flaky，无重试，3 workers；四批拆分为 Divider 16、Notification 64、Popconfirm 32、Toast 72 项。完整报告已由 runner 签署并保存到 `docs/documentation/evidence/{divider,notification,popconfirm,toast}.json` 及对应 `.report.json.gz`，运行前后源码/准备产物一致。正式总耗时 403.455 秒，浏览器 378.749 秒，resources/site/checks 全部缓存命中。日志、实际退出文件、两份计时和最终影响计划均保留于 `apps/docs/.data/documentation-smoke/historical-review-20260913/`。

最终 `--affected --plan` 退出 0，四批审阅与浏览器证据有效，其余 40 批审阅有效但旧工具输入的浏览器证据待恢复。四批各自的 `prepare-coverage.mjs --batch=<id>` 门禁全部通过。覆盖 diff 仅涉及四篇文档：2+8+4+9=23 项恢复 accepted；历史累计通过仍为 332，新增首次验收示例 0。当前 23/859 有效，剩余 836（309 历史待恢复、527 未验收）。其余 40 批旧证据未改动，不追加 Table 或未授权下一轮。

并行准备墙钟约 6 分钟；本轮构建/类型/内容/产物实际执行约 102 秒，另有缓存/指纹及覆盖计算时间。两轮浏览器合计 557.705 秒（代表 178.956 + 正式 378.749），失败排查 0 秒、浏览器重跑 0 次。Notification 的跨审返工在构建前完成，约 2 分钟，已包含在准备墙钟。收尾约北京时间 10:34，距首个独立时钟约 21 分钟；初始读取和派发早于该时钟，整轮仅可报约 24 分钟，非精确计时。不把三个 agent 的耗时相加，也不推断加速倍数。

README 与双线计划更新为当前范围，空 Changeset 随本轮提交。最终只暂存本次文档、映射、四批新证据、账本与工作记录，未修改公开产物代码；未执行全仓 check:full 或发布包回归。剩余工作为其余历史 40 批及原新增队列，Notification.config.direction 的声明/运行时差异已如实记入文档，未扩展组件修复。

收尾 Prettier、`git diff --check`、`pnpm check:changesets` 均退出 0；新增记录链接目标存在。Changesets 检查显示的既有 major 计划未修改，本轮仅添加空 Changeset。最后审阅 coverage diff，确认只更新四篇文档及总数，其余历史证据保持原字节。
