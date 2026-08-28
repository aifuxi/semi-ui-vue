# TagInput v2.102.0 对齐矩阵

## 基线与选择理由

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 组件顺序：最近完成 Slider；其后的 Switch 已提前完成，所以 `content/order.js` 中首个未完成输入类组件是 TagInput。
- 依赖：Input、Tooltip、Typography、Icon、ConfigProvider 已完成；Tag 与 Popover 的本组件所需 DOM/样式封装在私有子组件内，不把尚未完成的公开组件伪装成已交付依赖。

## 组件边界

| 模块                          | 单一职责                                      | 契约                                         |
| ----------------------------- | --------------------------------------------- | -------------------------------------------- |
| `TagInput.vue`                | 组合根 DOM、插槽、标签列表、输入与公开方法    | props / emits / slots / `focus()` / `blur()` |
| `use-tag-input-foundation.ts` | 建立 Vue 状态与固定 Foundation Adapter 边界   | 仅返回公开状态、Foundation 与清理方法        |
| `TagInputTag.vue`             | 输出固定 Tag/Paragraph class 与关闭、拖拽交互 | value/index/disabled/size → close/drag       |
| `TagInputRestPopover.vue`     | 用稳定 Portal 容器输出剩余标签浮层            | rest tags + Popover 风格 Tooltip             |

## 权威源码

- Adapter/DOM/API：`packages/semi-ui/tagInput/index.tsx`。
- 状态机：`packages/semi-foundation/tagInput/foundation.ts`、`utils/getSplitedArray.ts`。
- 样式：`packages/semi-foundation/tagInput/{variables,tagInput,rtl,animation}.scss`，以及 Tag/Input/Popover/Tooltip/Portal 依赖样式。
- 文档与测试：`content/input/taginput/`、`packages/semi-ui/tagInput/__test__/tagInput.test.js`。

## 公开 API 与 Vue 映射

| React v2.102.0                                        | 默认值             | Vue 契约                                                                         |
| ----------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------- |
| `value` / `defaultValue`                              | `undefined` / `[]` | 保留，并增加 `v-model` (`modelValue`)；显式 `undefined` 仍是受控空值             |
| `inputValue`                                          | `undefined`        | 保留受控输入并发出 `update:inputValue`                                           |
| `separator` / `split`                                 | `','` / 内置切分   | 同名 prop；支持 string、string[]、null 和自定义函数                              |
| `allowDuplicates`                                     | `true`             | 同名 Boolean，覆盖缺省/显式 false/显式 true                                      |
| `showRestTagsPopover`                                 | `true`             | 同名 Boolean，覆盖缺省/显式 false/显式 true；稳定自定义容器首次挂载              |
| `expandRestTagsOnClick`                               | `true`             | 同名 Boolean，覆盖缺省/显式 false/显式 true                                      |
| `showContentTooltip`                                  | `true`             | 同名 Boolean/`{ type, opts }` 配置；仅内容真实溢出时显示                         |
| `showClear` / `addOnBlur` / `draggable` / `autoFocus` | `false`            | 同名 Vue Boolean prop                                                            |
| `max` / `maxLength` / `maxTagCount`                   | `undefined`        | 同名 prop，保留 exceed/inputExceed 回调时机                                      |
| `prefix` / `insetLabel` / `suffix` / `clearIcon`      | `undefined`        | 同名 prop，同时提供同名 slot，slot 优先                                          |
| `renderTagItem(value,index,onClose)`                  | `undefined`        | `#tag="{ value, index, close }"` 为主；同名函数 prop 保留迁移兼容                |
| `onChange/onAdd/onRemove/...`                         | noop               | Vue emits：`change/add/remove/inputChange/exceed/inputExceed/focus/blur/keyDown` |
| ref `focus()` / `blur()`                              | —                  | `defineExpose<TagInputExposed>`                                                  |

## 状态、事件和行为

