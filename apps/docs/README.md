# 组件库文档站

`apps/docs` 是基于 VitePress 的私有文档应用。页面、可运行 Vue 示例与仅展示源码的示例均由本仓库维护，数量由本地索引生成时统计。文档站构建只读取本地页面、示例与静态资源，不从 `vendor/semi-design` 生成内容。

## 常用命令

| 命令                                      | 用途                                                  |
| ----------------------------------------- | ----------------------------------------------------- |
| `pnpm docs:prepare`                       | 构建文档站使用的公开包与主题包                        |
| `pnpm docs:prepare:ui`                    | 只重建 UI 与主题包                                    |
| `pnpm docs:dev`                           | 生成本地索引并在 <http://127.0.0.1:4321> 启动开发服务 |
| `pnpm docs:build`                         | 生成本地索引并构建到 `apps/docs/dist`                 |
| `pnpm --filter @workspace/docs typecheck` | 检查文档主题及示例类型                                |
| `DOCS_EXAMPLE_TIER=t3 pnpm test:docs`     | 运行指定梯次的文档浏览器测试，支持 `t1` 至 `t5`       |

首次使用或修改 `packages/**` 后先运行 `pnpm docs:prepare`。此命令构建组件库，组件库的 Foundation 集成仍遵循仓库的固定基线契约；`docs:dev` 与 `docs:build` 只构建文档站，不隐式重建公开包。

## 编辑文档

- 直接编辑 `content/**/*.md`。每页的 `title`、`description`、`type`、`order` 和可选 `icon` 写在 frontmatter 中；页面路径即站点路由。首页为 `content/index.md`。
- 分类名称及侧栏顺序在 `data/categories.json` 中维护。`scripts/prepare-index.mjs` 从本地 Markdown 生成导航和搜索索引，并检查路由、分类、图标及示例引用。
- 可运行示例放在 `.vitepress/theme/demo/examples/`，文件名就是 `<DemoBlock id="…" kind="live" />` 的 ID；非运行示例源码在 `data/code-sources.json` 中维护。修改示例时保持 Markdown 引用与源码一致。
- 站点样式与字体位于 `content/public/site/`，侧栏图标位于 `content/public/doc-icons/`，其余演示资源位于 `content/public/demos/`。历史素材的来源与许可见 [第三方归属](THIRD_PARTY.md)。

`content/public/search-index.json`、`content/public/example-files/`、`.vitepress/theme/generated/`、`cache/` 和 `dist/` 是可再生的忽略产物。`pnpm --filter @workspace/docs clean` 可清理这些产物。示例的安装依赖、可下载辅助文件和 `/demos/` 资源引用由索引脚本从源码提取。

## 生产构建与发布

| GitHub Actions                                                       | 用途                                                                                                                |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [Build docs artifact](../../.github/workflows/docs-artifact.yml)     | 手动选择分支预构建。上传 `semi-ui-vue-docs-<提交 SHA>-<运行尝试次数>`，内含 `site.tar.gz` 和 `site.tar.gz.sha256`。 |
| [Deploy docs to production](../../.github/workflows/docs-deploy.yml) | 手动选择 `master` 发布。调用同一构建流程，按 artifact ID 下载本次构建产物，经 SSH 发布到生产服务器。                |

文档站的生产地址是 <https://semi.fuxiaochen.com>，沿用 `fuxiaochen-next` 的 Caddy 服务。Caddy 从 `/data/fc-apps/semi-ui-vue-docs/current` 读取静态文件。产物校验通过后，发布脚本将其放入 `releases/<运行编号>-<尝试次数>`，再原子切换 `current`。工作流随后验证线上版本标记、首页、无后缀文档直链、搜索索引、样式和自定义 404。线上验收失败时，工作流尝试切回上一版。

### 首次准备服务器

服务器需要 Caddy、OpenSSH、Bash、GNU tar、GNU coreutils 和 `flock`。为文档站配置发布公钥，并确认发布账号能写入站点目录，Caddy 服务账号能读取 `current` 指向的版本。以下以 `site-deploy` 为例。

若 `current` 已指向 `releases/` 下的有效版本，保留该版本和链接。全新目录需要先放入一份可回滚的初始版本。在 GitHub 手动运行预构建，解开外层 artifact，把两份文件传到服务器上发布账号可读取的 `/tmp/semi-docs-upload`。同样可以在仓库根目录 `pnpm docs:prepare`、`pnpm docs:build` 后用 `bash apps/docs/deploy/package.sh <产物目录>` 生成这两份文件。

