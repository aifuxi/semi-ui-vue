# Progress 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

12 项双语示例均覆盖 light/dark、LTR/RTL，共 96 项。逐节点比较公开 class、文本、ARIA、SVG、计算样式与几何（各轴 ≤0.5px），截图 threshold=0.1、maxDiffPixelRatio=0.001。动态示例覆盖增减、0/100 禁用与键盘操作，渐变示例保留自动计时与真实数值动效。

参考适配器直接编译固定 Markdown，添加 ESM 导出，补齐英文动态示例缺失的 useState 导入，并保留现有 Vue 文档的双语可访问名称及图标按钮名称（英文动态条形原例缺少名称，同步补齐）。不复制上游实现。中文 Format 恢复固定上游的 Days/Done；英文 Basic 第四项使用 Disk usage，CircleWidth 使用上游固定颜色 #f93920，保留中英文基线差异。

每个进度条均有独立局部截图；动态示例比较中间颜色断点及首尾状态。自动渐变在隔离页面中推进相同时间，验证达到 100 后循环；在线编辑使用另一真实时钟页面，保留 Monaco 的实际加载。双语 light/LTR 执行每项源码、重置、编辑加载与退出恢复。迁移表的 `:percent` 使用代码标记，避免被 MDC 解释为指令而消失。

章节/API/迁移审阅：双语均保留 12 项顺序；引入使用公开 Vue 子路径及独立 CSS。format 支持 prop 与作用域插槽，percent 为受控 prop，无 v-model/emits；计时器在客户端启动并在卸载时清理。motion、默认值及类型以公开 ProgressProps 为准。文档 ClientOnly 演示不作为 SSR/hydration 证据。

正式状态以 evidence/progress.json 的完整矩阵与输入指纹为准，诊断不计入 accepted。
