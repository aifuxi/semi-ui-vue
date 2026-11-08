---
'@aifuxi/semi-ui-vue': patch
---

修复公开组件及静态子组件在 TSX 中遗漏事件属性的问题，保留原组件的事件、插槽和实例方法类型，并补齐 Form 字段监听器及 change 追加表单值的类型。
