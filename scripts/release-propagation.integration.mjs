import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { NPM_REGISTRY } from './public-packages.mjs';
import {
  DEFAULT_PROPAGATION_TIMEOUT_MS,
  propagationTimeoutMs,
  waitForRegistryAvailability,
} from './release-propagation.mjs';

const tag = 'next';
const version = '1.0.0-next.0';
const tarballBytes = Buffer.from('published tarball');
const integrity = `sha512-${createHash('sha512').update(tarballBytes).digest('base64')}`;
const packages = ['pkg-a', 'pkg-b', 'pkg-c', 'pkg-d', 'pkg-e'].map((name) => ({
  name,
  version,
  integrity,
  dependencies: {},
}));

const tarballUrl = (name) => `${NPM_REGISTRY}${name}/-/${name}-${version}.tgz`;
const fetchReadyTarball = async () => new Response(tarballBytes);

const readyState = (name = packages[0].name) => ({
  versions: {
    [version]: {
      dist: {
        integrity,
        tarball: tarballUrl(name),
        attestations: { provenance: { predicateType: 'x' } },
      },
    },
  },
  'dist-tags': { [tag]: version },
});

const staleState = ({ withVersion = false, withVersionTag = false, withProvenance = false }) => ({
  versions: withVersion
    ? {
        [version]: withProvenance
          ? { dist: { attestations: { provenance: { predicateType: 'x' } } } }
          : { dist: {} },
      }
    : {},
  'dist-tags': withVersionTag ? { [tag]: version } : { [tag]: '0.1.0-alpha.4' },
});

function countingReadState(resolve) {
  const polls = new Map();
  return {
    polls,
    readState: async (name) => {
      const count = (polls.get(name) ?? 0) + 1;
      polls.set(name, count);
      return resolve(name, count);
    },
  };
}

test('元数据就绪后仍等待 tarball 结束 404，已可下载的包只请求一次', async () => {
  const [ready, delayed] = packages;
  const requests = new Map();
  let clock = 0;
  const readings = await waitForRegistryAvailability({
    packages: [ready, delayed],
    tag,
    readState: async (name) => readyState(name),
    fetchTarball: async (url) => {
      const count = (requests.get(url.href) ?? 0) + 1;
      requests.set(url.href, count);
      if (url.href === tarballUrl(delayed.name) && count < 3) {
        return new Response('Not found', { status: 404 });
      }
      return new Response(tarballBytes);
    },
    timeoutMs: 10_000,
    initialDelayMs: 100,
    now: () => clock,
    sleep: async (milliseconds) => {
      clock += milliseconds;
    },
    log: () => {},
  });
  assert.equal(readings.get(ready.name).missing, null);
  assert.equal(readings.get(delayed.name).missing, null);
  assert.equal(requests.get(tarballUrl(ready.name)), 1);
  assert.equal(requests.get(tarballUrl(delayed.name)), 3);
  assert.equal(clock, 300);
});

test('传播慢于旧的 3 次等待上限时仍然通过，不停在固定次数上', async () => {
  // 旧实现只允许 3 次等待（15 秒），这条用例模拟"第 6 次才就绪"。
  const { polls, readState } = countingReadState((name, count) =>
    count >= 6 ? readyState(name) : staleState({}),
  );
  const readings = await waitForRegistryAvailability({
    packages,
    tag,
    readState,
    fetchTarball: fetchReadyTarball,
    timeoutMs: 5_000,
    initialDelayMs: 1,
    maxDelayMs: 4,
    sleep: () => new Promise((resolve) => setImmediate(resolve)),
    log: () => {},
  });
  for (const { name } of packages) {
    assert.equal(readings.get(name).missing, null);
    assert.ok(polls.get(name) >= 6, `${name} 应该在超过旧上限后仍继续轮询`);
  }
});

test('五个包并行轮询共享同一预算，不随包数量相乘', async () => {
  let clock = 0;
  const { polls, readState } = countingReadState((name, count) =>
    count >= 3 ? readyState(name) : staleState({}),
  );
  const readings = await waitForRegistryAvailability({
    packages,
    tag,
    readState,
    fetchTarball: fetchReadyTarball,
    timeoutMs: 10_000,
    initialDelayMs: 100,
    maxDelayMs: 1_000,
    now: () => clock,
    sleep: async (milliseconds) => {
      clock += milliseconds;
    },
    log: () => {},
  });
  for (const { name } of packages) assert.equal(readings.get(name).missing, null);
  for (const { name } of packages) assert.equal(polls.get(name), 3);
  // 串行实现会累加 5 个包各自的等待；并行只应付出两轮退避 100 + 200。
  assert.equal(clock, 300);
});

