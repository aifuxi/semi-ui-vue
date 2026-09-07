import assert from 'node:assert/strict';
import test from 'node:test';
import { staticFileResponse } from './static-file-response.mjs';

const content = Buffer.from('0123456789');
const respond = (options = {}) =>
  staticFileResponse(content, { contentType: 'video/webm', ...options });

test('完整媒体响应提供长度，HEAD保留相同头但不发送内容', () => {
  const result = respond();
  assert.equal(result.status, 200);
  assert.equal(result.headers['content-length'], 10);
  assert.equal(result.headers['accept-ranges'], 'bytes');
  assert.equal(result.body, content);
  assert.deepEqual(respond({ method: 'HEAD' }), { ...result, body: undefined });
});

test('字节范围支持首段、开放结束、后缀和末端夹紧', () => {
  for (const [range, expected, interval] of [
    ['bytes=0-3', '0123', '0-3'],
    ['bytes=7-', '789', '7-9'],
    ['bytes=-2', '89', '8-9'],
    ['bytes=8-99', '89', '8-9'],
    ['bytes=-99', '0123456789', '0-9'],
  ]) {
    const result = respond({ range });
    assert.equal(result.status, 206);
    assert.equal(result.headers['content-range'], `bytes ${interval}/10`);
    assert.equal(result.headers['content-length'], expected.length);
    assert.equal(result.body.toString(), expected);
    assert.deepEqual(respond({ range, method: 'HEAD' }), respond({ method: 'HEAD' }));
  }
});

test('不可满足的范围返回416和实际长度，不支持的范围单位忽略', () => {
  for (const range of ['bytes=10-', 'bytes=5-2', 'bytes=-0', 'bytes=-', 'bytes=0-1,4-5']) {
    const result = respond({ range });
    assert.equal(result.status, 416);
    assert.equal(result.headers['content-range'], 'bytes */10');
    assert.equal(result.headers['content-length'], 0);
    assert.equal(result.body, undefined);
  }
  assert.equal(respond({ range: 'items=0-1' }).status, 200);
});
