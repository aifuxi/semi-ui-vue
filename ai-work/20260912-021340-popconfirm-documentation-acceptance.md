# AI 工作记录：Popconfirm 文档严格验收与 RadioGroup 片段修复

- 日期：2026-09-12 02:13
- 状态：完成
- 执行模型：deepseek-v4-flash

## 目标

验证并交付未验证的一批改动：修复 `RadioGroup` 丢弃 slot 顶层 `v-for`（`Fragment`）导致模板内 `Radio` 全部不渲染的缺陷，完成 Popconfirm 四项 live 示例的双语、明暗与适用 RTL 严格视觉和行为验收，并让站点 `:focus-visible` 焦点环不再套到 Portal 内的文档示例上。

## 验收标准

- Popconfirm 4 项 × zh-cn/en-us × light/dark × LTR/RTL 共 32 项正式矩阵一次通过：卡片逐节点文本、class、`role`、`disabled`、SVG path、计算样式一致，各轴几何差 ≤0.5 CSS px，局部像素 threshold ≤0.1、差异比例 ≤0.001。
- `RadioGroup` 模板内顶层 `v-for` 渲染全部 `Radio` 并保持组选中语义，且有模板回归用例。
- `types` 示例删除局部容器与 `getPopupContainer` 后，浮层仍与固定基线一致地以 body 级 Portal 渲染。
- 组件修复按真实依赖使失效证据重验：不修改旧指纹、不用单例结果恢复 `accepted`。

## 风险与假设

- `apps/docs/src/assets`（含 `site.css`）在所有批次的 `inputs` 中，因此一次焦点环改动即让全部 19 批证据同时失效；账本必须如实降级而不是保留旧计数。
- 正式验收把多个批次放在一次 Playwright 调用里共享服务与构建，单次运行的压缩报告体积受 V8 字符串上限约束。
- 对照组依赖冻结动画与伪时钟采样（`animation-show` 等动画态 class），机器负载会改变采样时刻。

## 修改范围

- `packages/ui/src/radio/RadioGroup.ts`、`Radio.test.ts`：`renderSlotChildren` 递归摊平 slot 内 `Fragment`，保留 Text/Comment 过滤；新增真实模板回归用例。
- `apps/docs/src/demos/popconfirm/{zh-cn,en-us}/Types.vue`、`docs/documentation/mappings/popconfirm.json`：删除局部容器与 `getPopupContainer`，浮层回到 body 级 Portal。
- `apps/docs/src/assets/site.css`：`:focus-visible` 焦点环额外排除 `.semi-portal` / `.semi-portal-inner`。
- `apps/docs/tests/nuxt/popconfirm-matrix.spec.ts`、`apps/reference-react/docs-adapters/popconfirm.mjs`、`docs/documentation/batches/popconfirm.json`、`docs/documentation/popconfirm-acceptance.md`：本批正式矩阵、参考适配与审阅材料。
- `docs/documentation/evidence/**`（19 批）、`coverage.json`、`README.md`、`batch-plan.md`、changeset：证据、账本与进度同步。

## 关键决策与权衡

### 主状态附件按仓库惯例命名

- 选择：每个示例的首个采样状态命名为 `default`，`compare` 在 `default` 时输出 `default-styles`/`reference`/`vue`，其余状态继续用 `reopened-*`、`confirm-loading`、`focus-1` 等前缀名。
- 理由：`validateReport` 要求每项用例必带这三个规范附件；banner、config-provider、grid、layout、resizable、notification、space、toast 等既有矩阵都用同一命名约定。
- 备选：给 `compare` 增加 `primary` 布尔参数；能保留 `opened`/`type-default` 等描述性状态名，但与既有 19 个矩阵不一致，故未采用。
- 代价：首批采样的状态名从描述性名称变为 `default`，状态语义仍由用例步骤名和后续状态名表达。
- 回退：恢复 `state === 'opened'` 等原状态名并让附件名重新加前缀（会再次使本批报告校验失败）。

