# 安装包目标校验与第三方版本通知修复

## 问题现象与复现

- `verify-pack` 校验 `./dist/shared/*.css` 时，即使 `dist/shared` 没有 CSS，只要父目录存在 `dist/index.css` 就错误通过。使用隔离临时目录构造这两个位置，新增回归在修复前失败。
- 第三方通知生成器将 markdown-it 版本写为 `14.3.1`，但当前已安装版本和包清单均为 `14.3.3`。直接调用真实生成器，将输出写入仅声明 markdown-it 的临时包，新增回归在修复前确认最终通知版本错误。

## 已确认根因

- 通配目录在截取星号前缀后再调用 `path.dirname`，`dist/shared/` 被解析为父目录 `dist`；同时只匹配后缀，没有区分文件和目录。
- 许可证依赖表重复硬编码版本。只有 Tiptap 会读取已安装清单，markdown-it 升级后通知中的旧值未同步。

## 修复方案与范围

- 将导出目标检查移入现有 `public-export-entries.mjs` 供真实安装包检查和 fixture 共用。对完整目标取目录，按文件名前后缀匹配实际文件；当前支持单一文件名通配，其他模式明确报错。条件导出仍递归检查，非通配目标仍检查存在性。
- 所有第三方通知均从复制许可证的同一安装位置读取 `package.json` 的版本，移除重复版本表。SBOM 继续保留清单声明的版本或范围，本次不改变其契约。
- 未修改 vendor、依赖版本、锁文件或公开包 API。既有完整主题检查也会逐一读取共享 CSS，因此目录漏检是独立检查器错误，不代表完整发布链一定漏掉全部共享样式缺失。

## 验证结果

- `pnpm test:unit scripts/public-export-entries.spec.mjs scripts/write-compliance-artifacts.spec.mjs`：修复前新增两项失败；修复后 2 文件、3 项通过。涵盖父目录同后缀干扰、目录伪装文件、文件名前缀、嵌套条件导出、固定目标缺失、真实通知输出、原样许可证与 SBOM 范围保留。
- 对当前六个公开包清单调用同一检查函数，完整 exports 目标均通过。该步骤只读现有产物。
- 五个受影响脚本/测试的定向 ESLint 通过；Prettier 与 `git diff --check` 通过。
- 使用项目 mise Node `24.18.0`、pnpm `12.3.4`。未执行全量构建、发布或隔离 registry 安装；测试生成物位于临时目录并在完成后删除，没有覆盖共享 `dist`。
- 复现与通过日志保留在已忽略的 `.local/audit-infra-red.log`、`.local/audit-infra-green.log`。Vitest 出现既有 Vite native config 扩展名提示，不影响定向结果。
