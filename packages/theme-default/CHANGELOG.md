# @aifuxi/semi-theme-default

## 2.1.3

No changes in this release.

## 2.1.2

No changes in this release.

## 2.1.1

No changes in this release.

## 2.1.0

### Minor Changes

- [#32](https://github.com/aifuxi/semi-ui-vue/pull/32) [`da74d73`](https://github.com/aifuxi/semi-ui-vue/commit/da74d73f689c02f9eaf4126b0c5178771ed44b2a) Thanks [@aifuxi](https://github.com/aifuxi)! - 增加独立的颜色生成器公开入口，提供与固定 Semi DSM 算法结果一致的单色阶和全色盘生成、双模式语义主题及普通 CSS 输出。支持局部主题、强制深浅模式和弹层颜色继承，消费者无需 Sass 或专用构建插件；默认主题继续保持固定 Semi v2.102.0 基线。

- [#32](https://github.com/aifuxi/semi-ui-vue/pull/32) [`c5575dd`](https://github.com/aifuxi/semi-ui-vue/commit/c5575ddd2866ee556099478c06a5c49245afe310) Thanks [@aifuxi](https://github.com/aifuxi)! - 提供字体、字号、字重及行高的公开 CSS 主题变量，默认排版保持 Semi v2.102.0 基线。支持局部主题、默认弹层的排版继承，以及主题和字体变化后的 Typography 省略重算；用户定制主题无需 Sass 或专用构建插件。

### Patch Changes

- [#32](https://github.com/aifuxi/semi-ui-vue/pull/32) [`5d5daed`](https://github.com/aifuxi/semi-ui-vue/commit/5d5daed74283bd66661e337701b6a2667661989e) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复普通 Typography 字重覆盖 Upload 文件名强调的级联回归。

  通过固定 Semi 基线的实际深浅模式与尺寸、状态对照，修复日期选择器面板、Select 加载指示、Cascader 初始展开、Tree 加载与虚拟布局、Table 选择禁用、虚拟列宽及分组标题、AI 输入菜单宽度与模板图标、AI 对话删除菜单、Sidebar 链接状态、Chat 默认 Markdown 排版及样式依赖、JSON 搜索焦点与音视频音量轨道尺寸差异。

## 2.0.3

No changes in this release.

## 2.0.2

No changes in this release.

## 2.0.1

No changes in this release.

## 2.0.0

### Major Changes

- [#24](https://github.com/aifuxi/semi-ui-vue/pull/24) [`1754b97`](https://github.com/aifuxi/semi-ui-vue/commit/1754b979690628dd66e0b4179afb93655f2e5c6f) Thanks [@aifuxi](https://github.com/aifuxi)! - 逐组件 CSS 改为通过 `base.css` 和共享样式资源组合依赖。手动导入逐组件 CSS 的使用者需按 `style-dependencies.json` 同时导入对应依赖；`index.css` 全量导入保持不变。

## 1.2.0

No changes in this release.

## 1.1.2

### Patch Changes

- [#20](https://github.com/aifuxi/semi-ui-vue/pull/20) [`49e565c`](https://github.com/aifuxi/semi-ui-vue/commit/49e565ce59a4d01b7c18f32ff946f96932dc969f) Thanks [@aifuxi](https://github.com/aifuxi)! - 补全 Form 样式入口，使单独引入 `form.css` 即可覆盖所有公开的 `Form.*` 字段控件。

## 1.1.1

No changes in this release.

## 1.1.0

No changes in this release.

## 1.0.0

No changes in this release.

## 1.0.0-next.1

No changes in this release.

## 1.0.0-next.0

No changes in this release.

> 0.1.0 是清除旧 alpha 计数时由 Changesets 生成的未发布迁移基线，不代表一次 npm 发布。首个外部候选由后续版本 PR 生成。

## 0.1.0

No changes in this release.
