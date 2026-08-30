# Upload v2.102.0 对齐矩阵

## 权威源码

- React Adapter、公开类型、DOM 与 class：`vendor/semi-design/packages/semi-ui/upload/index.tsx`、`fileCard.tsx`、`interface.ts`
- Foundation 与上传状态机：`vendor/semi-design/packages/semi-foundation/upload/foundation.ts`、`fileCardFoundation.ts`、`constants.ts`、`utils.ts`
- 默认主题与 RTL：`vendor/semi-design/packages/semi-foundation/upload/upload.scss`、`variables.scss`、`rtl.scss`
- 中英文文档/API：`vendor/semi-design/content/input/upload/index.md`、`index-en-US.md`
- 上游行为测试：`vendor/semi-design/packages/semi-ui/upload/__test__/upload.test.js`、`dragUpload.test.js`、`uploadCrop.test.js`

## 组件边界

- `Upload`：唯一公开根组件，负责受控/非受控文件列表、隐藏 file input、选择/拖放/粘贴入口、上传流程编排、文件列表组合和公开方法。
- `UploadFileCard`：公开 `Upload.FileCard` 的 Vue 等价导出，只负责 list/picture 单文件的预览、进度、校验、重试、替换、移除和自定义渲染落点。
- `UploadNodeRenderer`：把函数 prop/作用域 slot 返回的 `VNodeChild` 落到模板，不持有业务状态。
- `UploadFoundation`：从固定 vendor 通过私有 integration 边界复用上传状态机、accept/size/limit、XHR/customRequest、before/after hooks、对象 URL、目录拖放与粘贴逻辑；公开声明只暴露 UI 自有类型。
- 图片裁剪依赖公开 `Cropper`/`Modal` 能力；裁剪状态只在客户端按需建立，SSR 不创建 URL、XHR 或全局监听。

## API 与 Vue 映射

| React v2.102.0                                      | 默认值 / 行为                                                                                    | Vue 公开契约                                                                                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `action`                                            | 必填；XHR/customRequest 目标                                                                     | 同名必填 string                                                                                                                       |
| `defaultFileList`                                   | `[]`，仅初始化非受控列表                                                                         | 同名，克隆数组作为内部初值                                                                                                            |
| `fileList`                                          | prop 出现即受控，`undefined` 等价空列表                                                          | 同名并补充 `modelValue`/`v-model`；按原始 VNode prop presence 判断受控                                                                |
| `accept/multiple/directory/capture`                 | 透传隐藏 file input；drop 同样校验 accept                                                        | 同名；`directory` 同时输出 `directory`/`webkitdirectory`                                                                              |
| `disabled/draggable/addOnPasting`                   | `false`                                                                                          | Vue Boolean props；disabled 阻断打开、拖放、移除、清空和粘贴注册                                                                      |
| `listType`                                          | `list`                                                                                           | `list / picture / none`                                                                                                               |
| `hotSpotLocation`                                   | `end`                                                                                            | picture 列表添加卡位置为 `start / end`                                                                                                |
| `promptPosition`                                    | `right`                                                                                          | 根节点 `x-prompt-pos` 保留 `left / right / bottom`                                                                                    |
| `showClear`                                         | `true`                                                                                           | 必须区分缺省、显式 `false`、显式 `true`                                                                                               |
| `showRetry`                                         | `true`                                                                                           | 必须区分缺省、显式 `false`、显式 `true`，且只在 `uploadFail` 出现                                                                     |
| `showUploadList`                                    | `true`                                                                                           | 必须区分缺省、显式 `false`、显式 `true`；false 仍保留选择/上传流程                                                                    |
| `showTooltip`                                       | `true`                                                                                           | 必须区分缺省、显式 `false`、显式 `true`；传给文件名省略提示                                                                           |
| `showPicInfo/showReplace`                           | `false`                                                                                          | 同名；文件项自身同名字段优先于组件默认                                                                                                |
| `uploadTrigger`                                     | `auto`                                                                                           | `auto / custom`；custom 先进入 wait，公开 `upload()` 后发送                                                                           |
| `beforeUpload/afterUpload`                          | 可改写状态、校验文案、文件和自动移除                                                             | 同名函数 prop，Promise/对象结果保持 Foundation 顺序                                                                                   |
| `beforeRemove/beforeClear`                          | 默认返回 true，false/Promise false 阻止操作                                                      | 同名函数 prop                                                                                                                         |
| `transformFile`                                     | 选择后、构建列表前转换文件                                                                       | 同名；输出须保留 File 能力与可选 uid/status                                                                                           |
| `customRequest`                                     | 接收 progress/error/success 回调                                                                 | 同名；回调驱动与 XHR 相同的状态和事件链                                                                                               |
| `renderFileItem/...`                                | React render props                                                                               | 同名函数 prop，并提供 `fileItem`、`thumbnail`、`picInfo`、`picPreviewIcon`、`picClose`、`fileOperation`、`fileListTitle` scoped slots |
| `children/prompt/dragIcon/dragMainText/dragSubText` | ReactNode                                                                                        | `default`、`prompt`、`dragIcon`、`dragMainText`、`dragSubText` slots；同名 VNode prop 作为函数调用场景兼容                            |
| `onChange`                                          | `{ currentFile, fileList }`，各状态迁移均通知                                                    | `change(payload)`，并同步 `update:fileList`、`update:modelValue`                                                                      |
| 其余 on*                                            | accept invalid、选择、打开、进度、成功、失败、尺寸、超限、移除、重试、清空、预览、拖放、粘贴错误 | 对应 Vue emits，参数顺序保持固定源码                                                                                                  |
| ref methods                                         | `insert/upload/openFileDialog`，另有 clear/remove                                                | `defineExpose`：`insert`、`upload`、`openFileDialog`、`clear`、`remove`                                                               |
| `Upload.FileCard`                                   | 公开静态子组件                                                                                   | 独立命名导出 `UploadFileCard`，并挂到默认导出类型的 `FileCard` 属性                                                                   |

