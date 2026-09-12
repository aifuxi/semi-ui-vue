# Tag 文档验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

12 项双语示例覆盖 light/dark 与 LTR/RTL，共 96 项。矩阵逐节点比较 class、属性（含 ARIA、role、tabindex）、文本、关键计算样式与各轴几何（≤0.5 CSS px），局部截图 threshold=0.1、maxDiffPixelRatio=0.001。头像图片、前后图标、Radio、TagGroup 与 SplitTagGroup 均进入比较；折叠浮层包含根节点本身的 class、属性、文本、关键计算样式及尺寸比较，另核对触发器在已对齐预览中的相对位置，并比较浮层相对触发器的 x/y/width/height（每轴≤0.5px），避免不同文档滚动坐标造成误判；保留子节点与整体截图检查。

## 固定来源与参考适配

- 中文固定源有 12 个 live blocks，英文有 11 个：英文缺少独立 Icons 示例。本地英文 Icons 的文案与中文固定片段相同，矩阵仅该项使用中文第 4 块；英文 Color 至 SplitGroup 使用英文第 4 至 11 块，其余使用对应语言原块。未复制维护独立 React 示例。
- 参考适配器补上匿名箭头示例默认导出，并修正 Colorful 固定片段错误的 `@douyin/semi-icons` 包名。
- 按现有映射，品牌图标替换为 IconCode / IconCodeStroked；头像 CDN 图片替换为同一份本地 `/demos/photo.svg`，保留尺寸与布局。图片 src 按 pathname 对照，消除参考服务与文档服务不同 origin，实际图片仍需解码成功并参与像素比较。
- Color 的 JSX `{item}` 在 React 中形成多个 children，Vue 插值合并成一个字符串。参考表达式规范为保留前后空格的单一模板字符串，使相同文本进入 Tag 的字符串内容分支，随后严格比较类名、ARIA 与几何。Vue 示例使用显式 content 模板字符串保留首尾空格，避免模板编译器裁去纯空白文本节点。
- Visible 恢复固定上游的非受控 RadioGroup 和 change 反转 visible 回调，参考不改写行为。GroupClose 英文重复的 Faceu tagKey 改为唯一 `2`：固定 TagGroup 将 tagKey 直接作为 React key，Jianying 与 Faceu 的两个 `tagKey=3` 在初始视图同时出现，违反 React 唯一 key 契约并触发错误；仅将 Faceu 的标识改成 `2`，不改变数量、顺序、颜色和文案；Vue 删除也使用原始 findIndex + splice 首项删除语义。源码依据为 `vendor/semi-design/packages/semi-ui/tag/group.tsx` 的 `renderAllTags`（`key=tagKey`）。
- 根内实例 id 按定义位置归一；浮层外部生成的 id 按引用出现顺序归一。Vue 原生 checked 属性反射与 ARIA 默认 false 的等价处理沿用已验收矩阵；状态仍由 checked 属性值和精确 ARIA/样式比较覆盖。

## 浮层箭头可访问性修复与路径等价项

固定 `popover/Arrow.tsx` 的无名 SVG 在 Chromium 实际 AX 树中保留 image 角色；Vue 原本额外设置 aria-hidden=true，从树中隐藏了该节点。因此两者不等价，PopoverArrow 移除额外标记，与固定源一致。矩阵撤销 aria-hidden 过滤和无语义等价假设，继续精确比较该属性。Popover 双层箭头测试覆盖上下、左右两种渲染分支的固定属性，先在旧实现复现失败后验证修复。

固定上方箭头背景 path 的 `14.5  6` 与 Vue `14.5 6` 仅空白分隔不同，该箭头 path 的连续空白规范为单空格，命令、数值、computed style、几何与像素仍精确对照。

## TagGroup 折叠计数组件修复

固定 `group.tsx` 的 `+{n}` 是两个文本子节点；Vue 原来合成单一字符串，错误进入 ellipsis 分支并生成 `Tag: +N`，同时改变 display、overflow、min-width 与字形宽度。组件通过 content 传入两个 Text VNode，恢复 center 布局和空 aria-label，且计数随 restCount 与 tagList 更新。公开 DOM 单测先在旧实现重现失败，再验证新实现的布局类、ARIA、两个文本节点和更新；Tag 单元与 SSR 共 13 项通过。矩阵无需文本归一，继续严格比较原始文本分段。组件浏览器与发布包证据由本轮正式验证补齐。

## TagGroup 浮层重开修复

生产站第二次打开浮层后只剩空容器，固定 React 正常；不冻结动画、等待旧浮层彻底卸载的独立探针均复现，排除截图冻结和旧 host 残留。jsdom 中通过父层更新或 hover 开关的无动效路径均未复现，不能声称单元测试先红。TagGroup 保留直接展示列表的缓存，把默认 Popover content 改为每次槽位渲染按当前数据构造新 Tag VNode，custom 模式克隆调用方 VNode；显式 popoverProps.content 覆盖仍保留。单元覆盖真实 hover 关闭卸载与重开，正式 Group 双轮矩阵及生产探针负责验证该生产差异。

## 交互覆盖

- Basic 验证 Escape 失焦、Delete 关闭及 preventDefault 对关闭按钮与 Backspace 的阻止；Avatar 同时覆盖键盘与按钮关闭。
- Visible 验证 Show → Hide → Show 的受控切换及每个终态。
- Group 双语以及 GroupClose 中文验证 +N hover 浮层内容、关闭与重开；英文 GroupClose 保持固定源码未启用 showPopover 的差异。
- GroupClose 按唯一 tagKey 连续删除两项，比较父层列表和折叠计数的更新。
- 每个双语 light/LTR 示例另验证源码展开/收起、重置、在线编辑 iframe 实际渲染与退出恢复。

## 章节、API 与迁移审阅

双语章节保留固定顺序与语言差异，新增 FAQ 与 React → Vue 迁移表。已核对 `packages/ui/src/tag/types.ts`、Tag.vue、TagGroup.ts 与 SplitTagGroup.ts 的公开 props、默认值、插槽与 emits。TagData 回调是对象字段 onClick/onClose/onKeydown/onMouseenter，模板监听事件使用 @click/@close；英文说明修正这两者混写。API 表为页面内联，无独立 tag.ts API 元数据文件。

正式状态以 `evidence/tag.json` 中完整矩阵与输入指纹为准；当前准备记录及诊断不计入 accepted。未降低截图、几何或样式门槛。
