# npm 发布手册

本仓库发布五个统一版本的公共包：

1. `@aifuxi/semi-theme-default`
2. `@aifuxi/semi-icons-vue`
3. `@aifuxi/semi-icons-lab-vue`
4. `@aifuxi/semi-illustrations-vue`
5. `@aifuxi/semi-ui-vue`

顺序是发布契约的一部分：UI 精确依赖同版本稳定图标包，因此始终最后发布。Foundation 集成层、测试基础设施和两个应用保持私有。

## 版本与 dist-tag

- 五个公开包必须使用完全相同的版本。
- 包含 prerelease 标识的版本发布到 `next`。
- 没有 prerelease 标识的稳定版本才发布到 `latest`。
- Git 标签必须是 annotated tag，名称严格为 `v<version>`，message 严格为 `发布 v<version>`，例如标签 `v0.1.0-alpha.5` 的 message 是 `发布 v0.1.0-alpha.5`。

`scripts/release-packages.mjs` 是包名、发布顺序、registry 和 dist-tag 规则的唯一集中清单。修改发布身份时必须同步通过 `pnpm release:verify`。

## 自动升版、提交与标签

后续统一版本使用根命令升级，不再逐个修改五个公开包：

```bash
# 只递增当前 x.y.z-alpha.N 的 N
pnpm release:bump alpha

# 显式指定严格、无 v 前缀且高于当前版本的 SemVer
pnpm release:bump 0.2.0-beta.0
pnpm release:bump 0.2.0
```

命令要求工作区和暂存区完全干净，并在写入前确认 Git 提交身份有效、五包版本一致且目标标签不存在。成功后只提交五个公开包的 `package.json`，预发布提交沿用 `chore(release): 升级公开包版本至 alpha.5` / `beta.0` 格式，稳定版提交使用完整版本号；随后创建 message 为 `发布 v<version>` 的 annotated tag。

命令不会执行 `push`、`release:check` 或 npm 发布。检查生成的提交和标签后，先在标签所在提交运行发布门禁，再分别推送提交和精确标签：

```bash
pnpm release:check
git push origin HEAD
git push origin v0.1.0-alpha.5
```

推送 `v*` 标签后，`.github/workflows/publish.yml` 才会执行 GitHub OIDC 发布。

## 发布前门禁

在发布提交上执行：

```bash
pnpm install --frozen-lockfile
pnpm playwright:install
pnpm release:check
```

`release:check` 先固定到官方 npm registry 审计全部 production 依赖，并阻止 moderate、high 或 critical 已知漏洞；随后执行边界、格式、lint、类型、单元/SSR、构建、主题、真实 tarball 消费和完整 Chromium 回归。发布验证还会扫描公开 manifest、README 和 `dist`，阻止 `@workspace/*`、`vendor/**`、私有 Foundation 类型及本机绝对路径进入产物。显式使用官方 registry 是为了避免本地镜像未实现 npm audit API 时产生错误结论。

Linux 截图不能覆盖 Darwin 基线。首次启用 Linux CI 前，手动运行 `visual-linux.yml`，下载生成的 `linux-snapshots` artifact，人工审核后再把 Linux 基线纳入仓库。

## 首次人工引导发布

npm trusted publisher 只能绑定已经存在的包。因此 `0.1.0-alpha.0` 需要由 `aifuxi` 在本机用 2FA 创建，仓库和 CI 不保存长期写入 token。
`publish.yml` 会对这个引导标签执行质量与浏览器门禁，但显式跳过 OIDC 发布任务；从 `0.1.0-alpha.1` 起才允许工作流发布。

1. 确认 npm 账户已启用 2FA，并显式登录官方 registry：

   ```bash
   npm login --registry=https://registry.npmjs.org/
   npm whoami --registry=https://registry.npmjs.org/
   ```

2. 保证 `master` 上的发布提交已经推送，工作区干净，并创建精确标签：

   ```bash
   git tag -a v0.1.0-alpha.0 -m "发布 v0.1.0-alpha.0"
   git push origin master v0.1.0-alpha.0
   ```

3. 先执行只读预检，再人工确认执行真实发布：

   ```bash
   pnpm release:preflight
   pnpm release:publish
   ```

`release:preflight` 会验证 npm CLI、登录用户、干净工作区、精确 git 标签，并确认五个同名版本尚不存在；对首次引导版本还会要求五个包名全部未被占用。`release:publish` 是不可逆的外部操作：它先用固定版本的 pnpm 为五个包生成 tarball，确保 `workspace:*` 被改写为精确版本，再依次对这些 tarball 调用官方 `npm publish --access=public --tag=next`。禁止直接对 workspace 包目录执行 `npm publish`。

若顺序发布中途失败，不要修改或覆盖已经发布的版本；先核对 npm 上的实际状态，再为未发布包处理失败原因。npm 已存在的版本号不可复用。

## 配置 GitHub 可信发布

首发五包均可在 npm 页面访问后，分别进入包的 Trusted Publisher 设置并使用相同配置：

- Provider：GitHub Actions
- Organization or user：`aifuxi`
- Repository：`semi-ui-vue`
- Workflow filename：`publish.yml`
- Allowed action：`npm publish`
- Environment：`npm`

配置完成后，为 GitHub 仓库创建需要人工批准的 `npm` Environment。后续发布只推送精确版本标签，由 `.github/workflows/publish.yml` 使用 OIDC 短期身份完成；不要向 GitHub 添加 `NPM_TOKEN`。

可信发布首次实际验证应使用下一统一版本 `0.1.0-alpha.1`。确认 OIDC 发布和 provenance 正常后，在 npm 包设置中禁用传统 token 发布并撤销不再需要的写入 token。

## 发布后验证

从空目录连接官方 registry 安装 `next`：

```bash
pnpm add @aifuxi/semi-ui-vue@next @aifuxi/semi-theme-default@next
npm audit signatures
```

同时核对五个 npm 页面：公开可见、版本一致、预发布只更新 `next`、repository 指向 `aifuxi/semi-ui-vue`，并显示正确的 MIT License、README、provenance 与依赖关系。首次人工引导版本可能使 `latest` 暂时停留在 `0.1.0-alpha.0`；首个稳定版本发布后，必须再确认 `latest` 精确指向该稳定版本。注册表中的 UI manifest 必须把 `@aifuxi/semi-icons-vue` 固定为同版本号，不得出现 `workspace:`。
