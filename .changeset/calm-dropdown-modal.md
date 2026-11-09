---
'@aifuxi/semi-ui-vue': patch
---

修复 Dropdown 菜单项通过 Enter 打开 Modal 后立即触发取消的问题。Enter/Space 手动激活菜单项前取消浏览器默认动作，防止焦点移入弹窗后重复点击；保留原生键盘事件冒泡、调用方监听和菜单内输入控件的默认动作。
