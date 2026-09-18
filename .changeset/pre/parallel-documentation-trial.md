---
'@aifuxi/semi-ui-vue': patch
---

修复 TagGroup 折叠计数的内容布局和 ARIA、浮层关闭后再次打开内容为空，以及 Popover 箭头额外的 aria-hidden 属性，使其与固定 Semi 基线一致；修复 Tooltip 在 rePosKey 与触发器位置同时更新时读取旧 DOM、导致滑块提示偏移的问题；并行推进 ScrollList、Tag、Timeline 双语文档严格验收，补齐批次矩阵、参考适配与章节/API/迁移审阅。
