# 文档站页头对齐

## 固定来源与边界

- Semi 基线：`v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- `vendor/semi-design/src/components/header.js` 使用独立页头；该版本的 `yarn.lock` 锁定 `@douyinfe/semi-site-header@0.0.29`，MIT，作者 yanqi.xu。
- 页头发布包 `dist/index.es.js`、`dist/index.css` 是主题/GitHub/语言控件和布局的来源。参考应用以精确开发依赖加载原代码，通过既有适配边界解析到只读 submodule 的 React 控件；不安装另一版本的 Semi UI/Icons，也不向 Vue 文档站引入 React 页头。
- 发布包 integrity：`sha512-x2j/EH6T8bGRAS8P0l+mznWOY4IcR1LY6RXFRqo/7Q6ktUjra5Cm3yFXm8uaJxkXHgY8H7JWnT9hHPriI0yK6w==`。

## 用户确认的站点适配

2026-09-08 用户明确选择复用 Semi 品牌图标，并授权实施本方案。本次仅为文档页头使用现有 `IconSemiLogo`，覆盖 AGENTS.md 中禁止复用 Logo 的规则在此位置的适用；保留 `Semi UI Vue` 名称、项目首页和 GitHub 地址，不表示官方授权或合作。其他品牌、favicon 和发布包的品牌政策不变。

固定官网通过 `src/html.js` 的未锁版本远程脚本注册 `semi-search`，无法据此还原历史搜索框。因此搜索入口采用固定 Input SCSS 外观与 `IconSearch`，保持原生 button、搜索弹窗及 Control/Meta K，不声称是历史官网搜索框的像素复刻。宽度 160px、内边距 12px、图标与文案间距 8px 是本站布局选择。

保留本站指南、组件、语言路由；不引入远程导航、Twitter、登录、远程搜索或主题色服务。GitHub/语言保留原生链接语义及链接浏览器能力，以公开 `.semi-button-*` 样式契约对齐上游按钮外观。主题沿用 `semi-docs-theme` 持久化。

## 对齐矩阵

| 区域   | 固定来源与验收                                                                                   | 站点适配                                         |
| ------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| 容器   | 60px 内容高度（含底边框实际 61px）、24px 水平内边距、light 半透明背景与暗色背景、backdrop filter | 固定置顶，保留本站导航                           |
| 品牌   | `IconSemiLogo` / `currentColor`                                                                  | 32px 图标，`Semi UI Vue`，移除硬编码绿色         |
| 操作区 | 10px 间距，Semi borderless 按钮                                                                  | 不显示 Twitter/登录/主题色                       |
| 主题   | light 显示 Moon，dark 显示 Sun，extra-large、text-2                                              | Vue 偏好状态与持久化；可访问名称表述目标主题     |
| GitHub | `IconGithubLogo`、extra-large、text-2                                                            | 项目链接，保持 anchor 语义                       |
| 语言   | 22px `IconLanguage`，5px padding/内容间距，6px 圆角，EN/中文字体                                 | NuxtLink 保持当前页面路由                        |
| 搜索   | 固定 Input wrapper 样式、`IconSearch`                                                            | button/aria-haspopup=dialog，本站搜索及快捷键    |
| 状态   | 中英文 × light/dark，default/hover/focus-visible                                                 | 搜索打开/关闭、焦点恢复、主题刷新保持、hydration |

## 验证入口

`apps/docs/tests/nuxt/header.spec.ts` 在同一 Chromium/context 下加载真实固定页头和 Vue 静态页面，对主题/GitHub/语言逐项比较计算样式、相对几何和局部截图。几何容差 0.5 CSS px，截图使用项目严格阈值。品牌及搜索单独附完整页头截图，不掺入上游等价断言。

参考场景仅拦截 SiteNav 远程配置为确定性空数据，并通过公开 API 关闭登录；不加载自定义元素远程脚本。参考页头仍含 Twitter，逐控件裁剪不纳入本站未采用的区域。测试收集 Vue/React console errors 和 hydration 警告；测试产物由 Playwright HTML report 保存。

最终验收使用 `pnpm --filter @workspace/docs build` 的静态产物，再运行 `pnpm --filter @workspace/docs exec playwright test -c playwright.config.ts header.spec.ts portal.spec.ts navigation-loading.spec.ts`。`DOCS_HEADER_ORIGIN` 仅供开发预诊断，不能代替静态验收。

## 本次验收结果（2026-09-09）

- 文档站静态构建、`check:dist`（198 页及搜索/历史入口/REPL/许可散列）、Nuxt 与 React 参考端类型检查、相关 ESLint/Prettier 检查通过。
- 正式静态回归：上述 3 个 spec，加 `--fail-on-flaky-tests`，212/212 通过，耗时 1.4 分钟，无重试与 flaky；包含全站页面加载与 hydration 错误检查。
- 页头 4 个语言/主题组合完成 36 组控件状态对照（3 个控件 × default/hover/focus），计算样式精确匹配，几何及截图达到仓库阈值；另有 2 个语言交互用例。light/dark 页头截图已人工查看。
- 保留测试真实时序：SSR 初始内容不能作为事件绑定完成的信号，先等待 Vue 挂载完成；语言切换等链接 href 更新再反向切换；截图前等待前一 Tooltip 退场，focus 截图包含完整轮廓，不扩大阈值或使用 mask。
- 共享输入改变使历史文档组件视觉证据的指纹失效。构建按既有规则将 coverage 中 43 个中文示例的有效验收计数降为 0，保留原证据文件；这表示需要重验，不是本次发现了 43 个组件缺陷。本任务完成页头对照和全站加载回归，没有重新认证历史组件视觉矩阵。
