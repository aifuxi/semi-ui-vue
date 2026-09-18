# AI 工作记录：继续补齐 Nuxt 文档

- 日期：2026-09-05
- 状态：本轮完成；全量 Nuxt 迁移仍进行中

## 目标

承接「将 docs 重构为 Nuxt」任务，在已提交的 `4dbff05` 上继续补齐固定 Semi Design v2.102.0 的双语组件章节、可运行示例和 Vue API。继续保留 Astro 默认入口，直到全部迁移验收通过。

## 验收标准

- 本轮 Form、Table、Upload、TreeSelect、Tree 各上游中文 live Demo 均有准确的双语内容映射与独立 Vue 示例。
- 示例只消费公开组件和样式子路径；异步、上传使用可清理的本地模拟，不调用业务后端。
- 类型、lint、格式、内容注册与静态构建检查通过；新增重点场景在固定 Chromium 验证实际交互。
- 更新覆盖账本与迁移记录。内容映射不等同于严格视觉验收，未验证项保持待验收。

## 风险与假设

- 起点为 196 页、1136 个注册 Demo、532／859 个中文上游 Demo 已映射；旧迁移说明中的 194／221／855 数字已过时。
- 中英文上游章节数量与顺序可能不同，映射按语义而非数组位置机械配对。
- 库的现有类型与运行时行为需独立核实；文档任务不擅自修改公共组件 API。

## 修改范围

对应五个组件的双语正文、SFC 示例、映射和浏览器行为检查；TreeSelect 增加结构化 API 元数据。共享注册、覆盖账本和迁移记录由主代理统一更新。

## 关键决策与权衡

- 继续按章节提供独立可编辑 SFC，不使用综合 Showcase 替代多个演示意图。纯数据与本地模拟 helper 可多文件共享，保留每例状态隔离。
- TreeSelect 远程搜索通过 `#empty` 显示加载状态，避免照搬上游示例中没有公开声明的 `loading` prop；`loadedKeys` 文档按实际公开数组类型说明，并区分 `load` 事件的 Set。
- TreeSelect 的随机动态数据改为确定性轮次；异步示例取消过期请求并清理计时器。
- Table 的当前页数据通过 `pagination=false` 与独立 Pagination 展示，避免内部二次分页；空值排序采用非受控方向和 `change` 驱动外部排序，规避当前受控点击通知仍读取旧值的限制。两项均保留公开组件不变，并在双语正文及映射中明示。
- Upload 裁切器使用父容器 100% 高度；通过公开 `cropModalProps.bodyStyle.height` 设置确定内容高度，浏览器验证实际裁切确认和取消。
- Form 的 FormSlot 运行时支持但公开类型未列入的参数不通过类型断言绕过；使用显式 ErrorMessage 并记录类型限制。
- Table 的远程示意图改为现有 `/demos/one.svg`，不会请求第三方图片；替代图不作为上游视觉等价证据。
- 文档组件、公共 API 和默认站点入口均沿用现有架构；回退可恢复本轮涉及的文档、示例、元数据和测试文件。

## 验证证据

- 起始工作区干净，HEAD 为 `4dbff05`。
- `pnpm check:vendor`：固定基线核验通过。
- Nuxt 静态构建成功；内容检查为 196 页、1451 个已注册 Demo；覆盖为 696／859，严格视觉验收为 0。
- `pnpm --filter @workspace/docs typecheck:nuxt`、`pnpm lint`、`pnpm format:check` 均退出 0。
- 固定 Chromium、`--retries=0`：门户 202 条（196 页加载及导航、搜索、SSR 阅读等）、编辑器 2 条、Form 6 条、TreeSelect 8 条、Upload 6 条、Tree 4 条均通过。最终组合运行 232 条通过、2 条 Table 定位断言失败；按实际无障碍名称修正定位后，Table 整组 6 条再次运行全部通过。两次运行覆盖 234 个独立检查。
- Table 复验包含升序／降序的 ARIA 状态与未知值置后、第二页 5 条记录、表头过滤空状态、虚拟列表跳至第 100 条；未改阈值或增加重试。
- 五组件 343 个注册依赖文件的路径大小写逐段核验通过；`git diff --check` 通过。
- 第一次全门户回归 170 条通过后，另一测试进程退出并关闭共享预览服务，剩余请求出现连接拒绝；最终采用单一测试运行管理服务，避免服务生命周期竞争。

## 未验证事项与剩余风险

尚有 163 个中文上游 Demo 未建立双语映射。全部 API 审阅和 React/Nuxt 严格视觉矩阵仍属持续迁移范围，不能以本轮映射或浏览器行为检查替代。公共组件源码、默认 Astro 入口和依赖清单未修改；未执行组件发布包验收；提交按用户后续指令执行，未推送远端。

## 复验命令

```bash
pnpm --filter @workspace/docs build:nuxt
pnpm --filter @workspace/docs check:nuxt:content
pnpm --filter @workspace/docs typecheck:nuxt
pnpm lint
pnpm format:check
pnpm --filter @workspace/docs exec playwright test -c playwright.nuxt.config.ts portal.spec.ts editor.spec.ts form-content.spec.ts table-content.spec.ts tree-content.spec.ts tree-select-content.spec.ts upload-content.spec.ts --retries=0
# 修正 Table 定位后的最终整组复验：6 passed
pnpm --filter @workspace/docs exec playwright test -c playwright.nuxt.config.ts table-content.spec.ts --retries=0
```
