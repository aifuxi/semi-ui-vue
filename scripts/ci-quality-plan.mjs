import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { appendFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import semver from 'semver';
import { publicPackages } from './public-packages.mjs';

/** GitHub API 单次请求最多等待 30 秒，沿用现有发布核验脚本的请求预算。 */
const REQUEST_TIMEOUT_MS = 30_000;

/** 只有当前仓库配置的版本机器人及其固定分支可进入证据复用判定。 */
export function isTrustedVersionPr(env) {
  return Boolean(
    env.BASE_SHA &&
    env.GITHUB_REPOSITORY &&
    env.RELEASE_BOT_LOGIN &&
    env.PR_HEAD_REF === 'changeset-release/master' &&
    env.PR_HEAD_REPO === env.GITHUB_REPOSITORY &&
    env.PR_AUTHOR === env.RELEASE_BOT_LOGIN,
  );
}

/** 执行只读 Git 查询；使用参数数组，避免把提交内容当作 shell 代码。 */
function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trimEnd();
}

/** 判定是否仅有官方六包版本、追加 CHANGELOG 和已消费 changeset 的变化。 */
export function isVersionOnlyDiff(base, head) {
  assert.match(base, /^[a-f0-9]{40}$/);
  assert.match(head, /^[a-f0-9]{40}$/);
  /** 禁止重命名掩盖路径变化；依赖、工具、工作流和 lockfile 改动均回到完整检查。 */
  const changes = git('diff', '--no-renames', '--name-status', base, head)
    .split('\n')
    .filter(Boolean);
  if (!changes.length) return false;
  /** 公开包文件之外只允许删除顶层 changeset，不包含配置和 README。 */
  const allowed = new Set(
    publicPackages.flatMap(
      // 六包固定分组的版本与发布记录是唯一可修改路径。
      ({ directory }) => [
        `packages/${directory}/package.json`,
        `packages/${directory}/CHANGELOG.md`,
      ],
    ),
  );
  for (const change of changes) {
    /** Git 的 name-status 输出使用制表符分隔状态与路径。 */
    const [status, file] = change.split('\t');
    if (status === 'D' && /^\.changeset\/(?!README\.md$)[^/]+\.md$/.test(file)) continue;
    if (status !== 'M' || !allowed.has(file)) return false;
  }
  /** 六包升级前后都必须同版，不能把不完整或回退版本当作可信版本 PR。 */
  const previousVersions = new Set();
  /** 升级后的统一版本还用于检查每份 CHANGELOG 的新增标题。 */
  const nextVersions = new Set();
  for (const { name, directory } of publicPackages) {
    /** 只剥离 version 字段，依赖、exports、脚本和发布策略的变化均不允许复用。 */
    const file = `packages/${directory}/package.json`;
    /** base 中的包清单必须来自 Git，不读取可能被构建修改的工作区文件。 */
    const previous = JSON.parse(git('show', `${base}:${file}`));
    /** head 清单是此次版本 PR 的准确输入。 */
    const next = JSON.parse(git('show', `${head}:${file}`));
    if (
      previous.name !== name ||
      next.name !== name ||
      !semver.valid(next.version) ||
      !semver.valid(previous.version) ||
      !semver.gt(next.version, previous.version)
    )
      return false;
    previousVersions.add(previous.version);
    nextVersions.add(next.version);
    /** 版本以外的所有字段按结构比较，允许 JSON 格式化但不放宽内容。 */
    const { version: previousVersion, ...previousFields } = previous;
    /** 新版本号已单独校验，其余字段必须与原清单完全一致。 */
    const { version: nextVersion, ...nextFields } = next;
    void previousVersion;
    if (!isDeepStrictEqual(previousFields, nextFields)) return false;
    /** 官方 CHANGELOG 在固定包标题之后追加新版本，旧记录必须完整保留。 */
    const changelog = `packages/${directory}/CHANGELOG.md`;
    /** 固定包标题用于校验追加位置，避免复用时悄悄删除历史记录。 */
    const header = `# ${name}\n\n`;
    /** 历史正文去除固定标题后应作为新文件的完整后缀。 */
    const oldLog = git('show', `${base}:${changelog}`);
    /** 只允许当前新版本位于最前，不允许将任意 Markdown 修改视为版本 PR。 */
    const newLog = git('show', `${head}:${changelog}`);
    if (
      !oldLog.startsWith(header) ||
      !newLog.startsWith(`${header}## ${nextVersion}\n`) ||
      !newLog.endsWith(oldLog.slice(header.length))
    )
      return false;
  }
  return previousVersions.size === 1 && nextVersions.size === 1;
}

/** 请求仓库自己的 Actions 证据；非成功响应不能被当成已通过检查。 */
async function githubJson(suffix) {
  /** 所有查询均绑定当前仓库，token 只发送给固定 GitHub API origin。 */
  const response = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/${suffix}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GH_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    },
  );
  if (!response.ok) throw new Error(`质量证据查询失败：${response.status}`);
  return response.json();
}

