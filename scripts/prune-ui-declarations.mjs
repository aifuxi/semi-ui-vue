import { readdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// vue-tsc also emits imported private helpers excluded from tsconfig's entry list.
// Publish the declaration graph reachable from exports, not those private implementation types.
const root = fileURLToPath(new URL('../packages/ui/', import.meta.url));
const manifest = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const files = (await readdir(path.join(root, 'dist'), { recursive: true }))
  .filter((file) => file.endsWith('.d.ts'))
  .map((file) => path.join(root, 'dist', file));
const available = new Set(files);
const reachable = new Set();
async function visit(file) {
  if (reachable.has(file)) return;
  if (!available.has(file)) throw new Error(`Missing public declaration: ${file}`);
  reachable.add(file);
  const source = ts.preProcessFile(await readFile(file, 'utf8'), true, true);
  for (const { fileName: imported } of [...source.importedFiles, ...source.referencedFiles]) {
    if (!imported.startsWith('.')) continue;
    const base = path.resolve(path.dirname(file), imported).replace(/\.[cm]?js$/, '');
    const dependency = [base, `${base}.d.ts`, path.join(base, 'index.d.ts')].find((candidate) =>
      available.has(candidate),
    );
    if (!dependency) throw new Error(`Missing declaration dependency: ${file} -> ${imported}`);
    await visit(dependency);
  }
}
for (const entry of Object.values(manifest.exports)) {
  if (typeof entry !== 'object' || !entry.types) continue;
  const target = path.resolve(root, entry.types);
  if (!target.includes('*')) await visit(target);
  else {
    const [prefix, suffix] = target.split('*');
    const matches = files.filter((file) => file.startsWith(prefix) && file.endsWith(suffix));
    if (!matches.length) throw new Error(`Empty declaration export: ${entry.types}`);
    for (const file of matches) await visit(file);
  }
}
const privateFiles = files.filter((file) => !reachable.has(file));
await Promise.all(privateFiles.map((file) => rm(file)));
console.log(
  `UI declarations: retained ${reachable.size}, pruned ${privateFiles.length} unreachable implementation files`,
);
