# Toast 文档批次验收

固定基线 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。Basic、Types、Colored、Links、Delay、ManualClose、Update、Context、Factory 九例，双语 × 明暗 × LTR/RTL，共 72 项正式组合；英文独有 Stacking 在 Basic 的 en-us 用例内额外覆盖。组件内部对齐修复使 ConfigProvider、Resizable、Typography 证据失效，四批共享一次公开包、主题与站点构建重验。

## 参考与适配

直接编译固定双语 Markdown。独立品牌替换 Bytedance→AIFUXI；双语 Other Types 固定示例的 `Hi,Bytedance dance dance` 缺一个空格，按 Vue 示例修正为 `Hi, AIFUXI dance dance`，其余文案逐字保留。

固定源码依赖三处 live scope 能力，均在批次适配器内补齐，不改共享构建别名：双语 Basic 的 `lodash-es` throttle 用等价 leading-only 实现替换；英文 Stacking 没有 `import React`；所有 `render(Demo)` 调用移除并导出命名组件。固定 `semi-ui/index.ts` 的组合导出 `export { default as Toast, ToastFactory }` 超出共享参考导入映射，这两个名字改走已公开的 `@semi-v2.102.0/toast` 别名。

Context 的 `title` 字段固定公开类型不消费，Vue 示例移除；Factory 参考沿用固定 DOM id，Vue 用模板 ref 与 `data-toast-container`，对照选择器不依赖该差异。双语文档的章节、API 与 React→Vue 迁移段落审阅有效；内部 `ToastCard` 仍不作为公开组件演示。

## 验证边界

组件侧对齐固定 `HookToast`：

1. `useToast` holder 改为逐条就地渲染裸 `ToastNotice`（内部 `ToastContextList`），空 holder 不渲染节点；命令式路径继续使用 wrapper/innerWrapper。
2. `ToastNotice.positionInList` 改为可选，hook 缺省时 `reservedIndex` 为 0，与固定 `HookToast` 不传列表位置一致。

比较 Toast 根节点的文本、语义、计算样式与几何：含 `role`/`aria-label`、`max-width`、RTL margin、`transform` 与 `animation-*`，各轴几何差 ≤0.5 CSS px。像素在 `.semi-toast-content` 上比较，threshold ≤0.1、差异比例 ≤0.001；因为 `theme="light"` 的填充是半透明的，截图期间只保留提示祖先链并把 `html/body` 背景统一为 `--semi-color-bg-0`，不裁剪或遮盖提示本体。

行为覆盖：3 秒与 10 秒自动关闭的 2999/3000、9999/10000 边界；`duration: 0` 60 秒常驻；同 id 更新内容/类型并在更新时刻重启计时；leading-only 10 秒节流、窗口内重复调用被忽略、关闭后取消节流；堆叠折叠与 hover 展开（含固定 `perspective` 3D 缩放）；重复展示去重与空操作关闭；自定义容器实例隔离与 fixed 定位；真实进出动效与编辑器内打开/关闭。计时在独立且不加载编辑器的页面用受控时钟验证。

两个方法学注意点：Vue 文档页所有示例共享同一个命令式实例，Stacking 对照前会重载页面以对齐参考页的全新实例状态；折叠采样前先进入再离开堆叠组，使 `mouseInSide` 复位（关闭后 innerWrapper 高度为 0 时，固定实现的 mouseleave 守卫不会再复位它）。

正式结果以自动生成的 evidence/toast.json 和压缩报告为准；诊断不增加 accepted。

## 2026-09-13 历史审阅补齐

逐段重读固定双语 Markdown 的全部 19 个 live 片段（中文 9、英文 10）、19 个 Vue Demo 及 Context 双语依赖，核对固定 ToastList/Toast/HookToast/Foundation 与 Vue 公开类型、命令式实例和 holder。章节、内联 API、ARIA、文案规则、Token 与 React→Vue 迁移均已审阅；映射 review 使用现有 documentReview 算法签署双语最终正文，未复制历史指纹。

