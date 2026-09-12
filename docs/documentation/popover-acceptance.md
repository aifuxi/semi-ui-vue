# Popover 文档批次验收

固定基线为 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。九个示例各覆盖双语、明暗及 LTR/RTL，共 72 个正式组合；Position、Arrow、ArrowCenter 每个组合逐一操作 12 个位置。正式结果以 evidence/popover.json 为准，诊断和准备不计 accepted。

## 全部固定片段前提审阅

| 示例            | 固定控件及语言差异                                                                                                                                           | 交互与依赖                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| TriggerChildren | 两语言均三触发器：Functional Component、ClassComponent、DOM；中文为 Empty，英文为 12px padding 的两行 article                                                | React forwardRef / class 的 props 透传对应 Vue useAttrs / 单根继承；中文 IllustrationSuccess / Dark 固定 150×150，Empty 宽 400、padding 20 |
| Basic           | 各一 Tag；中文“悬停此处”加上述 Empty，英文 Hover here 加两行 article                                                                                         | 默认 hover，ARIA role=tooltip，延迟 50ms                                                                                                   |
| Position        | 各 12 Tag，顺序 TL/Top/TR/LT/Left/LB/RT/Right/RB/BL/Bottom/BR；中文大 Tag margin 8、padding 20，容器偏移 80/300；英文小 Tag 与 tag-margin-right、偏移 40/180 | 每个位置逐一检查完整浮层、触发器及浮层绝对几何，保留边缘自动调整                                                                           |
| Controlled      | 中文一个 RadioGroup、两个 Radio（true/false）；英文一个 Click me Button                                                                                      | custom visible；中文 change.event.target.value，英文按钮切换并保留固定两层 div；Escape 不关闭受控面板                                      |
| Condition       | 两语言相同：Text、Switch、Hover me 与 Click me 两个 Button                                                                                                   | computed condition is true/false；关闭 condition 禁止两类触发，恢复再打开                                                                  |
| Arrow           | 每语言 12 Tag，两行无 padding article；showArrow                                                                                                             | 保留上游 tag-margin-right 与所有位置；比较箭头                                                                                             |
| ArrowCenter     | 同 Arrow，另 arrowPointAtCenter=true                                                                                                                         | 逐一比较 12 位置和箭头中心                                                                                                                 |
| Color           | 各一个 Colorful Popover Tag，默认 visible/custom、right、showArrow、蓝色背景及边框                                                                           | 固定相对定位局部容器；DOM id 查询改实例 ref。移除此前 Vue 独有 min-height 72px 和 overflow:hidden，避免裁掉真实浮层                        |
| InitialFocus    | 每语言一个 click me 触发按钮；面板含 first focusable element Button 和 placeholder=focus here Input                                                          | scoped content 的 initialFocusRef 对应 React ref；真实焦点、输入、Escape 回焦、退出后重开清空输入                                          |

所有 18 个固定代码片段直接由现有编译器加载。中文 Illustration 导入改用参考构建器既有 `@semi-v2.102.0/illustrations` 别名（与 Empty 批相同），解析到固定 vendor 的 semi-illustrations/src/index.ts。首次仅转译 JSX 未检查包解析，导致共享参考服务构建错误；后续逐段核对所有直接导入与导出名，保留该失败事实。TriggerChildren 中 helper class 先于 Demo，通用入口识别会误选 MyComponent，因此本批适配器移除 render(Demo) 并显式导出 Demo；Controlled 与 InitialFocus 的裸箭头命名为 DocumentationExample。没有改写交互、数量、定时器、props 或可见文案。无外部图片依赖；Illustration SVG 与固定站点 Inter 使用本地资源。

## 章节、API 与迁移审阅

双语页面涵盖使用场景、注意事项、九个示例、Tooltip/Popconfirm 关联、API、ARIA、键盘焦点、设计变量及 FAQ。API 采用 Vue 默认插槽、content scoped slot、visible-change/click-outside/esc-keydown 事件；保留 showArrow=false、disableFocusListener=true、condition=false 仅抑制内置触发、custom 由 visible 驱动的契约。模板 ref 与 useAttrs 替代 React forwardRef/class，getPopupContainer 延迟访问 DOM。无独立 Popover API 元数据文件，API 为页面表格。review 绑定固定双语源和当前双语页面内容。

## ARIA 前提修正

首次代表诊断在页面入口误把所有触发器定位为 aria-controls，Position/Basic 等 hover 示例已渲染但定位失败。固定 Popover 仅 click/custom 设 role=dialog；Tooltip 对 dialog 提供 aria-controls、aria-expanded、aria-haspopup=dialog，对 hover 的 tooltip 只提供 aria-describedby。Vue TooltipTriggerRenderer 遵循相同分支。矩阵按固定示例和索引检查对应属性、缺省另一关联属性及 tooltip 缺省 expanded/haspopup；页面与 REPL 都通过该 id 精确定位并验证面板 role。此修正覆盖入口、数量、开关、重置及编辑器，不改组件，不通过弱化 ARIA 断言规避失败。

## 触发组件实际属性透传复核

