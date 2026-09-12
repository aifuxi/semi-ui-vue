# Carousel 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

8 项中英文示例分别覆盖 light/dark 与 LTR/RTL，共 64 项。所有示例比较三张内容、指示器、箭头、Typography、Space 和配置 Radio 的结构、文本、属性、computed style、各轴几何（≤0.5 CSS px）及整个示例截图（threshold=0.1、maxDiffPixelRatio=0.001）。

## 参考与资源适配

适配器直接读取固定 Markdown 的原始片段，仅补充独立模块需要的 useState 导入、命名及默认导出。沿用现有映射明确记录的资产和品牌适配：bg-1/2/3 对应相同本地 one/two/photo.svg；Semi Logo 在两侧均替换成 87×31 的空白 aria-hidden span。背景图在截图前实际加载，未隐藏或遮罩图像区域。此资源差异不声称与上游 CDN 图片像素相同。

Basic 修复标题 Space 缺少的固定颜色；Theme 移除上游不存在的额外纵向 Space 容器。英文配置标签保留固定原文 theme、type、position、size、arrow、show time（含大小写）；其余示例保留固定中英文文案、参数和结构。生成的 id/for/ARIA 引用按定义顺序比较关系，显式 Radio name 精确比较；checked 比较实时 DOM property，缺省为 false 的 aria-disabled/invalid/required 与显式 false 等价。没有放宽几何或像素门槛。

Theme、Indicators、Arrows 的 RadioGroup 按示例设置唯一 name；固定参考侧同步同例同名，隔离 Vue 整页多个 Demo 的原生单选互斥。保留同一示例内部各 RadioGroup 原有同名关系，checked 仍测量原生 property，不直接覆盖。诊断发现 input 不反映组件 value，操作改用可见 addon 标签，按 ARIA 可访问名称定位对应 Radio，并断言 semi-radio-checked 与实际指示器/箭头终态。固定参考同例多组同名时，其他受控组会恢复原生 checked，不能假设被点击项必为 true；完整测量仍保留各项原生 checked 的两侧对照。

## 行为与时序

每项均覆盖下一张、上一张、首尾循环和指示器直达。Theme 轮换全部主题；Indicators 检查三种类型、三种位置、两种尺寸；Arrows 检查隐藏、恢复、hover 离开/进入和 always 恢复；CustomArrows 验证插槽图标和切换；Controlled 验证 change 回写后的当前内容。

Basic 与 AutoPlay 保留原始自动播放参数。配对页面的共享 BrowserContext 只安装/暂停/推进一次 Playwright 时钟，依据 Foundation 的 interval+speed 周期（2300/1800 ms）、400 ms 悬停/离开防抖，断言暂停跨越多个周期不变、恢复后周期前一毫秒不变及周期边界切换。使用共享 freezeAnimations 对 slide 在 300 ms、fade 在 500 ms 中点与 1000 ms 终态采样；保留真实动画样式和状态转换，不关闭业务动效。所有默认节点样式仍含 animation/transition duration 和 timing function。

双语 light/LTR 每项另开独立 BrowserContext 的真实时钟文档页面，检查源码展开/收起与本地 SFC 相等、重置、在线编辑 iframe 实际渲染、退出恢复及重新切换。Monaco 不消费受控时钟。新文档页面先等待 ClientOnly Carousel 实际挂载且加载占位消失，再操作 SSR 已存在的源码工具栏，避免 hydration 前点击没有响应。页面 console error 与 pageerror 阻断验收。固定 Carousel 箭头与指示器为非键盘控件，未虚构基线键盘支持；业务可访问性提示保留应用提供可操作暂停按钮的责任。

## 章节、API 与迁移审阅

逐项核对固定双语 8 个 live 示例、引入、API、Methods 和设计变量章节。公开 Vue CarouselProps/CarouselEmits/CarouselSlots/CarouselMethods 与实现保持一致：trigger 默认 click；arrowProps 为对象而非上游文档误写的函数；activeIndex 通过 change(index, preIndex) 回写，没有 v-model；默认插槽直接子节点为轮播项；箭头 slot/VNodeChild 保留公开入口；ref 包括 play/stop/goTo/prev/next。文档补充真实自动播放周期与防抖说明。

审阅指纹绑定固定中英文源码、实际文档页面及 API 元数据缺省状态。正式有效状态以 evidence/carousel.json 完整矩阵与输入指纹为准；准备或诊断不能生成 accepted。除上述已有资产/品牌适配外，不声明额外视觉 deviation。