```bash
sudo install -d -m 0755 -o site-deploy \
  /data/fc-apps/semi-ui-vue-docs \
  /data/fc-apps/semi-ui-vue-docs/releases
sudo -u site-deploy mkdir -m 0755 /data/fc-apps/semi-ui-vue-docs/releases/initial
sudo -u site-deploy bash -s <<'BASH'
set -euo pipefail
umask 022
root=/data/fc-apps/semi-ui-vue-docs
cd /tmp/semi-docs-upload
sha256sum --check site.tar.gz.sha256
tar --no-same-owner --no-same-permissions -xzf site.tar.gz -C "$root/releases/initial"
chmod 755 "$root/releases/initial"
test -s "$root/releases/initial/index.html"
ln -sT -- releases/initial "$root/current"
BASH
```

将 `semi.fuxiaochen.com` 的 DNS 指向同一台服务器，把随库的 [Caddy 站点配置](deploy/Caddyfile) 加入现有 `/etc/caddy/Caddyfile`。Caddy 需要能从公网接收 TCP 80 和 443 来管理 HTTPS 证书。新增配置时校验并重载 Caddy，日常发布只切换 `current`。

```bash
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile &&
  sudo systemctl reload caddy
curl -fSI https://semi.fuxiaochen.com/
```

### 配置 GitHub 并发布

在本仓库的 **Settings → Environments → production** 创建环境，将可部署分支限制为 `master`，并配置以下值。SSH 主机、端口和主机公钥对应现有服务器，私钥对应文档站的发布公钥。非默认端口使用 `[主机]:端口` 形式的 `known_hosts` 主机字段。

| 类型     | 名称                     | 值                                |
| -------- | ------------------------ | --------------------------------- |
| Variable | `DEPLOY_SSH_HOST`        | GitHub runner 可访问的 SSH 地址   |
| Variable | `DEPLOY_SSH_PORT`        | SSH 端口，省略时使用 `22`         |
| Variable | `DEPLOY_SSH_USER`        | 有权写入文档站发布目录的账号      |
| Secret   | `DEPLOY_SSH_KEY`         | 文档站发布账号的 SSH 私钥         |
| Secret   | `DEPLOY_SSH_KNOWN_HOSTS` | 从可信来源核验的 SSH 主机公钥记录 |

工作流进入 `master` 后，从 GitHub Actions 手动运行 **Deploy docs to production**，也可使用 `gh workflow run docs-deploy.yml --ref master`。成功后，线上版本标记 `curl -fsS https://semi.fuxiaochen.com/_release.txt` 应与运行日志中的发布编号和提交 SHA 一致。

### 手动回滚

自动回滚未完成时，先确认没有正在执行的发布，再以服务器发布账号运行以下命令。它从当前版本的发布记录定位上一版。保留当前版本及可用的回滚版本。

```bash
(
  set -euo pipefail
  cd /data/fc-apps/semi-ui-vue-docs
  exec 9>.deploy/lock
  flock -w 30 -x 9
  current=$(readlink current)
  [[ $current =~ ^releases/[0-9]+-[0-9]+$ ]]
  read -r previous _ < ".deploy/${current##*/}.previous"
  [[ $previous =~ ^releases/[a-zA-Z0-9][a-zA-Z0-9._-]*$ ]]
  test -s "$previous/index.html"
  staging=$(mktemp -d .deploy/.current.XXXXXXXX)
  trap 'rm -rf -- "$staging"' EXIT
  ln -s -- "$previous" "$staging/current"
  mv -Tf -- "$staging/current" current
)
```

## 主题工作台入口

品牌与排版编辑由独立的 [`apps/theme-studio`](../theme-studio/README.md) 提供，文档站只保留 API、使用说明、代码示例和外部入口，不导入工作台布局或状态。入口位于 `content/zh-CN/advanced/customize-theme.md`。

本地运行 `pnpm theme-studio:dev` 后可直接访问 <http://localhost:4322/#/tokens>。在 GitHub 仓库级 Variables 中通过 `VITE_THEME_STUDIO_URL` 指定工作台的公开 HTTPS 根地址，例如 `https://themes.example.com/`。文档站仅在配置了可用的 HTTPS 地址时显示入口。该变量在开发服务启动或生产构建时读取，修改后需重新启动或构建。工作台独立部署，不随 `docs:build` 构建。

## 验收

执行 `pnpm docs:build`、`pnpm --filter @workspace/docs typecheck`，并按影响范围运行 `DOCS_EXAMPLE_TIER=t1` 至 `t5` 的 `pnpm test:docs`。测试固定使用 3 个 Playwright worker；结果位于已忽略的 `test-results/docs` 与 `playwright-report/docs`。
