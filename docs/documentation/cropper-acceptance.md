# Cropper 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

5 项中英文示例覆盖 light/dark 与 LTR/RTL，共 40 项。比较 Cropper、Radio、Slider、Button、图片、预览与导出结果的属性、文本、computed style 和各轴几何（≤0.5 CSS px），完整示例截图使用 threshold=0.1、maxDiffPixelRatio=0.001。

## 固定参考与资产

参考适配仅默认导出原始 Demo、补齐 Preview 上游漏写的 Slider 导入，以及同源素材替换。依照 ADR0029，素材内容使用项目自有 SVG 图案；第 1–4 项恢复上游 image.png 的 720×400 intrinsic 尺寸，第 5 项恢复 abstract.jpg 的 1440×800，两者均为 1.8:1。照片内容不宣称与上游像素一致，详见 mapping 的 assetAdaptations 与专用归属记录。裁切区域、旋转、缩放与导出结果对照使用完全相同的素材。

Preview 显式引入现有 `image.css`，补齐固定原站全局 Image 样式依赖：基线 `image/image.scss` 为 `img[src=""]` / 无 src 图片设置 opacity=0。初诊唯一差异为该空图 opacity（参考 0、Vue 1），其属性、零尺寸几何及其余样式完全相同。Preview 保留固定上游未导出时的空 src 图片及其布局，不以 v-if 隐藏；资源准备只 decode 有实际 src 的图片，空图片仍参与节点、样式、几何和截图比较。输出图的属性按固定示例保留，不给参考侧补额外 alt。英文 Preview 保留原文的中文说明、按钮和滑杆标签。

## 交互与文档生命周期

每项先确认 React Cropper 独立渲染，再打开 Vue。全部主题和方向使用真实鼠标拖动裁切框、遮罩下图像、可用的右下角调整块；CropBox 验证不存在调整块，AspectRatio 验证调整后仍为 3:4。Basic 切换 round、roundRect、rect 并验证 4/8 个控制点；Controlled 与 Preview 使用真实键盘操作旋转/缩放滑杆并比较变化。每项点击裁切并验证可解码的 Canvas 输出和完整图像像素。

双语 light/LTR 额外逐项检查本地源码一致、展开/收起、重置、在线编辑实际 iframe 渲染和退出恢复。所有 pageerror/console error 均阻断；不靠延时、重试或降低门槛处理失败。

## 章节、API 与迁移

核对两语言全部 5 项、固定章节顺序、比例说明、受控 zoom 回调、裁切框设置、preview 容器、Methods 和设计变量。公开 props 默认值按实际 withDefaults 核验：defaultAspectRatio=1、fill 透明、zoom 范围 0.1–3、shape=rect、showResizeBox=true、zoomStep=0.1。v-model:zoom 对应 update:zoom，@zoom-change 对应 zoomChange；rotate 由父层 prop 控制。

模板 ref 暴露 getCropperCanvas(): HTMLCanvasElement；preview 返回已挂载 HTMLElement，组件没有内容插槽。cropperBoxClassName 与 cropperBoxCls 的公开兼容记录保留。imgProps 在固定 React 和当前 Vue 均仅声明未实际透传，双语正文如实说明；不是本轮新增能力。审阅指纹绑定固定中英文源码和当前双语页面。

正式状态只由完整矩阵和运行前后输入指纹确认；准备与诊断不计入 accepted。

## 导出截图视口诊断

初诊 Basic 导出图 dataURL、节点、样式和 426×400 几何完全一致，但 900px 视口截图缺少底部 426×28 像素。独立探针保留完整拖拽、形状和导出顺序：两侧根 y=91.578125、height=865，导出图 bottom=927.578125，超过 viewport=900；Vue 的正文处于 overflow 包含环境，参考 body 则按完整文档高度展开，导致视口外截图捕获差异。`.demo-block` bottom=1001.578125，大于图片底部，并非该元素自身尺寸裁短；固定页头 bottom=61，也没有覆盖底边。

同宽 1440、height=1200 时完全相同的 926×866 完整目标截图从 diff=11928、ratio=0.014874375869791848 变为 diff=0、ratio=0，仍使用 threshold=0.1、maxDiffPixelRatio=0.001。证据为本轮 ignored `cropper-viewport-probe/result/measurements.json` 和配对图片。正式矩阵采用双方实际 1440×1200 视口并单独附实际环境；采样前滚动完整目标到页头下，断言四角及中心无遮挡、根边界全在视口内。输出内容、截图根、像素门槛及拖拽/导出契约不变。

## 固定比例调整路径

第 13 次诊断在 AspectRatio 的 resize 宽度变化断言失败：配对样式证据显示 3:4 初始框均为 225×300，已占满 300px 容器高度。固定 Foundation `getRangeForAspectChange` 的 br 分支以 `containerHeight - yMin` 和比例限定右下角范围，向右下继续扩大按契约被钳制；这是测试输入无效，并非产品尺寸未更新。

矩阵改为真实右下控制点先向内拖动（-24、-32），验证宽高减少、3:4 比例与完整配对截图，再向外拖动（12、16），验证宽高增加且未越过容器高度、比例不变，并再次比较完整节点/样式/几何/像素。其他示例拖拽、导出及全部门槛保持原样，无固定等待或重试。
