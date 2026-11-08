# SideSheet 可访问名称修复

## 问题现象

- 消费方使用 `@aifuxi/semi-ui-vue@2.1.1`，通过公开 `aria-label` 和 `title` 插槽渲染工作项详情。
- 预期 `role="dialog"` 获得传入名称；实际可见标题正常，dialog 没有 `aria-label`，辅助技术读取到未命名对话框。
- 修复前新增两条组件回归均失败，实际名称为 `null`；测试覆盖实例名称、标题插槽以及全局默认与实例覆盖。

## 根因

Vue 将已声明的 `aria-label` prop 规范化为 `ariaLabel`。`SideSheet.resolveOptional` 仍用公开连字符键读取 `props`，因此实例值丢失。内层 `SideSheetContent` 已支持把 `ariaLabel` 输出到 dialog。

固定 React v2.102.0 同样遗漏 dialog 名称，但原因是最终 DOM 未输出属性。按用户授权修正 Vue 公开契约，不复刻该缺陷，不修改 vendor。

## 修复方案

- 仅在解析 `aria-label` 的实例值时读取 Vue 规范化后的键；公开类型、模板属性名和全局默认配置保持不变。
- 保留实例显式值（包括空字符串）优先于全局值的规则，动态删除属性后移除 DOM 名称。
- 添加真实父级更新/移除属性、关闭重开和全局默认优先级的单测。
- 添加真实 tarball 浏览器消费场景，通过可访问名称定位并验证更新、退出和重开；保留默认动效。
- 更新组件契约，明确与固定 React 缺陷的差异，并添加 patch Changeset。

## 验证结果

- 定向 SideSheet 单测、SSR、hydration：3 个文件、19 项通过。
- 公开 UI 包 `typecheck`、根工具 `typecheck:root`、受影响源码和测试 ESLint：通过。
- `pnpm check:artifacts`：构建、主题、无 DOM 导入、真实 tarball 安装/exports/类型/样式/tree-shaking 验证通过。安装复用现有外部依赖，不声称隔离网络安装。
- `pnpm test:consumer tests/consumer/side-sheet-a11y.spec.ts`：Chromium 浅色/深色 2 项通过，验证真实打包产物的可访问名称、动态更新及关闭重开。
- 首次错误使用 `pnpm exec playwright` 导致夹具缺少 `npm_execpath`，未执行组件断言；改用项目既有 pnpm script 后通过。新测试宿主触发多组件单文件 lint 规则，按既有组件测试约定说明测试宿主用途后通过。断言未放宽。
- 未执行人工读屏、全仓浏览器截图矩阵或迭鹿业务页面升级复验；未发布 npm，也未改业务项目。
