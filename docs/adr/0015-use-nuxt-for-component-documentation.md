---
status: accepted
supersedes: 0014-use-astro-starlight-for-component-documentation
---

# 使用 Nuxt 与 Nuxt Content 重建组件文档

用户确认以 Nuxt 4、Nuxt Content 3、Vue 3.5 与 TypeScript 替换 Astro/Starlight。
采用 SSR 与全量静态预渲染，交付 `.output/public`，不引入常驻服务或线上发布动作。

## 决策

- 正式内容使用 Markdown/MDC，交互示例使用 Composition API SFC；页面、源码与编辑器共享示例文件。
- 保留小写 locale 与 `components/<slug>` 地址，大小写历史入口继续可用；导航按固定上游分类与顺序组织。
- 页面视觉参考只读 Semi Design v2.102.0；品牌为 Semi UI Vue，仅呈现本站能力，不接上游账号、运营横幅、设计平台、AI 搜索或版本比较。
- Nuxt Content 负责内容查询；搜索索引在构建时生成并在浏览器本地检索。
- Vue REPL 与 Monaco 按需加载；依赖、编译器与运行资源来自本站静态产物，编辑代码在沙箱中运行。
- 正式应用只消费公开 Vue 包；上游样式与字体通过集中构建脚本读取，生成物不作为可独立修改的源码。
- 全量范围以 inventory 和覆盖账本为准，未验证项目不能被标记完成。

## 候选方案与影响

保留 Astro 无法满足用户明确的框架要求；常驻 Nuxt SSR 会改变静态部署方式；自建 Markdown 管线增加维护成本，因此均不采用。新依赖精确锁定并补充许可记录。

不修改公共组件 API、Foundation 集成方向或公开包发布契约。迁移保留 Git 历史，回退时整体恢复文档应用、工程配置与 lockfile。全量门禁通过后才切换默认入口。
