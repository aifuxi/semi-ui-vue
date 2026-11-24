import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { builtinEnvironments } from 'vitest/runtime';

const parentUrl = pathToFileURL(path.join(process.argv[2], 'package.json'));
const entry = import.meta.resolve('@aifuxi/semi-ui-vue/checkbox', parentUrl);
const environment = await builtinEnvironments.jsdom.setup(globalThis, {});
try {
  // 保持轮询待执行，画布替身仅用于完成真实播放器的导入探测。
  Object.defineProperty(globalThis.document, 'readyState', { value: 'loading' });
  globalThis.HTMLCanvasElement.prototype.getContext = () => ({ fillRect() {} });
  const { Checkbox } = await import(entry);
  assert.ok(Checkbox);
} finally {
  await environment.teardown(globalThis);
}
assert.equal(globalThis.document, undefined);
// 保留真实计时器，让子进程自然退出。遗留回调会抛错或让父进程等到超时。
