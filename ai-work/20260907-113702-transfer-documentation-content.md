# AI 工作记录：Transfer 双语示例补齐

- 日期：2026-09-07
- 状态：补齐线完成；Transfer 文档严格验收未执行

## 目标

先提交已完成的 OverflowList、ScrollList 补齐，再按队列完成 Transfer 14 项双语示例、实际页面与编辑器运行检查。只修复阻断本批主要演示操作的问题，不扩展为新的严格文档验收批次。

## 验收标准

- 固定上游 14 项中文 live Demo 各关联中英文实现，保留数据、布局、默认值、动作和语言差异。
- 文档内容、类型、构建、静态产物检查通过；28 个示例逐项验证主要操作、重置、源码及在线编辑运行。
- 组件修复有失败前/修复后回归、真实 Chromium 操作及必要发布包验证；受影响历史证据重新验收。
- 映射进度 741/859，待映射 118 项；有效严格验收 43/859，已映射待验收 698 项。下一补齐批次为 Feedback 7 项。

## 风险与假设

- 实际核验本地只读 submodule：`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`、tag `v2.102.0`。
- 基线为 `packages/semi-ui/transfer/index.tsx`、`packages/semi-foundation/transfer/`、默认主题及 `content/input/transfer/index.md` / `index-en-US.md`，没有使用在线新版本。
- 14 项双语顺序一致，没有独有示例；样式代码块归属对应示例，内联作用域化，不复制 Foundation 或组件 SCSS。
- 组件已有 ready 状态不证明新场景正确；本轮实际发现了自定义项拖放和英文示例 Provider 缺失。

## 修改范围

- 已按用户要求先提交 `b3a5d9d`：`docs: complete OverflowList and ScrollList bilingual demos`，24 文件，包含这两批已验证示例、映射、进度和记录。没有推送远端。
- `apps/docs/src/demos/transfer/{zh-CN,en-US}/`：28 个完整 SFC 替换原有两个简化 Example1；每个演示独立，无新增共享组件、外部资源或多文件依赖。注册总数从 1504 增至 1530。
- 双语 Transfer 正文、`docs/documentation/mappings/transfer.json`、生成注册表与覆盖账本：按上游索引关联全部演示，补充 Vue 插槽/拖拽/语言适配说明，修正英文迁移表残留中文。
- `packages/ui/src/transfer/Transfer.vue`、`TransferNodeRenderer.ts`、`Transfer.test.ts`：修复拖放接收边界及函数式把手渲染，新增两条公开行为回归；不修改公开 props、emits、slots 类型。
- `docs/components/transfer/alignment.md`、README、文档进度/双线计划：同步修复证据、数量与下一项。
- Locale 历史批次的 evidence 与正式报告按最终源码刷新；其它五批证据未失效。
- 前两批与本次 Transfer 分开提交；用户要求的“先提交”已在 Transfer 实施前执行。

## 关键决策与权衡

### 演示结构与语言

| 上游索引 | SFC                  | 保留能力与数据                                                   |
| -------- | -------------------- | ---------------------------------------------------------------- |
| 1        | Basic                | 100 项、568×416、选择/删除/搜索及日志                            |
| 2        | Grouped              | A/B/C 三组 13 项，默认已选禁用 B-3(value=6)                      |
| 3        | CustomFilter         | 六位联系人、姓名/邮箱搜索与高亮、头像、默认两邮箱、52px 自定义行 |
| 4        | Disabled             | 20 项、全禁用、默认数值 [2,4]                                    |
| 5        | Draggable            | 30 项、内建拖拽、默认 [2,4]                                      |
| 6        | Pagination           | 100 项、左侧 10 项/页、跨页选择                                  |
| 7        | ControlledPagination | 外部第 1/2/5/10 页按钮及当前页码、受控分页回调                   |
| 8        | CustomDraggable      | 自定义左右项、把手、头像与邮箱、默认两邮箱                       |
| 9        | CustomHeaders        | 30 项、自定义计数、全选/取消全选/清空                            |
| 10       | CustomPanels         | 100 条门店、完整左右面板、搜索/添加/删除/全选/清空/空态          |
| 11       | CustomPanelSortable  | 独立完整面板、默认 [2,4]、原生把手拖放                           |
| 12       | CustomPanelDnd       | 独立排序容器、默认 [2,4]、原生拖放、键盘排序/取消                |
| 13       | Tree                 | 双语相同英文地名、受控 Shanghai、禁用 Mexico                     |
| 14       | TreeLeafCount        | 7 文件/10 总节点、父节点选择只返回叶子、空初值                   |

