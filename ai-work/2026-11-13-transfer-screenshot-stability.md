# Transfer 历史截图采样不稳定

## 现象与定位

准备六包 2.2.0 发布时，完整 release:check 的 1,578 项单测、隔离产物消费及其前置检查通过；501 项组件 Chromium 中 500 项通过，Transfer desktop/dark 的历史 React 截图失败。当前 React/Vue 几何、样式与当轮像素比较均通过。

失败图只有 3 个像素超出原 Buffer 比较阈值，位于 Support 文字的笔画边缘。当前候选未改 Transfer、React 参考应用或主题源码，保留失败的 PNG、trace 和日志。以原测试、相同构建、3 workers、0 retries 进行三轮诊断，共 15 项中 14 项通过、同一旧图比较再失败一次，不能将其记为通过。

确认的测试路径问题是：最终历史基线比较使用一次性 screenshot Buffer 的同步 toMatchSnapshot，之前的字体和动画就绪不保证这一次采样具备连续稳定画面。字形边缘的底层 Chromium 光栅机制没有进一步归因，不将候选源码认定为产品视觉回归。

## 修复

仅将 Transfer light/dark 的两组历史图比较改用 Locator 的 toHaveScreenshot，让 Playwright 等待连续稳定画面后与原文件比较。保留独立 React/Vue Buffer 像素比较、逐目标几何和样式断言。

没有更新基线或增加重试。显式 maxDiffPixels=0、maxDiffPixelRatio=0，继续要求零个差异像素，避免继承全局较宽的比例配置；threshold=0.1 还比旧 Buffer 比较的默认 0.2 更严格。未改公开包实现、构建或主题，本项使用空 Changeset。

## 验证与边界

- 修正后同条件三轮诊断 15/15 通过，包含来源、交互、明暗历史截图与 RTL；测试配置仍为 0 retries。
- 受影响规格 ESLint、Prettier、git diff --check 通过。
- 单独补齐原发布检查被中断的全部真实 tarball 消费：75/75 通过。
- release:verify 通过，六包源码仍为 2.1.5；2.2.0 由机器人版本 PR 计算，不手改版本或标签。

其他 500 项组件、1,578 项单测、依赖审计与隔离产物检查的输入未改变，继续复用；不把原整条 release:check 进程写成退出成功。机器人生成版本候选后继续核对版本差异和准确发布产物。日志和旧图保存在忽略目录 test-results/release-20261113/，原发布检查与诊断结果分别留存。