test('区分待传播的三类元数据：版本、dist-tag 与 provenance', async () => {
  const reasons = [];
  const { readState } = countingReadState((name, count) => {
    if (count === 1) return staleState({});
    if (count === 2) return staleState({ withVersion: true });
    if (count === 3) return staleState({ withVersion: true, withVersionTag: true });
    return readyState(name);
  });
  const readings = await waitForRegistryAvailability({
    packages: [packages[0]],
    tag,
    readState,
    fetchTarball: fetchReadyTarball,
    timeoutMs: 1_000,
    initialDelayMs: 1,
    maxDelayMs: 1,
    sleep: async () => {},
    log: (message) => reasons.push(message),
  });
  assert.equal(readings.get(packages[0].name).missing, null);
  assert.ok(
    reasons.some((message) => message.includes('待传播')) === false,
    '就绪日志不应被当成缺失',
  );
});

test('预算用尽时保留最后一次读数与缺失项，由调用方判定失败', async () => {
  let clock = 0;
  const { readState } = countingReadState(() => staleState({ withVersion: true }));
  const readings = await waitForRegistryAvailability({
    packages: [packages[0]],
    tag,
    readState,
    fetchTarball: () => assert.fail('元数据尚未就绪时不应请求 tarball'),
    timeoutMs: 50,
    initialDelayMs: 10,
    maxDelayMs: 20,
    now: () => clock,
    sleep: async (milliseconds) => {
      clock += milliseconds;
    },
    log: () => {},
  });
  assert.equal(readings.get(packages[0].name).missing, `${tag} dist-tag`);
  assert.ok(clock >= 50);
});

test('registry 声明的完整性不符时立即失败', async () => {
  const { polls, readState } = countingReadState(() => ({
    ...readyState(),
    versions: {
      [version]: { dist: { ...readyState().versions[version].dist, integrity: 'sha512-other' } },
    },
  }));
  await assert.rejects(
    waitForRegistryAvailability({
      packages: [packages[0]],
      tag,
      readState,
      fetchTarball: () => assert.fail('registry 声明的完整性不符时不应请求 tarball'),
      sleep: () => assert.fail('完整性不符时不应等待传播'),
      log: () => {},
    }),
    /registry tarball integrity mismatch/,
  );
  assert.equal(polls.get(packages[0].name), 1);
});

test('tarball 传播预算用尽时记录 HTTP 404 与包名', async () => {
  const readings = await waitForRegistryAvailability({
    packages: [packages[0]],
    tag,
    readState: async (name) => readyState(name),
    fetchTarball: async () => new Response('Not found', { status: 404 }),
    timeoutMs: 0,
    sleep: () => assert.fail('预算用尽后不应继续等待'),
    log: () => {},
  });
  assert.equal(readings.get(packages[0].name).missing, 'tarball (HTTP 404)');
});

test('tarball 的其他 HTTP 错误和下载内容不符均立即失败', async () => {
  const options = {
    packages: [packages[0]],
    tag,
    readState: async (name) => readyState(name),
    sleep: () => assert.fail('这类下载错误不应等待传播'),
    log: () => {},
  };
  await assert.rejects(
    waitForRegistryAvailability({
      ...options,
      fetchTarball: async () => new Response('Unavailable', { status: 503 }),
    }),
    /tarball download failed \(HTTP 503\)/,
  );
  await assert.rejects(
    waitForRegistryAvailability({
      ...options,
      fetchTarball: async () => new Response('different tarball'),
    }),
    /downloaded tarball integrity mismatch/,
  );
});

test('传播预算可通过环境变量调整，默认值高于实测最慢的传播时间', () => {
  assert.equal(propagationTimeoutMs({}), DEFAULT_PROPAGATION_TIMEOUT_MS);
  assert.equal(
    propagationTimeoutMs({ POSTCHECK_PROPAGATION_TIMEOUT_MS: '' }),
    DEFAULT_PROPAGATION_TIMEOUT_MS,
  );
  assert.equal(propagationTimeoutMs({ POSTCHECK_PROPAGATION_TIMEOUT_MS: '123456' }), 123456);
  // 2026-09-18 实测 ui 的元数据比发布报告晚 188 秒，默认预算必须留足余量。
  assert.ok(DEFAULT_PROPAGATION_TIMEOUT_MS >= 300_000);
  for (const invalid of ['abc', '-1', '1.5', '9007199254740992']) {
    assert.throws(
      () => propagationTimeoutMs({ POSTCHECK_PROPAGATION_TIMEOUT_MS: invalid }),
      /POSTCHECK_PROPAGATION_TIMEOUT_MS/,
    );
  }
});
