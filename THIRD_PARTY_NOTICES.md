# Third-Party Notices

本项目以只读 submodule 中的 Semi Design `v2.102.0`（提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`）为复刻基线，并编译其主题、Foundation 样式和适用资产。

Semi Design 采用 MIT License，Copyright (c) 2021 DouyinFE。其完整许可证及上游列出的第三方归属保存在 `vendor/semi-design/LICENSE`，构建时会原样写入每个拟发布 tarball 的 `dist/THIRD_PARTY_LICENSES/Semi-Design.txt`，并同时生成 `THIRD_PARTY_NOTICES.md` 与 SPDX 2.3 SBOM。

本项目自身代码及五个公开包使用 MIT License。各发布包同时携带项目 `LICENSE`、`dist/THIRD_PARTY_NOTICES.md`、`dist/THIRD_PARTY_LICENSES/` 与 `dist/SBOM.spdx.json`；私有 workspace 工具不进入公开包。

项目开发工具包含由 Playwright 1.62.1 安装器提供的 `playwright-cli` skill（Microsoft Corporation，Apache-2.0），其来源为 [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli)。完整许可证保存在 `.agents/skills/playwright-cli/LICENSE`；项目适配在 skill 入口和 `references/project.md` 中注明。这些文件仅用于仓库开发，不进入公开组件包。
