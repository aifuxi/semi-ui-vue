---
'@aifuxi/semi-ui-vue': patch
---

修复 OverflowList 隐藏项计数不更新：折叠模式的 `+N` 与滚动模式两端的边缘计数此前停留在首次渲染值（折叠模式的 overflow 渲染器在 computed 中调用，VNode 创建在渲染之外；滚动模式的槽位被 Vue 的 stable 槽更新跳过）。现改为在渲染期调用 overflow 渲染器，并在隐藏项变化时以隐藏项键重建折叠包装节点与滚动边缘片段；同步完成 OverflowList 双语文档严格验收。
