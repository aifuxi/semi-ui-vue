# Semi UI Vue 组件文档门户实施计划

## 目标

为已完成的 Semi UI Vue 公开组件建立面向使用者的双语组件文档门户。首期完整迁移 Semi Design v2.102.0 中仍适用于 Vue 的组件说明和示例，并提供可运行 Vue Demo、公开 API、搜索、主题、移动端、可访问性与通用静态发布产物。

门户使用独立的 `Semi UI Vue` / `@aifuxi/*` 身份，并直接采用 Starlight 默认文档界面，不维护独立站点主题或仿制 Semi 官网壳层。

## 首期范围

- 双语首页与组件总览。
- 快速开始、导入与样式、TypeScript、主题与暗色模式、国际化、SSR、React→Vue 迁移、图标与插画、可访问性与浏览器支持。
- 全部公开组件的完整双语页面、Vue Demo 和 API 文档。
- Starlight 默认 Header、Sidebar、页内目录、搜索、主题/语言切换、页面标题、分页与 Footer。
- Pagefind 静态搜索和通用静态发布产物。

首期不包含设计原则、客户案例、生态市场、博客、营销首页、多版本站点、在线代码编辑器、分析监控和自动服务器部署。

## 应用边界

```text
apps/
  docs/                 Astro + Starlight 公开文档门户
  parity-vue/           由现有 docs-vue 重命名的内部 Vue 对照工作台
  reference-react/      固定 Semi v2.102.0 React 对照工作台
```

- `apps/docs` 消费公开 `@aifuxi/*` 入口，不读取 `vendor/**` 运行时代码。
- `apps/parity-vue` 保留固定场景协议和 Playwright 对照职责。
- `vendor/semi-design` 只用于内容、视觉与覆盖率参考。

## 内容结构

```text
apps/docs/src/content/docs/
  zh-CN/<category>/<page>.mdx
  en-US/<category>/<page>.mdx
apps/docs/src/demos/<component>/*.vue
apps/docs/src/data/api/<component>.ts

docs/components/<component>/
  alignment.md
  coverage.md
```

- 公开 MDX、Demo 与 API 元数据只在 `apps/docs` 维护。
- 对齐矩阵和覆盖清单只作为维护证据，不进入站点导航或搜索。
- 现有组件 `index*` 与 `react-to-vue.md` 的有效内容迁入正式页面后删除原重复副本。
- 每个上游章节和 Demo 必须在覆盖清单中标记为已迁移或给出有证据的排除理由。

## URL 与版本

- 正式域名：`https://semi.fuxiaochen.com`。
- 正式 canonical URL：`/zh-cn/<category>/<page>` 与 `/en-us/<category>/<page>`；`lang` 仍使用 BCP-47 的 `zh-CN` / `en-US`。
- `/` 固定跳转到 `/zh-cn/`；同时为原计划中的 `/zh-CN/*` 与 `/en-US/*` 生成带 canonical 的静态兼容入口。
- 两种语言必须使用相同相对路径并完整成对，不以内容回退掩盖缺失翻译。
- 首期只维护一个活动组件库版本，不增加版本前缀；页面同时显示组件库版本和固定参考基线 v2.102.0。

## 站点壳

站点直接使用 Starlight 默认主题和全部默认壳层组件，包括 Header、Sidebar、页内目录、搜索、主题与语言切换、页面标题、分页和 Footer。`apps/docs` 不注册 `customCss`，不维护 Starlight component overrides，也不建立独立的文档站主题层。

## Demo 契约

- 每个 Demo 是独立的 Vue 3 SFC，统一使用 TypeScript、Composition API 与 `<script setup lang="ts">`。
- 页面预览和源码展示读取同一个 `.vue` 文件。
- Demo 通过公开 `@aifuxi/*` 入口消费组件和样式。
- 静态示例优先 SSR，需要交互时选择最低必要的 Astro hydration 指令。
- 首期不引入浏览器 Vue 编译器；外部在线运行能力留作后续增强。

## API 契约

- 公开 TypeScript 类型决定 Props、Emits、Slots 和 Exposed API 的成员与类型。
- 结构化双语元数据提供说明、默认值、版本和注意事项。
- 生成器只读取公开导出，过滤内部运行时类型。
- 公开成员无说明、元数据引用不存在成员或中英文缺失时构建失败。
- MDX 页面不再手写整张 API 表。

## 搜索

- 使用随静态产物发布的 Pagefind，不依赖外部服务。
- 搜索只返回当前语言中已完成的正式页面。
- 索引标题、正文语义、章节、Demo 用途、API 成员和说明。
- Demo 源码正文、开发中页面和维护证据不进入普通全文索引。

