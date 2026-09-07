# AI 工作记录：Toast 双语示例补齐

- 日期：2026-09-07
- 状态：补齐线完成；Toast 严格文档验收未执行

## 目标与基线

补齐固定上游中文九项、英文十项 live 示例、双语章节及迁移说明。实际站点逐项验证主要操作、源码、重置与适用的编辑器路径；仅补齐线，不生成 accepted。

初始工作区干净；vendor 实测为 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21` / `v2.102.0`，保持只读。按 React Adapter、Foundation/SCSS、默认主题、双语内容、图标顺序核查，复用 `docs/components/toast/alignment.md`。

## 代表路径与实现边界

先只实现以下三项双语代表并完成实际浏览器检查，通过后才生成其余示例和注册：

- Delay（中文5/英文6）：最简单，首次打开、10秒自动关闭、关闭后重开。
- Basic（双语1）：普通3秒、stack多条hover展开；10秒leading-only节流、关闭回调取消节流后重开。
- Factory（中文9/英文10）：最高容器风险，自定义父节点首次挂载、默认实例隔离、关闭动画后重开、卸载清理。

每项独立小型SFC负责一个上游演示；Context额外依赖同语言目录的 `ContextContent.vue` 与 `context-key.ts`。其余示例无需拆分展示组件或新增通用composable。

| 中文索引 | 英文索引 | 示例        | 主要契约                                 |
| -------- | -------- | ----------- | ---------------------------------------- |
| 1        | 1        | Basic       | 3秒普通提示、10秒节流、堆叠展开          |
| 2        | 2        | Types       | success字符串简写，warning/error对象输入 |
| 3        | 3        | Colored     | 四种状态、theme=light                    |
| —        | 4        | Stacking    | 英文独有，10秒多条堆叠与hover            |
| 4        | 5        | Links       | 单行、多行Typography链接与双语文案       |
| 5        | 6        | Delay       | duration=10                              |
| 6        | 7        | ManualClose | duration=0、id去重、手动关闭及重开       |
| 7        | 8        | Update      | 同id原位info→success、1秒更新、重启计时  |
| 8        | 9        | Context     | provide/inject真实消费Light、原地holder  |
| 9        | 10       | Factory     | 自定义容器、默认/局部实例隔离            |

## 取舍与差异

- Basic使用本地时间戳实现固定上游lodash throttle的leading=true/trailing=false及onClose取消语义，无待清理timer，不复制第三方实现或新增REPL依赖。
- 保留上游共同的英文按钮文本，链接按语言显示；Bytedance正文替换为AIFUXI。无新增第三方资产或依赖，改编来源由映射关联固定上游；既有站点许可生成流程继续覆盖Semi MIT归属。
- Factory使用模板ref避免同页/编辑器容器id冲突，补齐上游遗漏的Toast导入，保持上游fixed定位而非擅自改为局部relative布局；卸载销毁局部实例。
- Context移除固定Adapter和公开类型均不消费的title；使用类型化InjectionKey及独立内容组件真实注入，不预先拼接字符串。每个语言目录放置两个小依赖文件，使示例能独立进入REPL。
- ManualClose卸载时关闭持久提示；Update用useId隔离实例，保留单实例内同id更新，卸载清理所有未触发timer和当前提示。
- 上游文档的id写为number，公开React类型为string；文档明确Vue接受string/number并返回string。说明静态同id更新不适用于每次创建新条目的holder，及外部close/destroyAll不额外触发onClose。
- 补齐API、Config、Accessibility、文案、Token与英文迁移表原有中文残留。内部ToastCard不是公开导出，保留文案规范但不伪造live示例。

## 定位过程与证据边界

- 交互浏览器观察到 `.semi-toast[role=alert]` / `aria-label="info type"`，关闭按钮的可访问名称来自close图标。自定义wrapper首次位于模板ref容器内；外层wrapper高度为0，局部截图裁剪真实 `.semi-toast-content`。
- Typography的上游无href链接在实际DOM为 `.semi-typography-link a`，不具备浏览器link角色；首次整批烟测错误使用getByRole(link)，随后根据真实DOM定点修正定位，不更改示例语义。
- 批量新增文件后开发HMR的源码面板为空，重启开发服务后恢复；未修改共享外壳。
- 初版Context跨父目录引用在实际REPL被请求为 `/zh-cn/components/ContextContent.vue/` 与 `/zh-cn/components/context-key/`，返回404。改为同语言目录依赖后，中英文Context页面、源码、重置和编辑器运行全部定点通过。未扩大到共享REPL修复。
- 开发态精确worker请求失败及其关联Event由共享smoke runner已有规则记录；另将NUXT_E7002四类导航预取警告和REPL sandbox精确警告写入本批 `warnings-<locale>.json`。Notification未改动页面同样复现预取问题：payload路径返回200 text/html，正常页面路径可用。未统一忽略console error、未修改共享runner，静态烟测不允许这些开发态例外。

## 已执行验证

- 本批Prettier、ESLint、内容注册检查通过；代表与扩展阶段Nuxt typecheck通过。最终类型检查还由联合入口执行。
- 初始 `accept:nuxt:batch --affected --plan`：Button、ConfigProvider、Dark Mode、Icon、Locale、Navigation六批证据有效。
- 双语代表通过：`apps/docs/.data/documentation-smoke/toast/20260907-representatives-passed/`；覆盖3组主要行为、各自源码/重置、Delay与Factory编辑运行。早期失败目录保留，不当作通过证据。
- Context修正后定点通过：`20260907-context-colocated/`；Links定点通过：`20260907-links-restart/`，均位于上述toast烟测目录。
- 整批开发站通过：`20260907-full-dev-passed/summary.json`，中文9项/英文10项，逐项主要操作、源码/重置；Delay、Factory、Context、Links双语编辑运行及iframe视口检查。Context局部截图已保存。
- 所有批量运行使用仓库Node、锁定Playwright Chromium 151.0.7922.34、1440×900、DPR1、light，中英文独立context并发。脚本复用共享 `documentation-smoke.mjs`，不复制runner。

## 未验证事项与后续

最终验证已完成：

- `pnpm --filter @workspace/docs check` 通过：联合类型/内容/构建/产物门禁，196页、1573个注册Demo、395条预渲染路由；许可与5809个产物文件散列通过。日志：`apps/docs/.data/documentation-smoke/toast/20260907-check.log`。现有lottie direct-eval、sideEffects与Lightning CSS警告保留。
- 最终静态整批烟测：`20260907-full-static/summary.json`，中文9项、英文10项全通过；console error、pageerror、requestfailed均为0，只有共享runner明确记录的Volar emmet/pug提示，无开发态fallback。两张Context局部截图已保存并查看中文截图。
- 独立无编辑器context的时钟验证：`20260907-timers/summary.json`，双语验证9.5秒仍在/10.5秒已关闭、duration=0在15秒后仍保留、同id更新后重新计时、卸载后不发生延迟更新。
- 实际修改编辑器后运行：`20260907-editor-edit/summary.json`，双语均将provide的Light修改为Edited context，运行后holder内容显示新值；退出编辑后原示例仍显示Light。此运行与模拟时钟完全隔离。
- 最终 `accept:nuxt:batch --affected --plan` 确认六批历史证据仍有效，无需重建或重验。
- 全部smoke脚本、失败/成功摘要、精确开发警告和局部截图保留于ignored的 `apps/docs/.data/documentation-smoke/toast/`；未执行clean。代表、完整与编辑修改脚本分别保留在representatives、full-dev、editor-edit对应目录，最终通过证据以本节指定目录为准。

映射从756/859增至765/859，待补齐94项；有效严格验收仍为43/859，已映射待验收722项。下一补齐批次UserGuide 8项，随后DragMove 4项；验收线下一批仍为Divider 2项。
Toast未执行严格React/Vue双语明暗、RTL、样式/截图/完整交互矩阵，不新增accepted。本批没有修改组件、公开类型、主题或共享构建/运行设施，无需额外组件发布包回归。未执行全仓check:full、提交或推送。
