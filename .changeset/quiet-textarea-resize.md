---
'@aifuxi/semi-ui-vue': patch
---

修复启用 autosize 的 TextArea 在详情切换时卸载后仍读取输入节点，导致浏览器抛出 TypeError 的问题。
