import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, expect } from '@playwright/test';

const issueText = (error) => error.stack || error.message || String(error);

export function createSmokeTracker(page, { now = () => performance.now() } = {}) {
  let currentPhase = 'setup';
  const phases = [];
  const issues = [];
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type()))
      issues.push({ kind: `console-${message.type()}`, phase: currentPhase, text: message.text() });
  });
  page.on('pageerror', (error) =>
    issues.push({ kind: 'pageerror', phase: currentPhase, text: issueText(error) }),
  );
  page.on('requestfailed', (request) =>
    issues.push({
      kind: 'requestfailed',
      phase: currentPhase,
      text: `${request.url()} ${request.failure()?.errorText ?? ''}`.trim(),
    }),
  );
  return {
    get currentPhase() {
      return currentPhase;
    },
    issues,
    phases,
    async step(name, action) {
      currentPhase = name;
      const started = now();
      const phase = { name, durationMs: 0, status: 'failed' };
      try {
        const result = await action();
        phase.status = 'passed';
        return result;
      } finally {
        phase.durationMs = Math.round(now() - started);
        phases.push(phase);
      }
    },
  };
}

export function classifyDevelopmentEditorIssues(issues) {
  const workerFailure = issues.some(
    (issue) =>
      issue.kind === 'requestfailed' &&
      /editor/i.test(issue.phase) &&
      /\/_nuxt\/assets\/(?:editor|vue)\.worker-[^/]+\.js net::ERR_FAILED$/.test(issue.text),
  );
  if (!workerFailure) return { known: [], unexpected: issues };
  const known = [];
  const unexpected = [];
  for (const issue of issues) {
    const editorPhase = /editor/i.test(issue.phase);
    const expected =
      editorPhase &&
      ((issue.kind === 'requestfailed' &&
        (/\/_nuxt\/assets\/(?:editor|vue)\.worker-[^/]+\.js net::ERR_FAILED$/.test(issue.text) ||
          (/^blob:/.test(issue.text) && /net::ERR_ABORTED$/.test(issue.text)))) ||
        (issue.kind === 'pageerror' && issue.text === 'Event') ||
        (issue.kind === 'console-warning' &&
          (/Could not create web worker/.test(issue.text) || issue.text === 'undefined')));
    (expected ? known : unexpected).push(issue);
  }
  return { known, unexpected };
}

export function classifyCommonEditorIssues(issues) {
  const known = [];
  const unexpected = [];
  for (const issue of issues) {
    const expected =
      issue.kind === 'console-warning' &&
      /editor/i.test(issue.phase) &&
      /^\[volar-service-(?:emmet|pug)\] this module is not yet supported for web\.$/.test(
        issue.text,
      );
    (expected ? known : unexpected).push(issue);
  }
  return { known, unexpected };
}

export async function closeAnimatedItems(
  page,
  locator,
  { settleMs = 300, timeout = 5_000 } = {},
) {
  while (true) {
    if (settleMs) await page.waitForTimeout(settleMs);
    const count = await locator.count();
    if (!count) return;
    await locator.first().click();
    await expect.poll(() => locator.count(), { timeout }).toBeLessThan(count);
  }
}

export async function runDocumentationSmoke({
  batch,
  baseURL = 'http://127.0.0.1:4321',
  locales,
  outputDirectory,
  runLocale,
  allowDevelopmentEditorFallback = false,
  browserType = chromium,
  contextOptions = {},
  now = () => performance.now(),
}) {
  if (!batch || !outputDirectory || !locales?.length || typeof runLocale !== 'function')
    throw new Error('smoke 需要 batch、outputDirectory、locales 和 runLocale。');
  const startedAt = new Date().toISOString();
  const started = now();
  const browser = await browserType.launch();
  let browserVersion = 'unknown';
  const results = [];
  try {
    browserVersion = browser.version();
    results.push(
      ...(await Promise.all(
        locales.map(async (locale) => {
          const context = await browser.newContext({
            baseURL,
            locale: locale.code,
            timezoneId: 'Asia/Shanghai',
            colorScheme: 'light',
            viewport: { width: 1440, height: 900 },
            deviceScaleFactor: 1,
            ...contextOptions,
          });
          const page = await context.newPage();
          const tracker = createSmokeTracker(page, { now });
          let error;
          try {
            await runLocale({
              page,
              locale,
              tracker,
              step: tracker.step,
              closeAnimatedItems: (locator, options) =>
                closeAnimatedItems(page, locator, options),
            });
          } catch (cause) {
            error = issueText(cause);
          } finally {
            await context.close();
          }
          const common = classifyCommonEditorIssues(tracker.issues);
          const development = allowDevelopmentEditorFallback
            ? classifyDevelopmentEditorIssues(common.unexpected)
            : { known: [], unexpected: common.unexpected };
          const classified = {
            known: [...common.known, ...development.known],
            unexpected: development.unexpected,
          };
          return {
            locale: locale.id ?? locale.code,
            status: error || classified.unexpected.length ? 'failed' : 'passed',
            error,
            phases: tracker.phases,
            issues: classified.unexpected,
            knownIssues: classified.known,
          };
        }),
      )),
    );
  } finally {
    await browser.close();
  }
  const summary = {
    batch,
    baseURL,
    startedAt,
    completedAt: new Date().toISOString(),
    durationMs: Math.round(now() - started),
    browserVersion,
    viewport: '1440x900',
    dpr: 1,
    results,
  };
  await mkdir(outputDirectory, { recursive: true });
  const summaryFile = resolve(outputDirectory, 'summary.json');
  await writeFile(summaryFile, `${JSON.stringify(summary, null, 2)}\n`);
  const failed = results.filter((result) => result.status === 'failed');
  if (failed.length)
    throw new Error(
      `smoke 失败：${failed.map((result) => `${result.locale}:${result.error ?? `${result.issues.length} issues`}`).join(', ')}；摘要 ${summaryFile}`,
    );
  return summary;
}
