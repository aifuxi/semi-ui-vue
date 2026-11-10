# runAfterTicks 异常传播修复

## 问题与根因

`runAfterTicks(callback, 1)` 的 callback 抛错或返回 rejected Promise 时，原实现仅通过
`.then(resolve)` 转发成功结果，没有转发递归调用的拒绝。外层 Promise 永久 pending，
同时产生 unhandled rejection；tick 为 0 时却能正常拒绝，公开工具的异常行为不一致。

独立 Node 进程提取修改前的函数体复现：callback 抛出原始错误后，30ms 观察结果为
`outcome=pending`、`unhandled=probe rejection`。该观察时间仅用于隔离复现，不进入测试断言。

## 修复与影响

定时器只负责等待一次 macrotask，再直接返回递归 async 调用，使回调异常沿原 Promise 链传播。
保留非正数立即执行、正数逐次调度以及回调只调用一次的正常行为。固定 React 基线也存在此缺陷，
异常路径的主动修正已记入 `_utils` 对齐契约，没有改动 vendor。

## 验证

- `pnpm test:unit packages/ui/src/_utils/run-after-ticks.test.ts packages/ui/src/_utils/Utils.test.ts packages/ui/src/_utils/Utils.ssr.test.ts`：3 个文件、16 项通过。
- 新增 6 项覆盖 0、1、2 次 tick 后同步抛错和异步拒绝，检查原始错误身份与单次调用。
- UI 包 `typecheck`、受影响源码与回归的 ESLint、受影响文件的 Prettier 检查通过。
- IDE 局部 build 返回成功，但提示构建诊断有限；以实际 Vitest 与项目类型检查为准。
- 此工具不生成 UI，未因本次异常传播修复增加视觉验收。
