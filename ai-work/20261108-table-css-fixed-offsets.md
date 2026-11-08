# BUG-000078：Table CSS 字符串列宽的固定偏移

## 问题现象

工单记录 `@aifuxi/semi-ui-vue@2.1.0` / Vue 3.5.44 的真实迭鹿缺陷列表：选择列与名称列均为左固定列，宽度使用 CSS 变量，实际分别为 56px、416px。横向滚动后，名称表头偏移 56px，正文却为 0px，覆盖选择列；列宽本身正确。验收要求包含主题变量/容器尺寸更新、数值宽度、左右固定列、RTL、分页与选择。

本次在组件库工作区使用锁定的 Vue 3.5.42 和只读 Semi React v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。三个新增单元回归在修复前失败；旧生产 tarball 的标准实例浏览器回归也按预期失败，正文名称列实际 left=0px、预期 56px，复现了同一计算缺陷，不依赖产品 CSS 覆盖。

## 已确认根因

- `TableCore.displayColumns` 将字符串 width 保留到 __width，这是 colgroup 渲染 CSS 的合法输入。
- 正文 fixedOffsets 原先只检查 __width 是否非空，字符串因此阻止回退至 measuredHeaderWidths。`table-utils.fixedOffsets` 只累加数值，最终把该字符串当作 0。
- `TableHeader.headerFixedOffsets` 已按“数值 __width → 数值 width → 实测表头宽度”计算，因此两条路径不一致。
- 原 ResizeObserver 只观察 wrapper；纯 CSS 变量更新可以改变表头宽度但不改变 wrapper 的尺寸。浏览器探索在保持 600px 容器不变的情况下证实需要独立观察表头。

## 实际修复与影响范围

- 正文改用与表头相同的数值优先级。原 CSS 字符串仍交给浏览器渲染，不用 parseFloat 或业务转换猜测 var/calc 的结果；数值和拖动后的宽度优先规则保留。
- 仅在存在 CSS 字符串列、并需要固定/虚拟测量时，复用现有 ResizeObserver 观察当前表头单元格的 border-box。通知仍合并到原 animation frame，统一刷新宽度缓存和滚动边界。同步移除旧表头、观察重建节点，卸载继续断开观察并取消待执行帧。纯数值表格不增加表头观察。
- 新增单元、固定基线专项场景及真实 tarball 消费测试；补齐参考应用本地声明中固定基线已有的 fixed 字段，不修改 vendor。更新中英文使用文档、组件契约及 UI patch Changeset，不手改公开包版本。
- 实现改动限于 TableCore，未添加产品样式、事件覆盖或业务数值宽度绕过，未改动分页和 Checkbox 实现。

## 固定 React 对照与明确差异

固定 `TableHeaderRow.cacheRef` 在非数值列宽时读取 getBoundingClientRect，初始及横向滚动中的左右固定偏移可作为正确对照，LTR/RTL 均通过。

其 componentDidUpdate 仅在 columns 身份变化时刷新该缓存。实际浏览器中 CSS 变量改变且容器缩窄后，选择列 border-box 已为 72px，固定 React 名称偏移仍为旧的 56px。新增对照显式记录这个固定版本限制；Vue 则必须按新几何对齐。表头独立 ResizeObserver 是满足本工单动态主题验收的修正差异，不把 React 的旧偏移改写为 Vue 正确预期，也不修改只读基线。

## 实际验证

- `pnpm test:unit packages/ui/src/table`：最终 20 个文件、103 项通过。新增 3 项覆盖 CSS var/calc/px、数值宽度优先、左右及 RTL、独立表头重测、显式 showHeader 的销毁重建、待执行帧取消与迟到通知清理；原排序、分页、伸缩、分组、展开、虚拟和 SSR 等用例继续通过。
- `pnpm exec playwright test tests/browser/components/table.spec.ts`：原有 9 项通过，原明暗/RTL 快照未改。初轮新增的 2 项动态对照暴露上述固定 React 限制；按源码与浏览器证据显式区分差异后，以 `-g 'CSS 字符串宽度'` 定向运行的最终 2 项通过，0 重试。
- `pnpm test:consumer tests/consumer/table-fixed-widths.spec.ts`：最终 4 项通过。生产 tarball 的 LTR/RTL × 明暗矩阵使用稳定的 columns/rowSelection/scroll 对象引用，纯 CSS 变量变化不会靠 prop watcher 重测掩盖问题。验证横纵滚动实际发生、两端偏移、容器变化、20/14 条换页、选择列可点击及无整页横向溢出。
- consumer 场景最初误用 defaultPageSize，改为 Table 已有公开 pageSize=20；选择操作改点实际可见的 Checkbox label，而非被装饰层覆盖的原生 input。保留原结果断言，未 force 点击、放宽几何阈值、添加固定等待或修改分页/Checkbox 逻辑。
- `pnpm check:artifacts`：公开包及主题构建、主题入口、无 DOM SSR import、真实 tarball 安装/exports/ESM/声明/样式/tree-shaking 均通过；复用本机 pnpm store，不声称隔离下载验证。
- UI、根工具、Storybook Vue 与固定 React 参考应用类型检查通过；受影响代码 ESLint、Prettier 与 Git diff 空白检查通过。`pnpm check:changesets` 在本次文件暂存后通过，按 fixed 六包组识别 patch 发布意图。
- 诊断日志、trace、截图和构建产物均留在本机临时路径及已忽略目录，不提交 Git。

## 交付边界

本次修复与本地生产 tarball 已验证；尚未推送、合并到 master、发版或升级迭鹿业务依赖，遵守用户“先别发版”的指令。原 localhost:48273 仍消费已发布版本，真实缺陷列表及其他共用业务页面需要在消费修复版本后复验。CSS 字符串的分组表头和虚拟表格没有新增专项浏览器矩阵；原数值场景继续由已有回归覆盖。

沿用本会话已核对的工具条件：工作区干净后开始本任务，无 CodeGraph 索引，完整工具目录无 WebStorm MCP，组件技能入口缺失；依据现有组件契约、mise/项目 Playwright CLI 与固定源码执行，不自行初始化索引或修改 IDE 配置。
