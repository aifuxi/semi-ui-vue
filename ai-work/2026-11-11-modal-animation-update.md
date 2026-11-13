# Modal 动画结束状态回归修复（2026-11-11）

## 问题现象与复现

最终全量检查发现 `ConfigProvider/PendingConsumers.test.ts` 的既有测试 `clears each Modal enter class on its own animation end and restarts on reopen` 失败：向遮罩派发 `animationend` 并等待一次 Vue 更新后，`.semi-modal-mask-animate-show` 仍存在。

定向执行该正式测试文件，原有六项通过，动画测试仍准确失败于同一行。无需重试、额外延时或浏览器时序即可复现，确认是实现回归，不是测试抖动。

预期：遮罩和内容分别在自己的动画结束事件后清除入场类，真实显隐切换或 motion 变化才开始新的动效周期。

## 已确认根因

本轮动态参数修复引入 `rawPropsRevision`，使参数存在性随组件更新重新解析，但遗漏了它与动效 watcher 的交互。

既有 watcher 通过单个 getter 返回 `[runtimeVisible.value, runtimeProps.value.motion]`。局部动画状态变化触发组件更新，参数版本递增使 `runtimeProps` 重新计算；即使 visible 与 motion 两个 Boolean 均未改变，getter 仍返回一个新数组。Vue 根据返回数组的身份判定 watcher 发生变化，再次把 `contentAnimating` 与 `maskAnimating` 设为 true。

具体链路为：`animationend` → `maskAnimating=false` → 组件更新 → 参数版本变化 → `runtimeProps` 重算 → 新数组触发 watcher → 两个动画标记重新变为 true。

## 修复方案

- 将该 watcher 改为 Vue 多源形式，分别通过两个 getter 返回 visible 与 motion。Vue 比较各个 Boolean，只有实际状态改变才重置动画周期。
- 保留原始参数版本机制，不按 VNode props 对象身份过滤更新，也不假设父组件总是创建新的 props 对象。
- 保留既有动画结束、关闭重开、首次省略 visible、缺省 closable 到显式 false 的全部断言；不改固定基线、CSS、动画时长或快照。
- 增加 Modal 正式回归：分别结束遮罩与内容动画后更新 title/closable，确认同一内容节点保持挂载、动画类不恢复、动态关闭入口配置仍生效。

## 验证结果

- 修复前：`pnpm test:unit packages/ui/src/config-provider/PendingConsumers.test.ts`，六项通过、一项按原断言失败。
- 修复后：`pnpm test:unit packages/ui/src/config-provider/PendingConsumers.test.ts packages/ui/src/modal`，7 个文件、41 项通过，包含原失败场景、Modal DOM、可访问性、层级、SSR 与 hydration，以及本轮新增的参数与动画交互回归。
- `pnpm --filter @aifuxi/semi-ui-vue typecheck` 通过，退出码 0。
- Modal 实现与新增正式回归的定向 ESLint 通过，`--max-warnings=0`；本次五文件的 Prettier 与差异空白检查通过。
- 主执行者运行生产态 `tests/browser/components/modal.spec.ts`：完整 Chromium 5 项全部通过，退出码 0；覆盖交互、浅深主题、RTL、几何和像素断言，未改快照或容差。
- 定向单测日志保存在已忽略的 `.local/audit-components/modal-animation-*`，浏览器日志为 `.local/project-audit-modal-animation-browser.log`，不提交原始日志。

最终全仓检查由统一执行者在修复后重新运行，结果记入总审计记录；上述定向结果不替代它。
