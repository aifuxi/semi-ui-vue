import assert from 'node:assert/strict';
import path from 'node:path';
import { mock } from 'node:test';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

/** 从真实 tarball 消费目录解析指定入口，每个入口在独立进程中首次求值。 */
const parentUrl = pathToFileURL(path.join(process.argv[2], 'package.json')).href;
/** 根入口和 Lottie 子路径都必须在文档尚未完成时安全退出。 */
const entry = import.meta.resolve(process.argv[3], parentUrl);
/** Node 虚拟时钟直接跨过固定播放器的 100 ms 轮询点，无需真实等待。 */
mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
/** 与 Vitest 一样并存 Node 计时器和由 jsdom 管理的 window 计时器。 */
const dom = new JSDOM();
Object.defineProperty(dom.window.document, 'readyState', { value: 'loading' });
/** 仅补齐 jsdom 不支持的透明像素探测，不替换播放器。 */
dom.window.HTMLCanvasElement.prototype.getContext = () => ({
  /** 导入阶段的 canvas 探测不需要实际绘制。 */
  fillRect() {},
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
// 根入口还会初始化浏览器 polyfill；使用同一 jsdom 窗口的原生 DOM 类型。
globalThis.Element = dom.window.Element;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.SVGElement = dom.window.SVGElement;
globalThis.Node = dom.window.Node;
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
});
try {
  await import(entry);
  dom.window.close();
  delete globalThis.document;
  delete globalThis.window;
  delete globalThis.navigator;
  delete globalThis.Element;
  delete globalThis.HTMLElement;
  delete globalThis.SVGElement;
  delete globalThis.Node;
  // 固定播放器原先在该周期抛出 document 未定义；真实产物必须没有遗留回调。
  assert.doesNotThrow(
    /** 执行销毁后的到期回调，异常直接使产物检查失败。 */
    () => mock.timers.tick(100),
  );
} finally {
  dom.window.close();
  mock.timers.reset();
}
