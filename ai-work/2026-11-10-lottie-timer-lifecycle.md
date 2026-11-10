# Lottie 就绪轮询退出异常修复

## 问题现象

迭鹿项目使用 `@aifuxi/semi-ui-vue@2.1.4` 的 Vitest/jsdom 检查中，401 项断言通过后，
内置 `lottie-web@5.13.0` 的 `checkReady` 抛出 `ReferenceError: document is not defined`，
使检查退出码为 1。预期导入组件库、卸载组件并退出测试环境后，不再执行越界回调。

## 根因与复现

固定播放器的公开 main 入口在模块求值时调用全局 `setInterval(checkReady, 100)`；
根入口的 Foundation 导入链会触发该模块，不依赖是否挂载 Lottie。
jsdom 的 `window.close()` 清理窗口计时器，但无法清理 Node 全局计时器。文档尚未完成、
或首次 100 ms 轮询尚未执行就退出时，计时器仍引用随后删除的全局 `document`。

`scripts/lottie-lifecycle.spec.mjs` 在独立 VM 中求值真实依赖，关闭 jsdom、删除浏览器全局、
推进虚拟时间 100 ms。修复前复现 ReferenceError；正常 complete 后扫描的对照测试通过。
这使原对话中的时序性故障成为无需真实延时的确定性回归。

## 修复方案

- 使用 pnpm 官方 patchedDependencies 固定 `lottie-web@5.13.0` main 入口补丁，创建和清理
  轮询均使用 `window` 的计时器 API，保留 100 ms 周期和 complete 后扫描语义。
- 不修改只读 Semi vendor，不更换播放器，不屏蔽未捕获异常，不要求消费者清理全局计时器。
- 根、参考 React、私有 Foundation 和公开 UI 共用锁文件中的同一补丁版本；UI 构建内联
  修复，消费安装不依赖消费者继承 workspace 补丁配置。
- 增加 loading/complete 首次轮询前销毁、完成后只扫描一次的真实依赖测试；真实 tarball
  门禁新增根入口与 Lottie 子路径独立进程的导入／退出检查，避免 SSR 缓存掩盖缺陷。

## 验证结果

- 最小复现：修复前 1 项失败、1 项通过；错误为销毁后的 ReferenceError。
- 修复后：真实依赖生命周期 3 项及组件单测、SSR、hydration 共 14 项通过。
- 使用同一独立进程夹具读取迭鹿实际安装的 2.1.4 根入口，确定性复现原堆栈
  `_runtime/543649de535a.js:3820`，没有修改迭鹿依赖、业务文件或测试配置。
- `pnpm check:publish-source`、受影响文件 Prettier/ESLint、`pnpm check:boundaries`、
  frozen-lockfile 检查通过。IDE build 无错误，但其诊断能力有限，不将它单独作为构建证据。
- `pnpm test:unit`：249 个文件、1534 项全部通过。
- 首次 `pnpm check:artifacts` 被新增的 tarball 夹具正确拦截：本地 Rspack 持久缓存仍引用
  补丁前依赖。确认各 workspace 依赖软链接均已指向补丁版本后，只清理 UI 的
  `node_modules/.cache/rspack` 并重建 UI；产物运行时路径随真实补丁依赖改变，已包含
  `window.setInterval` / `window.clearInterval`。随后 `pnpm verify:artifacts` 全部通过，
  包含主题、公开入口 SSR、真实 tarball 根／Lottie 子路径退出、类型与 tree-shaking。
- Chromium：Lottie 与 Checkbox 对照 10 项通过，未更新既有截图。
- `pnpm test:consumer`：57 项真实 tarball 浏览器用例通过。
- `pnpm test:changesets`：16 项通过；`pnpm audit:prod` 无已知漏洞；
  `pnpm release:verify` 通过六包身份、许可及发布边界检查。
- 以上为本次源码和本地真实产物证据；远端 CI、版本 PR、npm 发布及传播后验另行跟踪。

## 发布边界

用户已授权验证通过后推送并发布新版本，持续监控发布时间。遵循 Changesets 和既有
GitHub Actions 流程，不手改版本、不手工 npm publish；迭鹿业务改动不属于本仓库修复范围。
