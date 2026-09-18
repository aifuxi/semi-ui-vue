import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';

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

// 只有"元数据尚未传播"属于可等待状态；integrity、依赖、签名等不符一律由调用方立即失败。
function pendingMetadata(state, expected, tag) {
  const manifest = state.versions?.[expected.version];
  if (!manifest) return 'version';
  if (state['dist-tags']?.[tag] !== expected.version) return `${tag} dist-tag`;
  if (!manifest.dist?.attestations?.provenance) return 'provenance attestation';
  return null;
}

/**
 * 并行轮询 registry 元数据，直到每个包的版本、dist-tag 与 provenance 都可见，或共享预算用尽。
 * 返回每个包的最后一次读数，缺失项交给调用方断言，避免把传播延迟误判成发布失败。
 */
export async function waitForRegistryMetadata({
  packages,
  tag,
  readState,
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
        const missing = pendingMetadata(state, expected, tag);
        if (!missing) {
          pending.delete(name);
          readings.set(name, { state, missing: null });
          log(`${name}: registry metadata ready after ${formatSeconds(now() - startedAt)}`);
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
      `waiting for registry metadata propagation: ${pending.size} package(s) pending, retrying in ${formatSeconds(waitMs)} (budget ${formatSeconds(timeoutMs)})`,
    );
    await sleep(waitMs);
  }
  return readings;
}

function formatSeconds(milliseconds) {
  return `${Math.round(milliseconds / 1000)}s`;
}