/** 下载单份 JSON receipt；解压到内存，不将证据中的路径写入工作区。 */
async function readArtifact(id) {
  /** API 认证后的重定向由 fetch 处理，跨 origin 时不会转发 Authorization。 */
  const response = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/actions/artifacts/${id}/zip`,
    {
      headers: { Authorization: `Bearer ${process.env.GH_TOKEN}` },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    },
  );
  if (!response.ok) throw new Error(`质量证据下载失败：${response.status}`);
  /** ZIP 只在系统临时目录存在，成功或失败都释放。 */
  const directory = await mkdtemp(path.join(tmpdir(), 'semi-quality-evidence-'));
  try {
    /** 不信任 ZIP 的目录项，只读取固定文件名。 */
    const archive = path.join(directory, 'evidence.zip');
    await writeFile(archive, Buffer.from(await response.arrayBuffer()));
    return JSON.parse(
      execFileSync('unzip', ['-p', archive, 'quality-evidence.json'], { encoding: 'utf8' }),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

/** 查找与当前 base 完整 Git tree 相同的成功全量 CI，缺少证据时执行完整检查。 */
export async function findSourceEvidence(base, repository, get = githubJson, read = readArtifact) {
  /** tree 同时覆盖源码、依赖、配置和工作流，合并提交 SHA 不同不影响内容一致性。 */
  const tree = git('rev-parse', `${base}^{tree}`);
  /** 只搜索近期同仓库的成功 PR CI；没有匹配时正常回退完整验证，不无限扫描历史。 */
  const { workflow_runs: runs } = await get(
    'actions/workflows/ci.yml/runs?event=pull_request&status=success&per_page=30',
  );
  for (const run of runs) {
    if (
      run.path !== '.github/workflows/ci.yml' ||
      run.event !== 'pull_request' ||
      run.conclusion !== 'success' ||
      run.head_repository?.full_name !== repository
    )
      continue;
    /** 只有完整检查分支才上传此 receipt；版本复用分支不制造新的全量通过证据。 */
    const { artifacts } = await get(
      `actions/runs/${run.id}/artifacts?name=source-quality-evidence`,
    );
    /** 拒绝歧义证据，不选择多个同名 artifact 中任意一个。 */
    const receipts = artifacts.filter(
      // 过期证据无法验证，必须回到完整检查。
      (artifact) => artifact.name === 'source-quality-evidence' && !artifact.expired,
    );
    if (receipts.length !== 1) continue;
    /** receipt 的仓库、run 和实际 PR head 必须与 GitHub 返回的运行记录一致。 */
    const evidence = await read(receipts[0].id);
    if (
      evidence.schema !== 1 ||
      evidence.repository !== repository ||
      evidence.runId !== run.id ||
      evidence.headSha !== run.head_sha ||
      evidence.tree !== tree ||
      evidence.checks !== 'source-and-artifacts' ||
      !/^[a-f0-9]{40}$/.test(evidence.sha ?? '')
    )
      continue;
    /** 独立查询实际受测提交的 tree，拒绝伪造或错误的内容摘要。 */
    const testedCommit = await get(`git/commits/${evidence.sha}`);
    if (testedCommit.tree.sha === tree) return run.id;
  }
  return undefined;
}

/** 完整质量和产物检查成功之后，记录实际 checkout 内容，供之后的版本 PR 复用。 */
export async function recordSourceEvidence(filename, env = process.env) {
  await writeFile(
    filename,
    JSON.stringify(
      {
        schema: 1,
        repository: env.GITHUB_REPOSITORY,
        runId: Number(env.GITHUB_RUN_ID),
        headSha: env.HEAD_SHA,
        sha: git('rev-parse', 'HEAD'),
        tree: git('rev-parse', 'HEAD^{tree}'),
        checks: 'source-and-artifacts',
      },
      null,
      2,
    ) + '\n',
  );
}

if (process.argv[1] && path.basename(process.argv[1]) === 'ci-quality-plan.mjs') {
  if (process.argv[2] === 'record') {
    await recordSourceEvidence(process.argv[3]);
  } else {
    /** 复用必须同时满足身份、严格差异与成功检查三条条件。 */
    const eligible =
      isTrustedVersionPr(process.env) &&
      isVersionOnlyDiff(process.env.BASE_SHA, process.env.HEAD_SHA);
    /** 未满足条件时不查 API，也不跳过任何既有质量检查。 */
    const runId = eligible
      ? await findSourceEvidence(process.env.BASE_SHA, process.env.GITHUB_REPOSITORY)
      : undefined;
    console.log(runId ? `复用全量质量证据：run ${runId}` : '执行完整源码和产物检查');
    if (process.env.GITHUB_OUTPUT) {
      await appendFile(
        process.env.GITHUB_OUTPUT,
        `reuse=${Boolean(runId)}\nevidence-run=${runId ?? ''}\n`,
      );
    }
  }
}
