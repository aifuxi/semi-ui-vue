---
'@aifuxi/semi-ui-vue': patch
---

修复 Popover 未透传 clickTriggerToHide 的问题，并修正 Tooltip 在同一次操作中先关闭后重开的事件顺序，确保再次点击或键盘激活触发器时可靠关闭。
