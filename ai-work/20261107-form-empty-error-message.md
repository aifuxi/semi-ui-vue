# BUG-000069：Form.ErrorMessage 空字符串与图标契约修复

## 问题现象

迭鹿缺陷列表快捷编辑通过公开 `Form.ErrorMessage` 传入 `error=''`、`validateStatus='error'`、`showValidateIcon=true`，未出错时出现无文字的红色图标。记录版本为 UI 2.0.3 / Vue 3.5.44。本次使用项目锁定 Vue 3.5.42 与固定只读 React Semi v2.102.0（cdfba6e520fc83ad871b30f51f36d8af3aaa5a21）独立复现。

真实 React/Vue Form 场景新增独立错误区域，直接使用公开 API，不通过业务 CSS、字段包装或调用方值转换。完整 Chromium 新 headless、1440×900、DPR 1、zh-CN，分别运行明暗主题。

修复前两端实测：

- React：空字符串、undefined、false 均无错误区域和图标；非空字符串正常显示。显式 true 保留空错误容器，无图标。
- Vue：空字符串产生错误区域及图标；空错误与帮助文案组合、动态空错误均产生同一误报，显式 true 也错误显示图标。
- 先新增回归单测：9 项中 5 项失败、4 项通过，验证了空串、帮助文案抑制、布尔/数字与清除路径的偏差。

## 已确认根因

1. FormFieldError 联合类型含 Boolean，SFC 类型推导生成 Boolean 优先的运行时 props。Vue 把 `''` 转成 `true`，导致现有 `error === ''` 判断失效。
2. 图标条件使用原始 displayValue 的 truthiness，而 React 基线使用 generatorText 的渲染结果。布尔 true 或 truthy 数字应只保留空错误容器，不应生成无文字图标；数字也不应自动转换成错误文案。
3. 既有浏览器场景仅通过 Form.Input 验证，没有直接调用 Form.ErrorMessage 的空字符串场景，无法保护其公开 props 行为。

## 修复方案

- ErrorMessage 显式声明运行时 props，error/helpText 作为 VNode 数据原样传入，避免 Boolean 自动转换，保留公开 TypeScript 类型。
- 依照固定 React generatorText 保留字符串、有效数组与 VNode 渲染，布尔/数字不生成文本；图标条件取可渲染内容。
- 保留隐藏错误文案抑制 helpText、正常帮助文案、显式 true 空容器、showValidateIcon、状态更新及字段集成契约。
- 增加 9 项单元回归、明暗主题公开 React/Vue 示例与浏览器断言，以及真实生产 tarball 的空字符串与动态清除回归；现有 Form 快照保持不变。
- 新增独立示例后，旧测试的全页错误/帮助选择器会匹配到示例中有意展示的内容。将其限定到原 description 字段或原 Form 根，保留原断言值与行为。
- 添加 UI patch Changeset 与组件契约说明；不修改 vendor 或业务项目。

## 验证结果

- Form 单元和 SSR：3 个文件共 18 项通过，包含新增的 9 项回归。
- 修复后实际 CLI 对照：两端明暗主题的各类错误区域、图标数量和文案完全一致，独立区域截图逐像素一致。
- 首轮正式浏览器：新增 ErrorMessage 明暗主题均通过；旧 Form 两项因上述全页选择器匹配新增示例而失败，修正定位范围后复验，未修改阈值或旧图。
- 最终正式 Chromium：`pnpm exec playwright test tests/browser/components/form.spec.ts tests/browser/components/form-error-message.spec.ts`，7 项全部通过、0 重试，包含空错误明暗主题、错误更新、原内置字段集成与旧快照/RTL 回归。
- `pnpm test:consumer`：3 项全部通过、0 重试；新增的真实 tarball 明暗主题回归确认生产编译后空字符串、undefined、false 不产生错误区域或图标，true 保留空容器，错误→清除→再次错误同步正确。原有组件/Prism/Worker 消费测试也通过，来源 fixture 拒绝混入 workspace/vendor 源码。
- `pnpm check:artifacts` 退出码 0：公开包构建、83 个组件主题入口、SSR import、真实 tarball 的安装/exports/ESM/类型/样式/tree-shaking 均通过。
- 定向 ESLint、Prettier、`pnpm typecheck:root`、UI 类型检查、Changesets 意图与差异空白检查通过。

## 边界

本次修复并验证组件库与本地 tarball；尚未发布新版本或安装到迭鹿项目，未改动业务仓库的未提交迁移。业务快捷编辑现场在升级固定版本后仍需按原路径验收，不把独立组件或安装包测试等同于业务升级完成。

原图、计算结果和日志存于本地已忽略目录 `test-results/form-error-message/`，正式浏览器与 consumer 报告位于对应 test-results / playwright-report 目录，均不提交 Git。