- 使用 `<script setup lang="ts">`、类型化数据与 `shallowRef`，React render props 转作用域 slots；保持 value 与 key 的区别。
- 中文基础标签为“选项名称”、英文为 Item；分组为类别/Group；门店为海底捞门店/Hdl Store。英文 CustomFilter 末两联系人缩写 Qu/Qu，CustomDraggable 则为 Er/San，保留源码差异。
- 页面语言不会自动注入到 Demo。每个英文 SFC 自包含 `ConfigProvider :locale="{ code: 'en-US' }"`，使内置搜索、计数、清空、分页文案在页面和编辑器都正确；不修改共享外壳。
- 全自定义面板依靠 Transfer slot actions 管理状态，不复制第二套选中集合。两个 React 专属拖拽库适配为 HTML5 拖放，按当前 key 查找 oldIndex/newIndex 再调用 onSortEnd；Dnd 示例还保留键盘重排和取消。

### 修复真正的拖放接收边界，不在 Demo 绕过

- 固定 `_sortable/index.tsx:242-249` 在自定义 item 外建立排序容器；原 Vue drop 只绑定在默认行，slot/render 覆盖默认行后没有 drop 接收方。新增回归中，slot 模式没有发出排序后的 change；函数 prop 模式还发现把手文本为空。
- 修复：由现有 TransferNodeRenderer 在 draggable 时提供 `.semi-transfer-right-item-sortable-item` 容器，接收整行 drop；非拖拽不增加该 DOM。`sortableHandle(render)` 的 span 直接使用 `render()` 返回内容，修正将原生元素 children 写成组件 default slot 对象的问题。
- 保留 beginDrag/endDrag/dropAt 状态与 Foundation 排序逻辑，不增加公开 drop API，不让 Demo 访问私有状态；没有为演示添加强制刷新、替代计数或特殊输入分支。
- 无 LSP server 配置：工具实际返回“No language servers configured”；通过限定源码搜索检查 TransferNodeRenderer 调用、Transfer 消费与历史批次依赖。
- 取舍：增加上游已有的排序行 DOM 边界，而不是克隆自定义根 VNode 或假设它只有单根；保留整个自定义行及其嵌套节点作为 drop 区域。
- 回退边界：恢复 Transfer 两个源文件及新增回归，撤回本批 Demo/映射，重建产物并重新生成受影响 Locale 证据；不能只恢复旧 evidence 保持计数。

## 验证证据

### 源码、文档与发布包

- `pnpm exec vitest run packages/ui/src/transfer/Transfer.test.ts -t 自定义已选项`：修复前两项失败，分别为排序没有 change、把手内容为空。
- `pnpm exec vitest run packages/ui/src/transfer/Transfer.test.ts packages/ui/src/transfer/Transfer.ssr.test.ts`：修复后 14 项全部通过，包括 slot/render 两种路径的排序结果、显示顺序及 dragend 取消后不再排序。
- 本批 SFC、Transfer 源码/回归的定点 ESLint（`--max-warnings=0`）通过；Prettier 对本批文件执行格式化。
- `pnpm --filter @workspace/docs check`：初次约 141 秒；英文 Provider 补齐后最终约 95 秒。最终包含 63 项准备/证据基础设施测试、Nuxt 类型、内容、静态产物门禁；resources 复用，site/checks 因实际源码修改重新生成。
- 最终静态站点：395 条预渲染路由、196 页、1530 个注册 Demo；既有归属与散列清单更新为 13 个直接包、5717 个文件，没有新增第三方依赖或资产。
- `pnpm exec playwright test tests/browser/components/transfer.spec.ts`：5 项全部通过，包含默认 Transfer 的 React/Vue 行为、键盘、DOM、computed style、几何、桌面 light/dark 和 RTL 截图，不降低门禁或更新基线。
- `pnpm verify:pack-dist && pnpm verify:ssr-dist`：真实 tarball 安装、exports、ESM、类型、样式与 SSR import 均通过，公开包/组件子路径 SSR import 通过。之后仅改英文 Demo Provider 和正文，没有重复执行未受影响的发布包验证。

