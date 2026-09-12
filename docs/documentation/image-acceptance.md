# Image 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

10 项中英文示例各覆盖明暗与 LTR/RTL，共 80 项。完整矩阵比较文本、属性、关键 computed style、各轴几何（≤0.5 CSS px）和截图（threshold=0.1，maxDiffPixelRatio=0.001）；正式有效状态只由完整 runner 的 evidence/image.json 和当前输入指纹决定。

## 双语固定片段前提审阅

已逐项读取中英文全部 20 个固定 live 片段并编译适配后的 JSX。双语结构和实例数一致：Basic 1 张 360×200；Fallback 2 张 200×200 失败图及 2 个语言标签；Progressive 一张 300×200 主图、同尺寸且 preview=false 的临时占位图及 Reload；PreviewSource 一张 300×200 缩略图且预览地址不同；Group 4 张宽 200 的图；Standalone 两个按钮，分别控制 1/4 张源；Container 3 张宽 200 的图，父容器高 400 且 position:relative；CustomMenu 3 张宽 200 的图及 7 个自定义按钮；ExtendMenu 3 张宽 200 的图、默认 menuItems 的 0–3/3–7/7–末尾三段、3 个 Divider 与 Tooltip；Header 2 张宽 200 的图和 lamp1/lamp2 标题。

Fallback 保留英文两段原文；固定 alignItem 拼写无 CSS 效果，Vue 移除先前误加的 align-items:center。Group/Container/CustomMenu/ExtendMenu/Header 恢复固定 alt=lampN；没有 alt 的 Basic/Fallback/Progressive/PreviewSource 移除先前额外描述。CustomMenu 移除额外 aria-label，参考不新增命名，按固定七按钮及图标顺序操作；无障碍章节仍提示消费者提供有意义的描述和控件名称。ExtendMenu 英文保留固定 “I is a custom action”，Header 保留 “Custom title:” 无额外空格。Standalone 固定片段缺失 useState 导入，只补独立模块依赖。

## 资源与参考边界

沿用已有映射允许的图像内容适配，但恢复固定资源固有尺寸。本轮逐一通过 ax 获取固定 Markdown 六个 CDN URL，HTTP 200；sips 核验 abstract.jpg、sky.jpg、greenleaf.jpg、colorful.jpg、abstract-small.jpeg、abstract-big.png **全部为 1440×800**。此前共享 800×450 素材比例并不相同，width=200 时高度会偏差 1.389 px，不能保持该错误后凭两侧同素材通过认证。新增六个本批独立 `image-*.svg`，沿用项目原创图案、明确 1440×800；源文件哈希、地址与归属见 `apps/docs/public/demos/image-assets.md`，ignored 取证目录为 `apps/docs/.data/documentation-smoke/image/resource-dimensions-20260912/`。大小图独立文件和 URL，保留加载契约，不能据此声称复现原 CDN 内容、压缩大小或传输延迟。完整矩阵额外断言真实 decode 后 naturalWidth/naturalHeight=1440/800。

参考未知远程资源抛错，不能静默产生 undefined。失败源改为确定性损坏 data URI；只对该明确失败图验证 complete=true/naturalWidth=0，其余图仍实际 decode，不统一忽略资源错误。

Progressive 恢复固定 Date.now 更新 src，移除 Vue 强制 key 重挂载；Reload 断言源发生变化并重新加载。独立页面点击时间不同，仅将 reload query 中的时间戳值规范化，保留其他 URL、独立缩略/预览源关系。CustomMenu 原文 disableZoomIn/disableZoomOut 的拼写错误按本轮之前 mapping 第 8 项已明确的限定差异修正为公开 disabledZoomIn/disabledZoomOut；其余原始行为不变。除上述已有资源/拼写适配外，不声明额外视觉 deviation。

## 矩阵与生命周期

各成功图验证打开预览、真实图片加载、完整 Portal 样式/几何/截图、关闭与重开、Escape 关闭。Container 断言 Portal 实际位于指定父容器；其余 Portal 位于示例外。多图逐张切换至末尾、检查下一张消失、逐张回首并检查上一张消失；Standalone 重开进入四图预览。CustomMenu 实际点击底栏第 1/2 个按钮验证 onPrev/onNext，并检查首尾 disabled；其余多图点击左右切换箭头。全部成功示例覆盖放大、缩小、真实尺寸、旋转（每步断言 img style 实际改变）和实际 download 事件及无失败结果。改变状态后再次关闭、重开、旋转，证明退出后仍能操作。双语 light/LTR 各项验证源码、重置、在线编辑 iframe 加载和主要交互；Fallback 验证两张加载失败终态，Progressive 执行 Reload 后加载，Standalone 分别打开单图和多图，Container 核验容器 Portal，自定义菜单操作前后切换，全部成功示例打开关闭后退出编辑恢复；真实时钟不人为关闭业务动效。viewer 根节点自身的背景、定位、z-index、尺寸与样式参与测量，所有截图根额外比较绝对 x/y/width/height，不能由局部坐标抵消整体偏移。RTL 同时设置实际 body 和示例根，覆盖 body Portal 继承。固定 React previewInner.tsx 与 Vue 按 visible 卸载，关闭使用未过滤可见性的 locator count=0 验证真实卸载终态。所有页面 console error/pageerror 阻断验收。初次代表诊断仍需主 agent 验证实际浏览器触发和定位；本记录不以静态准备代替通过证据。

## 章节、API 与迁移

逐项核对固定双语引入、10 个 live 示例、Image/ImagePreview/MenuProps API 与设计变量。公开 Vue types.ts 的 native img 属性、props 默认、Image click/load/error、ImagePreview 双 v-model 与所有 emits、slots 及 render props 均对应现有文档。MenuProps 的 disabledZoomIn/disabledZoomOut、onRatioClick、ratioChange 为 Vue 真实契约；slot 中 menuItems 是 Vue VNodeChild 数组，局部 render function 只转交已有节点。Locale 提示跟随完整文档 Provider。审阅指纹绑定固定双语源码、API 元数据缺省状态及当前双语页面。

