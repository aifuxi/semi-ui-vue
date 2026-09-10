// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { createRsbuild } from '@rsbuild/core';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, it } from 'vitest';
import uiConfig from '../packages/ui/rslib.config.ts';

it('公开包 Worker 构建保留固定 JSON 协议并返回格式化和折叠结果', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'semi-json-worker-rsbuild-'));
  let code;
  try {
    const rsbuild = await createRsbuild({
      cwd: root,
      config: {
        plugins: uiConfig.plugins,
        source: {
          entry: {
            index: fileURLToPath(
              new URL(
                '../packages/foundation-integration/src/json-viewer-worker-entry.ts',
                import.meta.url,
              ),
            ),
          },
          include: [/vendor\/semi-design/],
        },
        tools: { htmlPlugin: false, rspack: { name: 'rsbuild-worker protocol-test' } },
        output: { filename: { js: '[name].js' }, minify: false },
        performance: {
          buildCache: false,
          printFileSize: false,
          chunkSplit: { strategy: 'all-in-one' },
        },
      },
    });
    const result = await rsbuild.build();
    await result.close();
    code = await readFile(path.join(root, 'dist/static/js/index.js'), 'utf8');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
  const replies = [];
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
