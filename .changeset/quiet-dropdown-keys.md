---
'@aifuxi/semi-ui-vue': patch
---

修复用 Enter 或空格展开 Dropdown 时的重复点击，避免误执行菜单首项或立即关闭菜单。Tag 触发器的 Enter 仅处理一次，文本输入触发器保留空格输入和表单提交。
