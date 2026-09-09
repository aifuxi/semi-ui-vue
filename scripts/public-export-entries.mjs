import { readFile, readdir } from 'node:fs/promises';
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
