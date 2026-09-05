# AI 工作记录：TooltipPortal 覆盖率门禁

- 日期：2026-09-05 16:07
- 状态：完成

## 目标

解决最新 PR 中 TooltipPortal 未达到每文件 100% coverage 的失败，不降低门禁或视觉阈值。

## 验收标准

- 完整 `pnpm test:coverage` 通过，TooltipPortal 四项覆盖率均为 100%。
- 动画结束清理、子元素动画隔离、重复开关、内容插槽及 fallback 行为有测试。
- 相关 Linux Chromium 对照、类型检查和 lint 通过。

## 风险与假设

- jsdom 的动画事件只验证事件处理，不作为 CSS 动画、几何或像素正确性的证据。
- 不修复该次云端 Chromium 报告中的其他组件失败，不声称整个 CI 已通过。

## 修改范围

- Tooltip 公开行为测试：动画生命周期、空内容 slot fallback、箭头节点、StyleValue。
- TooltipPortal 输入/输出边界测试：定位样式、箭头偏移、透明度、事件传播和空过渡状态。
- TooltipPortal 内容 fallback：用显式具名函数和 Vue `renderSlot` 保留插槽优先及空 slot fallback 语义。

## 关键决策与权衡

### 保留真实门禁并消除模板回调的映射歧义

- 证据：仅补测试后，Tooltip 两个测试文件四项覆盖率均为 100%；加入 Popover 等消费者测试后，函数覆盖率变成 22/23。
- 合并 JSON 将同一模板 fallback 的位置记录为两种范围：已执行的起点在子节点绑定处，未执行的起点在 slot 标签处。原始模板行 208–210 的范围甚至包含起点晚于终点的记录。
- 选择：把 fallback 放到具名源码函数，在局部无 DOM 的函数组件中调用 Vue `renderSlot`；fallback 仍使用已有 TooltipNodeRenderer。
- 理由：避免自动生成回调的源码映射差异，不忽略可执行逻辑，也不调整 coverage provider 或阈值。
- 备选：覆盖率豁免或降门槛不符合验收标准；逐消费者添加无关 fallback 测试会把工具问题扩散到各组件，未采用。
- 代价：内容多经过一层无 DOM 的函数组件，须验证插槽、焦点及几何和截图不变。
- 中间方案：曾在父模板表达式中调用 `renderSlot` 并把 VNode 作为 prop 交给 renderer；相关定向测试通过，但全量 Select 等动态更新报错。该方案已撤换为独立函数组件中的渲染，保留 Vue 的组件渲染边界；最终全量测试通过。
- 回退：还原内容渲染的小调整即可；新增行为测试可保留，但合并覆盖率映射问题会重新出现。

## 验证证据

- 命令使用全局 pnpm 12，并设置 `npm_config_manage_package_manager_versions=false`。
- `pnpm test:coverage`：最终 166 个文件、1133 项测试通过；TooltipPortal 为语句 82/82、分支 96/96、函数 23/23、行 65/65，四项均为 100%。
- Linux 容器中 `pnpm exec playwright test tests/browser/components/tooltip.spec.ts tests/browser/components/popover.spec.ts tests/browser/components/pagination.spec.ts tests/browser/components/breadcrumb.spec.ts tests/browser/components/select.spec.ts --retries=0`：最终 25 项通过，25.1 秒；保留既有视觉阈值，`CI=true`、`PARITY_IGNORE_HOST_BASELINES=1`。
- Linux 容器 `pnpm test:coverage`：166 个文件、1133 项测试通过，TooltipPortal 四项均为 100%。
- 完整 `pnpm check` 退出码 0：格式、lint、全工作区类型、coverage、构建、文档产物、主题、SSR 和真实 tarball 安装/exports/类型/样式验证全部通过。

## 未验证事项与剩余风险

- 未触发新的 GitHub Actions run；未提交或推送本轮修改。
- 未复跑云端完整浏览器矩阵。
