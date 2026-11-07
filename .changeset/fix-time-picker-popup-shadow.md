---
'@aifuxi/semi-ui-vue': patch
---

对齐 React Semi v2.102.0 的 TimePicker 专用弹层前缀，移除明暗主题下额外套用的 Popover 阴影、背景和圆角，保留原版时间范围列表的固定阴影。

选中时间居中时仅纵向滚动当前时间列，避免范围面板被连带横向滚动而产生 1px 内容偏移。
