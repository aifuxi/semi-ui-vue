# AI 工作记录：Grid 文档严格验收

- 日期：2026-09-11
- 状态：完成

## 目标与验收标准

按严格验收队列完成 Grid 七项双语示例，核对固定 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21 的章节、API、迁移及 React 参考。双语、明暗、LTR/RTL 共 56 项；真实宽度变化、六断点两侧、源码、重置、编辑运行及退出重开均纳入。样式精确相等、几何各轴不超过 0.5 CSS px，全例与逐行截图保持 threshold=0.1、maxDiffPixelRatio=0.001。

## 修改范围

- 新增 Grid 独立 React Markdown 适配器、正式批次、56 项矩阵和审阅说明；七项 React 示例直接来自只读 vendor，不独立复制维护。
- 双语文档使用 `<Row type="flex">`；gutter 默认值改为 0，justify/order/offset/push/pull 改为未设置，纠正英文属性大小写。保留实际源码 sm=576px 和 VerticalAlign 普通 div 的 value 属性。
- 两个对照应用禁止 Lightning CSS loader 和 CSS minifier 二次改写固定 Sass 输出，避免 Grid 百分比被截短。本批没有修改公开组件、主题源码、依赖或版本，提交空 Changeset。

## 关键诊断与取舍

1. 390px 下 React 容器宽度与 Vue 差 16px，原因是参考容器固定 padding=24px，而文档窄屏为 16px。矩阵读取实际预览 padding/overflow/尺寸及滚动位置，同态采样。
2. 窄屏局部差异来自站点侧栏真实 0.2 秒退场动画。按固定 layout.scss 与实际 DOM 动画等待 `getAnimations().finished`，不关动画、不暂停时钟、不 mask。
3. 575px 的 5/24 列宽出现一个 1/64 CSS px 的取整差异，并造成逐行文字像素超限。源码响应证实 Rsbuild 将 `20.8333333333%` 截为 `20.8333%`，两边 Sass 均为 1.54.9。对照应用保留 Sass 精度；生产构建产物亦确认保留完整百分比。代价是测试应用 CSS 较大，不影响消费者发布产物。没有放宽 computed width 或像素门槛。
4. Gutter 内部几何相同而整个预览高度差 12px，源于文档 overflow:auto 建立格式化上下文，影响垂直 gutter 负 margin；参考容器同步该实际样式后定点通过。

共享构建配置使历史八批证据失效，按真实输入重新验收全部九批，不改写旧证据指纹。WebStorm 项目与运行配置只读调用均超时，已说明后使用 CLI；未绕过权限拒绝。未启用子代理。

## 验证证据

- Grid 代表诊断：22/22 通过（浏览器 27.1 秒，诊断入口总计 32.7 秒）；窄屏 Gutter 与暗色 RTL Responsive 截图已人工复核。最后定点修复前的失败不算通过证据。
- `pnpm --filter @workspace/reference-react --filter @workspace/parity-vue run build`：两应用类型检查及生产构建通过。
- `PARITY_SERVER_MODE=build pnpm test:browser`：442/442 通过，浏览器 2.3 分钟。
- `pnpm test:tooling`：73+6=79 项通过；修改文件 ESLint、Prettier 与 `git diff --check` 通过。
- `pnpm typecheck:root`：本批前期通过；最终两应用类型由各自 build 检查，文档类型由正式入口检查。
- `pnpm check:changesets`：通过；未执行版本更新或发布。
- `pnpm --filter @workspace/docs accept:nuxt:batch grid --affected`：九批 352/352 通过，0 失败/重试/跳过；浏览器阶段 335.4 秒，入口总墙钟 349.9 秒。resources/site/checks 的全部输入和产物内容校验命中后复用，本轮未重复构建站点。正式入口运行前后输入核验通过，覆盖为 59/859。
- 收尾 `pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan`：九批全部证据有效，未触发额外构建或浏览器运行。

本地失败诊断与代表截图位于 ignored 的 `apps/docs/.data/documentation-smoke/grid/`，最终代表摘要及两张人工复核图片在 `final-representatives/`。早期失败原始日志保存在 `/tmp/grid-*.log`，部分 runner 输出曾被覆盖，不将全部旧 trace 声称为持久证据。正式证据由入口生成在 `docs/documentation/evidence/`，Grid 对应 `grid.json` 和 `grid.report.json.gz`，历史八批亦同时更新。

## 未验证事项与剩余工作

当前九批有效，剩余 800 项已映射待严格验收；下一批为 Layout 八项。没有新增 accepted deviation；本批未改公共运行时，不额外重复 SSR 和真实 tarball 发布验证。Grid 文档 ClientOnly 预览不充当组件 SSR/hydration 验收。
