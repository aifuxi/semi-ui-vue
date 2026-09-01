# `_utils` v2.102.0 对齐矩阵

## 基线与范围

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，commit
  `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 上游根入口只公开 `semiGlobal`，但发布清单还公开 `_utils/index`、
  `hooks/usePrevFocus`、`reactRender` 和 `semi-global` 深层入口；本切片逐项提供 Vue 映射。
- 固定基线没有 `_utils` 文档、Foundation 状态机、SCSS、Story 或测试资产。

## Vue 边界与职责

| 文件                       | 单一职责                                                   | 公开边界                       |
| -------------------------- | ---------------------------------------------------------- | ------------------------------ |
| `_utils/index.ts`          | 纯事件、复制、媒体查询、焦点、tick、滚动条和全局默认值工具 | `./_utils`                     |
| `_utils/use-prev-focus.ts` | 保存/更新前一焦点，并在替换或卸载时 blur                   | `./_utils/use-prev-focus`      |
| `_utils/vue-render.ts`     | Vue `render/unmount`、DOM 与 VNode ref 解析                | `./_utils/vue-render`          |
| `_utils/semi-global.ts`    | 重导出 ConfigProvider 使用的唯一 `semiGlobal` 单例         | 根入口、`./_utils/semi-global` |

纯函数保持普通 utility，不包装成 composable；只有依赖组件生命周期的焦点能力使用
`usePrevFocus`。全局默认值代理每次读取 singleton，配置更新无需重建代理。

## API 与行为矩阵

| React v2.102.0                                 | Vue 映射                                     | 关键行为                                       |
| ---------------------------------------------- | -------------------------------------------- | ---------------------------------------------- |
| `stopPropagation`                              | 同名原生/包装事件工具                        | `noImmediate` 只跳过 immediate stop            |
| `cloneDeep`                                    | 保留函数、Vue VNode、Error 身份              | 其余数据深拷贝；customizer 优先                |
| `registerMediaQuery`                           | 同名                                         | 初始回调、match/unmatch、现代与 legacy 清理    |
| `isSemiIcon`                                   | 检查 Vue VNode `type.elementType === 'Icon'` | 与本仓库图标工厂契约一致                       |
| `getActiveElement`                             | 同名                                         | SSR 返回 `null`                                |
| `isNodeContainsFocus` / `getFocusableElements` | 同名                                         | 选择器集合与固定基线一致，不额外过滤不可见节点 |
| `runAfterTicks`                                | 同名                                         | 非正数立即执行，正数逐个 macrotask 执行        |
| `getScrollbarWidth`                            | 同名                                         | 非浏览器为 `0`                                 |
| `getDefaultPropsFromGlobalConfig`              | 同名泛型 Proxy                               | global 显式键覆盖局部默认值，枚举键合并        |
| `usePrevFocus`                                 | `[readonly shallowRef, setter]`              | 替换时 blur 旧元素，卸载时 blur 当前元素       |
| ReactDOM `render/unmount`                      | Vue `render/unmount`                         | 同一容器命令式挂载/清理                        |
| `resolveDOM/getRef`                            | Vue 实例 `$el` / VNode `ref`                 | SSR 安全，非 Element 返回 `null`               |

## DOM、主题、可访问性与视觉

- 工具不自行生成 UI；焦点选择器属于行为契约，命令式 render 只渲染调用方提供的 VNode。
- 没有专属 class、Token、light/dark、RTL、Locale、viewport 或动画时刻，因此不建立
  React/Vue 截图。真实浏览器相关能力由单元 DOM 测试和已有使用方组件 Chromium 回归覆盖。
- 不引入新样式；默认主题根入口已经包含固定 base/global/animation 顺序。

## SSR、发布与框架映射

- 所有 DOM 访问均在调用时守卫；根和四个子路径可在 Node SSR 直接 import。
- `semiGlobal` 与 `config-provider` 导出必须引用同一对象，避免多入口配置分裂。
- 真实 tarball 验证子路径 ESM、声明、单例身份、类型调用、无 React/vendor/private 引用、
  许可证和 SBOM。
- 框架映射（不作为 behavior deviation）：`reactRender` 改名为 `vue-render` 并使用 Vue
  VNode/组件实例；
  `usePrevFocus` 返回 Vue readonly ref 与 setter，而非 React state tuple。其余公开行为保持等价。

## 验收门禁

- 单元：全部纯工具、modern/legacy media query、焦点查询与清理、命令式 render/unmount、
  DOM/ref 解析、global Proxy 动态覆盖与 singleton identity。
- SSR：移除 browser globals 后安全调用 `getActiveElement/getScrollbarWidth/resolveDOM`，全部入口可导入。
- 发布：根/子路径运行时和类型 consumer、tree-shaking、真实安装、许可证/SBOM。

## 完成证据

- `_base` / `_utils` 定向共 4 个测试文件、16 项行为与 SSR 测试通过；覆盖事件、复制、
  modern/legacy media query、焦点、tick、global Proxy、composable 清理和命令式 render。
- 全仓 `pnpm check` 通过：163 个测试文件、1116 项测试，以及格式、lint、类型、构建、
  主题、SSR dist 和真实 tarball 全链路均通过。
- 根入口与 `_utils` 的四个公开子路径通过 Node SSR import；tarball consumer 同时验证
  `semiGlobal` 在根、ConfigProvider、`/_utils` 与 `/_utils/semi-global` 间对象同一。
- React/Vue 工作台 Chromium smoke 2/2 通过。工具本身没有独立 DOM 或视觉样式，
  screenshot/computed-style/几何比较不适用，未更新基线，也未运行全仓组件浏览器回归。
- 除已记录的 ReactDOM/state tuple Vue 映射外没有未解释或 accepted behavior deviation，
  切片标记为 `ready`。
