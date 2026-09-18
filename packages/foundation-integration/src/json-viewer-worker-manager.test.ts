import { afterEach, expect, it, vi } from 'vitest';

const { workers } = vi.hoisted(() => ({
  workers: [] as Array<{
    messages: Array<{ messageId: number; method: string; params: unknown }>;
    onmessage:
      ((event: { data: { messageId: number; result?: unknown; error?: string } }) => void) | null;
    terminated: boolean;
  }>,
}));

vi.mock('./json-viewer-worker-entry?worker&inline', () => ({
  default: class {
    messages: Array<{ messageId: number; method: string; params: unknown }> = [];
    onmessage = null;
    terminated = false;
    constructor() {
      workers.push(this);
    }
    postMessage(message: { messageId: number; method: string; params: unknown }) {
      this.messages.push(message);
    }
    terminate() {
      this.terminated = true;
    }
  },
}));

import {
  disposeWorkerManager,
  getJsonWorkerManager,
  JsonWorkerManager,
} from './json-viewer-worker-manager';
import { setCurrentNameSpaceId } from './json-viewer-namespace';

afterEach(() => {
  vi.restoreAllMocks();
  workers.length = 0;
  setCurrentNameSpaceId('default');
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

it('模型更新、格式化、历史与折叠查询保留参数，乱序回复匹配原请求', async () => {
  const manager = new JsonWorkerManager();
  const worker = workers[0]!;
  const changes = { changes: [{ text: '{}' }], isFlush: true };
  const requests = [
    manager.formatJson({ tabSize: 4 }),
    manager.undo(),
    manager.redo(),
    manager.updateModel(changes),
    manager.foldRange(),
  ];
  expect(worker.messages.map(({ method, params }) => ({ method, params }))).toEqual([
    { method: 'format', params: { options: { tabSize: 4 } } },
    { method: 'undo', params: {} },
    { method: 'redo', params: {} },
    { method: 'updateModel', params: { op: changes } },
    { method: 'foldRange', params: {} },
  ]);
  for (const index of [2, 4, 0, 3, 1])
    worker.onmessage!({
      data: { messageId: worker.messages[index]!.messageId, result: index },
    });
  await expect(Promise.all(requests)).resolves.toEqual([0, 1, 2, 3, 4]);
  manager.dispose();
  expect(worker.terminated).toBe(true);
});

it('错误回复作为 Error 结果返回，未知和重复回复不影响后续请求', async () => {
  const manager = new JsonWorkerManager();
  const worker = workers[0]!;
  const request = manager.init('invalid');
  const messageId = worker.messages[0]!.messageId;
  worker.onmessage!({ data: { messageId: -1, result: 'unknown' } });
  worker.onmessage!({ data: { messageId, error: 'Invalid JSON' } });
  await expect(request).resolves.toEqual(new Error('Invalid JSON'));
  worker.onmessage!({ data: { messageId, result: 'duplicate' } });
  const validation = manager.validate();
  worker.onmessage!({
    data: { messageId: worker.messages[1]!.messageId, result: [] },
  });
  await expect(validation).resolves.toEqual([]);
  manager.dispose();
});

it('同一命名空间复用 Worker，销毁幂等且不影响其它实例', () => {
  setCurrentNameSpaceId('worker-test-a');
  const first = getJsonWorkerManager();
  expect(getJsonWorkerManager()).toBe(first);
  setCurrentNameSpaceId('worker-test-b');
  expect(getJsonWorkerManager()).not.toBe(first);
  disposeWorkerManager('worker-test-a');
  disposeWorkerManager('worker-test-a');
  expect(workers.map((worker) => worker.terminated)).toEqual([true, false]);
  setCurrentNameSpaceId('worker-test-a');
  expect(getJsonWorkerManager()).not.toBe(first);
  disposeWorkerManager('worker-test-a');
  disposeWorkerManager('worker-test-b');
  expect(workers.every((worker) => worker.terminated)).toBe(true);
});
