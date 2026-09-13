# 文档示例与严格验收

本页维护文档任务的完成标准、命令和证据规则。组件契约见[组件验收](../testing/component-contract.md)，代码与产物检查按[验证入口](../testing/validation.md)选择。并行任务使用[并行验收技能](../../.agents/skills/parallel-documentation-acceptance/SKILL.md)。

## 任务范围与完成标准

从[批次计划](./batch-plan.md)、映射和覆盖账本接续，只读取本次任务需要的材料。

| 任务               | 完成标准                                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| 补齐双语示例       | 固定基线的中英文示例、章节、语言差异和多文件依赖齐全；内容与类型检查通过；本批每个示例在实际文档站加载并完成主要操作 |
| 修复已有示例       | 修复指定问题及必要依赖，验证相关公开行为和实际受影响范围                                                             |
| 严格视觉与行为验收 | 完成双语、明暗及适用 RTL/交互矩阵；正文/API/迁移审阅与正式浏览器证据均有效，才计入 `accepted`                        |

映射数量、基础运行、代表诊断和正式验收分别记录。补齐示例不要求同时取得 accepted；恢复某个失效批次的 accepted 必须重新通过该批完整矩阵，不能用单例通过或旧报告改写指纹替代。

## 补齐线流程

核对固定基线中的双语片段、依赖与 API，完成示例和章节映射。交互复杂或依赖尚不确定时，先实现能验证关键风险的代表，再扩展同类示例；不要求每批遵循固定数量和顺序。

本批每个双语示例都需实际运行，覆盖其主要演示操作，以及适用的源码查看、重置、编辑器和多文件路径。发现组件缺陷时在授权范围内修复并验证；未完成项保留具体原因，不能以映射齐全代替可运行。

开发站用于实现和诊断；最终交付使用联合检查后的静态产物。代码或资源变化后更新实际消费的产物，复用经检查仍有效的准备缓存。完成后刷新账本并保留必要运行证据。

## 补齐线运行预检与失败定位

按实际行为选择检查，静态示例无需套用浮层、焦点或异步路径。

| 场景               | 需要核实的结果                                                           |
| ------------------ | ------------------------------------------------------------------------ |
| 双语与 Provider    | 文案、可访问名称和内置 locale 与固定基线一致                             |
| Portal、焦点与动效 | 真实打开、操作、关闭和适用的重开路径；等待可观察终态                     |
| 受控与异步状态     | 缺省值、显式空值、事件参数及完成状态符合公开契约                         |
| 编辑器与资产       | 实际编辑运行，依赖、字体、图片及多文件路径可加载                         |
| 生产特有风险       | 出现开发/生产差异、iframe 权限或公开消费端兼容风险时，用相应静态产物验证 |

定位失败时保留必要的 DOM/ARIA、状态、截图和错误，先区分示例接入、组件差异、参考环境与采样问题。最小复现保留触发故障的前序交互；依据新证据修改对应层，再检查同类场景。已有输入和证据未变化时，不反复运行整批构建或矩阵。

### 短 smoke

复用 `.agents/skills/ai-change-workflow/scripts/documentation-smoke.mjs` 和仓库锁定 Playwright。先观察真实可操作元素，再使用具名步骤与有界终态断言；错误需核实，不统一忽略 console/page error。

编辑器使用真实时钟；控制短暂状态采样时，在不加载编辑器的独立 context 操作。焦点、Portal、动画和几何保留真实浏览器条件，不用固定 sleep、强制点击或关闭动效掩盖问题。

脚本、摘要和必要截图放在 ignored 的 `apps/docs/.data/documentation-smoke/<批次>/<运行标识>/`。手动 Playwright 使用独立 `--output` 和 reporter 路径，避免覆盖正式证据；清理前归档仍需保留的结果。Smoke 不生成 accepted。

## 验收线流程

1. 核对所选批次、固定 React 参考及最终双语内容。参考适配应保留原交互、Provider、主题和 Portal 条件；章节/API/迁移差异有明确审阅结论。
2. 按适用风险运行代表诊断，失败用精确路径定位。完整正式矩阵仍覆盖批次的全部双语、明暗、方向及交互组合。
3. 修改稳定后完成 diff 自审、适用静态检查、回归及审阅指纹，执行 `--preflight`。检查用例选择逻辑有改动时，还需用 Playwright `--list` 核对实际发现集合；零用例不能算通过。
4. 运行正式入口验收本轮目标。共享输入和准备产物在运行期间保持稳定，避免其它构建、服务和写入任务争用。失败后保留输出，确认进程结束，再修复和重验尚未认证的完整批次。
5. 核对最终 diff 和证据有效性，刷新覆盖账本与所选批次记录，按根规则提交。报告实际完成范围、检查、失效证据和剩余问题。

### 影响范围与证据

修改共享组件、主题、锁文件、文档外壳或构建/验收工具前，先查看 `--affected --plan`，判断必要性及回归成本；修改后以实际影响计划复核。批次专用参考适配放在 `apps/reference-react/docs-adapters/<batch>.mjs`，避免无关批次依赖它。

