# Carousel v2.102.0 对齐矩阵

## 路线与权威来源

- 当前路线：最近完成 Card；Carousel 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 固定基线：Semi Design `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter、公开类型与 DOM：`packages/semi-ui/carousel/index.tsx`、`CarouselArrow.tsx`、`CarouselIndicator.tsx`、`interface.ts`。
- 状态与定时算法：`packages/semi-foundation/carousel/foundation.ts`、`constants.ts`。
- 样式、动效与 RTL：`packages/semi-foundation/carousel/carousel.scss`、`variables.scss`、`animation.scss`、`rtl.scss`。
- 默认主题与 Token：`packages/semi-theme-default/scss/index.scss`、`global.scss`、`animation.scss`。
- 文档与行为语料：`content/show/carousel/index.md`、`index-en-US.md`、`packages/semi-ui/carousel/__test__/carousel.test.js`、`cypress/e2e/carousel.spec.js`。
- Carousel 只依赖已进入 `ready` 的 Icon、ConfigProvider 与私有 Foundation 边界，无后续公开组件阻塞，可独立形成完整切片。

## Vue 组件边界

| 文件                         | 单一职责                                                 | 公开契约                      |
| ---------------------------- | -------------------------------------------------------- | ----------------------------- |
| `Carousel.vue`               | 解析默认值、组合子项/箭头/指示器并管理挂载与悬停生命周期 | props、emits、默认 slot、方法 |
| `CarouselArrow.vue`          | 默认/自定义箭头内容、属性与点击                          | Carousel 内部                 |
| `CarouselIndicator.vue`      | 指示器 DOM、主题/尺寸/位置及 click/hover 触发            | Carousel 内部                 |
| `CarouselItemRenderer.ts`    | 克隆真实元素 VNode，合并 class/style 与动画状态          | Carousel 内部                 |
| `use-carousel-foundation.ts` | 私有 Foundation adapter、受控状态、定时器与完整清理      | Carousel 内部                 |
| `types.ts`                   | 公开联合类型、props/emits/slots 与实例方法               | 根入口与 `carousel` 子路径    |

入口组件负责组合，切换/循环索引和自动播放沿用固定 Foundation；无复用价值的 class 计算保持局部纯函数。只有对子 VNode 的动态克隆模板无法准确表达，因此限定在内部 render-function renderer。

## 公开 API、默认值与 Vue 映射

| React v2.102.0       | Vue 契约                                      | 默认值 / 映射                                                   | 结论         |
| -------------------- | --------------------------------------------- | --------------------------------------------------------------- | ------------ |
| `activeIndex`        | `activeIndex`                                 | 受控；存在性而非 truthiness 决定受控                            | 等价         |
| `defaultActiveIndex` | `defaultActiveIndex`                          | `0`；只用于非受控初值                                           | 等价         |
| `animation`          | `animation`                                   | `slide`；另支持 `fade`                                          | 等价         |
| `arrowProps`         | `arrowProps`，另提供 `#leftArrow/#rightArrow` | slot 优先于对应 `children`；props/style/listener 合并到箭头 div | Vue 原生映射 |
| `autoPlay`           | `autoPlay`                                    | `true` 或 `{ interval?, hoverToPause? }`                        | 等价         |
| `arrowType`          | `arrowType`                                   | `always`；另支持 `hover`                                        | 等价         |
| `className`          | `className`，另接收 Vue `class`               | 合并到根 `div`                                                  | Vue 原生映射 |
| `indicatorPosition`  | `indicatorPosition`                           | `center`；`left/center/right`                                   | 等价         |
| `indicatorSize`      | `indicatorSize`                               | `small`；另支持 `medium`                                        | 等价         |
| `indicatorType`      | `indicatorType`                               | `dot`；另支持 `line/columnar`                                   | 等价         |
| `theme`              | `theme`                                       | `light`；另支持 `primary/dark`                                  | 等价         |
| `onChange`           | `@change`                                     | `(index, preIndex)`；状态切换前同步通知                         | Vue emit     |
| `showArrow`          | `showArrow`                                   | `true`；缺省、显式 false、显式 true 分别验证                    | 等价         |
| `showIndicator`      | `showIndicator`                               | `true`；缺省、显式 false、显式 true 分别验证                    | 等价         |
| `slideDirection`     | `slideDirection`                              | `left`；`right` 反转 reverse class 语义                         | 等价         |
| `speed`              | `speed`                                       | `300ms`；同时写入 transition/animation duration                 | 等价         |
| `style`              | `style`，另接收 Vue attrs style               | 合并到根节点                                                    | Vue 原生映射 |
| `trigger`            | `trigger`                                     | `click`；另支持 `hover`                                         | 等价         |
| `children`           | 默认 slot                                     | 只保留真实元素 VNode，忽略文本/注释/Fragment 包装并展平可用子项 | Vue 原生映射 |
| ref methods          | `play/stop/goTo/prev/next`                    | 通过 `defineExpose` 暴露同名实例方法                            | Vue 原生映射 |

### 默认 true 与子 VNode 门禁

- `autoPlay`、`showArrow`、`showIndicator` 都分别覆盖缺省、显式 `false`、显式 `true`；SFC 裸属性值 `''` 视为启用，不能使用普通 truthiness。
- 自动播放对象的 `interval` 默认 `2000`，实际轮换周期为 `interval + speed`。固定 Adapter 运行时只在 `hoverToPause: true` 时暂停对象形式的自动播放；这与同版本文档所写的“缺省 true”不一致，本切片以固定源码行为为准并保留该差异证据。
- 默认 slot 同时使用真实 SFC 模板宿主与 `h()` 宿主验证；克隆后保留原子项 key、class、style、attrs 和 listener，并追加固定 `.semi-carousel-content-item*` 与动画 style。
- 空/单项 Carousel 不创建箭头和指示器，不启动 interval；空列表的索引计算不得产生 `NaN` 可见状态。

