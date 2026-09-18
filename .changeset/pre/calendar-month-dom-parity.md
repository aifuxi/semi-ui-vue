---
'@aifuxi/semi-ui-vue': patch
---

修复 Calendar 月视图与固定 Adapter 的 DOM 差异：普通 gridcell 始终输出 `aria-current`（当天 `date`、其余 `false`），折叠单元格的 Popover 触发器 `<li>` 不再重复附加 `role="gridcell"`、`aria-label` 与 `aria-current`；同步完成 Calendar 双语文档严格验收。
