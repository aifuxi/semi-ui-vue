# Dark Mode 示例对齐矩阵

基线：只读 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`，固定 `content/advanced/dark-mode` 两个双语 live Demo。

| 契约            | 示例及验收                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------ |
| 默认状态        | 全局来自 body；局部内容初始 `semi-always-dark`，页头/侧栏/页脚保留全局主题                       |
| 切换与状态      | Global 键盘激活双向切换；Local dark → light → dark，外部 body 不变                               |
| 公开 API/事件   | Vue ref、@click、class、icon slot；可选 themeChange 同步文档外壳，无独立组件 API                 |
| DOM/class/style | 对照全部 Semi 节点、文本、ARIA、关键 computed style；rect 各轴 ≤0.5px                            |
| 视觉            | 同 Chromium 进程 1440×900 DPR1、zh-CN/en-US × light/dark；逐组件裁剪，threshold 0.1、ratio 0.001 |
| Portal          | Nav Group3 菜单使用局部容器；Popover/Tooltip 使用 body；每次局部切换后比较真实弹层并关闭         |
| 交互            | 全局按钮 Enter、局部按钮、导航 hover、分页选择；双语 light REPL 编辑运行及卸载                   |
| 动画            | 默认采样 300ms，hover 弹层 1000ms；加载真实 Inter 字体，无 mask                                  |
| SSR             | 静态生成与 Nuxt typecheck；DOM 仅用户事件读取；多文件模板 ref 隔离实例                           |
| RTL/窄视口      | 本指南没有 direction、断点或触摸配置；既有消费组件专项在原切片中验证，本批不重复                 |
| 适配            | 独立 IconApps 和品牌文本在两端一致；MIT 归属/文件散列保留；官网回调替换为 Vue 可选事件           |

源码依据：`semi-theme-default/scss/global.scss:3,146`、`_palette.scss:1,240`；`semi-ui/navigation/SubNav.tsx` 将上下文 getPopupContainer 转交 Dropdown；原指南明确区分默认 body 与局部容器。现有指南 div theme-mode 写法更正为上述主题 class，不修改上游或主题源码。

## 站点上下文与采样补充

- 固定站点 `src/components/layout.js:156-160,191` 按文档语言提供 LocaleProvider。React 参考 wrapper 和 Vue Local 多文件入口均显式提供相同 Locale，保证站点及 REPL 一致。
- 局部模式不改变页面 body；Nav 菜单继承局部 `--semi-color-bg-0`，默认 Popover/Tooltip 继承 body。弹层在对齐触发器后核对绝对位置，不通过移动弹层修正几何。
- 高侧栏分为完整菜单和收起控制裁剪，剔除无内容填充区；小控件截图前重新对齐分数像素坐标并使用相同物理像素 clip，焦点环扩展 4px，Tooltip 裁剪包含箭头。样式与几何仍逐项比较，无 mask 或阈值调整。
- 完全打开的弹层在 1000ms 采样点通过浏览器完成真实 animationend，避免两端停留在不同生命周期；不派发伪造 DOM 动画事件。
- Tab 路径验证 Tag 的焦点与焦点环。上游 hover 模式的 portalInserted 会在无 `:hover` 时关闭弹层，此行为按固定 Foundation:348-356 比较；不擅自修改基线。显式 focus 模式另有组件单测。
- 页码与页大小菜单选择纳入矩阵；页大小变化应按上游 key 重建 Select、释放旧焦点。
