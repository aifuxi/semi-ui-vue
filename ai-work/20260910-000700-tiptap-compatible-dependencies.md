# AI 工作记录：Tiptap 兼容范围依赖

- 日期：2026-09-10
- 状态：完成

## 目标与验收

消除发布包在官方 registry 严格隔离安装中的 Tiptap peer 冲突，允许兼容版本升级。保留 Semi v2.102.0 参考源码与现有 AIChatInput 行为、视觉和 SSR 契约。

## 修改与决策

- UI 和 React 参考应用的 Tiptap 依赖统一为 `^3.31.3`；删除 31 条 Tiptap overrides，由 lockfile 固定本次实际验证的 3.31.3。其他依赖的版本策略不变。
- React 参考应用直接使用的 ProseMirror model/state 分别改为 `^1.25.11` / `^1.4.4`，与新版 Tiptap 的依赖配套。首次浏览器运行虽然通过断言，但提示 model 重复加载；统一后再次运行，告警消失。
- 许可证通知从实际安装的 Tiptap manifest 读取版本；SBOM 延续记录发布依赖声明范围的契约。新版 `@tiptap/pm` 使用 `LICENSE`，并增加 `THIRD_PARTY_LICENSES.md`，两份内容共同保留在发布包的 pm 许可文件中。
- 同步架构、中英文组件说明和 Vue Adapter 源码版本依据。没有修改 vendor、组件实现或截图基线。
- 兼容范围允许未来 3.x 更新，不代表未来所有版本已经过行为验证；仓库更新 lockfile 时仍应执行受影响检查。回退可 revert 本次提交，但会恢复原有消费者 peer 冲突。

## 验证证据

命令通过 `mise exec --` 使用仓库 Node/pnpm 环境。

- `pnpm --filter @aifuxi/semi-ui-vue typecheck`、`pnpm typecheck:root`：通过。
- `pnpm exec vitest run packages/ui/src/ai-chat-input`：2 个文件、10 项组件/SSR 测试通过。
- `pnpm exec playwright test tests/browser/components/ai-chat-input.spec.ts`：最终 5 项通过；覆盖真实交互、DOM/样式/几何、light/dark、en-US/RTL、历史截图和同环境 React/Vue 像素对照，无 Tiptap 重复加载告警。
- `pnpm --filter @aifuxi/semi-ui-vue build`：修正 pm 许可文件名后通过。
- `pnpm verify:pack-isolated`：使用独立 store 从官方 registry 严格安装，通过真实 tarball 的 exports、ESM、类型、样式和 SSR 等检查；Tiptap peer 冲突不再出现。
- `pnpm verify:ssr-dist`：icons 525、icons-lab 86、illustrations 18、UI 151 个公开入口通过。
- 修改脚本的 ESLint、涉及文件的 Prettier、`git diff --check`：通过。
- `pnpm install --frozen-lockfile --offline`：通过。

## 既有问题与未验证范围

- 重新解析整个 workspace 时仍报告非 Tiptap peer 问题：`unctx@3.0.1` 与 `oxc-parser@0.139.0` / `unplugin@2.3.11` 不匹配，Vite 与 `sass@1.54.9` 不匹配，以及内部图标/插画包缺少 Vue peer 上下文。将修改前 HEAD 的 manifests、workspace 配置和 lockfile 复制到临时目录，执行 `pnpm install --lockfile-only --offline --fix-lockfile`，复现了相同问题。本次不扩大到 Nuxt/Sass 工具链调整，也没有关闭严格 peer 检查。
- WebStorm 的 read_file/get_run_configurations 均在 300 秒后超时，使用 CLI 回退；没有 IDE 诊断结果。
- 未执行全站构建、所有组件回归或完整发布门禁；本次仅确认受影响组件与发布包消费。历史文档验收证据没有重写。
