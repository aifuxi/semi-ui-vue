---
'@aifuxi/semi-ui-vue': patch
---

修复多实例和嵌套 Modal 共用标题、正文 ID 导致可访问名称与描述错误关联的问题。每个弹窗引用自身节点，命令式弹窗使用独立 app ID 前缀，SSR/hydration 保持关联稳定；无标题或自定义 header 时不再输出悬空的标准标题引用。
