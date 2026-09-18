---
'@aifuxi/semi-ui-vue': patch
---

修复 Dropdown 的组件触发器未转发 Tooltip ARIA 关联、Tag 触发器 tabIndex 丢失的问题，保留调用方显式焦点顺序，并按固定基线恢复嵌套 DropdownItem 的属性透传边界。将 Escape 回焦保留在隐藏前，移除关闭通知和动画结束后的额外聚焦，避免抢走用户已转移的焦点或改变重开后的焦点样式。
