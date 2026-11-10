# Vue 渲染响应性审计与修复（2026-11-11）

## 问题现象与复现

本轮全仓审计发现以下可独立复现的问题，均已纳入组件正式单测，而非仅保留临时诊断。

| 组件       | 触发操作                                                           | 修复前实际行为                  | 预期行为           |
| ---------- | ------------------------------------------------------------------ | ------------------------------- | ------------------ |
| Modal      | 初次不传 `visible`，随后传入 `true`                                | 对话框不显示                    | 同一实例显示对话框 |
| Banner     | 初次不传 `closeIcon`，随后传入 `null`                              | 关闭按钮仍显示                  | 移除关闭入口       |
| Tag        | 初次不传 `visible`，随后传入 `false`                               | 标签仍可见                      | 应用受控隐藏状态   |
| Dropdown   | 初次不传 `trigger`，随后设为 `click` 并点击按钮                    | 不发出 `update:visible`         | 切换为点击触发     |
| HotKeys    | 初次不传 `preventDefault`，随后设为 `true` 并命中快捷键            | 未阻止默认动作                  | 命中时阻止默认动作 |
| Upload     | 文件列表不变，父 render 替换 `fileItem` / `fileListTitle` 插槽闭包 | 仍显示旧插槽内容                | 两个插槽均刷新     |
| Upload     | `beforeCrop` 返回 rejected Promise，或确认裁切时画布导出抛错       | 同一个 `onCropError` 被调用两次 | 每次错误仅通知一次 |
| TreeSelect | 多选值不变，父 render 替换 `selectedItem` 插槽闭包                 | 多选标签仍显示旧内容            | 更新多选标签内容   |

## 已确认根因

- 参数存在性来自 `instance.vnode.props`，该集合本身不响应式。直接在 `computed` 中判断参数是否存在，会缓存首次挂载的结果。部分参数解析函数又先判断存在性、后读取 `props[key]`，导致初次缺省时连后续值变化也未订阅。
- Modal 等组件还必须区分 Vue 规范化后同为 `false` 的“缺省 Boolean”与“显式 false”。单纯把 `props[key]` 的读取提前，无法覆盖这类值未变而存在性变化的更新。
- Upload 与 TreeSelect 用普通 `computed` 缓存执行命名插槽得到的 VNode。当父 render 只替换捕获局部值的插槽函数、文件列表不变时，缓存不会失效。
- Upload 的两个裁切异常分支同时调用 `props.onCropError` 和 `emit('cropError')`。Vue 的 emit 本身会调用对应的 `onCropError`，造成重复通知。

## 修复方案与影响

- Modal、Banner、Tag：参考现有 SideSheet 的原始参数版本机制，在 `onBeforeUpdate` 中递增版本，全部 `hasRawProp` 判断订阅该版本；保持原有参数默认值、受控规则与 Foundation 边界。
- Dropdown：其原有版本机制只覆盖 `resolveOptional`。现让共享的 `hasRawProp` 也订阅该版本，使 trigger 及其他参数解析路径都能刷新。
- HotKeys：其 Boolean 参数显式设置 `default: undefined`，不存在缺省值与显式 false 被折叠的问题。参数解析先无条件读取实例值，再按原优先级选择实例或全局默认值即可。
- Upload：两个会执行插槽的计算使用现有 `useRenderComputed`；裁切异常统一经 emits 通知，保留公开 `onCropError` 类型兼容。
- TreeSelect：多选标签计算也会沿 helper 调用 `selectedItem` 插槽，现使用相同的 `useRenderComputed`，与原有单选展示保持一致。
- 不修改固定 Semi `v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21` vendor，不改主题、快照、阈值或测试重试策略。其他组件中同类原始参数模式仅列入审计候选，未批量改写。

## 验证结果

- 正式回归先红：仅添加七项回归后，六个组件单测文件共 87 项中原有 80 项通过，新增七项准确失败；覆盖上述七类实际行为。
- 修复后，同一组六文件 87 项通过。另补画布导出异常分支回归，确认两个裁切异常路径均只通知一次。
- 受影响 DOM、SSR、hydration 与邻接回归：`pnpm test:unit packages/ui/src/modal packages/ui/src/banner packages/ui/src/tag packages/ui/src/dropdown packages/ui/src/hot-keys packages/ui/src/upload`，22 个文件、147 项通过。路径过滤同时覆盖 TagInput 的邻接测试。Modal 测试另覆盖 `closable` 从缺省到显式 false 的 Boolean 同值边界；Tag 覆盖隐藏后重新显示。
- TreeSelect 补充回归先红：仅添加多选标签闭包替换测试后，13 项中原有 12 项通过、新增 1 项失败；修复后整个 TreeSelect 目录 DOM/SSR 共 15 项通过。
- UI 源码类型检查：`pnpm --filter @aifuxi/semi-ui-vue typecheck` 通过（退出码 0）；未重建公开包。
- 本轮七组件实现与正式测试的定向 ESLint 通过，`--max-warnings=0`；对应源码、契约、Changeset 与本报告的 Prettier 检查及 `git diff --check` 通过。
- IDE 定向 build 返回成功，但提示无法收集完整构建诊断；该返回不替代项目类型检查或包构建。
- 日志位于本地已忽略的 `.local/audit-components/`，不提交日志或临时配置。

## 插槽检查器与 Tabs

原检查器先检查缓存回调、后收集辅助函数，检查时辅助函数集合始终为空；递归收集标识符又向
`ts.forEachChild` 返回 Set，导致遍历提前结束。修复后先收集函数，再沿实际调用及直接缓存回调
传播插槽读取，覆盖同文件传递调用。仅作为函数值、对象属性或返回值保存的延后闭包不触发违规，
避免把 Cascader、TreeSelect 传递 renderer 的正常用法误报为执行插槽。

Tabs 原有手动 renderVersion 已能刷新插槽，本次等价复用 `useRenderComputed`，移除重复失效逻辑；
没有把该迁移计为原 Tabs 用户缺陷。门禁新增 18 个 fixture，覆盖声明顺序、直接 callback、
条件/map/传递调用、递归、函数引用、延后闭包和 Vue 行号；全部通过。Tabs 单元/client/SSR 共 19 项通过，
全仓 `check:slots` 通过。

该门禁使用同文件简单函数名匹配，不进行别名、动态成员和未知 callback 求值时机的完整语义分析。

## 浏览器验证

统一执行者按项目生产构建入口、完整 Chromium、3 workers、0 retries 运行：

- Banner、Dropdown、HotKeys、Modal、Tag、Tabs、Upload：7 个规格、35 项全部通过。
- TreeSelect：1 个规格、5 项全部通过。
- 覆盖对应组件已有真实交互、Portal、DOM、ARIA、浅深主题、RTL、几何与截图断言；未修改快照、阈值或重试。
- 日志位于 `.local/project-audit-reactivity-browser.log` 和 `.local/project-audit-tree-select-browser.log`；两次退出码均为 0。

上述浏览器规格验证受影响组件的现有真实场景，新增的缺省参数、插槽闭包及错误单次通知路径由正式单测逐项复现。
本轮公开包构建、真实消费与全仓检查在总审计记录中按最终输入另行记载。
