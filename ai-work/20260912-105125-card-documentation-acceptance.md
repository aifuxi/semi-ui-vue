# AI 工作记录：Card 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

接续 Calendar 批次，完成展示类第四个组件 Card 14 项固定上游示例的双语、明暗与 LTR/RTL 严格验收（共 112 项）。起始提交 5c4f688，已有 25 批证据有效、184 项 accepted。本批未修改 Card 组件，只对齐示例资源与英文文案，并新增批次配置、参考适配器、矩阵与验收记录。

## 验收标准

- 完整矩阵一次通过，无重试、跳过或失败；逐节点比较 class、属性、文本、`checked` property、关键计算样式与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，并对示例内每张卡片单独裁剪。
- 交互覆盖示例中真实存在的路径：Switch 关闭内置/自定义预加载、页签切换、滑块调节卡片间距、hover 阴影终态，以及双语 light/LTR 的源码/重置/在线编辑。
- 固定 vendor 不变；按真实依赖核对历史证据有效性，不改旧指纹。

## 风险与假设

- 固定 Markdown 混用两个封面文件名（`card-cover-docs-demo.jpeg` 与 `card-cover-docs-demo2.jpeg`），只替换其中一个会让参考侧加载线上原图。
- Card 示例内嵌 Tabs、Slider、Rating、Switch、Skeleton 等尚未验收的组件，其 DOM/ARIA 细节会进入本批比较范围。
- Tabs 在标题栏写入随机 `data-uuid`；Rating 显式输出 `aria-disabled="false"`；Slider 聚焦时显示 Portal 值提示气泡，落点在小数像素上。

## 修改范围

- 新增 `docs/documentation/batches/card.json`、`apps/docs/tests/nuxt/card-matrix.spec.ts`、`apps/reference-react/docs-adapters/card.mjs` 与 `docs/documentation/card-acceptance.md`。
- `docs/documentation/mappings/card.json` 补 `review` 审阅块（章节/API/迁移 + 源指纹），使账本可判定该文档 `accepted`。
- 示例修正：`apps/docs/src/demos/card/en-us/Group.vue` 引导文案恢复为固定上游的 `Slide to adjust the card spacing`。
- 计划更新：`docs/documentation/batch-plan.md` 进度、剩余范围与下一批。
- 未修改 `packages/ui`；未放宽裁剪、容差或门槛。

## 关键决策与权衡

- **两处封面文件名统一映射本地资源**：适配器把两个 CDN 封面地址都换成 `poster.svg`、头像地址换成 `photo.svg`，让两侧加载同一份离线资源；只映射其一会让参考侧渲染线上原图并产生 130px 高度差。
- **生成标识按定义顺序归一**：Tabs 的随机 `data-uuid` 归一为 `uuid-N`，缺项、重复或改序仍然失败；与既有 `id`/`data-popupid` 归一同源。
- **比较取可观察终态**：Tabs 等待进入动效的起始类消失；Group 在按键调节后失焦再比较，避免 Slider 值提示气泡的页面相关小数像素差异；Shadows 等待过渡结束后比较 hover 终态，不猜中间帧。
- **不扩张到未验收组件**：Rating 显式 `aria-disabled="false"`、Slider 提示气泡定位、Tabs 动效实现都只按来源说明等价处理，留给各自批次审阅，不在本批改组件。
- **示例文本以固定上游为准**：英文引导文案用固定 Markdown 的措辞，而不是让适配器迁就迁移版本。

## 验证证据

- 代表诊断（43 项：每个示例双语 light、首例 dark、全部 RTL dark）在修复后一次通过；另核对 `playwright --list` 实际发现 112 项与 `expectedCaseTitles` 一致。
- 迭代中定位并修复四类问题：封面资源映射（Cover 高度差 362 vs 231.6px）、Tabs `data-uuid`、Rating `aria-disabled="false"`、Tabs 切页签的动画中间态、Group 英文文案、Slider 聚焦气泡。
- 冻结后 `accept:nuxt:batch card --affected`：112/112 一次通过，unexpected=0、flaky=0、skipped=0、retry=0，3 workers，浏览器 61.7s，整轮 80.6s；resources/site/checks 命中内容缓存。
- `prepare-coverage --batch=card` 退出码 0；账本 198/859，Card `accepted`、14/14 示例、章节全部 `reviewed`；随后 `--affected --plan` 显示 26/26 批证据有效。
- 本批修复使 Card 证据在映射 review 定稿后失效一次，按完整矩阵重跑；未影响任何历史批次。

## 未验证事项与剩余风险

- 剩余 661 项已映射示例待严格验收，下一批为同分类的 Collapse 6 项（展示类按计划延后轮播、图片、浮层与 Table）。
- 本批只执行文档矩阵与准备阶段门禁（类型、内容、产物、账本），未运行全仓 `pnpm check:full`、发布包 tarball 回归与其他浏览器。
- Tabs、Slider、Rating 等内嵌组件只在本批范围内按等价项处理，仍待各自批次完整审阅。
