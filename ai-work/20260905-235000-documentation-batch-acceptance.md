# AI 工作记录：双语文档分批验收

- 日期：2026-09-05
- 状态：Button 首批已验收；全量计划继续待办

## 目标

按用户批准的顺序逐批补齐 163 项双语映射和全部 859 项验收证据，先完成 Button 17 项试点。

## 验收标准

- 批次可独立执行；完整门禁不因部分通过而放行。
- 同进程 Chromium 双语/明暗对照，逐节点样式精确比较，几何差值 <= 0.5 CSS px，局部截图 threshold <= 0.1、差异比例 <= 0.001。
- 证据关联源码指纹、场景和测试结果，修改后失效；不以已有映射替代验收。

## 风险与假设

- 不改变公开组件 API，不修改 vendor，不部署，不自动提交。
- 固定源码中的英文示例并非中文逐句翻译；逐项遵循对应语言源码。
- 上游 Split 示例未声明 newBtnVisible；参考编译器仅补 const 以在 ESM 运行，原始源码保留。
- 上游仅提供 Inter Regular / SemiBold，远程 Bold 字体不在 submodule；不得将替代字体误称为原字体。

## 修改范围

- Nuxt 示例及浏览器验收、文档覆盖账本和批次执行脚本；参考应用只读源码构建适配。

## 关键决策与权衡

- 保留现有 DemoBlock，独立裁剪组件和 Portal；行为、样式、几何与截图共同判断。
- 英文文案及布局按固定英文源码修正，不复用中文布局假设。
- 回退为本任务相关文件的完整变更集；无需数据迁移或外部服务回退。

## 验证证据

- 原 button-matrix：35 通过、2 失败、31 未运行；失败为英文 TypeColors 与 Themelight 文案/几何，日志 /tmp/docs-button-initial.log。

## 未验证事项与剩余风险

- 其余 163 项未映射、679 项已映射示例及站点收尾仍未执行；下一批 Icon 8 项。
- 站点 Inter-Bold 替代差异仍是收尾待办；Button 目标不使用该字体族，不能据此认定站点字体对齐。
- 未切换入口、未部署、未提交。

## 首批实施结果

- 全部英文示例按固定英文源码校正文案、布局、图标尺寸、菜单；主题文案保留 React 的分段文本节点，以对齐 Chromium 字形栅格化。
- 站点 focus-visible 和 disabled cursor 不再覆盖组件示例。参考根节点采用相同绝对屏幕坐标；Portal 使用相同的无交互背景，未使用 mask 或放宽阈值。
- Icon 不再用 undefined 或重复的多色 fill 覆盖 SVG 根属性；Button 不再跨 loading 卸载缓存组件 VNode；Tooltip 固定使用上游 animation 前缀，Dropdown/Popover 独立主题包含其所需样式。
- 负向复现：浏览器 Loading 第二次关闭抛出 exposed/null 异常；自定义 Tooltip 前缀单测 1 失败/16 通过；修复后定向单测 33/33 通过。
- `pnpm --filter @workspace/docs accept:nuxt:batch button`：公开包/主题/Nuxt 构建、类型、内容、84 条 Chromium 用例全部通过；源码指纹前后一致，生成自含图片/样式附件的压缩报告。
- `pnpm test:unit`：169 个文件、1146 项通过。
- `node --test apps/docs/scripts/documentation-evidence.test.mjs`：10 项通过，覆盖缺失矩阵、跳过、重试、失败、错误来源、缺少附件和源码/映射变更失效。
- 定向 ESLint、Prettier、源码边界检查通过；`pnpm verify:pack-dist` 验证真实 tarball 安装、ESM、类型、样式、SSR import 通过。
- `pnpm test:browser`：全仓 434 项 Chromium 回归通过。
- Nuxt `portal.spec.ts` / `visual.spec.ts` / `editor.spec.ts`：212 项通过，覆盖 196 页、导航搜索、编辑器与既有视觉场景。
- UI/Icon 包级 typecheck、`pnpm verify:theme-dist`、`pnpm verify:ssr-dist` 通过。主题验证同时检查 Dropdown/Popover 独立产物保留 Tooltip 动画选择器。
- 源码展示增加逐字核对，34 个双语 light/LTR 场景增加编辑预览初始内容与关闭清理；Types/Loading/Split 定向验证 3 项通过。发现并修正测试 addInitScript 对 sandbox iframe 注入 localStorage 的问题，保留 iframe 隔离策略。
- 加入上述检查后重新执行正式批次：84/84 通过（5.0 分钟），源码指纹前后一致；覆盖账本为 696/859 已映射、17/859 有效验收。
- `pnpm typecheck:root` 通过。全量文档门禁按预期仍失败，不能据首批验收切换默认入口。
