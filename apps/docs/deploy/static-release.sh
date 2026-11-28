#!/usr/bin/env bash
set -euo pipefail

fail() {
  printf '%s\n' "$1" >&2
  exit 1
}

operation=$1
root=$2
release_id=$3
commit_sha=$4
attempt_token=$5
checksum=$6
[[ $root == /* ]] || fail '发布根目录必须是绝对路径。'
[[ $release_id =~ ^[0-9]+-[0-9]+$ && $commit_sha =~ ^[0-9a-f]{40}$ ]] || fail '发布编号或提交 SHA 无效。'
[[ $checksum =~ ^[0-9a-f]{64}$ ]] || fail '站点产物的 SHA-256 无效。'
cd -P -- "$root"
[[ $PWD != / && -d releases ]] || fail '请先初始化站点发布目录。'

umask 022
mkdir -p -m 700 -- .deploy
exec 9>.deploy/lock
flock -w 30 -x 9

target="releases/$release_id"
previous_file=".deploy/$release_id.previous"
active=$(readlink current) || fail 'current 必须指向一个已部署版本。'

check_release() {
  [[ $1 =~ ^releases/[a-zA-Z0-9][a-zA-Z0-9._-]*$ && -s $1/index.html ]] ||
    fail '已有版本目录无效，请检查 current 或回滚记录。'
}

switch_current() {
  local swap
  swap=$(mktemp -d .deploy/.current.XXXXXXXX)
  if ! ln -s -- "$1" "$swap/current" || ! mv -Tf -- "$swap/current" current; then
    rm -rf -- "$swap"
    fail '切换 current 失败。'
  fi
  rmdir -- "$swap"
}

case "$operation" in
  publish)
    check_release "$active"
    [[ ! -e $target && ! -L $target ]] || fail '发布目录已存在，请使用新的发布编号。'
    staging=$(mktemp -d "releases/.$release_id.XXXXXXXX")
    trap 'rm -rf -- "$staging"' EXIT
    cat > "$staging/site.tar.gz"
    (cd -- "$staging" && printf '%s  site.tar.gz\n' "$checksum" | sha256sum -c -)
    mkdir -- "$staging/site"
    tar -xzf "$staging/site.tar.gz" -C "$staging/site" --no-same-owner --no-same-permissions
    # 归档根目录的权限由构建端决定，发布目录需允许 Caddy 读取。
    chmod 755 -- "$staging/site"
    test -s "$staging/site/index.html" || fail '站点产物缺少 index.html。'

    printf '%s %s\n' "$release_id" "$commit_sha" > "$staging/site/_release.txt"
    printf '%s %s\n' "$active" "$attempt_token" > "$previous_file"
    mv -T -- "$staging/site" "$target"
    switch_current "$target"
    printf '已切换到 %s，上一版为 %s。\n' "$target" "$active"
    ;;
  rollback)
    if [[ $active != "$target" ]]; then
      printf '本次发布未处于生效状态，当前版本为 %s。\n' "$active"
      exit 0
    fi

    # 避免回滚由另一次执行切换的同编号版本。
    read -r previous owner < "$previous_file"
    if [[ $owner != "$attempt_token" ]]; then
      printf '当前版本由另一次执行切换，跳过回滚。\n'
      exit 0
    fi
    check_release "$previous"
    switch_current "$previous"
    printf '已回滚到 %s。\n' "$previous"
    ;;
  *) fail '无效的发布操作。' ;;
esac
