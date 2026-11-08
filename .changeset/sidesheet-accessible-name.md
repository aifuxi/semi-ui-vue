---
'@aifuxi/semi-ui-vue': patch
---

修复 SideSheet 的公开 aria-label 在 Vue 属性名规范化后读取失败的问题，确保自定义标题插槽、动态名称和重开时 dialog 保留正确的可访问名称。
