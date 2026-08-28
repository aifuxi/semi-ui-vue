# BackTop v2.102.0 对齐矩阵

## 基线与选择理由

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 当前路线：最近完成的 Anchor 是固定 `content/order.js` 中首个未阻塞的导航组件；其后紧邻的 BackTop 不依赖尚未实现的 Tree、Pagination、Modal 或 Upload 链路。
- 已就绪依赖：Button 与稳定版 `IconChevronUp` 已完成公开切片；ConfigProvider/主题基础设施已经覆盖 RTL 与 light/dark。

## 组件边界

| 模块            | 单一职责                                                                 | 契约                                 |
| --------------- | ------------------------------------------------------------------------ | ------------------------------------ |
| `BackTop.vue`   | 连接目标滚动容器、Foundation 可见态、节流点击、默认按钮与 Vue attrs/slot | props / `click` emit / default slot  |
| `back-top.js`   | 从私有边界导出固定 BackTop Foundation                                    | declaration facade + bundled runtime |
| `back-top.scss` | 编译 BackTop、Button/IconButton 与 Icon 的逐组件样式                     | `back-top.css`                       |

## 权威源码

- Adapter、公开类型与 DOM：`packages/semi-ui/backtop/index.tsx`、`packages/semi-ui/iconButton/index.tsx`。
- 状态机与动画：`packages/semi-foundation/backtop/{foundation,constants}.ts`、`packages/semi-animation/`。
- 样式与 RTL：`packages/semi-foundation/backtop/{variables,backtop,rtl}.scss`、`packages/semi-foundation/button/{button,iconButton}.scss`。
- 主题 Token：`packages/semi-theme-default/scss/`。
- 文档与测试：`content/navigation/backtop/{index,index-en-US}.md`、`packages/semi-ui/backtop/__test__/backtop.test.js`。

## 公开 API 与 Vue 映射

| React v2.102.0        | 默认值          | Vue 契约                                                               |
| --------------------- | --------------- | ---------------------------------------------------------------------- |
| `target`              | `() => window`  | `() => Window \| HTMLElement \| null \| undefined`，仅客户端挂载后调用 |
| `visibilityHeight`    | `400`           | `number`；仅 `scrollTop > visibilityHeight` 时渲染                     |
| `duration`            | `450`           | `number`；同时驱动固定 Animation 时长和挂载时创建的点击节流窗口        |
| `className` / `style` | 空              | 保留兼容 prop，并合并 Vue `class` / `style`                            |
| `onClick`             | 空              | `click(event)` emit；Foundation 启动回顶动画后同步发出                 |
| `children`            | 默认 IconButton | Vue 默认 slot；缺省时复用 Button + `IconChevronUp` 生成相同 DOM/class  |
| 其余 DOM attrs        | 透传            | `data-*` / `aria-*` 等透传；保留上游根节点 `duration` attribute        |

## 状态、事件与动画顺序

- 初始 `visible=false`；客户端挂载时解析一次 target、注册 `scroll`，并立即经 `requestAnimationFrame` 计算可见态。
- 阈值比较严格使用 `>`：等于阈值隐藏，超过阈值显示；Window 读取 `pageYOffset`，Element 读取 `scrollTop`。
- 点击由 Lodash `throttle` 按挂载时的 `duration` 建立 leading/trailing 节流。Foundation 先从当前滚动值创建 `easeInOutCubic` Animation 到 0，再同步发出 `click`。
- Window 动画帧同时写入 `document.body.scrollTop` 与 `document.documentElement.scrollTop`；Element 写入自身 `scrollTop`。
- 卸载时移除实际 target 的监听、销毁活动 Animation，并取消尚未执行的节流尾调用。

## DOM / class / 样式

- 隐藏时不输出根 DOM；显示时输出 `div.semi-backtop`，保留 `x-semi-prop="children"`、兼容 class/style 与 attrs。
- 默认内容复现 `IconButton theme="light" icon={<IconChevronUp />}`：`button.semi-button.semi-button-with-icon.semi-button-with-icon-only > .semi-button-content > svg`。
- 根样式固定为 `position: fixed; box-sizing: border-box; right: 100px; bottom: 50px; z-index: 10; cursor: pointer; text-align: center; overflow: hidden`。
- `.semi-rtl` / `.semi-portal-rtl` 下将默认定位改为 `right: auto; left: 100px`。组件没有专属颜色 Token；默认按钮颜色随 light/dark 主题变化。

## 键盘、焦点、ARIA、国际化

- 上游根节点是无 role/tabindex 的 `div`，没有键盘触发逻辑；本切片不擅自增加与固定 DOM 不一致的按钮语义。默认子 Button 可聚焦，但其点击会冒泡到根并触发相同回顶流程。
- 调用方传入的 `aria-*`、`role`、`tabindex` 可透传到根节点；公开文档明确说明需要完整自定义语义时应通过 attrs/slot 提供。
- 组件无内置可见文案与 Locale 数据；zh-CN/en-US 使用相同行为与结构。RTL 只影响固定定位。

## SSR

- SSR 保持初始隐藏，只输出 Vue comment boundary；不调用 target，不读取 window/document/requestAnimationFrame，也不创建 Animation。
- 根入口与 `back-top` 子路径必须 SSR-safe import，产物不得泄漏 `vendor/**`、`@workspace/foundation-integration` 或 `@douyinfe/*` 运行时路径。

## 验收门禁

- 单元：默认值/默认 IconButton、class/style/attrs、自定义 slot、阈值严格比较、Element/Window 目标、点击/节流/动画、空 target、监听与动画清理。
- SSR：根与子路径导入、隐藏静态输出、target 不调用、无浏览器全局访问。
- Chromium：同 BrowserContext 的本地 React/Vue 来源、初始隐藏/滚动显示/点击回顶、computed style、bounding rect、desktop/mobile light/dark 与 RTL 裁剪截图。
- 发布：根与 `back-top` 子路径、类型、`back-top.css`、tree-shaking、SSR-safe import、Animation/bezier-easing 合规与真实 tarball 安装验证。

## Deviation

- React `children` 映射为 Vue 默认 slot；缺省内容由已对齐 Button/Icon 组合还原 IconButton DOM，不引入 React element/cloneElement 语义。公开可实现能力与 DOM 插入点不变。
- 上游卸载只销毁 Foundation；Vue 适配额外取消 Lodash throttle 的 trailing callback，避免组件卸载后仍触发公开 `click`。这只影响已经不可见、不可交互的卸载实例，结论为安全清理修复。

## 验收结果

- 固定基线核验通过：`vendor/semi-design` 为 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- `pnpm check` 通过：源码边界扫描覆盖 846 个运行时文件；42 个 Vitest 文件、326 项单元/SSR 测试通过；workspace 构建、主题逐组件产物、SSR import 与真实 tarball 安装验证通过。
- `pnpm test:browser` 通过：单一 Chromium worker 下 175 项行为、样式、几何、无障碍与视觉回归全部通过。
- BackTop 的 desktop/mobile light/dark 与 desktop light RTL 共五组 React/Vue 裁剪 PNG 逐字节一致；未使用截图 mask。
- 已记录并验收两项 Vue 适配差异，无未解释差异；BackTop 状态由 `pending` 更新为 `ready`。
