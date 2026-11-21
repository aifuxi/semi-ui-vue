---
'@aifuxi/semi-ui-vue': patch
---

修复 Select 下拉已收起时仍拦截 Escape，导致外层 Modal 无法响应键盘关闭的问题。下拉展开时，Escape 仍只收起下拉。
