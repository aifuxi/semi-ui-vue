import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { JSDOM } from 'jsdom';
import { expect, it, vi } from 'vitest';

/** 直接读取已安装的真实播放器，避免 Vitest 的 lottie-web 测试替身掩盖导入副作用。 */
const require = createRequire(import.meta.url);
/** 固定依赖的公开 main 入口，也是公开包构建内联的播放器。 */
const source = await readFile(require.resolve('lottie-web'), 'utf8');

/** 在独立浏览器全局中求值真实 UMD；仅补齐 jsdom 缺失的 canvas 探测能力。 */
function createPlayerEnvironment() {
  /** 窗口持有自己的计时器，close 必须能够清理播放器的就绪轮询。 */
  const dom = new JSDOM();
  vi.spyOn(dom.window.HTMLCanvasElement.prototype, 'getContext').mockImplementation(
    /** 播放器导入时只使用透明像素探测，不模拟动画逻辑。 */
    () => ({ fillRect: vi.fn() }),
  );
  /** 模拟测试环境中 Node 全局计时器与 jsdom window 计时器并存。 */
  const globals = {
    window: dom.window,
    document: dom.window.document,
    navigator: dom.window.navigator,
    setInterval,
    clearInterval,
  };
  runInNewContext(source, globals);
  return { dom, globals };
}

/** 两种导入状态都可能在第一次轮询前退出，不应留下访问已删除 document 的回调。 */
it.each(['loading', 'complete'])('真实 Lottie 导入后立即销毁 %s 文档不泄漏就绪轮询', (state) => {
  vi.useFakeTimers();
  /** 独立窗口对应一个短于播放器轮询周期的组件测试环境。 */
  const { dom, globals } = createPlayerEnvironment();
  try {
    vi.spyOn(dom.window.document, 'readyState', 'get').mockReturnValue(state);
    dom.window.close();
    delete globals.document;
    delete globals.window;
    delete globals.navigator;
    // 100 ms 来自固定播放器的就绪轮询周期；虚拟时间直接跨过原报错点。
    expect(
      /** 销毁后再执行原轮询周期，直接验证不存在越界回调。 */
      () => vi.advanceTimersByTime(100),
    ).not.toThrow();
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    dom.window.close();
    vi.useRealTimers();
    vi.restoreAllMocks();
  }
});

/** 保留上游的 complete 后自动发现动画语义，并确认成功后只执行一次。 */
it('真实 Lottie 等待文档完成后扫描一次并释放就绪轮询', () => {
  vi.useFakeTimers();
  /** 独立窗口允许准确控制 loading 到 complete 的转换。 */
  const { dom } = createPlayerEnvironment();
  try {
    /** 只观察真实播放器调用，不替换动画扫描实现。 */
    const scan = vi.spyOn(dom.window.document, 'getElementsByClassName');
    /** 可控文档状态排除 jsdom 自身异步加载事件对断言的影响。 */
    const ready = vi.spyOn(dom.window.document, 'readyState', 'get').mockReturnValue('loading');
    vi.advanceTimersByTime(100);
    expect(scan).not.toHaveBeenCalled();
    ready.mockReturnValue('complete');
    vi.advanceTimersByTime(100);
    expect(scan.mock.calls).toEqual([['lottie'], ['bodymovin']]);
    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(100);
    expect(scan).toHaveBeenCalledTimes(2);
  } finally {
    dom.window.close();
    vi.useRealTimers();
    vi.restoreAllMocks();
  }
});
