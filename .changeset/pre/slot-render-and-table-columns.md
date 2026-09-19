---
'@aifuxi/semi-ui-vue': patch
---

修复父级重渲染后插件插槽内容不刷新的问题：读取插槽的派生值改为每次渲染重新求值，覆盖 Tag、Typography、Table 等全部读取插槽的组件；同时修复 Table 同 `dataIndex` 多列的表头标题互相覆盖，并补充 Switch、Space、Grid 与固定基线一致的已知限制文档。
