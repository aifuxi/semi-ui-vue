---
'@aifuxi/semi-ui-vue': patch
---

修复 Table 受控分页重复切片、受控排序通知、行列无障碍属性与 RTL 固定列，并向自定义 sorter 传递排序方向；补齐 Checkbox 独立名称透传、Table 选择状态名称与 Pagination 非当前页状态。修复 SideSheet 数字宽高及多实例容器切换时的 Portal 锚点错误，补充对应文档严格对照。

补齐 Select 多选标签的默认方形样式与最大宽度，支持文档示例通过方向参数预览真实 RTL 上下文。

修复 Input 与 Checkbox 缺省无障碍属性的输出，以及 Descriptions 复用 VNode 数据时展开行关闭重开后内容丢失的问题。

修复 Dropdown 在弹层定位前提前触发可见性通知、导致回调聚焦使页面意外滚动的问题；保留受控可见状态的即时回写。
