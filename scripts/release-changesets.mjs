import { readFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';

// 空 changeset 只有 frontmatter 分隔符、没有 release 条目。
export function isEmptyChangeset(source) {
  const lines = source.split('\n');
  if (lines[0]?.trim() !== '---') return false;
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (end === -1) return false;
  return lines.slice(1, end).every((line) => line.trim() === '');
}

if (import.meta.main) {
  for (const entry of await readdir('.changeset', { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name === 'README.md') continue;
    const file = path.join('.changeset', entry.name);
    if (isEmptyChangeset(await readFile(file, 'utf8'))) {
      await unlink(file);
      console.log(`发布模式选择忽略空记录：${file}`);
    }
  }
}
