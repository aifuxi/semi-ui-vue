import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

export async function publicJavaScriptEntries(packageRoot) {
  const manifest = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
  const entries = new Set();
  for (const value of Object.values(manifest.exports)) {
    const target = typeof value === 'string' ? value : value.import;
    if (!target || !/\.(?:js|mjs)$/.test(target)) continue;
    if (!target.includes('*')) {
      entries.add(target);
      continue;
    }
    // Current exports use one wildcard filename segment. Reject new shapes instead
    // of silently omitting an entry when the public contract grows.
    const [prefix, suffix, extra] = target.split('*');
    if (extra !== undefined || !prefix.endsWith('/') || suffix.includes('/')) {
      throw new Error(`不支持的公开入口模式：${target}`);
    }
    const files = (await readdir(path.join(packageRoot, prefix), { withFileTypes: true })).filter(
      (entry) => entry.isFile() && entry.name.endsWith(suffix),
    );
    if (!files.length) throw new Error(`公开入口没有匹配产物：${target}`);
    for (const file of files) entries.add(`${prefix}${file.name}`);
  }
  if (!entries.size) throw new Error(`${manifest.name} 没有公开 JavaScript 入口`);
  return [...entries].sort();
}

/** 核对安装包的所有条件导出目标；通配目标必须至少对应一个实际产物。 */
export async function assertExportTargets(packageRoot, value) {
  if (typeof value === 'string') {
    if (!value.startsWith('./')) return;
    /** exports 中的相对目标以当前安装包为根目录解析。 */
    const target = value.slice(2);
    if (target.includes('*')) {
      /** 保留完整目标再取目录，避免 dirname('dist/shared/') 错退到父级 dist。 */
      const directory = path.dirname(target);
      /** 当前公开清单使用单一文件名通配；前后缀都属于匹配约束。 */
      const [prefix, suffix, extra] = path.basename(target).split('*');
      if (directory.includes('*') || extra !== undefined) {
        throw new Error(`不支持的公开入口模式：${value}`);
      }
      /** 读取文件类型，目录不能冒充同后缀的公开产物。 */
      const candidates = await readdir(path.join(packageRoot, directory), { withFileTypes: true });
      if (
        !candidates.some(
          /** 只接受目标目录中同时满足文件名前缀和后缀的实际文件。 */
          (candidate) =>
            candidate.isFile() &&
            candidate.name.startsWith(prefix) &&
            candidate.name.endsWith(suffix),
        )
      ) {
        throw new Error(`通配导出没有匹配产物：${value}`);
      }
    } else {
      await access(path.join(packageRoot, target));
    }
    return;
  }

  if (!value || typeof value !== 'object') return;
  await Promise.all(
    Object.values(value).map(
      /** 递归检查子路径、条件分支及 fallback 数组中的每个公开目标。 */
      (entry) => assertExportTargets(packageRoot, entry),
    ),
  );
}
