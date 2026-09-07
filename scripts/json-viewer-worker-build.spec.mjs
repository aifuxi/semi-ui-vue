// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { build } from 'vite';
import { expect, it } from 'vitest';
import uiConfig from '../packages/ui/vite.config.ts';
import { adaptPinnedJsonViewerCore } from '../packages/foundation-integration/vite-json-viewer-plugin.ts';

it('公开包 Worker 构建保留固定 JSON 协议并返回格式化和折叠结果', async () => {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    plugins: [...uiConfig.worker.plugins()],
    ...adaptPinnedJsonViewerCore().config(),
    build: {
      write: false,
      rolldownOptions: {
        input: fileURLToPath(
          new URL(
            '../packages/foundation-integration/src/json-viewer-worker-entry.ts',
            import.meta.url,
          ),
        ),
        output: { format: 'iife' },
      },
    },
  });
  const replies = [];
  const code = result.output.find((item) => item.type === 'chunk').code;
  expect(code).not.toContain('%WORKER_RAW%');
  class DedicatedWorkerGlobalScope {
    postMessage(message) {
      replies.push(message);
    }
  }
  const self = new DedicatedWorkerGlobalScope();
  runInNewContext(code, { self, console });
  expect(self.onmessage).toBeTypeOf('function');
  self.onmessage({
    data: { messageId: 1, method: 'init', params: { value: '{"name":"Semi","items":[1,2]}' } },
  });
  self.onmessage({
    data: {
      messageId: 2,
      method: 'format',
      params: { options: { tabSize: 4, insertSpaces: true, eol: '\n' } },
    },
  });
  self.onmessage({ data: { messageId: 3, method: 'foldRange', params: {} } });
  self.onmessage({ data: { messageId: 4, method: 'validate', params: {} } });
  await expect.poll(() => replies.length).toBe(4);
  expect(replies.map((reply) => reply.messageId)).toEqual([1, 2, 3, 4]);
  expect(replies.every((reply) => !reply.error)).toBe(true);
  expect(replies[1].result).toBeTruthy();
  expect(Array.isArray(replies[2].result)).toBe(true);
  expect(replies[3].result.problems).toEqual([]);
}, 30000);
