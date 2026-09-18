# Layout 文档严格验收

- 日期：2026-09-11
- 状态：完成

## 目标与范围

继续严格验收队列中的 Layout 八项双语示例，以固定 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21 的 Markdown 和 Adapter 为唯一参考。开始时工作区干净，九批正式证据有效，累计 59/859。最简单代表为 ThreeSections，交互代表为 Responsive、TopSidebar 和 SideNavigation。

新增独立 React 文档适配器、批次和 64 项矩阵。英文导航示例恢复固定源码的菜单、面包屑、模板文案和 Webcast 标题；保留独立品牌替换。双语 SideNavigation 使用公开 Nav.Header 的 text/logo 接入以保留折叠语义。英文复合示例载入完整 locale。API 文档纠正断点类型与英文表格列数。

## 诊断与取舍

- WebStorm 项目和运行配置查询均在 300 秒后超时，说明后使用 CLI 与文件补丁。未启用子代理。
- React 参考已先独立运行并观察实际 ARIA、菜单和折叠状态。开发站首次对照停在跨源字体加载，未进入像素比较；切换既有静态验收服务，不改共享字体策略。
- 第一轮静态类型检查发现 NavHeader 不是独立公开导出，改用已有 Nav.Header。该轮失败未生成证据；后续入口按实际失效范围重新准备。
- 关键样式精确相等、几何 0.5 CSS px、像素 threshold=0.1 / maxDiffPixelRatio=0.001；导航、面包屑、骨架和页脚分别紧裁剪。没有 mask 或阈值放宽。
- 补充浮层断言后，暗色 RTL TopSidebar 的展开提示有 10 个像素超限，样式/几何相等。失败整页与局部截图证实 Vue 右侧目录文字从 Tooltip 圆角透出，独立 React 参考没有该背景文字。依据固定 PageAnchor/index.scss 的 max-width:1399px，浮层视觉在该真实断点执行，目录自然隐藏；保留 1440px 折叠状态及 1399px 往返布局比较，不删除页面元素、不 mask、不修改浮层样式。失败材料保存于 apps/docs/.data/documentation-smoke/layout/popup-rtl-failure/。

## 验证证据

- 最终自动代表 25/25 通过，浏览器 53.5 秒，诊断浏览器阶段 54.0 秒。明色 SideNavigation 默认/折叠、暗色 RTL TopSidebar 及展开 Tooltip 截图均人工复核。代表摘要和截图保存在 `apps/docs/.data/documentation-smoke/layout/final-representatives/`，明色侧栏图片在 `side-representative/`。
- 本批 ESLint、Prettier 检查和 `git diff --check` 通过；`pnpm check:changesets` 通过。空 Changeset 不改变公开版本。
- 静态准备中的 Nuxt typecheck、内容注册检查及静态产物门禁通过。最终修改后静态生成 48.4 秒，后续纯测试调整复用 resources/site，按实际输入重新执行 checks。
- `pnpm --filter @workspace/docs accept:nuxt:batch layout --affected`：Layout 64/64 正式矩阵通过，0 失败/重试/跳过；3 workers，浏览器阶段 114.5 秒，入口墙钟 126.5 秒。resources/site/checks 均在完整内容校验命中后复用，本轮未重复构建。正式入口运行前后输入核验通过。
- 正式证据为 `docs/documentation/evidence/layout.json` 和 `layout.report.json.gz`。历史九批证据有效并跳过，本批累计有效验收增至 67/859。
- 收尾 `pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan` 确认十批全部证据有效，未触发额外构建或浏览器运行。

## 剩余范围

剩余 792 项已映射待严格验收，下一批是 Resizable 14 项。没有修改公开组件运行时、共享主题或构建基础设施，不重复执行未受影响的组件全矩阵、SSR 或真实 tarball 验证。文档 ClientOnly 预览不充当组件 SSR/hydration 验收。未新增 accepted deviation。
