# 示例补齐与严格视觉验收

本流程用于后续所有文档示例补齐、已有示例修复和视觉验收。视觉、行为和发布标准继续遵守根目录 `AGENTS.md`；根据实际改动选择验证范围，不把每次示例维护重新当成组件从零实现。

## 从目标到验收

1. 明确当前批次、固定上游示例索引和待修差异。先检查 Git 状态、vendor 基线、双语路径大小写和多文件 Demo 依赖；已有对齐矩阵按差异更新，不重复建立整套材料。
2. 在编写交互断言前，先确认 React 参考侧能独立运行，并核对原站 Provider、语言、主题、Portal 容器和键盘/hover 契约。先区分参考环境缺失、采样误差与真实组件差异，再补齐示例及必要的组件修复。用户已授权的范围内直接推进；发现无关问题记录后继续当前目标，不自动扩展下一组件。
3. 先执行当前批次的自动代表用例：全部示例的双语首主题，再加暗色与各方向敏感示例 RTL；需要定位已知失败时用 --grep 精确选择。通过新鲜度校验复用准备产物，变化或缺失才自动重建。代表用例按结构/默认视觉、主题、浮层、键盘分阶段诊断，使用具名 `test.step` 和局部有界断言；不要让错误状态耗尽整个用例的长超时。代表用例通过后再跑完整双语、明暗、适用 RTL/交互矩阵。诊断用 `--grep` 结果不能计入 accepted。
4. 修复稳定后集中运行受影响的组件回归、类型和真实包验证；修复期间优先定点测试，不在每个中间版本反复做完整发布包验证。只有共享基础设施、主题、运行时影响范围要求时才扩大回归；通过的检查不因“准备提交”而重跑。
5. 最后使用正式入口一次验收当前批次及受影响历史批次。运行期间冻结源码，不一边改文件一边跑验收；证据有效的批次直接跳过。失败时先诊断实际失败用例，不立即重复整套长耗时门禁。
6. 检查最终 diff 和证据状态，报告完成范围、必要验证及剩余问题。用户要求提交时只提交相关文件，已验证且未变化的源码不再触发构建。

## 命令入口

```bash
# 开始前查看失效范围，同时检查映射路径的精确大小写；不构建、不跑浏览器
pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan

# 默认代表用例：自动校验/复用构建，不生成 accepted
pnpm --filter @workspace/docs diagnose:nuxt:batch navigation

# 定点诊断：仅跑失败用例，测试改动不重建站点
pnpm --filter @workspace/docs diagnose:nuxt:batch navigation --grep 'Template zh-cn light$'

# 查看诊断范围；或仅准备并检查可复用产物
pnpm --filter @workspace/docs diagnose:nuxt:batch navigation --plan
pnpm --filter @workspace/docs diagnose:nuxt:batch navigation --prepare-only

# 单批正式验收，或多个批次共用一次构建
pnpm --filter @workspace/docs accept:nuxt:batch button
pnpm --filter @workspace/docs accept:nuxt:batch button icon

# 当前批次加上证据失效的历史批次，稳定后一次刷新
pnpm --filter @workspace/docs accept:nuxt:batch locale --affected
```

正式与诊断入口共用三阶段准备：resources 构建公开包/主题及本地资源，site 生成 Nuxt 静态站点，checks 执行类型/内容/产物检查。每阶段按输入内容、前置产物摘要、Node/平台/构建环境及安装锁记录缓存；所有产物文件及完整文件集合均按内容哈希校验。源码变化、缺失/新增/篡改产物、上次失败或运行中变化会自动失效，没有手工跳过构建的选项。文档改动复用 resources；纯测试改动复用 resources/site，仍运行实际消费测试文件的 Nuxt typecheck。独立 `build`、`typecheck` 保留原有自行准备语义；日常示例修复优先使用统一诊断入口。

完整矩阵仍在一次 Playwright 调用内共享服务；每个用例独立 context、同 worker Chromium 中配对 React/Vue。默认 3 workers 并行用例，保持各用例内部交互顺序；可用正整数 `DOCS_PARITY_WORKERS` 显式调节。并发改变不允许减少断言或靠重试消化失败。无失效批次不启动构建或浏览器。诊断默认 retries=0、max-failures=1，结果只用于定位；正式仍要求全部选定矩阵一次通过。

