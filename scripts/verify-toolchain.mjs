import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import semver from 'semver';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const config = await readFile(new URL('mise.toml', root), 'utf8');
// Keep the tool declarations deliberately simple so this check needs no TOML dependency.
const tools = config.match(/^\[tools\]\s*\n([\s\S]*?)(?=^\[|(?![\s\S]))/m)?.[1];
assert.ok(tools, 'mise.toml 必须声明 [tools]');
const version = (name) => {
  const value = tools.match(new RegExp(`^${name} = "([^"]+)"$`, 'm'))?.[1];
  assert.ok(value && semver.valid(value), `mise.toml 的 ${name} 必须是精确版本`);
  return value;
};
const node = version('node');
const pnpm = version('pnpm');
assert.equal(manifest.packageManager, `pnpm@${pnpm}`, 'packageManager 与 mise 不一致');
assert.equal(manifest.engines.pnpm, pnpm, 'engines.pnpm 与 mise 不一致');
assert.ok(semver.satisfies(node, manifest.engines.node), 'mise Node 超出 engines 支持范围');
assert.equal(process.versions.node, node, '请通过 mise exec 使用项目 Node');
assert.ok(process.env.npm_execpath, '请通过 pnpm check:toolchain 执行');
const actualPnpm = execFileSync(process.env.npm_execpath, ['--version'], {
  cwd: root,
  encoding: 'utf8',
}).trim();
assert.equal(actualPnpm, pnpm, '实际 pnpm 与 mise 不一致');
console.log(`工具链一致：Node ${node} / pnpm ${pnpm}`);
