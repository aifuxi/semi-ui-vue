# Navigation v2.102.0 对齐矩阵

## 路线与固定证据

- 当前路线：Upload 已完成后，`vendor/semi-design/content/order.js` 的下一项是 Navigation。
- 依赖状态：Navigation 公开依赖的 Dropdown、Collapsible、Tooltip、Button、Icon 与 ConfigProvider 均已进入 `ready`，此前记录的依赖阻塞已经解除。
- 唯一基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- React Adapter：`packages/semi-ui/navigation/{index,Item,SubNav,Header,Footer,CollapseButton,nav-context}.tsx`。
- Foundation：`packages/semi-foundation/navigation/{foundation,itemFoundation,subNavFoundation,constants,NavItem}.ts`。
- 主题：`packages/semi-foundation/navigation/{navigation,variables,mixin,animation,rtl}.scss` 与默认主题全局 Token。
- 文档与行为证据：`content/navigation/navigation/{index,index-en-US}.md`、`packages/semi-ui/navigation/__test__/navigation.test.js`、`cypress/e2e/navigation.spec.js` 及 `_story/`。

## Vue 组件边界

| 组件                 | 单一职责                                                       | 公开通信                                                                         |
| -------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `Navigation` / `Nav` | 归一化 `items`/默认 slot，管理收起、展开、选择状态并提供上下文 | props、`update:selectedKeys`、`update:openKeys`、`update:isCollapsed` 与公开事件 |
| `NavItem`            | 叶节点 DOM、链接、选择、Tooltip、键盘和局部事件                | 注入 Navigation 上下文，向父级报告选择/点击                                      |
| `SubNav`             | 子导航标题、展开/收起、Collapsible 与 Dropdown Portal          | 注入/派生上下文，向父级报告展开与点击                                            |
| `NavHeader`          | logo、标题、链接与收起态头部 DOM                               | 只读取收起态上下文                                                               |
| `NavFooter`          | footer 内容与内置收起按钮                                      | 只读取模式/收起态并请求切换                                                      |
| `CollapseButton`     | 本地化收起/展开按钮和收起态 Tooltip                            | props/emits                                                                      |

## 公开 API 与 Vue 映射

| React v2.102.0                         | 默认值                | Vue 契约                                                                        |
| -------------------------------------- | --------------------- | ------------------------------------------------------------------------------- |
| `items`                                | -                     | 保留；字符串递归归一化为同名 `itemKey`/`text`，对象输入不被修改                 |
| `children`                             | -                     | 默认 slot；支持 `NavHeader`、`NavItem`、`SubNav`、`NavFooter` 和自定义节点      |
| `selectedKeys` / `defaultSelectedKeys` | `[]`                  | 保留，并提供 `v-model:selectedKeys` / `update:selectedKeys`                     |
| `openKeys` / `defaultOpenKeys`         | `[]`                  | 保留，并提供 `v-model:openKeys` / `update:openKeys`                             |
| `isCollapsed` / `defaultIsCollapsed`   | `false`               | 保留，并提供 `v-model:isCollapsed` / `update:isCollapsed`                       |
| `mode`                                 | `vertical`            | `'vertical'                                                                     | 'horizontal'` |
| `limitIndent`                          | `true`                | 保留缺省/显式 false/显式 true 语义                                              |
| `subNavMotion`                         | `true`                | 保留缺省/显式 false/显式 true 语义                                              |
| `toggleIconPosition`                   | `right`               | `'left'                                                                         | 'right'`      |
| `header` / `footer`                    | -                     | 配置对象或 VNode；另提供 `#header` / `#footer`                                  |
| `renderWrapper`                        | -                     | 回调保留；另提供 `#item-wrapper="{ itemElement, isSubNav, isInSubNav, props }"` |
| `getPopupContainer`                    | -                     | 显式 prop 优先，其次 ConfigProvider；传递给折叠/水平 SubNav 的 Dropdown         |
| `onSelect`                             | noop                  | `select`；先于 Navigation `click` 与 NavItem `click`                            |
| `onOpenChange`                         | noop                  | `openChange`；先于 SubNav 触发的 Navigation `click`                             |
| `onCollapseChange`                     | noop                  | `collapseChange` 与 `update:isCollapsed`                                        |
| `multiple` / `onDeselect`              | 未接入固定 Foundation | 类型兼容保留，不发明固定源码不存在的多选/反选行为                               |
| React Node/render prop                 | -                     | VNode/function prop 与命名 slot；不暴露 React `children`/ref 语义               |

## 状态、事件与数据

- 叶节点第一次被选中：非受控模式更新内部 selection；随后顺序为 `select` → Navigation `click` → NavItem `click`。再次点击已选节点不再触发 `select`，仍触发两个 click。
- `select` payload 的 `selectedKeys` 仅含叶节点 key；内部高亮还加入该叶节点的零级父 SubNav key，与固定 Foundation 一致。
- SubNav 标题点击：计算下一 `openKeys`，非受控时更新内部状态；顺序为 `openChange` → Navigation `click`。
- Dropdown 显隐：按受控/非受控规则更新/通知 `openKeys`。固定 Foundation 的 key 有效性判断沿用 truthiness，因此 `0` 不能作为可交互 key；Vue 不擅自修正该基线行为。
- `items`/slot 变化时重建父级 key 映射；调用方的数组、对象与 VNode 不被修改。
- 受控 selected/open/collapsed 只发事件和 `update:*`，视图等待父级回写；非受控状态由组件持有。

