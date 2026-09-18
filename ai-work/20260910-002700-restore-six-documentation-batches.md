# AI 工作记录：恢复历史六批文档验收

- 日期：2026-09-10
- 状态：完成

## 目标与范围

恢复 Button、Icon、ConfigProvider、Locale、Dark Mode、Navigation 六批历史严格验收的当前有效证据。起始 HEAD 为 `afacd6e`，工作区干净；固定 vendor 为 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。开始时六批浏览器证据均失效，章节/API/迁移审阅仍有效，859 个上游示例已映射，有效 accepted 为 0。

## 修改与定位依据

仅修改三个文档矩阵中的采样等待，没有修改组件运行时、vendor、截图基线、像素/样式/几何阈值或重试设置。

- Dark Mode：首轮诊断 `Local zh-cn light` 在 size-20 状态采集到 React 仍为每页 10 条、Vue 已为 20 条，节点数为 276/273。将原先位于截图之后的 20 条生效断言提前，并等待下拉列表退出，再进行完整比较。
- Locale：`Components en-us dark rtl` 采样时 Vue 段落暂时恢复全文，节点数为 1018/1017。时序探针确认语言切换会重建消费者，省略计算经历全文、带展开操作的中间测量、最终折叠；仅等展开按钮可见不足以确认终态。先断言新语言生效，再等待两侧带展开操作的文本及高度一致且连续观察稳定，随后继续原有完整 DOM、样式、几何及截图门禁。
- Locale 修正过程：最初额外要求三行，首轮正式矩阵因此在中文阿拉伯语 RTL 的明暗两项失败。trace 显示固定 React 参考侧本身稳定为四行，不能套用英文三行结果。最终去掉这一新增错误假设，依据两侧实际稳定文本与高度等待；未放宽原有对照断言。
- Navigation：`Controlled en-us light` 关闭子菜单后 React 仍包含退出中的 13 个节点，Vue 已清理。固定 Collapsible 源码在真实 `transitionend` 中清理内容与过渡标记；在现有动画完成步骤之后断言当前示例的 `.semi-collapsible-transition` 已消失，再采样。

## 实际验证

均通过 `mise exec --` 使用仓库 Node/pnpm 与锁定 Chromium。

- `pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan`：六批均待验收，映射路径预检通过。
- 代表诊断首先选择 105 项，首轮 62 项通过后停在 Dark Mode；修正后该失败用例定点通过，后续默认 3 workers 的 Dark Mode 代表均通过。
- Dark Mode/Icon/Locale/Navigation 接续代表诊断：31 项通过后停在 Locale 英文 RTL；保存 DOM/trace 并运行测量探针。修正后 Locale/Navigation 32 项代表诊断中 31 项通过，剩余 Navigation 受控项定位后定点通过。
- 首轮正式 224 项：222 通过，2 项因新增三行假设失败，未生成任何新证据。修正后中文 RTL 明暗两项定点通过。
- 最终 `pnpm --filter @workspace/docs accept:nuxt:batch button icon config-provider locale dark-mode navigation`：退出 0，**224/224 通过，0 失败、0 跳过、0 flaky，所有用例 retry=0**。默认 3 workers；最终整轮墙钟 294943 ms（约 4 分 55 秒），浏览器 282056 ms。准备产物按内容哈希复用，构建和类型/内容/产物检查已在本次诊断准备阶段实际通过；输入与产物运行前后复核通过。
- 分批结果：Button 84、Icon 48、ConfigProvider 16、Locale 16、Dark Mode 8、Navigation 52。正式入口重新生成六份 JSON 证据和压缩浏览器报告，并刷新覆盖账本为 **43/859**。
- 三个修改 spec 的 ESLint、Prettier 与 `git diff --check` 通过。Nuxt 类型检查在修改测试后的准备阶段通过；IDE 构建接口报告成功但明确表示构建诊断能力有限，不作为实际类型检查的替代。

## 证据与进度

正式证据位于 `docs/documentation/evidence/{button,icon,config-provider,locale,dark-mode,navigation}.{json,report.json.gz}`。失败摘要、相关状态采样与最终计时保存在同目录工作记录旁的 `20260910-002700-restore-six-documentation-diagnostics.json.gz`；临时 trace 在 ignored 的 `apps/docs/.data/documentation-smoke/restore-six/`，不作为唯一持久依据。

同步 README 的当前证据说明，并纠正文档迁移页仍停留在 748/859 的映射统计。现有 859/859 映射全部保留，严格验收恢复至 43/859，剩余 816 项；下一批仍为 Divider 2 项。

## 环境与未验证范围

WebStorm 无可用 Run Configuration；IDE 终端用于预检与首次诊断，但长运行只返回超时，后续使用可轮询 CLI 确认退出码。首次诊断结合进程与生成报告确认失败，没有把 IDE 超时当作通过。

验收前暂停了本仓库占用 4321 的旧静态预览，避免重建它正在消费的资源；验收后恢复预览。未操作其他项目服务。

本轮没有执行全组件回归、全仓 `check:full`、完整 `release:check` 或 npm 发布；组件实现未变，任务仅恢复六批文档证据。其余示例严格验收、历史断链与站点许可审计仍在原队列中。
