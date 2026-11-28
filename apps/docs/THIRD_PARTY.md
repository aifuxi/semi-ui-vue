# 文档站第三方归属

本站部分文字和静态资源最初参考或改编自 Semi Design v2.102.0（`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`）。当前页面、示例与资源已纳入本仓库维护；这项历史来源不表示 Semi Design 官方认可或维护本项目。

- `content/public/site/site.css` 包含从该版本 `src/styles/{layout,index,doc,docDemo}.scss`、`src/components/PageAnchor/index.scss` 编译的样式，以及 `@douyinfe/semi-site-doc-style@0.0.5` 的正文排版 CSS。原始文件校验值记录在 [upstream-asset-sources.json](data/upstream-asset-sources.json)。
- `content/public/site/Inter-*.ttf` 取自同版 Semi Design 的站点资源。两份字体的版本为 Inter 3.007（`a0b6a71a9`），版权归 The Inter Project Authors，采用 SIL Open Font License 1.1。随站点分发的 [Inter 版权声明及许可全文](content/public/site/Inter-OFL.txt) 对应该版本的 [Inter 原始许可](https://github.com/rsms/inter/blob/a0b6a71a91e09e1a919fb725d7f2d9749266a230/LICENSE.txt)。
- `content/public/doc-icons/*.svg` 源自同版 Semi Design 的站点资源；`doc-heart.svg` 源自其 `packages/semi-icons-lab/src/svgs/heart.svg`。
- 页眉使用本地 `doc-icons/semi_logo.svg`，文件与 Semi Design v2.105.2 的同名资源一致，图形与该版本锁定的 `@douyinfe/semi-site-header@0.0.29` 字标一致。浏览器图标 `content/public/favicon.ico` 来自该基线 `src/html.js` 引用的 [Semi Design 站点图标](https://lf9-static.semi.design/obj/semi-tos/images/favicon.ico)，SHA-256 为 `eff308e561a761480d814f796a5262422e4b192b89b7a5c5ba1f94a3837f17a3`。
- `content/public/site/Inconsolata-Regular.woff2` 来自 `typeface-inconsolata@1.1.13`。
- 文档正文中的历史图片与官方资源链接仍指向原权利人提供的地址；本站不复制这些远程素材。

Semi Design 资源保留 [MIT 许可文本](content/public/site/SEMI-LICENSE)。上述两个 npm 包的 `package.json` 均标注 MIT；其名称、版本与作者信息保留于本文及仓库的 `pnpm-lock.yaml` 历史记录。后续更新这些本地资源时，须同步检查许可与归属。