## 状态、事件顺序与上传规则

1. 选择先校验 accept，再 `transformFile`/uid/size；超限先发 `exceed`，`limit=1` 用最后一项替换，其他 limit 只接纳剩余容量。
2. 接纳文件后先发 `fileChange`，再重置 input；每个新增项发 `change`，列表更新后 `auto` 才启动上传。
3. `beforeUpload` 为 false/`shouldUpload=false` 时不发送；对象结果可改写 status、validateMessage、fileInstance、autoRemove；`afterUpload` 在成功状态写入后执行，再发 progress=100、success、change。
4. progress 使用 0.95 系数，成功置 100；失败置 `uploadFail` 并按 error → state → change 顺序通知；重试先发 retry 再重新 post。
5. 移除/清空先等待 before hook；通过后释放本组件创建的 blob URL、更新列表，再发 remove/clear 与 change。受控模式发事件但不提交父级未回传的列表。
6. `uploadTrigger=custom` 的文件为 wait，`upload()` 只上传 wait 项；`insert(files,index)` 保持 accept/limit/size 与自动上传规则。
7. drag enter 记录 currentTarget 并置 legal；leave 仅在退出原目标时复位；drop 阻止浏览器打开，目录模式递归读取，再走相同 handleChange。
8. `addOnPasting` 只在客户端且非 disabled 时绑定 body keydown/paste，卸载或状态变化完整清理；粘贴错误发 `pastingError`。

## DOM、class、样式与动效

- 根 `.semi-upload`；picture、disabled、default/error/warning/success 状态 class 与 `x-prompt-pos` 保留。
- 两个隐藏 input 分别为 `.semi-upload-hidden-input`、`.semi-upload-hidden-input-replace`，均 `tabindex=-1`；普通 trigger/drag area 保留 `role=button`、`tabindex=0`、`aria-disabled`。
- list 模式为 `.semi-upload-file-list`，主区 `role=list aria-label="file list"`；picture 为 `aria-label="picture list"`，卡片均 `role=listitem`。
- list 卡固定 250×52，preview 36×36；picture 卡与 add trigger 默认 96×96；默认主题 SCSS直接编译，保留 hover/fail/progress/drag legal/disabled 与 dark token。
- prompt 的 left/right/bottom flex 次序、图片 hot spot、定制 picWidth/picHeight 和 RTL 的 margin/close/progress 翻转按固定 SCSS。
- 组件不新增自身 enter/leave 动效；Progress/Spin/Tooltip/Modal/Cropper 沿用既有切片动效。

