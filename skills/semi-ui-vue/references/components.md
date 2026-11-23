# 组件用途索引

按场景找到候选组件后，先确认该子路径存在于消费项目实际安装包的 `exports` 中。表中的 `./button` 对应 `@aifuxi/semi-ui-vue/button`。常用导出供定位，名称和签名以该入口的公开类型为准。

在匹配安装版本的仓库标签下，组件契约位于 `docs/components/<子路径名>/index.md`。文档站示例可在 `apps/docs/content/` 中按组件名称查找。若使用 `DemoBlock`，按示例 ID 查找 `apps/docs/.vitepress/theme/demo/examples/` 下的 Vue 源码或 `apps/docs/data/code-sources.json` 中的代码。版本定位和验证步骤见 [Skill](../SKILL.md#查证与验证)。

## 页面结构、排版与常用操作

| 用途                       | 组件或常用导出                                        | 子路径           |
| -------------------------- | ----------------------------------------------------- | ---------------- |
| 主内容、头部、底部、侧栏   | `Layout`、`LayoutSider`                               | `./layout`       |
| 响应式栅格                 | `Row`、`Col`                                          | `./grid`         |
| 成组元素的对齐和间距       | `Space`                                               | `./space`        |
| 分隔页面区块或列表项       | `Divider`                                             | `./divider`      |
| 标题、正文、文本与数字排版 | `Typography`、`Title`、`Paragraph`、`Text`、`Numeral` | `./typography`   |
| 提交、取消和成组操作       | `Button`、`ButtonGroup`、`SplitButtonGroup`           | `./button`       |
| 用图标触发操作             | `IconButton`                                          | `./icon-button`  |
| 页面上的悬浮快捷操作       | `FloatButton`、`FloatButtonGroup`                     | `./float-button` |
| 通用图标容器               | `Icon`                                                | `./icon`         |
| 拖动手柄调整区域大小       | `Resizable`、`ResizeGroup`                            | `./resizable`    |
| 拖动元素改变位置           | `DragMove`                                            | `./drag-move`    |
| 监听组合键并显示快捷键提示 | `HotKeys`                                             | `./hot-keys`     |

## 表单与内容输入

| 用途                             | 组件或常用导出                      | 子路径           |
| -------------------------------- | ----------------------------------- | ---------------- |
| 字段登记、校验、提交与表单状态   | `Form`、`Form.Input`、`Form.Select` | `./form`         |
| 单行文本、搜索、多行文本         | `Input`、`InputGroup`、`TextArea`   | `./input`        |
| 数字输入和步进                   | `InputNumber`                       | `./input-number` |
| 分格输入验证码                   | `PinCode`                           | `./pin-code`     |
| 新建、编辑和删除多个标签值       | `TagInput`                          | `./tag-input`    |
| 在数值范围内拖动选择值           | `Slider`                            | `./slider`       |
| 星级评分                         | `Rating`                            | `./rating`       |
| 选择与编辑颜色                   | `ColorPicker`                       | `./color-picker` |
| 上传图片或其他文件及展示上传状态 | `Upload`、`UploadFileCard`          | `./upload`       |
| 交互式裁切图片                   | `Cropper`                           | `./cropper`      |

## 选项、日期与时间

| 用途                         | 组件或常用导出              | 子路径            |
| ---------------------------- | --------------------------- | ----------------- |
| 同时勾选多项或确认单项       | `Checkbox`、`CheckboxGroup` | `./checkbox`      |
| 在可见的互斥选项中选一个     | `Radio`、`RadioGroup`       | `./radio`         |
| 打开或关闭设置               | `Switch`                    | `./switch`        |
| 从下拉列表中单选或多选       | `Select`、`SelectOption`    | `./select`        |
| 在文本输入过程中提示候选词   | `AutoComplete`              | `./auto-complete` |
| 沿层级逐级选定一条或多条路径 | `Cascader`                  | `./cascader`      |
| 在下拉树中选择节点           | `TreeSelect`                | `./tree-select`   |
| 在候选和已选两列之间移动项目 | `Transfer`                  | `./transfer`      |
| 用滚动列或滚轮选取项目       | `ScrollList`、`ScrollItem`  | `./scroll-list`   |
| 选择日期或日期范围           | `DatePicker`                | `./date-picker`   |
| 选择时分秒或时间范围         | `TimePicker`                | `./time-picker`   |

## 数据与信息展示

| 用途                         | 组件或常用导出                     | 子路径           |
| ---------------------------- | ---------------------------------- | ---------------- |
| 按行列展示、排序、筛选和分页 | `Table`、`TableColumn`             | `./table`        |
| 逐项展示结构相似的内容       | `List`、`ListItem`                 | `./list`         |
| 用键值对呈现详情             | `Descriptions`、`DescriptionsItem` | `./descriptions` |
| 独立的信息卡片或成组卡片     | `Card`、`CardGroup`、`CardMeta`    | `./card`         |
| 类别、属性或状态标签         | `Tag`、`TagGroup`                  | `./tag`          |
| 未读点、计数或角标           | `Badge`                            | `./badge`        |
| 人员、团队头像               | `Avatar`、`AvatarGroup`            | `./avatar`       |
| 按时间展示记录或事件         | `Timeline`、`TimelineItem`         | `./timeline`     |
| 按日、周、月展示日程         | `Calendar`                         | `./calendar`     |
| 无数据、无搜索结果的说明     | `Empty`                            | `./empty`        |

## 图片、媒体与富内容

| 用途                  | 组件或常用导出          | 子路径              |
| --------------------- | ----------------------- | ------------------- |
| 图片展示与放大预览    | `Image`、`ImagePreview` | `./image`           |
| 多张图片或卡片轮播    | `Carousel`              | `./carousel`        |
| 文本中的匹配词高亮    | `Highlight`             | `./highlight`       |
| 代码片段的语法高亮    | `CodeHighlight`         | `./code-highlight`  |
| 展开或浏览结构化 JSON | `JsonViewer`            | `./json-viewer`     |
| Markdown 渲染         | `MarkdownRender`        | `./markdown-render` |
| 音频播放              | `AudioPlayer`           | `./audio-player`    |
| 视频播放              | `VideoPlayer`           | `./video-player`    |
| 播放 Lottie 动画      | `Lottie`                | `./lottie`          |

## 导航与流程

| 用途                     | 组件或常用导出             | 子路径            |
| ------------------------ | -------------------------- | ----------------- |
| 应用菜单和分层导航       | `Nav`、`NavItem`、`SubNav` | `./navigation`    |
| 当前页面的层级路径       | `Breadcrumb`               | `./breadcrumb`    |
| 在同一区域切换内容视图   | `Tabs`、`TabPane`          | `./tabs`          |
| 展示流程阶段和当前步骤   | `Steps`、`Step`            | `./steps`         |
| 页面中直接展示可展开的树 | `Tree`、`TreeNode`         | `./tree`          |
| 跳转到页内章节           | `Anchor`、`AnchorLink`     | `./anchor`        |
| 独立分页或数据列表换页   | `Pagination`               | `./pagination`    |
| 回到页面或容器顶部       | `BackTop`                  | `./back-top`      |
| 在空间不足时折叠溢出项目 | `OverflowList`             | `./overflow-list` |

## 展开、浮层与确认

| 用途                           | 组件或常用导出                             | 子路径          |
| ------------------------------ | ------------------------------------------ | --------------- |
| 多个带标题的分区展开与收起     | `Collapse`、`CollapsePanel`                | `./collapse`    |
| 用自定义触发器展开一段内容     | `Collapsible`                              | `./collapsible` |
| 显示简短的辅助信息             | `Tooltip`                                  | `./tooltip`     |
| 围绕触发元素显示卡片或富内容   | `Popover`                                  | `./popover`     |
| 打开一组可执行的菜单操作       | `Dropdown`、`DropdownMenu`、`DropdownItem` | `./dropdown`    |
| 在页面中央显示弹窗或确认对话框 | `Modal`                                    | `./modal`       |
| 从页面边缘滑出详情或编辑面板   | `SideSheet`                                | `./side-sheet`  |
| 在触发位置进行轻量二次确认     | `Popconfirm`                               | `./popconfirm`  |

## 进度、状态、通知与反馈

| 用途                       | 组件或常用导出 | 子路径           |
| -------------------------- | -------------- | ---------------- |
| 页面内横幅提示和状态说明   | `Banner`       | `./banner`       |
| 短时显示操作结果           | `Toast`        | `./toast`        |
| 展示较完整的异步通知       | `Notification` | `./notification` |
| 展示完成比例               | `Progress`     | `./progress`     |
| 展示等待或加载状态         | `Spin`         | `./spin`         |
| 用占位结构预示加载后的内容 | `Skeleton`     | `./skeleton`     |
| 收集文本、选项或表情反馈   | `Feedback`     | `./feedback`     |
| 用多步提示引导使用新功能   | `UserGuide`    | `./user-guide`   |

## 对话与 AI 工作区

| 用途                              | 组件或常用导出   | 子路径               |
| --------------------------------- | ---------------- | -------------------- |
| 通用聊天消息与对话界面            | `Chat`           | `./chat`             |
| AI 对话输入、附件、引用与生成状态 | `AIChatInput`    | `./ai-chat-input`    |
| AI 消息、推理、引用和生成结果展示 | `AIChatDialogue` | `./ai-chat-dialogue` |
| 侧边面板展示代码、文件和引用      | `Sidebar`        | `./sidebar`          |

对话消息格式转换可另查 `./ai-chat-dialogue/data-adapter`。需要通用应用侧栏时查 `LayoutSider` 或 `Nav`。需要滑出的详情面板时查 `SideSheet`。

## 配置、语言与配套资源

| 用途                       | 组件或常用导出                     | 子路径              |
| -------------------------- | ---------------------------------- | ------------------- |
| 向子组件传递全局配置和方向 | `ConfigProvider`、`ConfigConsumer` | `./config-provider` |
| 提供或读取多语言上下文     | `LocaleProvider`、`LocaleConsumer` | `./locale`          |

语言对象另查 `./locale/source/*` 公开子路径。

| 用途               | 公开包                           | 仓库说明                           |
| ------------------ | -------------------------------- | ---------------------------------- |
| 稳定图标           | `@aifuxi/semi-icons-vue`         | `packages/icons/README.md`         |
| 实验图标           | `@aifuxi/semi-icons-lab-vue`     | `packages/icons-lab/README.md`     |
| 浅色和深色插画     | `@aifuxi/semi-illustrations-vue` | `packages/illustrations/README.md` |
| 默认主题及组件 CSS | `@aifuxi/semi-theme-default`     | `packages/theme-default/README.md` |
| 可选的现代圆角覆盖 | `@aifuxi/semi-theme-modern`      | `packages/theme-modern/README.md`  |
