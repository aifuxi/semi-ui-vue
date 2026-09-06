# 示例补齐与严格视觉验收

本流程用于后续所有文档示例补齐、已有示例修复和视觉验收。视觉、行为和发布标准继续遵守根目录 `AGENTS.md`；根据实际改动选择验证范围，不把每次示例维护重新当成组件从零实现。

## 从目标到验收

1. 明确当前批次、固定上游示例索引和待修差异。先检查 Git 状态、vendor 基线、双语路径大小写和多文件 Demo 依赖；已有对齐矩阵按差异更新，不重复建立整套材料。
2. 补齐示例及必要的组件修复。用户已授权的范围内直接推进；发现无关问题记录后继续当前目标，不自动扩展下一组件。
3. 先验证一个能暴露当前问题的代表用例。复用静态预览和现有确定性 fixture；源产物有变化才重新构建。代表用例通过后再跑完整双语、明暗、适用 RTL/交互矩阵。诊断用 `--grep` 结果不能计入 accepted。
4. 修复稳定后集中运行受影响的组件回归。只有共享基础设施、主题、运行时影响范围要求时才扩大回归；通过的检查不因“准备提交”而重跑。
5. 最后使用正式入口一次验收当前批次及受影响历史批次。运行期间冻结源码，不一边改文件一边跑验收；证据有效的批次直接跳过。失败时先诊断实际失败用例，不立即重复整套长耗时门禁。
6. 检查最终 diff 和证据状态，报告完成范围、必要验证及剩余问题。用户要求提交时只提交相关文件，已验证且未变化的源码不再触发构建。

## 命令入口

```bash
# 开始前查看失效范围，同时检查映射路径的精确大小写；不构建、不跑浏览器
pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan

# 定点诊断：静态产物须与待测源码一致；需要时先执行一次 docs build
pnpm --filter @workspace/docs exec playwright test -c playwright.nuxt.config.ts button-matrix.spec.ts --grep 'Button 文档 Types zh-cn light$'

# 单批正式验收，或多个批次共用一次构建
pnpm --filter @workspace/docs accept:nuxt:batch button
pnpm --filter @workspace/docs accept:nuxt:batch button icon

# 当前批次加上证据失效的历史批次，稳定后一次刷新
pnpm --filter @workspace/docs accept:nuxt:batch locale --affected
```

正式入口每次只执行一次 `prepare:site`（包含公开 JS 和主题构建）、Nuxt generate、Nuxt typecheck、内容与静态产物检查，随后顺序运行所选完整矩阵。无失效批次时不启动构建或浏览器。独立 `build`、`typecheck` 保持自行准备资源的安全语义；需要联合验证时使用 `check` 或正式入口，避免串联这些独立命令造成重复构建。不提供忽略产物新鲜度的正式 `skip-build` 选项。

## 影响范围与证据

批次声明 `dependencyMode: imports-v1`：从当前 Demo 和文档外壳的脚本导入出发，追踪 UI 公开子路径、相对导入与再导出。共享 Tooltip 等组件仍会使真实消费者失效；无关 Demo、无关 UI 组件及 React 普通场景不会触发重验。UI 纯类型导入不作为视觉依赖，类型检查仍在正式验收中执行；公共 API 变更另按组件门禁验证。

批次 `inputs` 必须保留实际使用的内容、API 元数据、资产、主题、Foundation、包导出/构建配置、锁文件、React 文档编译器、文档外壳和浏览器 fixture。图标、主题、Foundation 等共享包目前保守按包追踪。动态 import、未知别名、无法解析的本地依赖会扩大到全部 UI，并在计划中说明；不能手工删依赖来让证据继续有效。新增非 UI 共享依赖时同步补充 `inputs`。

`DemoBlock` 与 `ApiTable` 的固定页面注册表按本批目录/API 选择输入；修改注册表实现本身仍会使所有使用批次失效。更改指纹算法须重新生成浏览器报告，禁止把旧报告直接改成新指纹。完整矩阵全部通过、无重试/跳过且运行前后源码一致后，才统一写证据并刷新一次覆盖统计。

## 确定性视觉上下文

复用 `apps/docs/tests/nuxt/visual-context.ts` 的同进程 Chromium context 和 `waitForVisualAssets`，在截图前真实加载 Inter 字体、解码目标内图片；缺失资源直接失败。参考与 Vue 均使用静态站点本地资源，预览脚本提供字体/REPL 所需 CORS。

继续使用 `demo-parity.ts` 的 `freezeAnimations`，按上游状态显式选择动画采样时间，不能一律跳到动画结尾。截图前对齐裁剪范围、文档滚动和坐标，默认态将指针移到空白区；需要 hover/focus 的用例显式进入对应状态。交互导致滚动后重新对齐，不用延长固定 sleep 掩盖时序问题。

验收仍要求关键 computed style 精确相等、各轴几何差不超过 0.5 CSS px、截图 threshold ≤ 0.1、差异比例 ≤ 0.001；可见局部差异仍须解释并修复或按源码证据记录 deviation。不得扩大裁剪、mask、容差或盲目更新基线提速。