## 键盘、焦点、ARIA、Portal、国际化、RTL 与 SSR

- 上游普通 trigger、clear、retry、picture 操作以 `role=button + tabIndex` 表达但未实现 Enter/Space handler；Vue 不虚构事件，真实 file input 保留原生选择可访问性，Button 子操作沿用 Button 键盘语义。
- list/picture 的 role/label、上传 Progress 的 `aria-label="uploading file progress"`、图片 alt=name 与 disabled aria 保持。
- Cropper Modal 适用时创建既有 Modal Portal；稳定容器沿用 ConfigProvider/Modal 已验证语义，Upload 自身不新增定位或 capture-scroll 监听。
- locale 优先级：ConfigProvider `locale.Upload` > zh-CN/en-US 内置回退；57 Locale 完整性沿用 ConfigProvider 总门禁，本切片验证 zh-CN/en-US 渲染。
- ConfigProvider direction 通过 `.semi-rtl` 生效；验证 title margin、size/retry margin、picture close/progress/error 的左右翻转。
- 根/子路径 import SSR-safe；SSR 可输出默认/list/picture/none、disabled、验证态、受控文件列表、locale/RTL 静态 DOM。URL/XHR/FormData/document/navigator/clipboard 只在客户端交互或生命周期内使用。

## 编码前行为门禁

- `showClear/showRetry/showUploadList/showTooltip` 各覆盖缺省、显式 false、显式 true；真实 SFC template 与 `h()` 至少覆盖默认真值的调用形态。
- defaultFileList、受控 fileList、modelValue；受控选择/移除只发事件，父级未回传时 DOM 不提交。
- accept 的扩展名、MIME、通配符；min/max size；limit=1 与多文件截断；transformFile。
- auto/custom、manual upload、insert；beforeUpload/afterUpload 同步与 Promise 分支；customRequest progress/success/error；retry。
- beforeRemove/beforeClear 拒绝与通过、clear、blob URL 释放；同文件 input reset。
- drag enter/leave/drop、directory 映射、disabled；addOnPasting 注册/清理/错误。
- list/picture/none、hotSpot start/end、prompt position、validate status/message、preview fallback、progress/fail/retry/replace/remove、全部 render prop/slot。
- Exposed API、ARIA、Button/input 焦点、zh-CN/en-US、dark、RTL、SSR/hydration。
- desktop 1440×900、mobile 390×844、light/dark/RTL 的 React/Vue computed style、geometry、组件裁剪截图；独立图片再做直接 byte/pixel 比较。
- 根/子路径导出与声明、逐组件 CSS、SSR dist、真实 tarball 安装/导入/类型/tree-shaking/合规。

## Deviation

- React render props/ReactNode 映射为 Vue 函数 prop、具名/作用域 slot 与 `VNodeChild`；不暴露 React SyntheticEvent。
- `Upload.FileCard` 在 Vue 以 `UploadFileCard` 命名导出，同时保留组合导出属性，避免要求模板通过静态属性取组件。
- 当前无 accepted visual/behavior deviation；实现与浏览器对照完成后更新结论。

## 验收结论

- 状态：`ready`。
- 固定基线：Semi Design `v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Vue 源码、Foundation 隔离入口、独立 Upload 主题、中英文文档、React→Vue 迁移表与 React/Vue 场景均已完成。
- Upload 定向 unit/SSR 为 13 项通过；应用、场景注册与测试基础设施定向合计 160 项通过，类型与构建门禁通过。
- Chromium 定向 7 项通过，覆盖桌面/移动、light/dark、RTL；7 个目标的 computed style/geometry 对齐，React/Vue 独立裁剪截图直接字节相等，无 accepted visual deviation。
- 根/`upload` 子路径、独立 `upload.css`、SSR dist 与真实 tarball 安装/导入/类型/样式/合规验收通过。
