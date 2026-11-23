#!/usr/bin/env bash
set -euo pipefail

output_dir=${1:?用法：bash apps/docs/deploy/package.sh <产物输出目录>}
dist=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)/dist

required_files=(
  index.html
  404.html
  zh-CN/start/getting-started.html
  zh-CN/components/index.html
  search-index.json
  site/site.css
  site/SEMI-LICENSE
  site/Inter-OFL.txt
)

for file in "${required_files[@]}"; do
  if [[ ! -s "$dist/$file" ]]; then
    printf '文档产物缺失或为空：%s\n' "$dist/$file" >&2
    exit 1
  fi
done

mkdir -p -- "$output_dir"
cd -- "$output_dir"
# 跳过 macOS 扩展属性及伴随文件，使归档只包含站点产物。
COPYFILE_DISABLE=1 tar --no-xattrs -C "$dist" -czf site.tar.gz .
if command -v sha256sum >/dev/null; then
  sha256sum site.tar.gz > site.tar.gz.sha256
else
  shasum -a 256 site.tar.gz > site.tar.gz.sha256
fi
