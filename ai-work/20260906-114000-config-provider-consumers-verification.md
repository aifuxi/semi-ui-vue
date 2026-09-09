# ConfigProvider 第二份补丁验证

- 用户授权：回复“确认”，应用 `20260906-111500-config-provider-consumers.patch` 并继续验收。
- 状态：已批准修复完成；ConfigProvider 文档批次仍未通过，不提交或发布。
- 基线：只读 Semi Design v2.102.0，`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 交付

修复 DatePicker 装饰图标、TextArea 默认 class、Checkbox enable class、Switch 缺省 ARIA、Steps 点击契约、TimePicker 实际触发节点、Navigation 默认图标/ARIA。补齐 DatePicker 四种日期类型和 Steps 动态监听器；Navigation 的 aria-expanded 由下层 Dropdown 克隆覆盖，因此 Dropdown 内部也保留缺省与显式 false/true 的区别，未新增公开 API。

英文 Direction 保留上游 en_GB，参考入口只解析固定源码的 Locale 子路径。文档站隔离原生 color-scheme，避免 dark 页面改变参考原生控件颜色。验收等待实际示例和 Inter 字体；选项和命令按钮使用对应语言的实际文案。所有截图先居中，Badge 按本体与越界角标的完整边界裁剪，包含 1px 抗锯齿边缘。

## 已执行验证

- 全仓单元：171 文件、1164/1164 通过，无未处理 rejection。
- 受影响组件与工作台 Chromium：44/44 通过；Dropdown 后续修复追加 Navigation/Dropdown 10/10 通过。没有更新快照，未再次跑全仓 Chromium。
- UI/reference typecheck、修改范围 lint、文档静态构建通过。
- 最终运行时产物的真实 tarball 安装、exports、ESM、类型、样式、SSR import 通过；SSR dist 通过。
- 原始回归日志：`20260906-114000-config-provider-regressions.json.gz`。

## 严格矩阵结论

最终 16 项用例均未通过，失败原因已稳定区分：

| 示例      | 范围                              | 尚未解决的问题                                                                                                                                  |
| --------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| TimeZone  | 双语 × light/dark，4 项           | 切换 GMT+00:00 后，React 日期输入为 2020-02-13 13:08:25，Vue 仍为 21:08:25；DatePicker 非受控值未响应时区变更。后续 TimePicker 输入断言未到达。 |
| Consumer  | 双语 × light/dark，4 项           | 完整 Tooltip 结构缺少箭头；此前定格对照同时记录了 24px 内容宽度与定位差异。                                                                     |
| Direction | 双语 × light/dark × LTR/RTL，8 项 | 默认样式、几何、逐控件截图、输入/开关及 Notification 检查通过；Modal 显示结束后仍保留 animate-show class 和 transform，而 React 已清除。        |

证据：`20260906-114000-config-provider-strict.report.json.gz`，包含样式、位置、逐控件截图及嵌入的失败截图。Toast、Modal 关闭及后续在线编辑器路径因前置失败未全部执行，不描述为通过。所有门禁保持 computed style 精确相等、rect ≤0.5 CSS px、截图 threshold ≤0.1 / ratio ≤0.001；无 mask。

开发预览跨端口字体失败和 Badge 视口边缘裁剪问题已定位，最终使用静态预览和完整裁剪重新验证。这些中间失败不作为组件偏差或 accepted 证据。

## 后续边界

时区更新、Typography 正式 Tooltip/Popover 集成和 Modal 动画阶段清理属于新发现的运行时修复，尚未修改。本次批准范围的补丁已应用，不把未解决问题计入 accepted。Button/Icon 将按最终共享源码刷新证据；最终账本和审计结果另记于本文件末尾。

## 最终审计

- 最终共享源码下，Button 84/84、Icon 48/48 通过；两批均无重试/跳过，指纹重新计算一致。有效严格验收 25/859，映射 707/859；ConfigProvider 仍为 in-progress。
- 文档静态产物检查通过：196 页、搜索/历史入口、本地 REPL、许可和散列；证据校验器 10/10 通过。工具 TypeScript 检查与最终矩阵 lint 通过。
- `git diff --check` 通过，vendor 无修改。未暂存、提交或发布。
- 测试与诊断服务已清理，恢复 4321 Nuxt 开发服务。