API 补齐现有公开 motion、getWrapperId 和 close 返回值，说明 hover 暂停/移出重新计时及空容器错误边界。motion 仅描述命令式动画，hook holder 沿用固定裸 Toast；未添加新组件能力。固定双语 Types 都含成功文案缺空格，修正原记录的“英文独有”误述。静态四种展示方法固定 type；holder open 使用 default，不从 options.type 推断类型。Factory 和静态实例的 config 支持范围与公开 ToastConfig 一致，React Context 替换为真实 provide/inject，未声称静态实例继承页面上下文。

### 全部双语片段的诊断前提

以下数量与顺序均取自固定源码，未从 Vue 运行结果反推；所有按钮文案沿用共同英文，除 Links 外两种语言的可见结构相同。

| 示例（中文/英文索引） | 固定控件与内容                                                                | 交互、环境及适配前提                                                                                                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Basic（1/1）          | 2 按钮：Display Toast、Throttled Toast                                        | stack=true，3 秒与 10 秒，leading-only 10 秒节流，onClose 取消节流；双语均依赖 lodash-es，批次 shim 只供本例 trailing=false，采样时钟使用真实 epoch。先关闭再重开，堆叠先移入再移出以清除共享实例 mouseInSide。 |
| Types（2/2）          | 3 按钮：Success、Warning、Error，纵向两个 br 分隔                             | success 字符串，warning/error 对象；成功按钮使用 success Token。双语都把 Hi,Bytedance 统一为 Hi, AIFUXI，此为显式文案修正。                                                                                     |
| Colored（3/3）        | 4 按钮：Info、Success、Warning、Error                                         | theme=light、duration=3；半透明背景按既有采样方法统一祖先背景，仍比较整个 Toast 样式/几何及内容像素。                                                                                                           |
| Stacking（无/4）      | 1 按钮：Click multiple times                                                  | 英文独有，duration=10、stack=true；补隐式 React 导入。Basic 英文矩阵中独立导航、连续 3 次点击、折叠/hover 展开；不是漏掉的第 10 个测试标题。                                                                    |
| Links（4/5）          | 2 按钮：Display Toast、Display Multi-line Toast；单行 1 链接、多行 2 链接     | 中文：更多、查看详情、一会再看；英文：More Info、More Info、Later。保留单行 12px、多行 8px/20px，Text link 不带 href，不虚构导航效果；VNode 数组适配 Fragment。                                                 |
| Delay（5/6）          | 1 按钮：Close After 10s                                                       | duration=10；独立无编辑器页面验证 9999/10000ms 边界。                                                                                                                                                           |
| ManualClose（6/7）    | 2 按钮：Show Toast、Hide Toast；Not auto close                                | duration=0；重复展示维持 1 条，重复关闭为空操作；onClose 清 id，Vue 补卸载清理，独立时钟验证 60 秒常驻。                                                                                                        |
| Update（7/8）         | 1 按钮：Update Content By Id                                                  | 1000ms 后原条目改为 Id By Content Update/success，重新计满 3 秒。Vue useId 代替固定 toastid 隔离同时加载的示例，卸载清理 timer；不改变单例更新顺序。                                                            |
| Context（8/9）        | 1 按钮：Hook Toast；ReachableContext: Light                                   | duration=0，success；裸 holder 就地渲染、无 innerWrapper。固定 title 不被消费，Vue 移除；同语言 ContextContent.vue/context-key.ts 都必须可编译加载，真实 inject 消费 Light。                                    |
| Factory（9/10）       | 2 按钮：Default Toast、Toast in custom container；1 容器文本 custom container | 补固定 live scope 的 Toast 导入；模板 ref/data-toast-container 替代固定 id，容器挂载后点击，保留 fixed 几何和独立实例。Vue 卸载销毁局部实例。                                                                   |

全部片段无图片、外部资源或资源固有尺寸依赖；CSS、图标和 Typography 走已有本地构建。关闭按钮来自固定 IconButton/对应 Vue Button，无自定义 Escape 或焦点捕获；ARIA 为 alert 与类型标签。进入/退出须等待真实 animationend；固定 toast show/hide/stack 动画均为 300ms，既有堆叠采样的 400/450ms 等待依托该固定过渡窗口，未延长业务计时。矩阵声明为 9 × 2 语言 × 2 主题 × 2 方向 = 72 项，英文 Stacking 在 4 个英文 Basic 组合内覆盖。代表和实际 Playwright 用例清单、浏览器结果由主调度统一核验，本次审阅不代替正式验收。
