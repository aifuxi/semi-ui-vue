# AudioPlayer v2.102.0 对齐矩阵

## 基线与路线

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，commit
  `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 当前 README 为 73/85，固定 `content/order.js` 在 Locale 之后的可独立验收项为
  AudioPlayer。JsonViewer 仍依赖独立 Worker 核心，Chat/MarkdownRender 仍处于较重
  Markdown/AI 链路；AudioPlayer 只复用已经 ready 的 Button、Tooltip、Popover、
  Dropdown、Image、Locale 与 Icons，因此作为下一切片。
- 源码证据：
  - Adapter/API/DOM：`packages/semi-ui/audioPlayer/{index,audioSlider,utils}.tsx`。
  - Foundation/常量/样式：`packages/semi-foundation/audioPlayer/`。
  - 默认主题：`packages/semi-theme-default/scss/{index,global}.scss`。
  - 中英文文档：`content/plus/audioPlayer/`；固定基线没有独立单元或 Cypress 用例。

## Vue 组件边界

| 文件                                  | 单一职责                                                      | 公开边界                             |
| ------------------------------------- | ------------------------------------------------------------- | ------------------------------------ |
| `AudioPlayer.vue`                     | 归一化音频源，连接固定 Foundation，管理媒体状态、曲目和工具栏 | props、原生 attrs、暴露的 audio 元素 |
| `AudioSlider.vue`                     | 水平/垂直进度条、鼠标几何、悬停反馈和 Tooltip                 | 私有组件；`value/max/onChange`       |
| `audio-player/index.ts`               | 导出组件、公开类型和纯函数 `formatAudioTime`                  | 根入口与 `audio-player` 子路径       |
| `foundation-integration/audio-player` | 隔离固定 Foundation 与常量                                    | 私有运行时边界，不进入公开声明       |

播放器负责一个媒体状态机和一组控制器；滑块具有独立的拖动、几何与浮层职责，因此拆成
子组件。媒体 DOM、Foundation 实例及事件处理器保持原始身份，不进入 Vue 深层代理。

## 公开 API 与默认值

| React v2.102.0        | 默认值      | Vue 映射                                                       | 结论                                                  |
| --------------------- | ----------- | -------------------------------------------------------------- | ----------------------------------------------------- |
| `audioUrl`            | 必填        | 同名 prop；`string \| AudioInfo \| Array<string \| AudioInfo>` | 数组按当前索引循环播放                                |
| `autoPlay`            | `false`     | 同名 Boolean prop                                              | 只在 metadata 初始化时同步 playing 状态               |
| `showToolbar`         | `true`      | 同名 Boolean prop                                              | 必须区分缺省、显式 `false`、显式 `true`               |
| `skipDuration`        | `10`        | 同名 number prop                                               | 前进/后退夹在 `[0, duration]`                         |
| `theme`               | `'dark'`    | `'dark' \| 'light'`                                            | 保留 `.semi-audio-player-{theme}`                     |
| `className` / `style` | `undefined` | `className`、Vue `class/style` 与原生 attrs                    | 仅根容器接收 attrs；内部 audio 不重复外部 class/style |

ConfigProvider `overrideDefaultProps.AudioPlayer` 的优先级是“显式 prop > 全局覆盖 > 上游
默认值”。`showToolbar` 对缺省、显式 false/true 使用原始 VNode prop 键判断，不能用普通
truthiness 覆盖显式 false。

## 状态、事件顺序与媒体行为

1. 初始状态为暂停、索引 0、时间 0、速率 1.0x、音量 100、无错误。
2. mounted 后注册 `loadedmetadata`、`error`、`ended`；unmount 使用相同函数引用移除。
3. metadata 依次同步 duration、`autoPlay`、媒体音量和速率；`timeupdate` 同步当前时间。
4. 播放按钮在暂停时调用 `play()` 后切到播放，播放时先 `pause()` 后切到暂停；错误时
   播放按钮禁用。
5. 数组曲目 previous/next 循环索引，清除错误，重置时间与速率后播放；单曲 ended 只
   回到暂停。数组 ended 自动进入下一首。
6. 时间滑块写 `currentTime`；前后跳转只写原生媒体时间并夹紧边界；速度菜单同步
   `playbackRate`；音量滑块向下取整并同步 `[0,1]` 原生音量。
7. 静音在当前值 0/非 0 间切换为 50/0。刷新在正常态回到 0；错误态调用 `load()`，
   等待新的 metadata/error 事件决定后续状态。
8. `audioUrl` 从调用方变化时重新归一化索引、时间、速率与错误状态，不保留越界索引。

## DOM、class、样式与主题

- 根：`div.semi-audio-player.semi-audio-player-{theme}`，内部顺序固定为隐藏 audio、
  control、info、可选 toolbar。
- audio 保留 `<track kind="captions" :src>`；原生 `audio` 不参与视觉布局。
- 数组源显示 previous/play/next，单源只显示 play；封面使用 50×50 Image；标题与错误
  同行，错误时不渲染时间滑块。
- 主时间滑块固定 323px 容器；音量浮层为 43×164，内部垂直滑块高 120；进度、圆点、
  hover 扩宽和速度菜单 class 全部保留 `.semi-audio-player-*`。
- 逐组件主题入口按 `index.scss -> global.scss -> audioPlayer.scss` 编译。默认主题根入口
  已包含同一上游 SCSS，不新增或更名 Token。

## 键盘、焦点、ARIA、Portal、RTL、国际化与 SSR

- 固定 Adapter 没有播放器专属键盘或 ARIA。交互语义由 Button、Dropdown、Tooltip 与
  Popover 提供；不为根或滑块擅自新增 role/tabindex。
- Tooltip/Popover/Dropdown 沿用已验证的 Portal、Escape、焦点与自定义容器合同。
  浏览器夹具会在父级挂载前创建稳定 popup 容器，首次浮层必须直接进入该容器；关闭与
  卸载后共享浮层监听由这些依赖组件清理。
- 播放器本身没有方向分支；RTL 由 ConfigProvider 传给复用浮层。场景覆盖 RTL，确认
  根控制顺序和几何与固定 React 一致。
- `prev/next/volume/backward/forward/mediaError` 来自 `AudioPlayer` Locale。固定 React
  `renderError` 写死中文而未读取已有 `mediaError` 字段；Vue 使用 Locale 字段修复
  en-US 可访问文案，记录为 accepted deviation，根视觉场景不触发错误态。
- SSR 输出完整静态控制 DOM 与 audio/track，但不得调用 play/pause/load、读取 duration
  或注册 DOM 事件；hydration 后注册一次，unmount 完整清理。根与子路径 import 必须
  SSR-safe。

## Deviation

- Accepted：错误文案使用固定 Locale 的 `AudioPlayer.mediaError`，而 v2.102.0 React
  Adapter 写死“音频加载失败”。原因是同版本 Locale 已公开 en-US 等翻译，Vue 原生
  Locale 映射需要真正响应 provider；影响仅限错误态文案，zh-CN 与视觉基线相同。
- Accepted：原生 `class/style` 只合并到根容器，不像 React 源码那样把同一
  `className/style` 重复放到隐藏 audio。重复样式会让 Vue fallthrough 语义异常，且隐藏
  audio 不影响视觉或媒体行为；`.semi-audio-player` class 仍保留在 audio 上。
- 无其它已知行为、样式或发布差异。

## 验收门禁

- 单元：缺省/显式 false/true 工具栏、ConfigProvider 优先级、四类 audioUrl、metadata、
  play/pause、timeupdate、seek、rate、volume/mute、refresh/error、ended/循环、源更新、
  事件引用清理、Locale、attrs 与公开类型。
- SSR/hydration：静态 DOM、无媒体副作用、hydration 后事件注册、卸载清理、根与子路径
  SSR-safe import。
- Chromium：desktop/mobile light/dark、en-US RTL；computed style、几何、截图；主滑块
  点击、速度菜单和音量 Portal 的真实交互；稳定自定义 popup 容器。
- 发布：根/子路径运行时和声明、`audio-player.css`、源码边界、tree-shaking/SSR-safe
  import、真实 tarball consumer 与合规产物。

## 完成证据

- AudioPlayer 定向单元与 SSR 为 2 个文件、11 项通过；最终全仓单测为
  141 个文件、998 项通过，lint、全仓类型检查、源码边界与生成漂移检查均通过。
- AudioPlayer Chromium spec 在更新基线和不更新基线两轮均为 7/7；共享
  parity harness 4/4，workbench smoke 2/2。desktop/mobile 的 light/dark 及 en-US RTL
  五组 React/Vue PNG 均字节一致，独立解码像素比较亦通过；代表性 desktop/mobile
  截图已人工检查。固定上游在 390px 视口中保留 323px 主滑块与完整控件固定布局，
  Vue 精确复现其移动端裁切表现，未用额外响应式样式改写基线。
- React 参考应用、Vue 文档应用、全部公开包和默认主题构建通过；根入口与
  `./audio-player` 均通过 SSR-safe import，`audio-player.css` 的固定选择器、Token 和暗色
  主题通过检查。
- `pnpm --config.verify-deps-before-run=false verify:pack-dist` 的真实 tarball consumer 通过
  根/子路径 ESM、公开类型、样式 exports、SSR import、许可证与 SPDX SBOM 检查。
- 本切片未修改共享 Playwright 比较算法、全局主题 Token 或测试配置，按分级策略未重跑
  全部组件浏览器回归；已覆盖当前场景、共享 harness 与工作台 smoke。
- 除上述两项 accepted deviation 外无未解释差异，AudioPlayer 垂直切片标记为 `ready`。