## 诊断后的文本测量修正

diagnostic-05 中 Basic/Progressive 的 viewer 根、footer 和 footer-page 样式已一致，但 React `{curPage}/{totalNum}` 分为三个 TEXT_NODE，Vue 为一个 `1/1` 文本节点。测量改为对完整 textContent 一次归一可折叠 ASCII 空白（仅 white-space normal/nowrap），其余模式保留原文；不在节点间添加空格、不逐段 trim，保留相邻标签的真实空白和所有字符。Header 双语固定原文为 `自定义标题：{title}` / `Custom title:{title}`，模板同样冒号后无额外空格；该动态文本分段采用同一规则。子元素结构、文本、样式与几何仍逐项断言，像素门槛不变。

diagnostic-07 进一步定位 footer 页码固有宽度差（React 20.59375 / Vue 20.578125 px），已在共享 ImagePreviewFooter 的既有 render 边界恢复固定三个文本节点；详情见 `docs/components/image/alignment.md`。同份附件中 Slider 在 showTooltip=false 时仍保留动态 data-popupid/aria-describedby，但面板尚未创建；测量以 data-popupid 声明的 DOM 顺序建立稳定映射，并对声明及所有 id/ARIA 引用应用同一映射。每个节点和属性继续参与比较，显式检查非空 ID 与 aria-describedby 包含其声明，不删除属性、不丢失数量或引用一致性。

## 半透明预览背景的确定性采样

diagnostic-10 的 Basic preview 原始节点样式和各轴几何全部通过。读取完整 1440×900 PNG，真实预览图区域 x=44..1396、y=74..825 共 1,017,456 像素，在 threshold=0.1 下差异为 0；8084 个超限像素全部位于外围背景（顶部 2983、左侧 3238、右侧 348、底部 1515）。固定参考是独立 Demo，Vue 是含页头/侧栏的真实文档页，两种外部页面内容透过相同预览半透明背景造成差异。

仅在 viewer 截图期间用 screenshot.style 将 body 背景统一到同主题 `--semi-color-bg-0`，隐藏 body 直接子节点的外部背景，并只对 `.semi-image-preview` 根恢复 visibility。没有强制全部后代可见，保留内部自身 visibility/display、图像、菜单、图标和 Portal 位置；截图前原始 viewer 背景透明度、全部关键样式及绝对几何仍精确断言。默认示例截图不使用该处理，像素阈值和裁剪范围均不变。修复后正式结果待统一诊断，不以此次 PNG 读数替代完整矩阵。

## 比例操作定位与终态

diagnostic-13 的 default/preview/reopen/ZoomIn/ZoomOut 均已通过；固定图标类名为 `semi-icon-real_size_stroked`，原 spec 错写为连字符导致找不到控件。该次缩放并未切换 ratio：两侧图片宽度 1353→1497→1353 px，比例图标始终 real_size_stroked。固定 Footer Foundation 仅在比例按钮点击后切换 adaptation/realSize，对应图标 real_size_stroked/window_adaption_stroked。

比例操作现定位唯一的两状态图标（CustomMenu 仍操作第 5 个按钮），点击后断言图标切换及原尺寸宽 1440px，再点击恢复适应状态并完整比较；放大缩小额外断言图像宽度实际增减。复核其余 plus/minus/rotate/download 类名和前后按钮路径与固定源码一致，旋转仍断言实际 style 改变并对照终态，下载仍等待真实 download 事件及无失败结果，退出重开后继续旋转检查不变。未增加强制点击、等待时长或重试。

diagnostic-16 的 Group 默认态暴露固定组 ID 缺失。共享 ImagePreview 用 useId 补稳定默认 ID，保留 attrs 显式覆盖与 ref Observer 隔离；双语 Container 外层补固定 `id="container"`，参考和测量不变。ID 数量、关系及全部默认属性仍参与完整比较，修复后有效结论待统一矩阵。

## 文档坐标精度与完整裁剪

diagnostic-19 中 ExtendMenu en-us default 的子树样式和几何通过，但完整根截图为 React 926×165 / Vue 926×166。trace 显示 Vue scrollY=4270，参考 align 原先先写 top、再读取序列化的 style.top=`413.906px` 相加。该往返会把 CSS 布局的原始 1/64 精度坐标截断，在截图下沿恰跨整像素时产生一行差异；完整 group 高度双方均 116.109375，加上下 padding 为 164.109375，与这个裁剪边界条件一致。原始根 bbox 此次未附，因此不把推导坐标冒充直接采样。

align 现一次读取原始 bbox 和 scroll，直接写入 `box.y + scroll.y` 的文档坐标，禁止从 style 字串取回定位数值；Vue 根不移动，截图不resize、不删除边缘、不改完整裁剪范围和0.5px门槛。每次比较追加原始根 bbox 与页面 scroll 数值附件，用于后续定点诊断确认。已有通过代表仅保留诊断事实，正式有效状态仍由冻结输入的完整runner生成。

## RTL 参考根定位

diagnostic-22 的 Basic en-us dark rtl 原始根附件为参考 x=861、Vue x=347，width 均926，y/height/scroll相同，偏移恰为1440−926=514。原因是参考根在 RTL body 的正常块流中先右对齐到514，再由 position:relative 的 left347额外偏移。align 现将参考根设为 absolute，继续以原始 bbox/scroll 的物理 left/top 一次定位；body minHeight仍取实际文档高度。Vue不移动，内容RTL继承、完整裁剪和0.5px门槛不变。
