# Badge v2.102.0 对齐矩阵

## 路线与固定证据

- 当前路线：最近完成 Avatar；Badge 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 固定基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter、公开类型与 DOM：`packages/semi-ui/badge/index.tsx`。
- 常量、样式与 RTL：`packages/semi-foundation/badge/constants.ts`、`variables.scss`、`badge.scss`、`rtl.scss`。
- 默认主题与 Token：`packages/semi-theme-default/scss/index.scss`、`global.scss`、`variables.scss`。
- 文档与行为证据：`content/show/badge/index.md`、`index-en-US.md`、`packages/semi-ui/badge/__test__/badge.test.js`。
- Badge 只依赖已经完成的 ConfigProvider 与 Avatar；没有 Foundation 状态机、Portal、Observer 或后续组件依赖，可以独立形成可发布切片。

## Vue 组件边界

| 模块                   | 单一职责                                             | 公开边界                                          |
| ---------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| `Badge.vue`            | 渲染基底、点状/计数/自定义徽标并根据方向计算缺省位置 | props、emits、`default`/`count` slots、原生 attrs |
| `BadgeNodeRenderer.ts` | 在模板中原样承载 `VNodeChild`                        | Badge 内部                                        |
| `types.ts`             | 定义 Badge 的公开联合类型、props、emits 与 slots     | 根入口与 `badge` 子路径导出                       |

Badge 没有可复用状态或副作用，不新增 composable；固定源码也没有 JavaScript Foundation，因此不制造空的 Foundation facade。

## API、默认值与 Vue 映射

| Semi React v2.102.0             | 默认值                        | Vue 契约                                                             | 对齐门禁                                                                   |
| ------------------------------- | ----------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `children`                      | 无                            | 默认 slot                                                            | 有/无基底时的 position 与 `semi-badge-block`                               |
| `count`                         | 无                            | `VNodeChild` prop；另提供 `#count` slot                              | number/string/0/空串/null/undefined/自定义 VNode                           |
| `dot`                           | `false`                       | Boolean                                                              | 与 count 互斥，dot 优先且内部无内容                                        |
| `type`                          | `primary`                     | 六种固定联合类型                                                     | primary/secondary/tertiary/danger/warning/success class 与颜色             |
| `theme`                         | `solid`                       | `solid \| light \| inverted`                                         | 背景/文字颜色与自定义节点不附加主题 class                                  |
| `position`                      | LTR `rightTop`；RTL `leftTop` | 四种固定联合类型                                                     | 四角定位、ConfigProvider 方向缺省、独立使用不带位置 class                  |
| `overflowCount`                 | 无                            | number                                                               | 仅数字且 truthy 上限小于 count 时渲染 `${overflowCount}+`；保留 0/负数边界 |
| `className`                     | `''`                          | 同名兼容 prop；同时接收 Vue `class`                                  | 只作用于外层 `.semi-badge`                                                 |
| `style`                         | 无                            | 同名兼容 prop                                                        | 按固定 Adapter 作用于内部 count，并以 `style \|\| countStyle` 优先         |
| `countClassName` / `countStyle` | 无                            | 同名 props                                                           | 只作用于内部徽标；custom/count/dot 都验证                                  |
| mouse/click callbacks           | noop                          | `click`、`mouseenter`、`mouseleave` emits；兼容 `onClick` 等监听写法 | 原生事件对象、一次触发、attrs 不误落内部节点                               |

## 状态、DOM 与事件

- 根始终为 `span.semi-badge`，默认 slot 先渲染；内部始终存在 `span[x-semi-prop=count]`。
- 有基底时内部徽标附加 position class；无基底时附加 `semi-badge-block` 且不附加 position class。
- `count !== null && count !== undefined` 才进入普通计数 class；数字 0 和空字符串仍显示计数样式。
- truthy 且非 number/string 的 count 是 custom：只带 `countClassName semi-badge-custom`，不带 type/theme/count/dot 以外的普通计数 class；`dot` 仍按固定源码优先附加。
- 数字 count 仅在 `overflowCount && overflowCount < count` 时截断；相等值不截断，`overflowCount=0` 不截断。
- click/mouseenter/mouseleave 发生在外层根节点；回调收到原生 DOM 事件。组件不建立受控/非受控状态，也没有事件重排。

## 样式、主题、RTL、国际化与动效

- 逐组件样式直接编译固定 `semi-foundation/badge/badge.scss`；根主题已包含同一文件，发布 CSS 不包含 vendor 路径。
- 数字徽标固定 18px 高、最小 18px、左右 4px padding；dot 固定 8px；四角用 `translate(±50%, ±50%)`。
- light/dark 由全局 `--semi-*` Token 驱动；默认视觉矩阵覆盖 desktop `1440×900`、mobile `390×844`、light/dark。
- RTL 由 ConfigProvider 提供 direction 并由 `.semi-rtl` 设置文本方向；未显式 position 时从 `rightTop` 切换为 `leftTop`。增加 RTL 行为和截图门禁。
- Badge 无 Locale 文案、键盘交互、焦点管理、Portal 或动效；57 Locale 数据不适用。

## 无障碍、SSR 与发布

- 固定 Adapter 不增加 role 或 aria；Vue 保留该 DOM，同时把用户提供的 `aria-*`/`data-*`/title 等 attrs 转发到根，语义由基底内容或调用方提供。
- SSR import/render 不访问 DOM 或浏览器全局；ConfigProvider 注入在 SSR 中可直接解析。
- 根与 `@aifuxi/semi-ui-vue/badge` 子路径导出 Badge 和全部公开类型；真实 tarball 验证 ESM、声明、根/`badge.css`、tree-shaking、SSR-safe import、许可证与 SPDX SBOM。
- Badge 无 JavaScript Foundation；样式仍只从固定 submodule 编译，公开运行时和声明不得泄漏 `vendor/**` 或私有 workspace 路径。

## React → Vue deviation

- Accepted：React `children` 映射为 Vue 默认 slot；ReactNode `count` 同时保留 `VNodeChild` prop并提供 `#count` slot。节点结构和 class 判定不变。
- Accepted：React SyntheticEvent 映射为 Vue 原生 `MouseEvent`；事件落点与调用顺序不变。

除上述框架原生映射外，没有 accepted deviation 或未解释差异。

## 验收门禁

- 单元/SSR：默认值、六 type、三 theme、四 position、LTR/RTL 缺省、独立使用、number/string/0/空串/null/undefined/custom、dot 优先、overflow 边界、class/style 优先级、attrs、三类鼠标事件、slot 与 SSR。
- Chromium：同 BrowserContext 校验本地 React 源码请求、无运行时错误、computed style、bounding rect、事件、desktop/mobile light/dark/RTL 与成对局部截图。
- 发布：完整 `pnpm check:full`，主题根/逐组件入口与真实 tarball 安装验证。

## 验收结论

- 状态：`ready`（2026-08-28）。
- `pnpm check:full` 通过：56 个 Vitest 文件、430 个测试，以及 224 个 Chromium 测试全部通过；Badge 专属 Chromium 门禁 7/7 通过。
- desktop/mobile 的 light/dark 与 light RTL 共 5 组 React/Vue 局部截图均满足严格阈值，成对文件逐字节一致。
- 默认主题、逐组件 `badge.css`、源码/构建产物 SSR import、真实 tarball 安装、ESM、类型、样式入口、许可证与 SPDX SBOM 验证全部通过。