### 证据全量重验按报告体积分组，而非伪造有效计数

- 选择：按 `--affected` 的完整失效集合重验 19 批，分 5 组运行（accessibility/banner/button/dark-mode/divider/float-button、config-provider/icon/locale、feedback/grid/space/toast、layout/navigation、notification/resizable/typography），每组复用同一份 `resources`/`site`/`checks` 准备证明，只重新运行本组浏览器矩阵。
- 理由：19 批单次运行的 JSON 报告超出 V8 字符串上限（`RangeError: Invalid string length`），报告无法落盘，`accept:nuxt:batch` 因此不能写出任何一批证据；分组的每组规模（204/80/224/116/256 项）回到历史已验证可写出的量级。
- 备选：改共享 reporter（流式写出或按批分文件）；属共享验收设施改动，会再次改变全部批次指纹并让本轮已写证据失效，未纳入本次验证范围。
- 代价：浏览器阶段分 5 次运行（合计约 19 分钟），准备与类型、内容、产物检查仍只复用一份。
- 回退：无；分组只影响进程边界，不影响逐批指纹与报告校验。

## 验证证据

- `pnpm exec rstest run packages/ui/src/radio`：11 项通过，含新增「模板内顶层 v-for 的 Fragment 子节点全部渲染并保持组语义」。
- `pnpm exec prettier --check`、`pnpm exec eslint --max-warnings=0`（全部改动文件）：通过。
- `pnpm check`：工具链、vendor、inventory、图标、插画、Locale、源码边界、别名、格式、lint、源码类型、单测与工具测试全部通过。
- `pnpm check:artifacts`：默认主题 86 个根入口、SSR import（icons 525 / icons-lab 86 / illustrations 18 / ui 151）、真实 tarball 的 exports/类型/样式/Worker 校验通过。
- `pnpm --filter @workspace/docs accept:nuxt:batch popconfirm`：32/32 通过（58.3s），写出 `docs/documentation/evidence/popconfirm.json` 与 `popconfirm.report.json.gz`。
- 5 组 `accept:nuxt:batch`：204/80/224/116/256 项共 880/880 通过，`unexpected=0`、`flaky=0`、`skipped=0`；三个阶段准备全部按内容哈希命中复用。
- `prepare-coverage.mjs`：859/859 已映射、129 个有效验收（新增 Popconfirm 4），文档状态分布 15 accepted / 8 excluded / 79 in-progress，与 HEAD 一致。
- `pnpm test:browser`：442 项全仓组件 Chromium 对照回归全部通过（2.2 分钟），覆盖 Radio 等共享组件的 React/Vue DOM、几何与像素对照。
- 失败定位：首次整轮 912 项中 1 项（Resizable Basic zh-cn dark）在冻结动画后缺少 `.semi-toast-animation-show`；单独重跑该用例 8/8 通过（`--repeat-each=4 --workers=1`），属本机并发负载下的采样漂移，不是组件回归，随后无并发负载的整轮通过。

## 未验证事项与剩余风险

- 19 批 `--affected` 单次运行仍会因 JSON 报告超过 V8 字符串上限而失败；需要在浏览器阶段分组或改共享 reporter，两者都会再次使全部批次指纹失效，属独立改动。
- Playwright CLI 位置参数按正则匹配文件路径：`button-matrix.spec.ts` 同时匹配 `float-button-matrix.spec.ts`，只选 button 而不选 float-button 时 `splitBatchReport` 会正确拒绝整轮；本次以同时显式选择规避，未修改脚本。
- 730 项已映射示例待严格验收，下一批为 Progress 12 项；其余文档章节/API/迁移审阅、站点壳与传递依赖许可审计仍待完成。
- 未一次性运行 `check:full` 组合命令（其组成阶段 `pnpm check`、`check:artifacts`、`test:browser` 与全部 19 批 Nuxt 矩阵均已分别通过）；Nuxt 矩阵按报告体积分 5 组运行，与单次运行等价。
