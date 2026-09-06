import { defineConfig } from '@playwright/test';
import base from './playwright.config';

const requestedWorkers = process.env.DOCS_PARITY_WORKERS;
if (
  requestedWorkers !== undefined &&
  (!/^[1-9]\d*$/.test(requestedWorkers) || !Number.isSafeInteger(Number(requestedWorkers)))
) {
  throw new Error('DOCS_PARITY_WORKERS must be a positive safe integer');
}

export default defineConfig(base, {
  // Each matrix case owns its context and keeps its React/Vue pair in the worker's
  // Chromium process. Parallelize cases, preserving every case's interaction order.
  fullyParallel: true,
  // Start with the repository's measured Chromium concurrency; keep docs tuning explicit.
  workers: requestedWorkers === undefined ? 3 : Number(requestedWorkers),
});