## DOM、class 与视觉

- 根：`.semi-navigation`，模式 class 为 `.semi-navigation-vertical` / `.semi-navigation-horizontal`，收起态增加 `.semi-navigation-collapsed`。
- 固定结构：`root > .semi-navigation-inner > (.semi-navigation-header-list-outer + footer)`；列表为 `ul.semi-navigation-list[role=menu]`。
- 叶节点保持 `.semi-navigation-item(.semi-navigation-item-normal)`、selected/disabled/collapsed/has-link 状态 class、icon/text DOM 与链接内移 padding 结构。
- SubNav 保持 `.semi-navigation-sub-wrap`、`.semi-navigation-sub-title`、`.semi-navigation-sub`、open/popover 状态 class；垂直展开使用 Collapsible，水平或收起态使用 Dropdown。
- Header/Footer/CollapseButton 保持固定 `.semi-navigation-*` class；水平模式不渲染内置 collapse button。
- 主题直接编译固定 Navigation SCSS，并同时包含 Button、Tooltip、Dropdown、Collapsible、Portal 与 Icon 的公开依赖样式；覆盖 light/dark、桌面/移动和 RTL。

## 键盘、焦点与 ARIA

- 列表为 `role="menu"` 且 `aria-orientation` 等于 mode；叶节点为可聚焦 `role="menuitem"`，SubNav 标题为可聚焦 `role="menuitem"`。
- Enter 等价于点击；disabled 叶节点/SubNav 不选择、不展开、不通知事件。
- `aria-disabled`、`aria-expanded`、link `tabindex=-1` 与 Dropdown 的 Escape/焦点返回沿用固定 Adapter 和已 ready 的 Dropdown/Tooltip 语义。
- 嵌套 Dropdown 的完整方向键能力受固定 v2.102.0 限制；不额外发明与 React 不同的 roving tabindex。

## Portal、动效、主题、RTL、国际化与 SSR

- `getPopupContainer` 的稳定容器必须在首次显示时就是 Portal 父节点；不为上游未承诺的迟到容器增加 Observer/轮询。
- Element/Document capture-scroll 定位与卸载清理由既有 Tooltip/Dropdown 公共实现负责，Navigation 增加真实透传与卸载后无残留验证。
- `subNavMotion=false` 直接切换子列表；为 true 时使用 Collapsible 的终态和固定 200ms 图标旋转 class，不比较不同时刻的动画帧。
- `ConfigProvider.direction=rtl` 同时驱动根 `.semi-rtl` 与 Dropdown Portal RTL；截图覆盖 desktop/mobile light/dark/RTL。
- Navigation locale 使用 `Navigation.collapseText` / `expandText`；缺省 zh-CN，`code=en-US` 回退英文，显式 provider locale 优先。
- 所有 import 均 SSR-safe；首次 SSR 输出稳定的垂直/水平、header/footer、选中与展开 DOM，Portal/全局监听只在客户端创建并清理。

## 编码前适配门禁

- `limitIndent`、`subNavMotion`：缺省、显式 false、显式 true 三组；不得用普通 truthiness 覆盖显式值。
- 读取 `NavFooter collapse-button` 等子 VNode 布尔值时，同时覆盖真实 SFC 模板裸属性、`:collapse-button="false"` 与 `h()` 的 true/false。
- 默认 slot 展开 Fragment，过滤 Comment/空白，且只把真正的 NavHeader/NavFooter 移到结构区；自定义节点保留在列表中。
- 自定义 Portal 容器在打开前稳定存在，首次浮层父节点即正确；关闭/卸载后无 Portal、timer 或全局监听残留。

## Deviation

- 无已接受的视觉或行为 deviation。
- `itemKey=0` 的 truthiness 限制来自固定 v2.102.0 Foundation，属于逐字对齐的上游限制而非 Vue deviation；迁移文档要求使用非空字符串或非零数字 key。
- 固定源码虽然声明 `multiple`、`onDeselect` 与 SubNav `isOpen`，但 v2.102.0 Foundation/Adapter 没有把它们接成独立公开行为；Vue 仅保持类型迁移入口，不据此宣称额外能力。

## 完成门禁

- Vue 源码、Foundation facade、根/子路径导出、Navigation 独立 CSS。
- 中英文文档、React→Vue 迁移、React/Vue 同数据场景。
- 单元/SSR/类型、键盘/ARIA、Portal/locale/RTL、桌面/移动 light/dark 浏览器对照。
- 关键 computed style 精确相等、几何误差不超过 `0.5 CSS px`；阈值截图通过后再直接比较成对 PNG。
- 真实 tarball 安装、根/子路径 ESM、声明、样式、tree-shaking、SSR import、许可与 SBOM 验证。
