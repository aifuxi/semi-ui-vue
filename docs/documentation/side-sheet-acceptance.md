# SideSheet 文档批次验收

固定基线 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21，show/sidesheet 双语各 6 段，顺序一致。全批双语 × 明暗 × LTR/RTL 共 48 项正式用例；证据由主 agent 正式 runner 生成，本文不预先声称通过。

## 固定双语片段前提审阅

已逐段核对全部 12 段的实例数、控件、文案、props/事件、DOM 属性、依赖与 Portal。每例初态恰好 1 个触发按钮、1 个受控 SideSheet；触发文字都是 Open SideSheet，仅 Custom 是 More Information。没有图片、远程资源或多文件依赖。默认 closeOnEsc=false，按 Escape 保持打开；默认 close 按钮没有额外可访问名称，以专属 class 定位后验证真实焦点。closeIcon=null 在固定 SideSheetContent 中使用 `closeIcon || <IconClose/>`，所以中文 Custom 仍有关闭按钮。

| 索引 | 示例      | 固定前提与断言                                                                                                                                                                                                                                                                                                       |
| ---- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Basic     | 中文标题滑动侧边栏，英文 Sidesheet；正文两个 p，逐字保留。默认从右侧打开，mask 点击关闭。                                                                                                                                                                                                                            |
| 2    | Placement | 初态 right；4 个 radio，right/left/top/bottom；标题同 Basic，正文两个 p。逐方向打开关闭采样，top/bottom 高度按实际固定 Foundation 为448px，非上游文档表格400。                                                                                                                                                       |
| 3    | Size      | 初态 small；3 个 radio，small/medium/large，宽448/684/920；英文标题 SideSheet（大小写不同于 Basic），逐尺寸验收。                                                                                                                                                                                                    |
| 4    | Outside   | 1 个 TextArea，placeholder=Please enter something，marginTop=12；mask=false、disableScroll=false。中文标题可操作外部的侧边栏/正文这里是输入的内容：；英文标题SideSheet/正文Here is what you entered:。保持外部输入可编辑并实时显示第二段。                                                                           |
| 5    | Container | 1 个 .sidesheet-container，高320、overflow hidden、relative、border 1px、radius2、padding24、居中、fill-0 背景；span Render in this 与两个 br。内部 Portal 宽220，标题中文渲染在指定容器内部/英文SideSheet。Vue用实例ref替代参考的全局querySelector，不改变容器。                                                    |
| 6    | Custom    | 1 Form，1 dateTime DatePicker 宽272、6 radio（操作系统4、来源2）、1 multiple Select 宽560/4用户标签、1 Banner、2 footer按钮。日期当前时间；固定测试只设置Date，真实计时器和动效继续运行。初值type=all、origin=scm、users=[1,2,3,4]。双语 footer 原片段均无handler，恢复 Vue 无操作按钮，点击不重置、不提交、不关闭。 |

Custom 逐语言差异：中文 title=创建资源包，Date label=创建时间，radio=全平台/iOS/Android/Web、从SCM上传/手动上传，用户曲晨一/夏可曼/曲晨三/蔡妍；Banner warning、icon=null、有默认关闭按钮，正文 strong 当前部署环境：线上部署 + br + SCM 提示。英文 title=Create New Package，label=Created Time，radio=All/iOS/Android/Web、Uploaded From SCM/Uploaded Manually，用户 Tianyi Lee/Chen Qu/Yan Cai/Wenzhuo Cui；Banner 默认 info、icon=null、closeIcon=null，英文正文保留完整两句。固定 footer Reset/Submit 或重置/提交均没有 onClick。title 为 Typography.Title heading4；header/body borderBottom 均1px主题边框，footer flex-end、第一按钮marginRight8。

React 适配仅为匿名箭头补 ESM 导出，以及英文原站 en_US Provider。Vue 清理迁移引入的按钮/radio/span 首空格。未改变固定基线、动效、尺寸、字段数量或交互意图。

## 审阅与验收范围

双语章节、全部手写 API 与公开 SideSheetProps/Emits/Slots 已核对。此页面无 api-table 元数据输入。迁移说明已有 height=448 的上游表格偏差、canVerticalSetWidth、v-model:visible、cancel、after-visible-change、命名slot与实例容器说明。公开 SideSheetCancelEvent 含 MouseEvent/KeyboardEvent，closeOnEsc 默认false，keepDOM 默认false。

矩阵每例先比较默认根文本、样式、几何和截图；打开比较真实 SideSheet 与 mask 的计算样式、相对几何以及viewport绝对位置，容器额外核对 Portal 在实例内。几何各轴≤0.5 CSS px，截图 threshold≤0.1、差异比例≤0.001。与 Modal 成熟矩阵一致，仅在 Portal 截图隐藏外部文档外壳并设统一主题底色，真实 mask 独立比较且不遮盖；无容差放宽。打开等待真实 Animation.finished，关闭等待节点卸载，全部例退出后重开，mask与关闭按钮均测试；Outside 验证外部编辑和未锁滚动；Custom 验证6 radio/4标签，iOS选择和 footer 无操作语义。默认片段没有异步提交，不发明异步契约。

明亮LTR双语额外覆盖源码逐字等于磁盘、源码展示、重置后打开关闭、在线编辑 iframe 打开关闭及错误门禁。setFixedTime 只冻结 Date，不停计时器，不会暂停编辑器。全部页面与console错误都保留为失败。完整正式用例数须由主 agent Playwright --list 核对。

### Custom 同名 Radio 的固定行为

固定 RadioGroup 在未传 name 时使用 `default`，Custom 的两个 Form.RadioGroup 同处一个 form 且未传 name。React 在点击 iOS 后，iOS label 已切到 `semi-radio-checked`、All/全平台取消，但原生 input.checked 不保持 true；直接使用 Playwright check() 会因其附加原生状态断言失败。矩阵使用真实 click 后验证上述 label 终态及 footer 惰性，继续完整节点样式、几何和像素对照，并额外逐项比较两端六个 radio 的 checked property 和 name，不能将视觉选中记录为原生 checked=true 已通过。
