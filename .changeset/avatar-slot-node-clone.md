---
'@aifuxi/semi-ui-vue': patch
---

修复 Avatar 共享 slot 配置时的节点复用：`topSlot.text`/`bottomSlot.text`/`hoverMask` 传入的 VNode 在渲染前克隆，使同一份配置对象在每个头像实例上都继续渲染，不再静默丢失内容；同步记录 Avatar 双语文档严格验收。
