# Icon 文档批次验收

基线：Semi Design v2.102.0，cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

## 源码与边界

先核对 semi-ui/icons 转发、semi-icons/src/components/Icon.tsx、styles/icons.scss 与 variables.scss，再核对默认主题 variables.scss、中英文 basic/icon 文档和生成图标。Icon 无独立 Foundation。

每个 Demo SFC 只呈现对应上游示例；CustomSvg 子组件只输出固定文档 SVG，经默认 slot 交给 Icon。无新增组件公共 API、依赖、全局样式或生产行为。

## 对齐矩阵

| 索引 | 示例          | 公开契约与验收                                                                                        |
| ---- | ------------- | ----------------------------------------------------------------------------------------------------- |
| 1    | Basic         | 默认 16px、role=img、aria-label=home、内部 SVG aria-hidden                                            |
| 2    | RotateSpin    | small 12px、rotate=180；spin 的 .6s linear infinite 动画在 0/150/300ms 样式及截图对照                 |
| 3    | Sizes         | 7 种图标 × 5 种尺寸，8/12/16/20/24px，保持每行 margin-bottom=4px                                      |
| 4    | Colors        | 容器继承色与显式 style color，24px                                                                    |
| 5    | Bicolor       | fill 数组与字符串、Token 颜色、10px 间距                                                              |
| 6    | Multicolor    | 缺省四色、完整四色、双色补齐；比较实际 path/stop 计算颜色                                             |
| 7    | Custom        | 默认 slot 替代 svg ReactNode；保持 SVG path/mask 与 180 度旋转；中英文分别保留 maskType/masktype 写法 |
| 8    | Accessibility | aria-label 覆盖为 back to homepage；内置 SVG 隐藏于辅助技术                                           |

全部覆盖 zh-CN/en-US × light/dark、1440×900 DPR1。RotateSpin/Colors/Multicolor/Custom 额外 RTL，对照方向下的图标顺序、marginRight 和旋转。Icon 无内置受控状态、事件序列、Portal、焦点、国际化数据或响应式断点；文档无额外交互控件，校验源码展示、在线编辑首帧与退出清理，Icon 默认不进入 Tab 序列。站点 SSR 随 Nuxt 全量预渲染验证，Demo 为 ClientOnly，不将站点预渲染当作 Icon SSR render 证据；本批检查客户端挂载与运行错误，组件既有 SSR 门禁独立保留。

同一 Chromium context 打开固定 React 源码和 Nuxt 双页，统一字体、文档高度/滚动偏移/视口坐标与动画时刻。逐节点关键样式精确相等，几何各轴 <=0.5 CSS px；每个图标单独截图，不以空白容器稀释差异，threshold=0.1、maxDiffPixelRatio=0.001，不使用 mask。默认截图附件记录完整图标集合裁剪，逐图标证据另附。

## 迁移与归属

className → class；React 事件 prop → Vue 原生事件；svg → 默认 slot（保留程序化 VNode prop）；React cloneElement → component + v-for。固定文档自定义 SVG 由 Semi Design MIT 授权，来源与哈希纳入站点 licenses。无 accepted deviation；测试通过前不声明验收完成。

上游中文 Custom 的 maskType 在 React 16 开发模式产生一条已知 DOM 属性警告。保留原始源码；测试要求该警告仅在中文 React Custom 发生且恰好一条，并附原文。Vue 页及其他参考用例不允许控制台错误。这是固定参考源码的开发警告，不是视觉差异豁免。
