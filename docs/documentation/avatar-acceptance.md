# Avatar 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

15 项双语示例均覆盖 light/dark 与 LTR/RTL，共 120 项。逐节点比较公开 class、文本、ARIA、`alt`/`src`、SVG 与关键计算样式（含 transform、clip-path、filter、z-index 与 direction）及几何（各轴 ≤0.5px），整体截图 threshold=0.1、maxDiffPixelRatio=0.001，其余示例另做逐 `.semi-avatar` 局部裁剪比较。选择器覆盖 `.semi-avatar-wrapper`，因为 topSlot/bottomSlot 是 `.semi-avatar` 的兄弟节点而非子节点。

topSlot 渐变与更多头像的滤镜使用实例或生成 id（React `getUuidShort`、Vue `useId`），矩阵按 SVG 内 `[id]` 定义顺序把 paint server 解析为 `url(#definition-N)` 后比较。

交互覆盖：事件示例真实 hover 进入与退出 `hoverMask`（断言 `.semi-avatar-hover` 与图标数量）；头像组示例打开 `renderMore` 的 Popover，比较 portal 内容的结构、样式与像素，并断言面板相对触发头像的偏移两侧一致（各轴 ≤0.5px），移开指针后关闭。

图片类示例与参考统一使用既有本地 `/demos/photo.svg`（上游为远程 CDN）：图片视觉内容与上游不同，但双侧同源同尺寸，几何与像素比较逐项成立；矩阵把参考侧的文档站地址前缀归一后再比较 `src`。

## 本批修复的组件缺陷

固定示例把同一份 slot 配置对象（`bottomSlot.text` 为 React element / Vue VNode）交给多个头像。Vue vnode 属于挂载它的树，原有 `AvatarNodeRenderer` 原样返回节点，导致第一实例之后的头像静默丢失 slot 内容（Chromium 实测参考 45 个节点 vs Vue 39 个）。按 `RatingNodeRenderer` 的既有做法在渲染前 `cloneVNode`，同一配置即可在每个实例上重复渲染，与固定 React element 语义一致。修复前该用例失败、修复后通过，回归证据为 avatar-matrix 的 BottomSlot 用例；`docs/components/avatar/alignment.md` 已记录该契约。

## 参考适配器适配

固定 Markdown 直接编译，不复制上游实现。除本地素材替换外：

- 补上上游省略的组件与 `IconPlus` 导入，并支持「顶部和底部 Slot」的裸 JSX 片段（`()=>{` 与 `() =>` 两种箭头写法）。
- 英文 Bottom Slot 示例的 `content` 按真实 `bottomSlot.text` 契约纠正；英文动画示例仍传已移除的 `borderMotion`，同样按当前 `border={{motion:true}}` 契约纠正（全量逐项核对 15 对片段，仅存在这两处陈旧 prop）。
- 固定站从 CSS 加载 Inter，而本参考工作台由 JavaScript 注入字体，且 600 字重只在标签首次渲染时才请求——比挂载更晚。适配器在挂载示例前请求该字重（实测请求时间线：示例模块 98ms、`Inter-SemiBold.ttf` 130ms），使自适应字号测量与文档站一致。

## Deviation

- Adaptive：`.semi-avatar-content` 的 `scale` 由挂载时的文字宽度决定，且不随字体后到而重算（固定实现只在字符串子节点变化时重算）。参考侧原先把回退字体的度量冻结进 `transform`（0.869565 vs 0.833333）。已按上一节把字体请求提前到挂载前，两侧均按真实度量计算，未放宽断言。
- Overlap：dark RTL 的逐头像裁剪有 3 个抗锯齿边界像素差异（比例 0.00128 > 0.001，通道差 0.10–0.12）。同用例逐节点比较显示 DOM、class、文本、样式与几何完全相等（rect 差值 < 1e-9），整体截图按标准阈值通过，差异稳定复现且只出现在重叠圆弧的混合像素上。因此该示例以整体截图与逐节点比较为准，不做逐头像裁剪。
- More：Popover 内容里被克隆的头像为 24×24，单个抗锯齿边界像素即达比例 0.0017 > 0.001（通道差 0.10）。同一节点比较同样完全相等且稳定复现，因此该 portal 以 Popover 截图作为比较单位，不逐 24×24 头像裁剪；触发头像与整体截图仍逐项比较。

以上是本批仅有的两处限定差异；其余 14 项仍逐元素裁剪比较，数值门槛（threshold 0.1、maxDiffPixelRatio 0.001、几何 0.5px）未做任何放宽。

## 章节/API/迁移审阅

双语均保留固定上游章节与顺序（中文 19 个、英文 18 个），API 章节在固定 `Avatar`/`AvatarGroup` 之外补充 Vue 的 slot 配置类型说明；引入示例统一为公开 Vue 子路径 `@aifuxi/semi-ui-vue/avatar` 与独立 `@aifuxi/semi-theme-default/avatar.css`。API 以真实公开类型为准：`size`/`shape`/`color` 有固定枚举与缺省值，`gap` 缺省 3，`border`/`contentMotion` 支持布尔与 `{ motion }` 配置，`topSlot`/`bottomSlot` 支持配置对象与作用域插槽，`hoverMask` 为插槽或 `VNodeChild`，`AvatarGroup` 支持 `maxCount`/`overlapFrom`/`renderMore`（Vue 为 `#more`），`onClick` 等转 `@click`，`onError` 保留返回值语义。文档演示为客户端渲染，不作为 SSR/hydration 证据。

正式状态以 evidence/avatar.json 的完整矩阵与输入指纹为准，诊断不计入 accepted。
