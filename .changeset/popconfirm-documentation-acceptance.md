---
'@aifuxi/semi-ui-vue': patch
---

修复 `RadioGroup` 丢弃 slot 顶层 `v-for` 生成的 `Fragment`：模板内直接 `v-for` 的 `Radio` 现在全部渲染并保持组选中语义（此前整段列表被过滤掉）。同时完成 Popconfirm 四项示例的双语、明暗与适用 RTL 严格验收。
