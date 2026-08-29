# Tag v2.102.0 对齐矩阵

## 路线与权威来源

- 当前路线：实时提交历史已完成 `Table`；`Tag` 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 已就绪依赖：Avatar、Icons、Popover/Tooltip、ConfigProvider RTL 和发布/Chromium 基础设施均已进入 `ready`。Tag 不依赖后续 Timeline、Banner 或 Notification，可独立形成验收闭环。
- 唯一基线：`vendor/semi-design` 的 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter/DOM：`packages/semi-ui/tag/index.tsx`、`group.tsx`、`splitTagGroup.tsx`、`interface.ts`；样式/常量/RTL：`packages/semi-foundation/tag/`；中英文 API 与示例：`content/show/tag/`。

## 组件边界

- `Tag.vue`：单标签公开 props/emits/slots、受控/非受控可见性、点击/关闭/键盘、Avatar 与固定 DOM/class。
- `TagGroup.ts`：把 `tagList` 映射为 Tag、按 `maxTagCount` 折叠并用既有 Popover 展示剩余项；不修改调用方数据。
- `SplitTagGroup.ts`：只装饰直接可见子 VNode 的 first/last class；模板 Fragment 会按 Vue 直接子语义展开，保留原 class/key。
- `TagNodeRenderer.ts`：只负责安全渲染 `VNodeChild`，不持有状态。

## 公开 API 与 Vue 映射

| v2.102.0 React API                       | 固定源码默认值              | Vue API / 验收                                                                    |
| ---------------------------------------- | --------------------------- | --------------------------------------------------------------------------------- |
| `children`                               | 无                          | 默认 slot；数据 API 使用 `content`，slot 优先                                     |
| `size`                                   | `default`                   | `default/small/large`；保留对应 class                                             |
| `color`                                  | `grey`                      | 固定 17 色 union 与 `.semi-tag-{color}-{type}`                                    |
| `type`                                   | `light`                     | `light/solid/ghost`                                                               |
| `shape` / `avatarShape`                  | `square` / `square`         | `square/circle`；Avatar 复用已发布组件                                            |
| `closable`                               | `false`                     | 同名 prop；关闭 emit `close(content,event,tagKey)` 与 `update:visible(false)`     |
| `visible`                                | 内部初值 `true`             | 可选受控 prop + `v-model:visible`；缺省时关闭后内部隐藏，显式 false/true 保持受控 |
| `tagKey`                                 | 无                          | 作为关闭 payload；Vue VNode `key` 仍由渲染器管理                                  |
| `prefixIcon/suffixIcon`                  | null                        | 同名 prop 或 `#prefixIcon/#suffixIcon`，slot 优先                                 |
| `avatarSrc`                              | 无                          | 同名 prop；输出固定 Avatar DOM/class                                              |
| `colorful/gradient`                      | false/false                 | 同名 Boolean；gradient 仅由固定 SCSS 在 colorful class 下生效                     |
| `className/style/tabIndex/aria-label`    | `''/{}/undefined/undefined` | `class`/`className`、StyleValue、原生 attrs；交互 Tag 才添加 role/button 键盘语义 |
| `onClick/onClose/onKeyDown/onMouseEnter` | noop/noop/无/noop           | Vue `click/close/keydown/mouseenter` emits；事件顺序与阻止默认行为一致            |
| `TagGroup.tagList`                       | 调用方提供                  | `TagData[]` 或 custom VNodeChild；不修改输入对象                                  |
| `TagGroup.maxTagCount/restCount`         | 无                          | 超出时显示 `+N`；`restCount` 保留固定公开类型的 truthy 覆盖语义                   |
| `TagGroup.showPopover/popoverProps`      | false/无                    | 稳定 Popover；固定默认可被 `popoverProps` 逐项覆盖                                |
| `TagGroup.mode`                          | 无                          | `custom` 时原样渲染 VNodeChild，否则创建 Tag                                      |
| `SplitTagGroup`                          | 无                          | `role=group`、aria-label/class/style 透传并装饰直接子节点                         |