## 状态、事件顺序、DOM 与动效

- 初始状态为 `activeIndex=preIndex=有效初值`、`isReverse=false`、`isInit=true`。首次真实切换先把 `isInit` 置 false，再记录 `preIndex`，再 emit `change(next, previous)`，非受控模式最后更新 activeIndex。
- `next/prev` 先停止旧 interval，再按子项长度循环索引；受控模式只 emit，不主动改变 active item；随后按 autoplay/forcePlay 契约恢复定时器。
- `goTo` 对越界和负数索引取模，方向由当前索引与目标索引比较；指示器切换遵循同一事件/状态顺序。
- 根为 `div.semi-carousel`，内容为 `div.semi-carousel-content.semi-carousel-content-{animation}`；每个元素子项保留固定 current/active/prev/next/slide-in/slide-out class 和 `speed` 对应的四个动画 style。
- 箭头与指示器只有子项数大于 1 且对应 show prop 开启时渲染；默认箭头保留 Semi Icon 与固定 `aria-label`，自定义箭头 props 覆盖内部 click 时与固定 React Adapter 一样由调用方接管点击。
- hover 型箭头由固定 CSS 控制 opacity。slide/fade、reverse 与 RTL 均复用固定 SCSS；截图在切换动效终态采集，交互专项另断言动画起始 class。
- 根 mouseenter/mouseleave 使用 400ms debounce；满足 `autoPlay === true` 或对象显式 `hoverToPause: true` 时暂停/恢复。所有 debounce timer 与 interval 在卸载时清理。

## 键盘、焦点、ARIA、RTL、国际化与 SSR

- 固定 v2.102.0 Adapter 将根 `role=listbox`、`tabIndex=0`、keydown 绑定和箭头 `role=button` 注释掉，因此不额外创造键盘焦点状态机；默认箭头 Icon 的 `aria-label="Previous index"/"Next index"` 保留。
- 调用方传入的 `aria-*`、`data-*` 与原生 listener 落到根节点一次；自定义箭头 props 按固定 Adapter 落到对应箭头 div。
- Carousel 无 Locale 文案；light/dark 由主题 Token 驱动，RTL 由 ConfigProvider 的 `.semi-rtl` 与固定 `rtl.scss` 交换箭头位置、镜像图标并反转指示器间距。
- import/render SSR-safe，不在 setup/模块求值阶段访问 DOM；interval 与 debounce 仅在客户端挂载/事件后建立，卸载完整清理。

## 测试与发布门禁

- 单元测试覆盖受控/非受控、默认索引、循环/越界、方法、事件顺序、自动播放/暂停/强制播放、默认 true 三态、单项/空项、指示器 click/hover、箭头自定义、class/style/attrs/listener、模板与 `h()` VNode 克隆。
- SSR 覆盖默认/显式 Boolean、基础/单项、命名箭头 slots、ARIA/data attrs 与动画 style，确认 import/render 不创建 timer 或触碰 DOM。
- React/Vue 场景覆盖基础 slide、fade、line/columnar、hover 箭头、自定义箭头、单项、受控切换、RTL 与可访问属性。
- 视觉覆盖桌面 `1440×900`、移动 `390×844`、light/dark 与 RTL；关键 computed style 精确相等，bounding rect 各轴误差 `<= 0.5px`，截图阈值 `<= 0.1` / `0.001`，并独立比较成对 PNG 字节。
- 根与 `@aifuxi/semi-ui-vue/carousel` 子路径导出组件和公开类型；`@aifuxi/semi-theme-default/carousel.css` 包含固定 Token、Icon 与 Carousel 样式。
- 真实 tarball 验证根/子路径 ESM、声明、逐组件 CSS、tree-shaking、SSR-safe import、许可证与 SPDX SBOM；公开声明不得泄漏 Foundation/vendor 私有类型。

## Deviation

- React `arrowProps.*.children` 保留 VNodeChild prop，并增加 Vue `#leftArrow/#rightArrow`；slot 优先级在迁移文档明确，能力不减少。
- 固定 v2.102.0 本身未给轮播根、箭头和指示器提供完整 role/tabindex/键盘语义；为保持 DOM 与行为基线，本切片不擅自增加这些属性，只保留默认 Icon 的 aria-label。该上游限制记录为基线事实，不作为 Vue-only accepted deviation。
- 无 accepted visual/behavior deviation；任何未解释差异均阻止 `pending -> ready`。

## 验收结论

- 当前状态：`ready`。
- `pnpm check` 全部通过：固定 vendor/inventory/icons/source boundary、格式、lint、类型、62 个单元测试文件共 468 条测试、全包构建、主题产物、SSR import 与真实 tarball 消费验证均为绿色。
- `pnpm test:browser` 全部通过：245 条 Chromium 回归中 Carousel 专项 7 条，覆盖真实固定 React 来源、交互/计算样式/几何、桌面与移动 light/dark、RTL。
- 五组 Carousel React/Vue 配对 PNG 另以 `cmp` 独立核验为逐字节相等；无 mask、无共享截图文件、无 accepted visual/behavior deviation。
