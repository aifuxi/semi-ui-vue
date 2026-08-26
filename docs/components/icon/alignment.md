# Icon v2.102.0 对齐矩阵

## 固定证据

- Semi UI 转发入口：`vendor/semi-design/packages/semi-ui/icons/index.tsx`
- 稳定图标基类：`vendor/semi-design/packages/semi-icons/src/components/Icon.tsx`
- 稳定图标入口与 523 个组件：`vendor/semi-design/packages/semi-icons/src/index.ts`、`src/icons/`
- Lab 图标基类、入口与 84 个组件：`vendor/semi-design/packages/semi-icons-lab/src/components/Icon.tsx`、`src/icons/`
- 样式：`vendor/semi-design/packages/semi-icons/src/styles/icons.scss`、`variables.scss`
- 中英文文档：`vendor/semi-design/content/basic/icon/index.md`、`index-en-US.md`
- AI fill 工具：`vendor/semi-design/packages/semi-icons/src/utils.ts`

## 组件边界

| 边界                                    | 单一职责                                                    | 状态与副作用                          |
| --------------------------------------- | ----------------------------------------------------------- | ------------------------------------- |
| `packages/icons/src/components/Icon.ts` | 稳定 Icon 根 span、公开 props、attrs、slot 与 `convertIcon` | 仅保存根 DOM 引用；无全局监听         |
| `packages/icons/src/icons/*.ts`         | 输出固定 SVG VNode                                          | 多色渐变每次渲染生成与上游相同的短 id |
| `packages/icons-lab/src/`               | 独立发布 Lab 基类与 84 个彩色 SVG                           | 无共享状态                            |
| `scripts/generate-icons.mjs`            | 从只读 TSX 机械生成 Vue render 文件并检查漂移               | 构建期读取 vendor，不进入发布产物     |
| `packages/ui/src/icon/index.ts`         | 提供主 UI 包的 `Icon` 转发入口                              | 无运行时逻辑                          |

生成管线保留 TSX 中已经确定的 path、mask、clipPath、gradient、固定颜色、`currentColor`、fill 顺序和 SVG attrs，不复制 React 生命周期或 JSX 运行时。生成文件不可手改；`pnpm check:icons` 会逐字检查 523 + 84 个输出。

## 公开 API 与 React→Vue 映射

| React v2.102.0                   | 默认值    | Vue 3.5                                                                     | 结论         |
| -------------------------------- | --------- | --------------------------------------------------------------------------- | ------------ |
| `size`                           | `default` | 同名 prop：`inherit / extra-small / small / default / large / extra-large`  | 保留         |
| `spin`                           | `false`   | 同名 boolean prop                                                           | 保留         |
| `rotate`                         | -         | 同名 number prop；只接受 safe integer 后生成 transform                      | 保留         |
| `prefixCls`                      | `semi`    | 同名 prop                                                                   | 保留         |
| `type`                           | -         | 同名 prop；生成 aria-label 与类型 class                                     | 保留         |
| `fill`                           | -         | `string \| string[]`；稳定 AI 图标支持双色/四色覆盖                         | 保留         |
| `svg: ReactNode`                 | -         | `#default` slot；也保留 `svg` VNode prop 作为程序化入口                     | Vue 原生映射 |
| `className / style / HTML attrs` | -         | 原生 `class / style / attrs`，消费方值后合并并可覆盖 role、label、transform | Vue 原生映射 |
| React `ref<HTMLSpanElement>`     | -         | 组件 ref 暴露只读 `element` computed ref                                    | Vue 原生映射 |
| `convertIcon(Svg, type)`         | -         | 同名生成器，接收返回 SVG VNode 的 renderer                                  | 保留用途     |

`@workspace/icons` 根运行时导出与固定稳定包一致：default Icon、`convertIcon` 和 523 个命名图标；`@workspace/icons-lab` 根导出 default Icon 和 84 个命名图标。主 UI 包根入口与 `@workspace/ui/icon` 都转发稳定 Icon 基类。

## DOM、class 与样式

- 根节点固定为 `span[role=img].semi-icon`，内置图标增加 `.semi-icon-{type}`。
- 除 `inherit` 外，size 分别增加 `.semi-icon-extra-small/small/default/large/extra-large`；计算字号为 8/12/16/20/24px。
- `spin` 增加 `.semi-icon-spinning`，使用固定 `.6s linear infinite` 动画；显式 style 的 transform 覆盖 `rotate` 派生值。
- SVG 固定为 `width/height=1em`、`focusable=false`、`aria-hidden=true`，具体 viewBox 与子节点来自固定生成源。
- 单色图标通过 `currentColor` 继承颜色；AI 双色与四色图标遵循固定 fill 补齐、截断和四色反转规则；Lab 图标保留固定颜色，不提供 fill prop。
- `icon.css` 按 theme index → global → animation → icon styles 顺序编译；根主题也包含相同 icon styles。

## 行为、可访问性与运行环境

- Icon 本身不可聚焦，不创建点击或键盘事件；原生 listener 作为 attrs 落在根 span。
- 内置图标默认以 `type` 作为 `aria-label`；业务图标应传入本地化 `aria-label`，纯装饰图标可显式覆盖为 `role=presentation` 与 `aria-hidden=true`。
- SVG 自身 `aria-hidden=true`，避免根 span 与内部图形重复暴露。
- light/dark 只通过当前颜色与 Token 影响单色/AI 图标；Lab 固定颜色不随主题改变。
- 没有 Portal、国际化数据、Observer 或客户端全局访问；基类、全部生成图标与 Lab 图标均可 SSR import/render。
- 渐变图标沿用固定源码的短随机 id；同次渲染的多个实例互不引用同一渐变。该行为与 React 基线一致，不作为 hydration 场景使用。

## 完成证据

| 维度       | 门禁                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------- |
| 生成完整性 | 固定入口名称、523 稳定组件、84 Lab 组件与生成文件逐字漂移检查                             |
| 单元/SSR   | props、attrs 覆盖、slot、双色/四色 fill、渐变 id、全部 607 图标可渲染、代表图标 hydration |
| Chromium   | 尺寸、旋转、spin、继承色、多色、Lab、ARIA、计算样式与几何                                 |
| 视觉       | desktop/mobile × light/dark；组件局部截图，阈值 0.1 / 0.001                               |
| 发布       | icons/icons-lab/UI 根与子路径、types、`icon.css`、SSR import、真实 tarball 安装           |

当前没有 accepted deviation。
