---
'@aifuxi/semi-ui-vue': patch
---

修复 SideSheet 进入动画结束后残留的状态 class，分别清理遮罩与内容动画状态，退出时等待真实动画结束，避免定时器提前卸载；补充 Feedback 双语文档严格验收。