## 组件页面完成门槛

组件页面进入正式导航前必须同时满足：

1. 中英文页面完整成对。
2. 上游章节与 Demo 全部完成映射或记录排除理由。
3. Props、Emits、Slots 和 Exposed API 覆盖率 100%。
4. 全部 Demo 通过类型检查、构建和适用的浏览器交互测试。
5. light/dark、桌面/移动页面可用。
6. 链接、锚点、搜索与许可检查通过。
7. 不包含“待补充”或“即将支持”等绕过完成门槛的占位内容。

## 浏览器证据

- 文档站只验证 Starlight 默认壳层下的路由、链接、锚点、溢出、主题切换、键盘导航和基础交互，不维护自定义壳层几何或整页视觉快照。
- 组件本身的视觉、明暗主题和响应式对齐继续由独立 React/Vue parity 测试负责，不能用文档站截图代替。

## 许可、隐私与发布产物

- 覆盖清单记录迁移内容的上游路径、固定版本和改编结果。
- 静态产物包含项目 License、DouyinFE MIT 归属和实际第三方 Notice。
- 不迁移来源不清晰的营销图片、客户 Logo、内部服务代码或第三方嵌入。
- 不包含分析、监控、Cookie、用户标识、外部搜索或核心 CDN 依赖。
- 仓库只交付在普通静态 HTTP 服务器中验证过的通用静态目录，不附带 Nginx、Caddy、Docker、SSH 或云厂商配置。
- DNS、TLS 和云服务器上线由项目所有者在仓库外完成。

## 实施阶段

### 阶段 0：冻结输入与影响范围

- 核对 vendor tag/SHA、inventory、README 完成状态与当前工作树。
- 统计 85 个公开根模块、上游文档章节和 Demo 数量。
- 建立文档页面、公开导出、主题入口和上游内容路径的统一 registry。

### 阶段 1：拆分应用并建立门户骨架

- 将 `apps/docs-vue` 重命名为 `apps/parity-vue`，同步 workspace 名称、脚本、Playwright、边界检查和架构文档。
- 新建 `apps/docs`，精确锁定兼容的 Astro、Starlight、Vue 与 MDX 依赖。
- 配置双语内容、正式域名、根路径、Pagefind、静态输出和根路径跳转。
- 增加 `dev:docs`、对照工作台命令及文档专属检查入口。

### 阶段 2：默认站点壳与内容基础设施

- 使用 Starlight 默认主题和默认组件，不增加 `customCss` 或壳层 override。
- 建立页面 schema、双语配对、导航 registry 和完成状态过滤。
- 实现 DemoBlock、源码读取、API 生成器和覆盖清单校验。
- 实现 License/Notice 页面、无跟踪检查和通用静态产物验证。

### 阶段 3：六组件参考批次

- Button
- Select
- Modal
- Table
- Icon
- JsonViewer

六个组件全部通过内容、API、Demo、搜索、可访问性和静态产物门禁后，冻结模板和批量迁移规范。

### 阶段 4：批量迁移

按固定 `content/order.js` 和上游分类推进：

1. 基础、布局与资源
2. 输入类
3. 导航类
4. 数据展示与容器
5. 反馈与引导
6. AI、内容渲染与媒体长尾
7. 门户基础指南与全局资源页收口

每批只把达到组件文档完成门槛的页面加入正式导航。

### 阶段 5：首期发布审计

- 执行全部双语、API、Demo、链接、搜索、可访问性和许可门禁。
- 在隔离静态服务器中验证最终产物，不以 Astro 开发服务器结果替代。
- 审核正式域名链接、站点地图、canonical、404、根路径跳转和旧地址别名。
- 输出静态目录与完整性证据，由项目所有者部署至云服务器。

## CI 分层

- 所有文档变更：schema、双语、API、Demo 类型、构建、链接、锚点、搜索、许可。
- 单组件文档变更：对应页面浏览器矩阵。
- DemoBlock、API 生成器、搜索变更：完整代表页浏览器 smoke。
- 组件源码或主题变更：文档测试加对应组件及受影响链的 React/Vue 对照。
- 共享运行时、共享主题、Playwright 基础设施或发布审计：全部组件浏览器回归。

## 完成定义

首期只有在基础指南与全部公开组件页面均达到完成门槛、静态产物验证通过、许可归属完整，并且不存在未解释的上游内容缺口时才完成。域名 DNS、TLS 与服务器部署不属于仓库完成条件，但上线后需要另行核验实际可访问性。