### 实际文档站和在线编辑器

- `node apps/docs/scripts/preview-static.mjs` 启动真实静态站，浏览器工具打开中文/英文 Transfer 页面并截图观察；完整交互由临时 Playwright smoke 直接操作。
- 环境为锁定 Chromium 1234 / Chrome 151.0.7922.34，1440×900、DPR 1、light、浏览器 locale=en-US；分别使用 zh-cn/en-us 页面。
- 最终完整 smoke：28/28 通过，约 36.5 秒。无 pageerror 或 console error；仅记录 Emmet/Pug 不支持 Web 的 warning。
- 全部示例均验证主要操作、重置、展开/收起源码、在线编辑器真实键盘修改 label/值、点击运行、iframe 出现修改后的 Smoke 文案、退出编辑后恢复原示例。
- 列表/头部：选择、邮箱/名称搜索、匹配高亮、全选匹配项、清空、无匹配；分组全选 13 项，清空后保留禁用 B-3；全禁用示例 20 个复选框与搜索框不可用、默认 2/4 保留。
- 分页：10 项/页、跨页选择保持；受控按钮跳第 5/10 页后首项为 40/90，外部页码同步；搜索后显示正确结果。
- 四种拖拽演示均使用真实鼠标 dragTo：内建 2/4 重排、自定义联系人重排、两个完整面板 2/4 重排；自定义 Dnd 还验证 Space→ArrowDown→Enter 重排、Space→Escape 取消。
- 树：Shanghai 初值，搜索并选 Beijing，清空；叶子计数初值为 7/10，选择两个父文件夹与独立文件得到 7 个叶子，清空恢复。固定 Adapter `showButton` 在 treeList 为 false，因此没有虚构树头全选按钮。
- 调试过程修正了 smoke 的三个错误假设：自定义行同时有拖拽/删除两个 button，需精确选删除；树头不显示全选；英文 Highlight 首个匹配为大写 Quchen。只有英文 Provider 缺失需要改示例，未以放宽断言掩盖运行错误。
- 本地 ignored 证据在 `apps/docs/test-results/transfer-content/`：smoke.json 与 28 张局部 PNG。它们不是严格验收 evidence；关键事实在本记录保留。临时 smoke.mjs 已删除，浏览器与预览服务已关闭。

### 历史证据失效与刷新

- `pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan`：改组件前六批有效；修改后仅 Locale 依赖 Transfer，3 项文档证据失效，有效数暂降至 40。
- 输入冻结后运行 `pnpm --filter @workspace/docs accept:nuxt:batch locale --affected`：resources/site/checks 全部通过内容哈希校验复用；Locale 16 项正式双语明暗矩阵全部一次通过，无重试/跳过；约 61 秒。其它五批有效并跳过。
- 正式入口重验源码/产物后写入 Locale evidence 并刷新账本：741/859 映射、43 项有效严格验收。没有篡改指纹或沿用失效报告。

## 未验证事项与剩余风险

- Transfer 14 项没有执行完整严格文档 React/Vue 明暗/RTL/交互矩阵、全量 API/迁移审阅或新增 accepted。组件默认态的 5 项既有对照不能替代 14 项文档严格验收。
- 原生 drag image 与 React Portal overlay、拖动阈值、触摸、自动滚动和动画时序仍需严格审阅；两个自定义拖拽示例将上游被覆盖的空态分支改为实际可见，已在 mapping 记录，不是 accepted deviation。
- CustomFilter/CustomDraggable 的关闭图标由透明原生按钮承载，保留 hover 显隐并增加键盘操作；精细视觉差异须在严格验收时核对。
- REPL 的 Emmet/Pug Web 支持警告仍存在，不阻断本次编辑运行，没有修改共享编辑器。没有执行全仓 check:full 或全组件 Chromium 矩阵。
- 上一批 OverflowList 计数问题未扩展处理；ScrollList 固定分钟数据仍待严格对照。

下一补齐批次：Feedback 7 项，随后 Notification 8 项。严格验收下一批仍为 Divider 2 项。
