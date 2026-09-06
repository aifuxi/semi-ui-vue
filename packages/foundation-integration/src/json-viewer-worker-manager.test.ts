import { afterEach, expect, it, vi } from 'vitest';

const { workers } = vi.hoisted(() => ({
  workers: [] as Array<{
    messages: Array<{ messageId: number; method: string }>;
    onmessage: ((event: { data: { messageId: number; result: unknown } }) => void) | null;
  }>,
}));

vi.mock('./json-viewer-worker-entry?worker&inline', () => ({
  default: class {
    messages: Array<{ messageId: number; method: string }> = [];
    onmessage = null;
    constructor() {
      workers.push(this);
    }
    postMessage(message: { messageId: number; method: string }) {
      this.messages.push(message);
    }
    terminate() {}
  },
}));

import { JsonWorkerManager } from './json-viewer-worker-manager';

afterEach(() => {
  vi.restoreAllMocks();
  workers.length = 0;
});

it('同一时刻发出的初始化和校验请求分别收到对应 Worker 响应', async () => {
  vi.spyOn(Date, 'now').mockReturnValue(1_725_000_000_000);
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
  const manager = new JsonWorkerManager();
  const worker = workers[0]!;
  const results: Array<[string, unknown]> = [];
  void manager.init('{}').then((result) => results.push(['init', result]));
  void manager.validate().then((result) => results.push(['validate', result]));
  worker.onmessage!({ data: { messageId: worker.messages[0]!.messageId, result: {} } });
  await Promise.resolve();
  expect(results).toEqual([['init', {}]]);
  worker.onmessage!({
    data: { messageId: worker.messages[1]!.messageId, result: { problems: [] } },
  });
  await Promise.resolve();
  expect(results).toEqual([
    ['init', {}],
    ['validate', { problems: [] }],
  ]);
  manager.dispose();
});
