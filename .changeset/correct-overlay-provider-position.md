---
'@aifuxi/semi-ui-vue': patch
---

修复 SideSheet 与 Image.Preview 继承 ConfigProvider 自定义容器时误用局部 absolute 定位的问题，保留原挂载宿主和组件显式容器语义；Feedback popup 在长页面中同步恢复视口内显示与操作。