REPL 资产入口按固定小组共享打包，根入口与公开子路径使用同一份组件实现，UI 保留按需拆分，Vue 和跨包资产通过统一 import map 加载。生成时验证每个公开入口的传递静态模块请求数不超过 200；不得通过为每个入口重复打包运行时或让简单示例加载全库来降低表面请求数。

准备记录位于 ignored 的 `apps/docs/.data/documentation-preparation`；验收持有本轮输入/产物证明，浏览器结束后重新核验，不能被其它构建后来写入的缓存记录替代。清理构建后自动恢复，不要求使用者管理缓存键。

成功与失败运行均输出 `apps/docs/test-results/acceptance-timing.json`，记录各构建/检查/浏览器阶段、总耗时和最慢的十次用例执行（含 retry/status），并保留 worker 数、用例数量/集合哈希与原始浏览器 stats。准备缓存命中、失效原因和校验耗时也记录在 stages。诊断对应 `diagnostic-timing.json`，不会覆盖正式计时。共享原始报告为 `test-results/batches.json`；持久证据仍逐批保存，批次 `stats.duration` 为该批测试执行时长之和，整轮墙钟时间保留在 `sharedRunStats`，不能把整轮时间重复归给每个批次。

## 影响范围与证据

批次声明 `dependencyMode: imports-v2`：从当前 Demo 和文档外壳的脚本导入出发，追踪 UI 公开子路径、相对导入与再导出。共享 Tooltip 等组件仍会使真实消费者失效；无关 Demo、无关 UI 组件及 React 普通场景不会触发重验。UI 纯类型导入不作为视觉依赖，类型检查仍在正式验收中执行；公共 API 变更另按组件门禁验证。

批次 `inputs` 必须保留实际使用的内容、API 元数据、资产、主题、Foundation、包导出/构建配置、锁文件、React 文档编译器、文档外壳和浏览器 fixture。图标与主题保守按包追踪；Foundation 按实际命名导出追踪纯转发模块，共享运行时工具/构建配置仍追踪。转发目标缺失、含副作用、样式或越界时保守扩大。动态 import、未知别名、无法解析的本地依赖会扩大到全部 UI，并在计划中说明；不能手工删依赖来让证据继续有效。新增非 UI 共享依赖时同步补充 `inputs`。

`DemoBlock` 与 `ApiTable` 的固定页面注册表按本批目录/API 选择输入；修改注册表实现本身仍会使所有使用批次失效。更改指纹算法须重新生成浏览器报告，禁止把旧报告直接改成新指纹。共享报告按明确的 spec 归属拆分；未知 spec、重复认领、任一批次缺项/失败/重试/跳过或全局错误均拒绝整轮。完整矩阵全部通过、无重试/跳过且运行前后源码一致后，才统一写证据并刷新一次覆盖统计。

## 确定性视觉上下文

复用 `apps/docs/tests/nuxt/visual-context.ts` 的同进程 Chromium context 和 `waitForVisualAssets`，在截图前真实加载 Inter 字体、解码目标内图片；缺失资源直接失败。参考与 Vue 均使用静态站点本地资源，预览脚本提供字体/REPL 所需 CORS。

继续使用 `demo-parity.ts` 的 `freezeAnimations`，按上游状态显式选择动画采样时间，不能一律跳到动画结尾。截图前对齐裁剪范围、文档滚动和坐标，默认态将指针移到空白区；需要 hover/focus 的用例显式进入对应状态。交互导致滚动后重新对齐，不用延长固定 sleep 掩盖时序问题。

验收仍要求关键 computed style 精确相等、各轴几何差不超过 0.5 CSS px、截图 threshold ≤ 0.1、差异比例 ≤ 0.001；可见局部差异仍须解释并修复或按源码证据记录 deviation。不得扩大裁剪、mask、容差或盲目更新基线提速。

## 避免不必要的共享改动

新增批次的参考编译适配、品牌替换和站点交互放入 `apps/reference-react/docs-adapters/<batch>.mjs`；共享插件自动发现惰性入口，批次仅追踪自己的适配器及递归依赖，新增适配器不会改变其它批次的输入。接入前查看 `--affected --plan`。共享入口确需改变时仍重验全部真实消费者，不靠删除 inputs 或改写旧指纹保留 accepted。可复用的裁剪、字体、滚动及动画确定性问题先在代表场景解决，再铺开场景矩阵；不能让每个主题/语言重复承担同一轮工具排错。