- Enter：先阻止表单提交，再按 separator 切分、过滤空白/重复、应用 max；顺序为 `change → add → inputChange('')`。
- Backspace：输入为空时移除最后标签；顺序为 `change → remove`。
- 关闭：按可见标签的原始 index 删除；受控模式只通知，等待 `value/modelValue` 回写。
- 清空：标签非空时 `change([])`，输入非空时再 `inputChange('')`，并阻止根点击冒泡。
- blur：`addOnBlur=true` 时先尝试添加，再退出 focus 并发出 blur。
- maxLength：普通输入和 IME composition end 都逐切分片段校验；超限发出 `inputExceed`。
- active：点击根或公开 `focus()` 展开折叠标签并注册 document click；外部点击、blur API、卸载完整清理。
- draggable：仅 active 时显示 handle；拖放重排后通过上游 Foundation 发出 `change`。

## DOM / class / 样式

- 根：`.semi-tagInput`，保留 focus/hover/disabled/error/warning/size/with-prefix/with-suffix 状态 class、`aria-disabled`、`aria-invalid` 和 data-*。
- 内容：`.semi-tagInput-wrapper`；标签保留 `.semi-tag`、`.semi-tag-content`、`.semi-tag-close`、Paragraph ellipsis class；输入继续消费已对齐 Input DOM。
- 剩余计数：`.semi-tagInput-wrapper-n`；浮层使用 `.semi-popover-*`、`.semi-portal` 和箭头。
- 主题入口直接编译固定 TagInput、Tag、Input、Typography、Tooltip、Popover、Portal 与 Icon SCSS；保留 `.semi-*` 和 `--semi-*`。

## 键盘、焦点、ARIA、Portal、动效

- 输入保留 `aria-label="input value"`；根保留调用方 aria-label、disabled/invalid；关闭标签与 clear 均可聚焦，Enter 激活。
- `focus({ preventScroll })`、autoFocus 与前后缀点击聚焦；disabled 不聚焦、不增删。
- 剩余标签浮层由 hover 触发，首次打开即挂入调用方稳定 `getPopupContainer`（或 ConfigProvider/body）；卸载不得残留 portal。
- Popover/Tooltip 进入退出动画沿用固定 SCSS；截图在稳定动画时刻采集。

## RTL、国际化、SSR

- RTL 由 ConfigProvider 的 `.semi-rtl` 祖先与固定 `tagInput/rtl.scss` 对齐，标签 margin 方向反转。
- 组件没有内置 locale 文案；中英文场景使用相同数据合同分别验证可渲染性。
- SSR 仅输出根、标签与输入；document、focus、测量、Portal 和点击外部监听只在客户端生命周期执行。

## 验收门禁

- 单元：受控/非受控、四个默认 true Boolean 的缺省/false/true、分隔/重复/max/maxLength/IME、事件顺序、清空、键盘、slot/函数标签、拖拽、焦点、ARIA、Portal 首挂与卸载。
- SSR：默认/disabled/校验/slot/折叠输出，无 Portal 和 vendor 路径。
- Chromium：同 BrowserContext 的 React/Vue 计算样式、几何、公开行为、desktop/mobile light/dark/RTL 与裁剪截图。
- 发布：根与 `tag-input` 子路径导入、类型、样式、SSR-safe import、tree-shaking、许可/SBOM 和 tarball 安装。

## Deviation

- 上游 `renderTagItem` 与 `showContentTooltip.renderTooltip` 消费 `ReactNode`。Vue 主契约分别映射为 `#tag` slot，以及在该 slot 中组合公开 `Tooltip`；为渐进迁移保留 `renderTagItem` 函数 prop。原因是 ReactNode/render-prop 不能作为 Vue 公共类型逐字复制；用户影响是迁移自定义提示时需改写为 slot，标签 DOM、关闭回调和可实现能力不变，验收为 Vue 原生等价映射。
- 上游 active draggable 分支通过 `_sortable`/dnd-kit 包裹列表；其公开结果是 handle、排序后的值与 `onChange`，内部 `onSortEnd`/`sortableHandle` 不属于 TagInput API。Vue 采用浏览器原生 drag events，保留相同 handle、指针排序结果和 `change` 回调，不发布 React/dnd-kit 类型。用户影响是拖拽过程由浏览器而非 dnd-kit 提供反馈；固定场景不比较瞬时 drag overlay，最终 DOM、顺序与事件已通过单元验收，因此接受该运行时实现差异。
