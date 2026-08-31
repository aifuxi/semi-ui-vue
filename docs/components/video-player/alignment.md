# VideoPlayer v2.102.0 对齐矩阵

## 基线与路线

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，commit
  `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 当前 README 为 74/85，固定 `content/order.js` 在 AudioPlayer 后进入可独立验收的
  VideoPlayer。它复用已 ready 的 Button、Popover、Dropdown、Tooltip、Locale、Icons 与
  AudioSlider；JsonViewer 仍受独立 Worker 核心阻塞，因此 VideoPlayer 是当前依赖就绪的
  下一切片。
- 源码证据：
  - Adapter/API/DOM：`packages/semi-ui/videoPlayer/{index,videoProgress,utils,ErrorSvg}.tsx`。
  - Foundation/常量/样式：`packages/semi-foundation/videoPlayer/`。
  - 默认主题：`packages/semi-theme-default/scss/{index,global}.scss`。
  - 中英文文档、Story 与 Cypress：`content/plus/videoPlayer/`、
    `packages/semi-ui/videoPlayer/_story/`、`cypress/e2e/videoPlayer.spec.js`。

## Vue 组件边界

| 文件                                  | 单一职责                                                  | 公开边界                           |
| ------------------------------------- | --------------------------------------------------------- | ---------------------------------- |
| `VideoPlayer.vue`                     | 媒体状态、原生 video 事件、控制栏、通知与全屏/PiP 编排    | props/emits、attrs、暴露 video     |
| `VideoProgress.vue`                   | 章节进度、拖动几何、缓冲/播放宽度、Tooltip                | 私有组件；value/max/change         |
| `video-player/index.ts`               | 导出组件、公开类型与纯函数 `formatVideoTime`              | 根入口与 `video-player` 子路径     |
| `foundation-integration/video-player` | 隔离固定 Player/Progress Foundation、常量与 Marker 类型面 | 私有运行时边界，不泄漏 vendor 路径 |

播放器负责单一媒体状态机；章节进度拥有独立的拖动和浮层生命周期，因此拆成子组件。Foundation、
DOM、timer 与事件函数保持原始身份，使用 `markRaw` / `shallowReactive`，不进入深层代理。

## 公开 API 与默认值

| React v2.102.0          | 默认值      | Vue 映射与约束                                                      |
| ----------------------- | ----------- | ------------------------------------------------------------------- |
| `autoPlay`              | false       | 同名 Boolean prop                                                   |
| `captionsSrc`           | -           | 同名 string；输出 captions track                                    |
| `clickToPlay`           | true        | 同名 Boolean；区分缺省、显式 false、显式 true                       |
| `controlsList`          | 全部十项    | `VideoPlayerControl[]`；顺序由固定 DOM 分组决定                     |
| `crossOrigin`           | -           | 原生 video `crossorigin`                                            |
| `defaultPlaybackRate`   | 1           | 初始 playbackRate 与下拉当前值                                      |
| `defaultQuality`        | ''          | 初始清晰度；只在 qualityList 存在时渲染                             |
| `defaultRoute`          | ''          | 初始线路；只在 routeList 存在时渲染                                 |
| `forwardRef`            | -           | Vue 原生 `ref` 改为 `defineExpose({ element })`                     |
| `height` / `width`      | -           | 根容器内联尺寸，接受 number/string                                  |
| `loop` / `markers`      | false / -   | 原生 loop；Marker `{ start, title }[]`                              |
| `muted` / `volume`      | false / 100 | 初始化原生 volume；`muted=true` 时状态音量为 0，与固定 Adapter 一致 |
| `onPause/onPlay`        | -           | `pause` / `play` emits，原生事件后更新状态再触发                    |
| `onQualityChange`       | -           | `qualityChange` emit，参数为 value                                  |
| `onRateChange`          | -           | `rateChange` emit，参数为 number                                    |
| `onRouteChange`         | -           | `routeChange` emit，参数为 value                                    |
| `onVolumeChange`        | -           | `volumeChange` emit；固定 Foundation 未调用，记录 deviation         |
| `playbackRateList`      | 五项        | `{ label, value }[]`，固定列表为 2/1.5/1.25/1/0.75                  |
| `poster/src/theme`      | -/-/dark    | 同名；theme 为 dark/light                                           |
| `qualityList/routeList` | -           | `{ label, value }[]`                                                |
| `seekTime`              | 10          | 聚焦在播放器内时左右方向键跳转                                      |
| `className/style`       | -           | 与 Vue `class/style`、其它 attrs 仅合并到根                         |

ConfigProvider `overrideDefaultProps.VideoPlayer` 优先级为“显式 prop > 全局覆盖 > 上游默认值”。
`clickToPlay` 使用原始 VNode camelCase/kebab-case 键判断显式性；单测必须同时覆盖缺省、显式
false、显式 true 和 provider 覆盖。

## 状态与事件顺序

1. 初始时间、缓冲、错误、镜像和播放态为零值；质量/线路/倍速、muted、volume、src 来自
   解析后的运行时 props。
2. mounted 后同步 duration/volume/playbackRate，注册 `keydown`、`fullscreenchange`、
   `leavepictureinpicture`；unmount 使用相同函数引用移除并清理 controls/notification timer、
   document mousemove/mouseup 与临时 loadeddata 恢复监听。
3. video `play/pause` 原生事件先更新 `isPlaying`，再分别 emit `play/pause`；点击视频只在
   `clickToPlay=true` 时切换。`ended` 回到暂停并显示控制栏。
4. `timeupdate/durationchange/progress` 同步 currentTime/totalTime/最后 buffered end；拖动进度
   直接写 video.currentTime。
5. waiting/stalled 显示 Locale 通知，canplay 清除；error 覆盖播放器，poster 在播放中隐藏，
   已经进入中段的暂停态保留节点但 opacity 为 0。
6. 速率切换同步原生 playbackRate、状态、emit 与一秒通知；清晰度/线路切换先更新状态与
   emit，再在新资源 loadeddata 后恢复时间和原播放态。
7. 镜像翻转原生 video；全屏记录滚动位置并在退出后恢复；PiP 调用原生 API，退出时按
   video.paused 恢复播放图标。
8. 键盘只在 `videoWrapper.contains(document.activeElement)` 时响应 Space、ArrowLeft、
   ArrowRight；左右跳转沿用浏览器 currentTime 边界语义。

## DOM、样式、ARIA、Portal、主题与 RTL

- 根为 `div.semi-videoPlayer`；内部顺序固定为 wrapper/video、poster、pause、error、
  notification、controls。镜像追加 `.semi-videoPlayer-mirror`。
- wrapper 追加 `-dark/-light`；video 为 `object-fit: contain`；控制栏 56px、进度热区 20px，
  章节相邻保留 2px 间距，DOM/class 与 SCSS 选择器不改名。
- VideoProgress 保留 `role=slider`、`tabindex=0`、`aria-valuenow`；控制项复用 Button 的键盘
  与 aria-disabled。固定 Adapter 没有 slider 键盘调整和额外 aria-label，不擅自新增。
- Tooltip/Popover/Dropdown 使用 ConfigProvider 的稳定 `getPopupContainer`。对照夹具在
  子树挂载前创建容器，首次可见 Portal 必须直接进入该容器；卸载后不得保留播放器浮层。
- 默认主题入口按 `index.scss -> global.scss -> audioPlayer.scss -> videoPlayer.scss` 编译，
  因 VideoPlayer 复用 AudioSlider；根入口纳入同一链路。
- 组件自身没有 RTL 分支，方向由 ConfigProvider 和复用浮层传递；桌面/mobile light/dark
  与 en-US RTL 都进入 Chromium 对照。

## 国际化、SSR 与 deviation

- Locale 使用固定 `VideoPlayer.rateChange/qualityChange/routeChange/mirror/cancelMirror/loading/
stall/noResource/videoError`，57 个既有 Locale 数据无需新增或改写。
- SSR 输出静态 video/track、poster、progress 与控制栏，不读取 document/window、媒体属性，
  不注册监听；hydration 后才初始化。根与子路径 import 必须 SSR-safe。
- Accepted：`clickToPlay=false` 时 Vue 阻止视频点击切换。固定 React 声明并文档化该 prop，
  但 Adapter 无条件调用 `handlePlayOrPause`，属于 v2.102.0 实现遗漏；Vue 保留公开语义，
  影响仅限调用方明确禁用点击播放时。
- Accepted：Vue 在 unmount 时使用稳定回调引用完整移除 `keydown`，并清理临时通知/
  loadeddata timer。固定 Foundation 的 inline keydown remove 引用不同且临时通知 timer 未清，
  会造成卸载后副作用；修复不改变挂载期间行为。
- Accepted：公开 `volumeChange` emit 在音量实际变化时触发。固定 Adapter 声明并公开
  `onVolumeChange`，但 Foundation 从未 notify；Vue 兑现公开回调语义。
- 无其它已知行为、样式或发布差异。

## 验收门禁

- 单元：默认/显式 clickToPlay、ConfigProvider 优先级、DOM/theme/attrs、媒体事件顺序、
  progress/markers、controlsList、volume/mute、rate/quality/route、通知、键盘焦点范围、
  fullscreen/PiP、src 更新、Locale、监听与 timer 清理。
- SSR/hydration：完整静态 DOM、无媒体/全局副作用、hydration 后单次注册与相同引用清理。
- Chromium：desktop/mobile light/dark、en-US RTL；computed style、几何、截图；进度拖动、
  速率/质量/线路菜单、音量 Portal、键盘、镜像和稳定自定义容器。
- 发布：根/子路径运行时和声明、`video-player.css`、源码边界、tree-shaking/SSR-safe import、
  真实 tarball consumer 与合规产物。

## 完成证据

- 当前组件：VideoPlayer 单元/SSR、场景注册与两端应用定向测试通过；
  Chromium 7 项覆盖来源、行为、Portal、computed style、几何、desktop/mobile
  light/dark 与 en-US RTL，无更新参数复跑通过。
- 视觉：5 组 React/Vue 裁剪图解码像素对照通过，人工复核无可见局部差异；
  desktop/mobile light、mobile dark 与 RTL light 四组 PNG 还直接字节一致。
  desktop dark 只宣称解码像素门禁通过，不宣称 PNG 字节一致。
- 受影响链路：React/Vue 生产构建、工作台 smoke、Foundation/UI 类型、主题产物、
  源码边界、根/子路径 SSR import 与真实 tarball 消费均通过。
- 仓库门禁：`pnpm check` 通过，包含固定 vendor/inventory、生成漂移、格式/lint、
  全 workspace 类型与单测、全构建、主题、SSR 和真实发布包验证。
- 未运行全仓 `pnpm test:browser`：本次只新增 VideoPlayer 场景注册、组件作用域
  harness CSS 与快照，未改动共享运行时、全局主题、Playwright 比较算法、端口、
  字体、viewport 或动画归一化；按组件切片验收策略，当前组件完整场景加工作台 smoke
  为本次浏览器证据边界。
