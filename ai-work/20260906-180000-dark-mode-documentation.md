# AI 工作记录：Dark Mode 示例补齐与严格视觉验收

- 日期：2026-09-06
- 状态：完成

## 目标

补齐下一批 Dark Mode 的两个固定上游 live 示例，并完成双语明暗严格视觉与行为验收。起始工作区干净，参考为只读 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。本轮没有提交或发布。

## 验收标准

- 两项示例具备双语文档、公开 API 迁移、独立编辑器运行、映射与许可记录。
- React/Vue 在同一 Chromium context、1440×900、DPR 1、固定字体/时间/语言/主题下比较；computed style 精确相等，rect 各轴差值不超过 0.5 CSS px，截图 threshold 0.1、maxDiffPixelRatio 0.001，无 mask。
- 代表诊断稳定后，通过正式入口共享一次构建并刷新所有受影响批次；重试通过、跳过和缺失证据不算完成。

## 风险与假设

局部示例包含 Layout/Nav 嵌套、局部及 body Portal，并暴露组件语言与焦点差异。既有 Vue 实现不作为正确性来源；以固定 React 源码、原站 LocaleProvider 上下文及同环境浏览器结果判断。共享参考编译器和 DemoBlock 改变使既有四批证据失效，需一起刷新。

## 修改范围

- 新增双语 Global/Local 示例及拆分子文件，共 14 个 SFC，注册 4 个入口；补齐双语主题说明、迁移表、映射、对齐矩阵和 MIT 文件哈希清单。
- Global 通过可选 themeChange 同步文档外壳；编辑器独立运行不依赖原站 window.setMode。局部主题使用 semi-always-dark/light，修正旧文档普通 div theme-mode 写法。
- React 参考直接编译固定 Markdown，补齐 useState、Layout 和原站 LocaleProvider 上下文；两端使用独立品牌及 IconApps，保留原始归属与许可。
- NavHeader 保留 text 缺省 undefined，避免 Vue Boolean 转换生成额外节点；Navigation 补齐独立 LocaleProvider 消费。
- Tooltip 克隆 VNode 使用组件可消费的 tabIndex；Pagination 按上游 pageSize + locale.pageSize 重建 Select，清理切换后的焦点样式。
- Foundation Select 声明补齐固定源码已存在的 updateScrollTop，无上游或运行时修改。相应黑盒测试与组件 alignment 已同步。

## 关键决策与权衡

### 主题与 Portal

采用原始全局/局部作用域，局部导航下拉挂到本实例容器，Tooltip 保持 body Portal 并验证继承全局 Token。没有将全部浮层强制移入局部容器；这样保留上游示例意图。代价是测试须分别验收两种主题作用域。回退时可撤回本批示例及其集成；消费者修复有独立测试可保留。

### 截图与键盘

按实际控件裁剪，长侧栏分别验收导航列表与折叠按钮，保留焦点环和箭头；两端滚动位置及像素相位统一，截图使用相同物理 clip，Portal 的位置仍独立比较。通过浏览器 Animation.finish() 完成真实动画并等待原生 animationend 后采样，无虚构事件、放宽容差或旧基线更新。

固定 tooltip/foundation.ts:348–356 的 hover 模式会在插入浮层后检查 :hover；指针离开时，仅键盘聚焦不会持续显示浮层。诊断曾误要求持续打开，依据源码改为验证两端一致关闭及真实焦点环；显式 trigger="focus" 的开启另由黑盒测试验证。没有改变组件行为以满足错误预期。

## 验证证据

- `pnpm exec vitest run packages/ui/src/navigation packages/ui/src/tooltip packages/ui/src/pagination packages/ui/src/select`：8 文件、61 项通过，[日志](./20260906-180000-dark-mode-unit.log.gz)。
- `pnpm exec playwright test tests/browser --retries=0 --reporter=json`：全仓 Chromium 442 项通过，无跳过、失败或 flaky，[报告](./20260906-180000-dark-mode-browser.json.gz)。
- `pnpm --filter @workspace/docs accept:nuxt:batch dark-mode --affected`：共享公开 JS、主题和 Nuxt 构建，类型/内容/产物检查通过；Button 84、ConfigProvider 16、Dark Mode 8、Icon 48、Locale 16，共 172 项通过，无跳过、失败或 flaky，[正式日志](./20260906-180000-dark-mode-official.log.gz)。截图、样式和环境附件保存在 [批次证据目录](../docs/documentation/evidence/)。
- UI、文档和参考 React 类型检查、`pnpm typecheck:root`、修改范围 ESLint 通过；证据验证器 19 项通过。
- `pnpm verify:pack-dist`：真实 tarball 安装、exports、ESM、类型、样式和 SSR import 通过；`pnpm verify:ssr-dist`、`pnpm check:boundaries` 通过。[检查日志](./20260906-180000-dark-mode-checks.log.gz)。
- 复核 14 个示例许可 sha256；手动查看导航浮层、带箭头 Tooltip 和键盘焦点截图。五批 acceptedBatch 均为 true，最终覆盖账本为 1476 个注册 Demo、712/859 项映射、33/859 项有效严格验收。

## 未验证事项与剩余风险

下一批为 Navigation 10 项。其余示例的逐项严格验收、最终站点整体门禁和 Nuxt/REPL 传递依赖许可审计仍按批次计划推进。本轮没有运行整套 pnpm check/check:full，不以本批通过宣称 859 项示例或全站已完成。