## 状态、事件与 VNode 门禁

- `visible` 必须从当前原始 VNode props 区分缺省、显式 false、显式 true；缺省为非受控内部 true，受控关闭只通知、不改写 prop。
- 鼠标关闭：先 `stopPropagation/stopImmediatePropagation`，同步 emit `close`；监听器 `preventDefault()` 时不隐藏且不 emit visible update，否则再通知 false。
- Delete/Backspace：执行同一关闭链后 preventDefault/stopPropagation；Enter 先 emit click 再阻止；Escape blur；最后仍 emit keydown。
- `SplitTagGroup` 同时使用真实 SFC 模板宿主和 `h()` 宿主验证 Fragment、Comment/Text、动态子节点、既有 class 与单节点 first+last。
- `TagGroup` 不用 truthiness 解释子 Tag 的 Boolean；数据中的 `closable: false/true` 原样传递，模板裸 `closable` 在 Tag 自身按 Vue Boolean 语义工作。
- Popover 稳定容器由既有 Popover 合同负责；本组件不增加 Observer、轮询或滚动监听。

## DOM、样式、主题、RTL、国际化与 SSR

- Tag DOM 固定为 `.semi-tag`，可选 prefix wrapper、Avatar、`.semi-tag-content-*`、suffix wrapper、`.semi-tag-close`；invisible 只加 class，不卸载。
- TagGroup 为 `.semi-tag-group`；最大数量添加 `-max` 与 size class；`+N` Tag 背景透明。SplitTagGroup 为 `.semi-tag-split[role=group]`，不增加布局 wrapper。
- 独立 `tag.css` 编译 theme/global/animation、Portal、Avatar、Popover/Tooltip、Tag 与 Icons；根 CSS 已含固定 Tag SCSS。
- RTL 由 ConfigProvider 的 `.semi-rtl` 祖先触发固定 `rtl.scss`；关闭图标、Avatar margin、Group margin 反转。SplitTagGroup 固定源码没有独立 RTL 边角交换，按 v2.102.0 保留。
- 组件无 Locale 文案；zh-CN/en-US 只验证 slot/data 内容可渲染。SSR import/render 不访问 window/document；Popover 未打开时无 Teleport 副作用。

## 测试与发布证据

- 单元：全部枚举/class、内容与图标 slot、Avatar、受控/非受控可见性、关闭 preventDefault、鼠标/键盘顺序、ARIA/tabIndex、TagGroup 数据/折叠/回调/Popover、SplitTagGroup template+h() 门禁。
- SSR：Tag/TagGroup/SplitTagGroup 可渲染，受控 invisible 与 fixed classes 保留，无浏览器全局访问。
- Chromium：同进程 React/Vue 来源、交互、computed style 与 bounding rect；桌面/移动 light/dark 和 RTL 成对局部 PNG，另做独立 buffer 直接比较。
- 发布：根/`tag` ESM 与声明、逐组件 CSS、SSR-safe import、tree-shaking、合规产物和真实 tarball 消费。

## Deviation 与状态

- React `children/ReactNode/className` 映射为 Vue slots/`VNodeChild`/class，并增加原生 `v-model:visible`；框架映射不构成能力损失。
- Vue Fragment 在 SplitTagGroup 中按模板直接子元素展开；React Fragment 是单个可克隆元素但 class 不落 DOM。Vue 映射避免无效 class 丢失，并保持可见边界语义。
- 复杂内容缺省 key 使用稳定索引而非 React 侧 `Math.random()`；仅改善 Vue patch 稳定性，不改变 DOM、事件或公开 payload。
- 当前没有 accepted visual/behavior deviation。当前状态：`ready`；固定源码、单元/SSR、主题/打包与 Chromium 全量门禁均已通过。