诊断 15 的中文 Controlled 没有关联 ARIA，并非 Tooltip 的 custom 分支不 clone。固定 Tooltip render 无条件 clone 并提供 data-popupid；但 RadioGroup render 只转交六个显式 ARIA 字段与 getDataAttr(rest)，过滤 controls/expanded/haspopup，Vue RadioGroup 的 inheritAttrs=false 与 data-* 过滤一致。因此只对中文 Controlled 验证这四个 ARIA 属性缺省，通过固定 data-popupid 精确关联 role=dialog 的面板；不修改产品补不存在的属性。重查其余18片段：Color 的 Tag、英文 Controlled 的 Button 均转交剩余 attr，仍有完整 dialog ARIA；InitialFocus/Condition 的 Button、各位置与 Basic 的 Tag，以及显式透传的 TriggerChildren 均保留原 ARIA。所有入口/计数/REPL 使用 data-popupid 定位，并单独严格验证固定 ARIA 与该 id 一致，未把“可定位”等同于“满足ARIA”。

## 模板文本边界修正

诊断 09 在 Basic 的 Tag 发现 Vue 模板额外前导空格进入真实可访问名（`Tag:  悬停此处`），固定 React 为 `Tag: 悬停此处`。一次核查双语全部 Tag/Button/Text：Basic、三个位置组的 Tag、Condition 的 Text 和两个 Button 均有同类多余前导空格，已按固定片段移除。Color、InitialFocus、Controlled 与三个自定义触发器原文无该差异。保留 article 中固定文本和换行语义；比较仍逐字验证 aria-label，没有规范化可访问名。

## 截图滚动上下文修正

诊断 12 的 Position trace 显示截图前两侧 scrollY=1171、Portal top=1531、浮层高 278，顶为 82px。Vue 站点 scroll-padding-top=92px，locator.screenshot 内部 scrollIntoView 把 Vue 单侧上滚 10px 至1161，导致截图后面板绝对 y 相差10；内部截图像素差为0。改用锁定 Playwright 1.62.1 screenshotPage 的 viewport-relative clip（Chromium delegate 加 visualViewport pageX/pageY），避免 screenshotElement 的自动滚动。截图前同时严格比较 trigger/panel 绝对几何，验证完整 bbox 位于 viewport 及面板中心与四角内缩采样点未被遮挡；截图后断言 scroll 不变、单侧 bbox 不变及双侧 trigger/panel 仍一致。背景规范、0.5px 与像素门槛不变，不改产品站 CSS。

## 采样与门禁

默认主体另比较全部触发器及布局容器的文本、样式、几何与完整截图，不仅比较触发器矩形。InitialFocus 保持输入真实焦点直接按 Escape，再检查返回触发器，关闭前不人工转移焦点。比较关联 ARIA id 的完整面板节点、文本、SVG、样式及局部几何，关键样式精确相同、各轴误差 ≤0.5 CSS px，像素 threshold ≤0.1、差异率 ≤0.001。截图只统一半透明浮层的页面背景；截图前独立断言真实面板绝对位置，不删内容、不隐藏面板内节点、不放宽阈值。真实进场动画等待 finished，退出等待面板销毁后才重开。Color 是固定永久受控例，不强加关闭路径；无业务 Promise 异步，hover 延迟与动画生命周期保留。双语亮色 LTR 另验证源码、重置与真实编辑器加载及主要交互。

本批没有 accepted deviation；准备后的代表诊断、跨批只读复核与统一完整矩阵由主 agent 执行。

## InitialFocus 共享适配修复

诊断18中 Vue Input 未出现焦点类及蓝色边框，而固定 React 已聚焦。示例 scoped ref 透传正确，差异来自 Tooltip 原先把组件实例转换为 `$el`：Input 的根 div 不可聚焦，丢失其公开 focus 方法。共享适配现优先浅存有 focus 方法的公开实例、以成员方式调用保留 this，无方法才回退 HTMLElement 根，卸载 null 清理。固定 React adapter 直接调用实例 focus 的语义不变；测试不手动聚焦修平差异。含兄弟 Button 的 Input ref 回归先在 activeElement 处复现失败，修复后初次打开、Escape销毁/回焦和再次打开通过；Tooltip/Popover/Popconfirm 42项单元通过。真实焦点、样式与历史证据由统一 Chromium 验收重验。

## RTL 默认主体过渡终态

诊断21 Condition en-us dark rtl 的 default-styles 只有 Switch knob 的 x 相差1.53125px（React796.14404296875、Vue797.67529296875），Switch父框、Text、Button及Space几何全部相同。固定 switch.scss:117 为旋钮 transform 设置 transition，加载后切换 body RTL 触发过渡，原采样落在不同帧。compare 现在在资源加载后等待两次requestAnimationFrame，再等待目标子树真实 animation.finished，之后精确比较 transform 和几何；固定九例没有无限动画。不增加sleep、不关闭动画，hover、定位和初始焦点流程保持原时序。

## Color 局部 Portal 与文档外壳裁剪

诊断24 Color en-us dark rtl 的完整浮层无遮挡检查失败。两侧固定 right 面板均从x1259延伸到1428，仍在1440视口内；Reference完整可见，Vue仅露出x1259–1273蓝条，截断处正是demo-block右边界。站点site.css:312–316的.demo-block overflow:hidden会裁剪该例自定义局部Portal，body级Portal没有此问题。DemoBlock 新增可选 overflow 配置，仅双语 Color 示例显式开启 visible，修复真实文档页的局部浮层裁剪，其余示例默认不变。测试不设置临时 overflow 覆盖，完整面板hit-test、截图前后绝对几何、滚动不变及像素门槛全部保留。
