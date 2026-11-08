---
'@aifuxi/semi-ui-vue': patch
---

修复 Modal 自定义 header 丢失 title 可访问名称的问题；嵌套或多个 Modal 的 Esc 仅作用于顶层，关闭后恢复有效入口或外层焦点，并保留顶层关闭保护及退出动效。
