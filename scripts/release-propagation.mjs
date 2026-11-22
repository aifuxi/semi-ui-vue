import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { NPM_REGISTRY } from './public-packages.mjs';

export const DEFAULT_PROPAGATION_TIMEOUT_MS = 600_000;
const DEFAULT_INITIAL_DELAY_MS = 2_000;
const DEFAULT_MAX_DELAY_MS = 30_000;

export function propagationTimeoutMs(env = process.env) {
  const raw = env.POSTCHECK_PROPAGATION_TIMEOUT_MS;
  if (raw === undefined || raw === '') return DEFAULT_PROPAGATION_TIMEOUT_MS;
  const value = Number(raw);
  assert.ok(
    Number.isSafeInteger(value) && value >= 0,
    'POSTCHECK_PROPAGATION_TIMEOUT_MS must be a non-negative integer of milliseconds',
  );
  return value;
}

function pendingMetadata(state, expected, tag) {
  const manifest = state.versions?.[expected.version];
  if (!manifest) return 'version';
  if (state['dist-tags']?.[tag] !== expected.version) return `${tag} dist-tag`;
  if (!manifest.dist?.attestations?.provenance) return 'provenance attestation';
  return null;
}

async function tarballAvailable(dist, expected, fetchTarball) {
  const label = `${expected.name}@${expected.version}`;
  assert.equal(dist.integrity, expected.integrity, `${label}: registry tarball integrity mismatch`);
  const url = new URL(dist.tarball);
  assert.equal(url.origin, new URL(NPM_REGISTRY).origin, `${label}: unexpected tarball registry`);
  const response = await fetchTarball(url, {
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    await response.body?.cancel();
    if (response.status === 404) return false;
    throw new Error(`${label}: tarball download failed (HTTP ${response.status})`);
  }
  assert.ok(response.body, `${label}: tarball response has no body`);
  const hash = createHash('sha512');
  for await (const chunk of response.body) hash.update(chunk);
  assert.equal(
    `sha512-${hash.digest('base64')}`,
    expected.integrity,
    `${label}: downloaded tarball integrity mismatch`,
  );
  return true;
}

/**
 * 并行等待元数据与 tarball。npm 的 tarball 可能晚于版本元数据可下载。
 * 返回每个包的最后一次读数，缺失项交给调用方断言，避免把传播延迟误判成发布失败。
 */
export async function waitForRegistryAvailability({
  packages,
  tag,
  readState,
  fetchTarball = fetch,
  timeoutMs = DEFAULT_PROPAGATION_TIMEOUT_MS,
  initialDelayMs = DEFAULT_INITIAL_DELAY_MS,
  maxDelayMs = DEFAULT_MAX_DELAY_MS,
  now = () => Date.now(),
  sleep = delay,
  log = (message) => process.stdout.write(`${message}\n`),
}) {
  const startedAt = now();
  const deadline = startedAt + timeoutMs;
  const pending = new Map(packages.map((expected) => [expected.name, expected]));
  const readings = new Map();
  for (let round = 0; pending.size > 0; round += 1) {
    await Promise.all(
      [...pending].map(async ([name, expected]) => {
        const state = await readState(name);
        let missing = pendingMetadata(state, expected, tag);
        if (
          !missing &&
          !(await tarballAvailable(state.versions[expected.version].dist, expected, fetchTarball))
        ) {
          missing = 'tarball (HTTP 404)';
        }
        if (!missing) {
          pending.delete(name);
          readings.set(name, { state, missing: null });
          log(
            `${name}: registry metadata and tarball ready after ${formatSeconds(now() - startedAt)}`,
          );
          return;
        }
        if (now() >= deadline) {
          pending.delete(name);
          readings.set(name, { state, missing });
          log(
            `${name}: propagation budget exhausted after ${formatSeconds(now() - startedAt)} (missing ${missing})`,
          );
        }
      }),
    );
    if (pending.size === 0) break;
    const waitMs = Math.max(0, Math.min(initialDelayMs * 2 ** round, maxDelayMs, deadline - now()));
    log(
      `waiting for registry propagation: ${pending.size} package(s) pending, retrying in ${formatSeconds(waitMs)} (budget ${formatSeconds(timeoutMs)})`,
    );
    await sleep(waitMs);
  }
  return readings;
}

function formatSeconds(milliseconds) {
  return `${Math.round(milliseconds / 1000)}s`;
}
