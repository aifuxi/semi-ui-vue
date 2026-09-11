# Layout 文档批次验收

固定基线为 Semi Design v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

八项示例覆盖双语、明暗与 LTR/RTL，共 64 项正式矩阵。默认布局、窄屏回程、响应式 md 边界、菜单选择、键盘、侧栏折叠恢复与源码编辑器按固定 Markdown 演示核验。关键样式精确相等，各轴几何误差不超过 0.5 CSS px，截图 threshold=0.1、maxDiffPixelRatio=0.001，不 mask。

ThreeSections、LeftSidebar、RightSidebar、Sidebar 与 Responsive 保留原站窗口装饰及伪元素。所有示例真实切换 390px 并恢复 1440px；Responsive 依次经过 767、768、390、1440px，对照首次挂载与全部断点日志 true/false 序列。参考容器同步实际预览的 padding、overflow、宽度与滚动位置，等待文档移动侧栏真实退场。

TopNavigation、TopSidebar、SideNavigation 验证鼠标选中第二项、Enter 选择末项及真实焦点。两项侧栏示例连续折叠/恢复两轮，标题跟随状态；首次折叠后分别 hover 菜单与展开按钮，核对 Tooltip 文字、关键样式、几何和含箭头的紧裁剪像素，等待退出卸载后再打开一次。导航、面包屑、骨架和页脚在桌面宽度下分别紧裁剪，避免空白内容稀释局部差异。

Tooltip 在 1399px 真实视口比较：固定 PageAnchor/index.scss 在此隐藏文档目录，避免 Vue 独有的右侧目录文字从提示圆角透出。1440px 的默认与折叠布局继续比较，并在 hover 前后验证 1399px 往返布局；不隐藏元素、不 mask 或改写 Tooltip 样式。

双语亮色 LTR 全部验证源码、重置、编辑器首帧、退出及再次打开。ThreeSections 实际修改内容文字并运行，SideNavigation 修改 Avatar 文字并运行，随后重置恢复；全程真实时钟。通知/帮助按钮无业务回调，保留本地可访问名称；不为纯布局元素增加键盘语义。

React 参考直接编译固定双语 Markdown，仅适配匿名导出、完整语言 Provider 及独立品牌。Semi/ByteDance 图标使用 IconInfoCircle，品牌文字使用 aifuxi；英文 SideNavigation 保留 Webcast 标题，面包屑保留各例原有拼写差异。

Layout、Header/Footer/Content 与 Sider 的 props、默认 tagName/prefixCls、attrs 边界和断点回调依据固定 Adapter 与 Vue 公开类型审阅。Sider 回调返回媒体查询匹配值，不自动折叠。Layout 无专属设计变量，示例样式来自原站 docDemo.scss。文档预览为 ClientOnly，不充当组件 SSR/hydration 验收。