普通一轮新批次验收不隐含恢复所有历史 accepted。根据实际影响完成必要的组件或工具回归，工具核验仍有效的历史证据继续复用；失效历史证据如实反映在账本中。只有任务明确要求恢复这些批次的 accepted 时，才将它们加入完整正式矩阵。不得删实际输入、改旧指纹或降低门槛维持进度。

批次 `dependencyMode: imports-v2` 按导入关系追踪 UI、Foundation 和文档依赖，未知动态依赖会保守扩大。非 UI 共享输入需在 `inputs` 中声明，包括资产、主题、包导出/构建配置、锁文件、参考编译器和浏览器 fixture。更改正式断言或指纹算法会使相关证据失效；诊断和计时工具按其实际影响验证。

正式报告按 spec 归属逐批归档；缺项、失败、重试、跳过、全局错误或运行前后输入变化均不能认证。大型压缩报告无损分片保存，证据元数据记录顺序，工具重组后校验完整压缩流及全部用例；缺片、乱序或内容损坏均不能认证。历史单文件 gzip 报告继续兼容，完整附件与原校验要求保留。需要恢复的失效批次执行完整矩阵，已有效且输入未变的批次由 runner 复用。

## 命令入口

下例批次名按当前目标替换。运行日志和实际退出码必须可核实；后台进程启动成功不表示验证通过。

### 示例开发

```bash
# 校验/准备资源和内容注册，启动开发站
node .agents/skills/ai-change-workflow/scripts/documentation-dev.mjs
# 仅准备，不启动服务
node .agents/skills/ai-change-workflow/scripts/documentation-dev.mjs --prepare-only

# 已有对应准备产物时的内容/类型检查
pnpm --filter @workspace/docs check:content
pnpm --filter @workspace/docs exec nuxt typecheck
# 最终静态站、类型、内容和产物联合检查
pnpm --filter @workspace/docs check
pnpm --filter @workspace/docs preview

# 刷新映射及当前有效验收计数
node apps/docs/scripts/prepare-coverage.mjs
```

补齐线不用 `check:nuxt:coverage` 或 `prepare-coverage.mjs --batch=<批次>` 作为完成门禁：它们分别要求全量或指定批次严格证据，不能替代基础运行检查。

### 严格验收

```bash
# 只读影响计划，不构建或跑浏览器
pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan
# 最终审阅前置门禁，不要求已有浏览器证据
pnpm --filter @workspace/docs accept:nuxt:batch button icon --preflight

# 代表诊断与定点诊断，不生成 accepted
pnpm --filter @workspace/docs diagnose:nuxt:batch navigation
pnpm --filter @workspace/docs diagnose:nuxt:batch navigation --grep 'Template zh-cn light$'
# 查看诊断范围；或只准备产物
pnpm --filter @workspace/docs diagnose:nuxt:batch navigation --plan
pnpm --filter @workspace/docs diagnose:nuxt:batch navigation --prepare-only

# 当前目标的完整正式矩阵，共享准备和服务
pnpm --filter @workspace/docs accept:nuxt:batch button icon
# 仅在目标包括恢复历史 accepted 时，加入全部受影响批次
pnpm --filter @workspace/docs accept:nuxt:batch locale --affected
```

正式入口先检查请求集合的审阅状态。`--preflight` 对缺项、内容变化或缺失输入返回非零，不自动更新审阅指纹；浏览器证据不能替代语义审阅。

### 准备缓存与输出

正式和诊断入口共用 resources、site、checks 三阶段准备，按输入、环境和产物内容校验缓存；缺失、变化或上次失败的阶段自动重建。使用这些入口复用结果，不手工跳过新鲜度检查。运行期间持有的输入/产物证明在结束后再次核验。

矩阵共享服务，每个用例独立 context、配对 React/Vue；现有默认 3 workers，可用正整数 `DOCS_PARITY_WORKERS` 调整。正式和诊断均为 retries=0、max-failures=1，失败报告不认证批次；大批请求可按报告体积和资源容量分组。

准备记录在 `apps/docs/.data/documentation-preparation`。正式/诊断阶段耗时分别在 `apps/docs/test-results/acceptance-timing.json` 与 `diagnostic-timing.json`；共享原始报告为 `test-results/batches.json`，持久证据逐批保存。需要分析耗时时复用这些输出，无需另建计时系统或逐项手工记账。

## 确定性视觉上下文

复用 `apps/docs/tests/nuxt/visual-context.ts`、`waitForVisualAssets` 和 `demo-parity.ts`。参考与 Vue 使用锁定 Chromium 及本地资源，截图前加载真实字体、解码图片并对齐裁剪、滚动与坐标；缺失资源直接失败。

等待真实状态转换完成，再用 `freezeAnimations` 选择契约要求的采样时刻。默认态移开指针，hover/focus 路径显式进入对应状态；不能一律跳过动画、过滤状态类或延长业务定时器来制造一致。

样式、几何和像素门槛统一遵循[组件契约](../testing/component-contract.md#浏览器验收门槛)。可见局部差异仍需修复，或按固定源码证据记录允许的 deviation；不得扩大裁剪、mask、容差或盲目更新基线。
