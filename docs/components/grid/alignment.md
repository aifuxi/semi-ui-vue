# Grid v2.102.0 对齐矩阵

## 固定源码证据

- 公开入口：`vendor/semi-design/packages/semi-ui/grid/index.tsx`
- Row Adapter：`vendor/semi-design/packages/semi-ui/grid/row.tsx`
- Col Adapter：`vendor/semi-design/packages/semi-ui/grid/col.tsx`
- 常量与样式：`vendor/semi-design/packages/semi-foundation/grid/constants.ts`、`grid.scss`、`mixin.scss`、`rtl.scss`
- 中英文文档：`vendor/semi-design/content/basic/grid/index.md`、`index-en-US.md`
- 上游行为测试：`vendor/semi-design/packages/semi-ui/grid/__test__/calculateGutter.test.js`

## 组件边界

| Vue 文件          | 单一职责                                               | 状态与副作用                                                    |
| ----------------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| `Row.vue`         | Row class、Gutter 计算、原生 attrs 与 Row→Col provider | 保存六断点匹配状态；mounted 注册 `matchMedia`，unmount 完整清理 |
| `Col.vue`         | 24 栅格及六断点 class、消费 Row Gutter、原生 attrs     | 无内部状态；缺少最近 Row provider 时立即报错                    |
| `grid-context.ts` | 类型化 Row→Col Gutter 上下文                           | provider 实例隔离，嵌套 Row 的 Col 只消费最近上下文             |
| `media-query.ts`  | SSR-safe `matchMedia` 注册与新旧监听 API 清理          | 仅客户端创建监听                                                |

Grid 不需要 Foundation 运行时实例或额外 composable；Foundation 仅提供固定 SCSS。

## 公开 API 映射

### Row

| React v2.102.0                                          | 默认值 | Vue                                    | 结论         |
| ------------------------------------------------------- | ------ | -------------------------------------- | ------------ |
| `type?: 'flex'`                                         | -      | 同名 typed prop                        | 等价         |
| `align?: top/middle/bottom`                             | -      | 同名 typed prop                        | 等价         |
| `justify?: start/end/center/space-around/space-between` | -      | 同名 typed prop                        | 等价         |
| `gutter?: number/object/[horizontal, vertical]`         | `0`    | 同名 typed prop；tuple 接受响应式对象  | 等价         |
| `prefixCls?: string`                                    | `semi` | 同名 typed prop                        | 等价         |
| `className/style/HTML attrs`                            | -      | Vue `class/style` 与 fallthrough attrs | Vue 原生映射 |
| `children`                                              | -      | 默认 slot                              | Vue 原生映射 |

### Col

| React v2.102.0                           | 默认值 | Vue                                    | 结论         |
| ---------------------------------------- | ------ | -------------------------------------- | ------------ |
| `span/order/offset/push/pull?: number`   | -      | 同名 typed props                       | 等价         |
| `xs/sm/md/lg/xl/xxl?: number \| ColSize` | -      | 同名 typed props                       | 等价         |
| `prefixCls?: string`                     | `semi` | 同名 typed prop                        | 等价         |
| `className/style/HTML attrs`             | -      | Vue `class/style` 与 fallthrough attrs | Vue 原生映射 |
| `children`                               | -      | 默认 slot                              | Vue 原生映射 |

组件没有受控/非受控状态，也不修改调用方 props。Row 和 Col 都不声明业务事件；原生监听器落在各自根 div。

## DOM、class 与样式

- 普通 Row 为 `div.semi-row`；`type="flex"` 改为 `semi-row-flex`，并按需增加 `semi-row-flex-{justify}` 与 `semi-row-flex-{align}`。
- Row 与 Col 根节点都保留 `x-semi-prop="children"`，并透传 class、style、ARIA、data、role、id 和原生事件。
- Col 固定为 `div.semi-col`，基础尺寸 class 为 `semi-col-{span}`；order、offset、push、pull 使用上游同名 class。
- 六断点 class 使用 `semi-col-{screen}-{value}` 与对应的 order/offset/push/pull 形式。响应式配置中的 `0` 仍生成 class；顶层 order/offset/push/pull 的 `0` 与固定 Adapter 一样不生成 class。
- 水平 Gutter 在 Row 写入左右负半间距，在直接或后代 Col 写入左右正半间距；垂直 Gutter 同理写入上下间距。调用方 style 最后合并并可逐项覆盖。
- 响应式 Gutter 按 `xxl → xl → lg → md → sm → xs` 选择当前已匹配且已配置的首个值。
- 栅格宽度基于 24 列；`span=0` 隐藏。固定断点为 xs `<576`、sm `≥576`、md `≥768`、lg `≥992`、xl `≥1200`、xxl `≥1600`。
- `.semi-rtl` / `.semi-portal-rtl` 让 Row 方向变为 RTL；`.semi-rtl` 下 Col float 向右并镜像 offset。

## 键盘、焦点、ARIA、Portal、动效、国际化与 SSR

- Row/Col 是纯布局 div，不增加 tabindex、键盘处理、焦点样式或 ARIA；调用方可通过原生 attrs 补充语义。
- 无 Portal、动效、Locale 文案、Observer、异步资源或全局配置依赖。
- import 与 SSR render 不访问 DOM。SSR 初始六断点均为匹配，和固定 React state 一致，因此响应式 Gutter 选择最高已配置断点；hydration 后 `matchMedia` 收敛为真实视口。
- 缺少 `window.matchMedia` 时保持 SSR-safe 和可挂载，并保留固定初始选择。
- Col 必须位于 Row provider 下；否则保留固定错误 `please make sure <Col> inside <Row>`。

## 验收矩阵

| 层级          | 覆盖                                                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 类型          | 根/`grid` 子路径导出，Row/Col props、断点、Gutter 与 ColSize 类型                                                                      |
| 单元          | 基础/flex/custom prefix class，attrs/slot，数值/二维/响应式 Gutter，style 覆盖，六断点 class 与零值，监听清理，缺少 Row，SSR/hydration |
| Chromium 行为 | 固定源码来源、24 栅格、Flex 对齐/排序、桌面/移动响应式 Gutter 与 Col、RTL float/offset、无运行时错误                                   |
| 视觉          | desktop 1440×900 与 mobile 390×844，light/dark；额外 desktop light RTL；组件裁剪                                                       |
| 发布          | build、SSR import、真实 pack 安装、根/子路径 ESM 与 types、根/逐组件 CSS、许可证/SBOM                                                  |

截图阈值保持 `threshold=0.1`、`maxDiffPixelRatio=0.001`，同时要求同一 Chromium 中 React/Vue 组件截图字节完全一致；对应节点 bounding rect 各轴差值不超过 `0.5 CSS px`。

## Deviation

当前没有 accepted visual/behavior deviation。React `RowContext` 是内部实现细节，Vue 改用类型化 provide/inject；公开 DOM、Gutter 传播和嵌套隔离不变。
