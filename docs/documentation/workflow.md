# 示例补齐与严格视觉验收

本流程用于后续所有文档示例补齐、已有示例修复和视觉验收。视觉、行为和发布标准继续遵守根目录 `AGENTS.md`；根据实际改动选择验证范围，不把每次示例维护重新当成组件从零实现。

## 从目标到验收

1. 明确当前批次、固定上游示例索引和待修差异。先检查 Git 状态、vendor 基线、双语路径大小写和多文件 Demo 依赖；已有对齐矩阵按差异更新，不重复建立整套材料。
2. 在编写交互断言前，先确认 React 参考侧能独立运行，并核对原站 Provider、语言、主题、Portal 容器和键盘/hover 契约。先区分参考环境缺失、采样误差与真实组件差异，再补齐示例及必要的组件修复。用户已授权的范围内直接推进；发现无关问题记录后继续当前目标，不自动扩展下一组件。
3. 先验证一个能暴露当前问题的代表用例。复用静态预览和现有确定性 fixture；源产物有变化才重新构建。代表用例按结构/默认视觉、主题、浮层、键盘分阶段诊断，使用具名 `test.step` 和局部有界断言；不要让错误状态耗尽整个用例的长超时。代表用例通过后再跑完整双语、明暗、适用 RTL/交互矩阵。诊断用 `--grep` 结果不能计入 accepted。
4. 修复稳定后集中运行受影响的组件回归、类型和真实包验证；修复期间优先定点测试，不在每个中间版本反复做完整发布包验证。只有共享基础设施、主题、运行时影响范围要求时才扩大回归；通过的检查不因“准备提交”而重跑。
5. 最后使用正式入口一次验收当前批次及受影响历史批次。运行期间冻结源码，不一边改文件一边跑验收；证据有效的批次直接跳过。失败时先诊断实际失败用例，不立即重复整套长耗时门禁。
6. 检查最终 diff 和证据状态，报告完成范围、必要验证及剩余问题。用户要求提交时只提交相关文件，已验证且未变化的源码不再触发构建。

## 命令入口

```bash
# 开始前查看失效范围，同时检查映射路径的精确大小写；不构建、不跑浏览器
pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan

# 定点诊断：静态产物须与待测源码一致；需要时先执行一次 docs build
pnpm --filter @workspace/docs exec playwright test -c playwright.nuxt.config.ts button-matrix.spec.ts --grep 'Button 文档 Types zh-cn light$' --retries=0 --max-failures=1

# 单批正式验收，或多个批次共用一次构建
pnpm --filter @workspace/docs accept:nuxt:batch button
pnpm --filter @workspace/docs accept:nuxt:batch button icon

# 当前批次加上证据失效的历史批次，稳定后一次刷新
pnpm --filter @workspace/docs accept:nuxt:batch locale --affected
```

正式入口每次只执行一次 `prepare:site`（包含公开 JS 和主题构建）、Nuxt generate、Nuxt typecheck、内容与静态产物检查，随后在一次 Playwright 调用内顺序运行所选完整矩阵，共享同次预览服务、参考服务和浏览器运行；仍使用单 worker 与各测试独立 context，不额外提高并发。无失效批次时不启动构建或浏览器。独立 `build`、`typecheck` 保持自行准备资源的安全语义；需要联合验证时使用 `check` 或正式入口，避免串联这些独立命令造成重复构建。不提供忽略产物新鲜度的正式 `skip-build` 选项。

成功与失败运行均输出 `apps/docs/test-results/acceptance-timing.json`，记录各构建/检查/浏览器阶段、总耗时和最慢的十次用例执行（含 retry/status）。共享原始报告为 `test-results/batches.json`；持久证据仍逐批保存，批次 `stats.duration` 为该批测试执行时长之和，整轮墙钟时间保留在 `sharedRunStats`，不能把整轮时间重复归给每个批次。

## 影响范围与证据

批次声明 `dependencyMode: imports-v1`：从当前 Demo 和文档外壳的脚本导入出发，追踪 UI 公开子路径、相对导入与再导出。共享 Tooltip 等组件仍会使真实消费者失效；无关 Demo、无关 UI 组件及 React 普通场景不会触发重验。UI 纯类型导入不作为视觉依赖，类型检查仍在正式验收中执行；公共 API 变更另按组件门禁验证。

批次 `inputs` 必须保留实际使用的内容、API 元数据、资产、主题、Foundation、包导出/构建配置、锁文件、React 文档编译器、文档外壳和浏览器 fixture。图标、主题、Foundation 等共享包目前保守按包追踪。动态 import、未知别名、无法解析的本地依赖会扩大到全部 UI，并在计划中说明；不能手工删依赖来让证据继续有效。新增非 UI 共享依赖时同步补充 `inputs`。

`DemoBlock` 与 `ApiTable` 的固定页面注册表按本批目录/API 选择输入；修改注册表实现本身仍会使所有使用批次失效。更改指纹算法须重新生成浏览器报告，禁止把旧报告直接改成新指纹。共享报告按明确的 spec 归属拆分；未知 spec、重复认领、任一批次缺项/失败/重试/跳过或全局错误均拒绝整轮。完整矩阵全部通过、无重试/跳过且运行前后源码一致后，才统一写证据并刷新一次覆盖统计。

## 确定性视觉上下文

复用 `apps/docs/tests/nuxt/visual-context.ts` 的同进程 Chromium context 和 `waitForVisualAssets`，在截图前真实加载 Inter 字体、解码目标内图片；缺失资源直接失败。参考与 Vue 均使用静态站点本地资源，预览脚本提供字体/REPL 所需 CORS。

继续使用 `demo-parity.ts` 的 `freezeAnimations`，按上游状态显式选择动画采样时间，不能一律跳到动画结尾。截图前对齐裁剪范围、文档滚动和坐标，默认态将指针移到空白区；需要 hover/focus 的用例显式进入对应状态。交互导致滚动后重新对齐，不用延长固定 sleep 掩盖时序问题。

验收仍要求关键 computed style 精确相等、各轴几何差不超过 0.5 CSS px、截图 threshold ≤ 0.1、差异比例 ≤ 0.001；可见局部差异仍须解释并修复或按源码证据记录 deviation。不得扩大裁剪、mask、容差或盲目更新基线提速。

## 避免不必要的共享改动

新增批次的参考编译适配、品牌替换和站点交互尽量放在批次专属模块；接入前查看 `--affected --plan`。共享入口确需改变时仍重验全部真实消费者，不靠删除 inputs 或改写旧指纹保留 accepted。可复用的裁剪、字体、滚动及动画确定性问题先在代表场景解决，再铺开场景矩阵；不能让每个主题/语言重复承担同一轮工具排错。
