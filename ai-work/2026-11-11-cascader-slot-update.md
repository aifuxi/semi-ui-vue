# Cascader 多选展示插槽刷新修复（2026-11-11）

## 问题现象

固定两项多选值和 `maxTagCount=1`，使用 `restTagsPopoverProps` 保持折叠项浮层打开。在父 render 中捕获当前文本，将该局部值交给 `display` 插槽；随后仅更新文本，不替换 `treeData` 或选择值。

预期：可见标签与折叠浮层中的标签都显示新文本。实际：更新前为 `旧内容-0` / `旧内容-1`，父更新后仍保留这两个旧文本。正式回归同时断言两条路径，两个更新断言在修复前均失败。

Cascader 对应的公开插槽名为 `display`；TreeSelect 的 `selectedItem` 不是此处的 API。

## 根因

`visibleTagNodes` 与 `hiddenTagNodes` 使用普通 `computed` 缓存 `renderTag` 返回的 Tag VNode。`renderTag` 当时只创建子 Tag 的默认插槽函数，`entityTagContent` 及 `slots.display` 延后到子组件渲染时才执行。

因此，词法上“computed 没有立即执行 display 插槽”并不代表缓存安全。父组件替换插槽闭包但选择数据不变时，两份 computed 继续返回相同 VNode；Vue 复用原节点，相关子树不重新渲染，延后的插槽也没有重新求值。该因果路径已由真实 Cascader、Tag 与 Popover 的 DOM 回归复现。

## 修复方案

- 将两份 VNode 列表计算改为项目已有的 `useRenderComputed`，在父组件更新时重新生成标签 VNode。
- 保留原有可见与折叠分界、完整选择索引、Tag 的默认插槽结构、关闭回调及 Foundation 选择规则。
- 不修改固定 Semi vendor、共享 Tag/Popover 实现、样式、快照或测试阈值，不增加延时或重试。
- 本次只修复已实际复现的 Cascader 缓存问题，其他源码模式仍按未复现候选交审核。

## 验证结果

- 先红：仅添加正式回归后，`Cascader.test.ts` 原有 18 项通过，新增 1 项失败；可见与折叠标签的两个更新断言均准确失败。
- 后绿：`pnpm test:unit packages/ui/src/cascader` 通过，3 个文件、22 项，包含 DOM、SSR 与 hydration。
- `pnpm --filter @aifuxi/semi-ui-vue typecheck` 通过，退出码 0；未构建公开包或改共享 dist。
- Cascader 实现与正式测试的定向 ESLint 通过，`--max-warnings=0`；本次五个文件的 Prettier 检查与 `git diff --check` 通过。
- 主执行者运行 `playwright test tests/browser/components/cascader.spec.ts`：生产构建后完整 Chromium 的 5 项全部通过，退出码 0，涵盖交互、浅深主题、RTL、几何和像素断言；使用项目 workers=3、retries=0 配置，单规格实际由 1 worker 执行。
- 浏览器现有真实场景与新增 jsdom 插槽闭包回归分别记录，不将布局通过当作新增动态路径已在浏览器逐步重现。浏览器日志为 `.local/project-audit-cascader-browser.log`。
- 诊断与先红后绿日志在本地已忽略的 `.local/audit-components/cascader-*`，不提交临时日志或测试配置。
