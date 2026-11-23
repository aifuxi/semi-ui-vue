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

## 发布到自有服务器

文档站按独立子域名的根路径 `/` 构建。静态服务器从 `/srv/semi-ui-vue-docs/current` 读取当前版本，服务账号需要有权读取该路径指向的目录。

### 配置静态服务器

使用 Nginx 时，参考 [Nginx 配置](deploy/nginx.conf)，将 `server_name` 改为实际子域名，并沿用服务器现有的 HTTPS 入口。确认 `http` 配置加载了 `mime.types`。配置生效前执行 `nginx -t`。

使用 Caddy 时，将 [Caddyfile](deploy/Caddyfile) 中的站点区块加入服务器的 `/etc/caddy/Caddyfile`，将 `docs.example.com` 替换为实际子域名。Caddy 作为公网入口时，将子域名解析到服务器并开放 TCP 80 和 443，以便 Caddy 自动签发和续期 HTTPS 证书。配置会将无后缀路由映射到对应的 `.html` 或目录的 `index.html`，缺失路径返回站点的 404 页面。

在 Linux 上使用 systemd 管理 Caddy 时，校验配置后重载已运行的服务。

```bash
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo systemctl reload caddy
```

Caddy 部署沿用下方的打包、发布和回滚流程。每次发布只需切换 `current`，Caddy 无需为切换版本重载配置。

### 获取构建产物

`Build docs artifact` 工作流进入默认分支后，可在 GitHub Actions 手动选择待构建的分支。构建结果是名为 `semi-ui-vue-docs-<提交 SHA>` 的 artifact，其中包含 `site.tar.gz` 和对应的 SHA-256 校验文件。下载并解开外层 artifact 后，将这两个文件一起传到服务器。

也可在仓库根目录本地构建并打包，使用该检出对应的提交 SHA 标记版本。

```bash
git submodule update --init --recursive
mise run deps:install
mise exec -- pnpm docs:prepare
mise exec -- pnpm docs:build
artifact_dir=$(mktemp -d)
bash apps/docs/deploy/package.sh "$artifact_dir"
printf '%s\n' "$artifact_dir"
```

### 在服务器上发布

以下命令使用 Bash、GNU coreutils 和 GNU tar。替换上传目录与提交 SHA 后，以有权写入站点目录的账号执行。校验文件通过后，先解包到临时目录，再用符号链接一次切换整个站点。

```bash
(
  set -euo pipefail
  umask 022
  site_root=/srv/semi-ui-vue-docs
  artifact_dir=/tmp/semi-docs-upload
  release_sha=填入完整的提交SHA
  [[ "$release_sha" =~ ^[0-9a-f]{40}$ ]]
  release_dir="$site_root/releases/$release_sha"
  (cd "$artifact_dir" && sha256sum -c site.tar.gz.sha256)
  mkdir -p "$site_root/releases"
  if [[ -e "$release_dir" || -L "$release_dir" ]]; then
    printf '版本目录已存在：%s\n' "$release_dir" >&2
    exit 1
  fi
  staging=$(mktemp -d "$site_root/.stage.XXXXXX")
  trap 'rm -rf -- "$staging"' EXIT
  mkdir "$staging/site"
  tar --no-same-owner -xzf "$artifact_dir/site.tar.gz" -C "$staging/site"
  test -s "$staging/site/index.html"
  mv -T "$staging/site" "$release_dir"
  ln -s "$release_dir" "$staging/current"
  mv -Tf "$staging/current" "$site_root/current"
)
```

切换后，从真实域名直接访问 `/zh-CN/start/getting-started` 和 `/zh-CN/components`，确认无后缀 URL 返回 200。检查搜索索引、示例文件下载和字体许可，访问不存在的路径确认返回 404。

回滚时，把 `current` 切回上一个已保留的版本目录。站点根路径配置保持固定。

```bash
(
  set -euo pipefail
  site_root=/srv/semi-ui-vue-docs
  previous_sha=填入上一版本的完整提交SHA
  [[ "$previous_sha" =~ ^[0-9a-f]{40}$ ]]
  previous_dir="$site_root/releases/$previous_sha"
  test -s "$previous_dir/index.html"
  staging=$(mktemp -d "$site_root/.stage.XXXXXX")
  trap 'rm -rf -- "$staging"' EXIT
  ln -s "$previous_dir" "$staging/current"
  mv -Tf "$staging/current" "$site_root/current"
)
```

## 主题工作台入口

品牌与排版编辑由独立的 [`apps/theme-studio`](../theme-studio/README.md) 提供，文档站只保留 API、使用说明、代码示例和外部入口，不导入工作台布局或状态。入口位于 `content/zh-CN/advanced/customize-theme.md`。

本地运行 `pnpm theme-studio:dev` 后可直接访问 <http://localhost:4322/#/tokens>。部署时通过 `VITE_THEME_STUDIO_URL` 指定工作台的公开 HTTPS 根地址，例如 `https://themes.example.com/`。文档站仅在配置了可用的 HTTPS 地址时显示入口。该变量在开发服务启动或生产构建时读取，修改后需重新启动或构建。工作台独立部署，不随 `docs:build` 构建。

## 验收

执行 `pnpm docs:build`、`pnpm --filter @workspace/docs typecheck`，并按影响范围运行 `DOCS_EXAMPLE_TIER=t1` 至 `t5` 的 `pnpm test:docs`。测试固定使用 3 个 Playwright worker；结果位于已忽略的 `test-results/docs` 与 `playwright-report/docs`。
