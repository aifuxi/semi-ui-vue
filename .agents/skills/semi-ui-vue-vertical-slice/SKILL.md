---
name: semi-ui-vue-vertical-slice
description: 在本仓库实现、继续或验证 Semi Design v2.102.0 的 Vue 组件完整对齐切片。用于“开始下一个组件”“继续组件复刻”“实现 Tooltip 完整切片”等请求，覆盖组件选择、源码、主题、文档、React/Vue 对照、测试与发布验证；不用于普通业务页面中的 Semi 使用问题、vendor 升级或无关 Vue 开发。
metadata:
  short-description: 完成 Semi UI Vue 组件垂直切片
---

# Semi UI Vue 组件垂直切片

## 适用边界

在 `/Users/chen/fc-studio/semi-ui-vue` 中新增、继续、修复或验收一个 Semi 对齐组件时使用本 Skill。用户没有指定组件而是说“下一个组件”时，必须从项目既定路线和依赖关系中选择，不能按字母顺序猜测。

普通业务项目中查询或使用上游 Semi React 组件时，使用 `semi-design-guide`；升级 vendor、修改上游源码或处理无关 Vue 页面不属于本 Skill。

## 权威来源

1. 先遵守仓库根目录 `AGENTS.md` 的全部项目约束，不在本 Skill 重复维护那些硬规则。
2. 以只读 `vendor/semi-design` 的固定 tag 和 SHA 为唯一 Semi 对齐基线；现有 Vue 实现、测试和截图都不是正确性来源。
3. 从 `docs/research/`、`docs/architecture/workspace.md`、最近完成的组件与提交历史确定组件路线和依赖。
4. 固定源码缺失信息或用户明确要求检查当前上游时，才查询在线资料，并标明版本差异。

## 开始工作

1. 检查 `git status --short`、近期提交、已进入 `ready` 的组件和当前路线。保护所有无关修改。
2. 用户指定组件时遵循其范围；未指定时根据路线、公开依赖和基础设施缺口选出下一组件，并在编码前说明选择理由。
3. 运行以下只读检查，确认本地基线有效：

   ```bash
   git submodule status vendor/semi-design
   git -C vendor/semi-design describe --tags --exact-match
   ```

4. 按 `AGENTS.md` 规定的顺序读取对应 `semi-ui` Adapter/类型/DOM、Foundation/常量/SCSS、默认主题、文档测试和相关资产。
5. 编码前创建或更新 `docs/components/<component>/alignment.md`，记录 API、默认值、状态、事件顺序、Vue 映射、DOM/class、样式、键盘焦点、ARIA、Portal、动效、暗色、RTL、国际化、SSR 与 deviation。
6. 组件存在以下任一特征时，编码前必须读取 [Vue Adapter 对齐易错点](references/vue-adapter-parity-pitfalls.md)，并先把适用的行为门禁写入对齐矩阵和测试骨架：
   - 默认值为 `true` 的可选 Boolean prop；
   - 读取、克隆或装饰子 VNode；
   - Portal、Teleport 或 `getPopupContainer`；
   - 根据 resize、scroll 或 viewport 变化重新定位。

## 完整切片合同

一个组件切片应在适用范围内同时完成：

- Vue 源码、公开类型、props/emits/slots/v-model，以及根导出和子路径导出。
- 必需的 Foundation 隔离入口；公开运行时和声明不得泄漏 `vendor/**` 或私有包路径。
- 默认主题根入口、逐组件 CSS 入口及构建/校验接线。
- 中文文档、英文文档、React → Vue 迁移说明和对齐矩阵。
- 使用固定 React 源码的参考场景、Vue 场景和共享测试基础设施接线。
- 面向公开行为的单元测试，以及适用的 SSR、键盘、焦点、ARIA、Portal、动效、RTL 和国际化测试。
- 同一 Chromium 环境下的 React/Vue computed style、几何和截图证据，覆盖要求的桌面/移动端、light/dark 与适用状态。
- 真实发布 tarball 的安装、导入、类型、样式入口、tree-shaking/SSR-safe import 和合规验证。

不能等价的差异必须记录源码证据、原因、用户影响和验收结论；缺少必要产物时不得宣称完成。

## 实现与验证策略

- 沿用最近完成组件的工程接线方式，但独立对照固定源码，不复制其行为假设或视觉基线。
- 先运行组件级和受影响包的针对性检查；切片连贯后再运行仓库当前 `package.json` 定义的完整检查。不要在 Skill 中写死测试数量或产物大小。
- 不要并行运行会争用固定 Playwright webServer 端口的命令。端口、权限或浏览器启动失败应先按环境问题诊断。
- 先验证行为和 computed style，再接受截图。Playwright 阈值通过不等于图片字节一致；只有实际比较确认后才能报告字节一致。
- 浏览器验证结束后清理本次启动的服务，并复查工作区范围。

## 完成与提交边界

最终报告应说明组件选择理由、主要交付物、实际验证范围、截图结论、deviation 和工作区状态。

不要自动提交。只有用户明确要求提交时，才审计并暂存本切片的确认路径，运行 `git diff --cached --check` 和暂存范围检查，使用简体中文 Conventional Commit，并在提交后确认工作区状态。不要仅为提交而重复构建或测试。
