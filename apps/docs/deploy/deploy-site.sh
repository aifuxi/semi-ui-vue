#!/usr/bin/env bash
set -euo pipefail

artifact_dir=${1:?用法：bash apps/docs/deploy/deploy-site.sh <产物目录>}
: "${DEPLOY_SITE_URL:?缺少站点地址}" "${DEPLOY_ROOT:?缺少服务器发布根目录}"
: "${DEPLOY_SSH_HOST:?缺少 SSH 主机}" "${DEPLOY_SSH_USER:?缺少 SSH 用户}"
: "${DEPLOY_SSH_KEY:?缺少 SSH 私钥}" "${DEPLOY_SSH_KNOWN_HOSTS:?缺少 SSH 主机公钥}"
: "${DEPLOY_RELEASE_ID:?缺少发布编号}" "${DEPLOY_COMMIT_SHA:?缺少提交 SHA}"

if ! read -r checksum filename < "$artifact_dir/site.tar.gz.sha256" ||
  [[ ! $checksum =~ ^[0-9a-f]{64}$ || $filename != site.tar.gz ]]; then
  printf '站点产物的 SHA-256 校验文件无效。\n' >&2
  exit 1
fi

(
  cd -- "$artifact_dir"
  printf '%s  site.tar.gz\n' "$checksum" | sha256sum -c -
)

quote_remote() {
  printf "'%s'" "$(printf '%s' "$1" | sed "s/'/'\\\\''/g")"
}

umask 077
temp_dir=$(mktemp -d)
pending_verification=false
ssh_target="$DEPLOY_SSH_USER@$DEPLOY_SSH_HOST"
ssh_options=(
  -T -F /dev/null -p "${DEPLOY_SSH_PORT:-22}" -i "$temp_dir/identity"
  -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes
  -o "UserKnownHostsFile=$temp_dir/known_hosts" -o GlobalKnownHostsFile=/dev/null
  -o ConnectTimeout=15 -o ServerAliveInterval=15 -o ServerAliveCountMax=3
)

remote_release() {
  ssh "${ssh_options[@]}" -- "$ssh_target" "bash -c $remote_script -- $1 $remote_args"
}

finish() {
  local status=$?
  if [[ $pending_verification == true ]] && ! remote_release rollback </dev/null; then
    printf '自动回滚失败，请核对服务器的 current 链接和发布记录。\n' >&2
    status=1
  fi
  rm -rf -- "$temp_dir"
  exit "$status"
}

trap finish EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

deploy_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
remote_script=$(quote_remote "$(< "$deploy_dir/static-release.sh")")
remote_args="$(quote_remote "$DEPLOY_ROOT") $(quote_remote "$DEPLOY_RELEASE_ID") $(quote_remote "$DEPLOY_COMMIT_SHA") $(quote_remote "${temp_dir##*/}") $(quote_remote "$checksum")"

printf '%s\n' "$DEPLOY_SSH_KEY" > "$temp_dir/identity"
printf '%s\n' "$DEPLOY_SSH_KNOWN_HOSTS" > "$temp_dir/known_hosts"
unset DEPLOY_SSH_KEY DEPLOY_SSH_KNOWN_HOSTS

# SSH 中断时远端可能已完成切换，因此在发送产物前登记回滚。
pending_verification=true
remote_release publish < "$artifact_dir/site.tar.gz"

fetch() {
  local path=$1 status=$2 content_type=$3 response
  response=$(curl --silent --show-error --max-time 20 -H 'Cache-Control: no-cache' \
    --output "$temp_dir/response" --write-out '%{http_code} %{content_type}' \
    "${DEPLOY_SITE_URL%/}$path")
  if [[ $response != "$status $content_type" && $response != "$status $content_type;"* ]] ||
    [[ ! -s "$temp_dir/response" ]]; then
    printf '线上验收失败：%s 预期 %s %s，实际 %s。\n' "$path" "$status" "$content_type" "$response" >&2
    return 1
  fi
}

fetch "/_release.txt?run=$DEPLOY_RELEASE_ID" 200 text/plain
if [[ $(< "$temp_dir/response") != "$DEPLOY_RELEASE_ID $DEPLOY_COMMIT_SHA" ]]; then
  printf '线上版本标记与本次产物不一致。\n' >&2
  exit 1
fi

fetch / 200 text/html
fetch /zh-CN/start/getting-started 200 text/html
fetch /zh-CN/components 200 text/html
fetch /search-index.json 200 application/json
fetch /site/site.css 200 text/css
fetch /404.html 200 text/html
mv -- "$temp_dir/response" "$temp_dir/404.html"
fetch "/__docs_deploy_missing_$DEPLOY_RELEASE_ID" 404 text/html
if ! cmp -s -- "$temp_dir/response" "$temp_dir/404.html"; then
  printf '线上 404 响应未返回站点的 404 页面。\n' >&2
  exit 1
fi

pending_verification=false
printf '发布并验证成功。版本 %s，提交 %s。\n' "$DEPLOY_RELEASE_ID" "$DEPLOY_COMMIT_SHA"
