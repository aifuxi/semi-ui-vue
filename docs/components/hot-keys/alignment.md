# HotKeys v2.102.0 对齐矩阵

## 基线与路线

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，commit
  `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 上游顺序：`content/order.js` 在 DragMove、JsonViewer 后列出 HotKeys，再列出
  Lottie。JsonViewer 仍依赖独立 Worker 核心；HotKeys 只依赖自身 Foundation，能
  独立验证组合键状态机、监听清理、SSR 与视觉主题，因此在 DragMove 后回补。
- 源码证据：
  - Adapter/API/DOM：`packages/semi-ui/hotKeys/index.tsx`。
  - Foundation/键表/样式：`packages/semi-foundation/hotKeys/{foundation,constants}.ts`
    与 `hotKeys.scss`、`variables.scss`。
  - 默认主题：`packages/semi-theme-default/scss/{index,global}.scss`。
  - 中英文文档与示例：`content/plus/hotkeys/`。

## Vue 组件边界

| 文件                              | 单一职责                                                                      | 公开边界                                             |
| --------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------- |
| `HotKeys.vue`                     | 归一化 props/slot，连接固定 Foundation，输出固定 DOM/class 并管理监听生命周期 | props、`click`/`hotKey` emits、默认 slot、原生 attrs |
| `hot-keys/index.ts`               | 组合公开组件与静态 `HotKeys.Keys`，导出公开类型                               | 根入口与 `hot-keys` 子路径                           |
| `foundation-integration/hot-keys` | 隔离固定 Foundation 与键表                                                    | 私有运行时边界；公开声明不泄漏 vendor 路径           |

组件只有一个视觉根和一个监听状态机，不再拆分展示子组件。Vue 默认 slot 是 React
`render` 的原生映射；普通 `content`/`hotKeys` 仍由模板直接渲染。

## 公开 API 与默认值

| React v2.102.0                          | 默认值                             | Vue 映射                                         | 结论                                            |
| --------------------------------------- | ---------------------------------- | ------------------------------------------------ | ----------------------------------------------- |
| `hotKeys?: KeyboardEvent['key'][]`      | `null`，但 Foundation 要求合法组合 | 必填同名 prop `HotKeysKey[]`                     | 收紧类型以表达固定运行时不变量；运行时仍校验    |
| `content?: string[]`                    | `null`                             | 同名 prop；缺省显示 `hotKeys`                    | 等价                                            |
| `preventDefault?: boolean`              | `false`                            | 同名 prop                                        | 等价；只在匹配成功时阻止                        |
| `mergeMetaCtrl?: boolean`               | `false`                            | 同名 prop                                        | 固定 Foundation 读取但未使用，按基线保留该行为  |
| `getListenerTarget?: () => HTMLElement` | `document.body`                    | 同名 prop，允许返回 `null/undefined` 后回退 body | Vue setup/SSR 阶段不访问 document               |
| `onHotKey(event)`                       | noop                               | `@hot-key` / `onHotKey`                          | payload 与时序等价                              |
| `onClick()`                             | noop                               | `@click` / `onClick`                             | Vue 额外提供原生 `MouseEvent` payload           |
| `render`                                | `undefined`                        | 默认 slot                                        | slot 有可渲染内容时替代键帽；空 slot 输出空节点 |
| `className` / `style`                   | `''` / `null`                      | `className`、`class`、`style` 与原生 attrs       | class/style 合并；data/ARIA/role 可透传         |
| `HotKeys.Keys`                          | 固定完整键表                       | 同名静态对象，并导出类型化常量                   | 值与大小写完全一致                              |

ConfigProvider 的 `overrideDefaultProps.HotKeys` 位于显式 prop 与固定默认值之间；布尔
prop 使用原始 VNode prop 存在性区分缺省和显式 `false`。

## 状态机、事件顺序与更新

1. 客户端 mounted 时取得 `getListenerTarget()`，空值回退 `document.body`，注册
   `keydown` 后由固定 Foundation 校验组合。
2. 合法组合必须恰好包含一个普通键；Meta、Shift、Alt、Control 可为零到多个。未知
   键抛出 `${key} is not a valid key`，零个或多个普通键抛出固定组合错误。
3. 每次 keydown 先逐项匹配配置修饰键与 `event.metaKey/shiftKey/altKey/ctrlKey`，并
   要求未配置的修饰键也未按下；普通键按 `event.code` 与固定 `keyToCode` 映射匹配。
4. 命中时先 `preventDefault()`（若启用），再触发 `hotKey`；不阻止冒泡。组件根点击
   只触发 `click`，不影响快捷键状态。
5. `hotKeys`、`preventDefault`、`mergeMetaCtrl` 更新后 Foundation 在下一次事件读取
   最新值；与上游空 `componentDidUpdate` 一致，不因 prop 更新重绑目标。
6. unmount 从实际注册目标移除同一 handler。Vue 记录首次注册目标以保证 getter 返回值
   后续变化时仍能可靠清理；这只修复潜在监听泄漏，不改变已挂载期间的触发目标。

固定 Foundation 虽解构 `mergeMetaCtrl`，但 v2.102.0 没有用它合并 Meta/Control；该
prop 在此基线是可接受的已知 no-op，不擅自实现更新版本语义。

## DOM、class 与样式

- 普通模式根为 `div.semi-hotKeys`；每个键一层无 class 的 `span`，内部
  `span.semi-hotKeys-content`，第二项起在前面增加
  `span.semi-hotKeys-split`，文本固定为 `+`。
- slot 模式保留同一个根与 class，但不创建键帽结构；空 slot 不创建根。
- 固定 SCSS：根 `inline-flex`、居中、`white-space: nowrap`、`user-select: none`；键帽
  高 20px、1px 边框、2px 圆角、2px/4px padding；分隔符左右 margin 3px。
- 颜色只依赖 `--semi-color-fill-0`、`--semi-color-text-2`、
  `--semi-color-text-0`，逐组件入口顺序为默认主题 `index.scss`、`global.scss`、
  `hotKeys/hotKeys.scss`。无专属动效、Portal、图标或插画。
- RTL 不改变 DOM 顺序或 class；浏览器按容器方向渲染文本。暗色通过全局 Token 切换。

## 键盘、焦点、ARIA、国际化、SSR

- 组件本身不可聚焦，不声明 role/tabindex/ARIA，也不劫持焦点；监听范围完全由目标
  决定。调用方可用原生 attrs 增加语义。
- 无内置 Locale 文案。zh-CN/en-US 只验证自定义 `content`/slot 可渲染；全部 Locale
  的完整性由现有共享门禁覆盖。
- 无 Portal、浮层或动效。SSR 只输出静态键帽/slot DOM，不读取 window/document；
  hydration 后才注册监听，卸载必须清理。

## Deviation

- Accepted：React `render` 映射为 Vue 默认 slot，slot 只求值一次；不复制 ReactNode、
  render function 双求值或 React ref 语义。最终 DOM 与可见内容等价。
- Accepted：Vue 将 `hotKeys` 标为必填并在无值时给出固定组合错误，而不是保留上游
  `null.map/forEach` 的偶发 TypeError；合法输入的行为不变。
- Accepted：卸载从实际注册目标清理，避免动态 getter 让上游实现从错误目标移除监听。
- 当前没有视觉 deviation。`mergeMetaCtrl` 的 no-op 是固定 Foundation 本身的行为，
  不是 Vue 侧偏差。

## 验收门禁

- 单元：键帽/content/slot、静态 Keys、class/style/attrs、click、合法/非法组合、严格
  修饰键、大小写/code、preventDefault 顺序、响应式 props、局部目标和卸载清理、
  ConfigProvider 默认值、`mergeMetaCtrl` 固定 no-op。
- SSR/hydration：服务端无 browser global、普通与 slot DOM、hydration 后 body/自定义
  目标监听和清理。
- Chromium：固定 React/Vue 同场景来源；desktop/mobile、light/dark、RTL；逐目标
  computed style、几何、截图和 body/局部目标快捷键行为。
- 发布：根/子路径运行时与声明、静态 Keys、逐组件 CSS、SSR-safe import、真实 tarball
  consumer、许可/SBOM 与 source-boundary 门禁。

## 完成证据

- 当前组件单元与 SSR 共 13 项通过；共享 scenario registry、React 工作台与 Vue 工作台
  定向测试通过，受影响的 UI/Foundation/test-infra/React/Vue 类型检查通过。
- Chromium 当前组件 7 项通过：本地固定源码请求证明、严格组合键/局部目标行为、5 个
  computed-style/几何目标，以及 desktop/mobile light/dark 与 light RTL。快照更新后已
  无更新参数复跑；React/Vue 像素比较通过，未声称 PNG 字节一致。
- 代表性 desktop light/dark、mobile light 与 RTL 快照已人工目视检查，键帽、分隔符、
  自定义 slot、局部目标和主题布局正常。
- 默认主题 HotKeys 入口与产物、SSR dist 子路径、源码边界均通过；真实 tarball consumer
  的根/子路径 ESM、声明、静态 `HotKeys.Keys`、逐组件 CSS、SSR import、许可与 SBOM
  验证通过。
- 本切片只新增 HotKeys 组件级场景、别名、样式入口与快照，没有修改共享比较算法、
  Playwright 配置、webServer、字体/viewport 或全局运行时；因此不触发全仓
  `pnpm test:browser`。仓库 `pnpm check` 全链路通过，工作台 Chromium smoke 2 项通过。
