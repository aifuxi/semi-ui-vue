import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { gunzipSync } from 'node:zlib';
import { batchInputs } from './documentation-inputs.mjs';

export const root = resolve(import.meta.dirname, '../../..');
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
export async function readJson(path) {
  return JSON.parse(await readFile(resolve(root, path), 'utf8'));
}
export async function loadBatches() {
  const directory = 'docs/documentation/batches';
  const files = await readdir(resolve(root, directory));
  return Promise.all(
    files
      .filter((file) => file.endsWith('.json'))
      .sort()
      .map((file) => readJson(`${directory}/${file}`)),
  );
}

/** Include uncommitted edits and new source files; never fingerprint dist or the evidence itself. */
export async function fingerprint(batch) {
  const { files } = await batchInputs(batch);
  const hash = createHash('sha256');
  for (const file of [...new Set(files)].sort()) {
    hash.update(file + '\0');
    try {
      hash.update(await readFile(resolve(root, file)));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      hash.update('deleted');
    }
    hash.update('\0');
  }
  const revision = execFileSync('git', ['-C', 'vendor/semi-design', 'rev-parse', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
  }).trim();
  if (revision !== 'cdfba6e520fc83ad871b30f51f36d8af3aaa5a21')
    throw new Error('验收要求固定 v2.102.0 submodule。');
  hash.update(revision);
  // Tracked modifications inside the read-only submodule must also invalidate old evidence.
  hash.update(execFileSync('git', ['-C', 'vendor/semi-design', 'diff', 'HEAD'], { cwd: root }));
  return hash.digest('hex');
}
export function reportCases(report) {
  return (report.suites ?? []).flatMap(function walk(suite) {
    return [
      ...(suite.specs ?? []).flatMap((spec) =>
        spec.tests.map((test) => ({ title: spec.title, file: spec.file, ...test })),
      ),
      ...(suite.suites ?? []).flatMap(walk),
    ];
  });
}
export function validateReport(report, batch) {
  const cases = reportCases(report);
  const wanted = batch.examples.flatMap(({ name }) =>
    batch.locales.flatMap((locale) =>
      batch.themes.flatMap((theme) =>
        (batch.rtlExamples?.includes(name) ? ['ltr', 'rtl'] : ['ltr']).map(
          (direction) =>
            `${batch.title} ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`,
        ),
      ),
    ),
  );
  if (
    report.errors?.length ||
    cases.length !== wanted.length ||
    new Set(cases.map((test) => test.title)).size !== wanted.length
  )
    return false;
  return wanted.every((title) => {
    const test = cases.find((test) => test.title === title);
    if (
      !test ||
      test.status !== 'expected' ||
      test.results.length !== 1 ||
      test.results[0].status !== 'passed'
    )
      return false;
    const attachments = test.results[0].attachments ?? [];
    if (
      !['environment', 'default-styles', 'reference', 'vue', 'acceptance'].every((name) =>
        attachments.some((attachment) => attachment.name === name && attachment.body),
      )
    )
      return false;
    try {
      const decode = (name) =>
        JSON.parse(
          Buffer.from(attachments.find((attachment) => attachment.name === name).body, 'base64'),
        );
      const proof = decode('acceptance');
      const environment = decode('environment');
      const example = batch.examples.find((entry) => entry.index === proof.index);
      return (
        example?.name === proof.name &&
        proof.upstream === batch.upstream &&
        title ===
          `${batch.title} ${proof.name} ${proof.locale} ${proof.theme}${proof.direction === 'rtl' ? ' rtl' : ''}` &&
        batch.locales.includes(proof.locale) &&
        batch.themes.includes(proof.theme) &&
        ['text', 'styles', 'geometry', 'screenshots', 'interaction'].every((check) =>
          proof.checks?.includes(check),
        ) &&
        environment.baseline === 'cdfba6e520fc83ad871b30f51f36d8af3aaa5a21' &&
        environment.viewport?.width === 1440 &&
        environment.viewport?.height === 900 &&
        environment.deviceScaleFactor === 1 &&
        environment.locale === (proof.locale === 'zh-cn' ? 'zh-CN' : 'en-US') &&
        environment.colorScheme === proof.theme &&
        environment.playwright === '1.62.1'
      );
    } catch {
      return false;
    }
  });
}
export function evidenceIsCurrent(evidence, batch, currentFingerprint) {
  return (
    evidence.fingerprint === currentFingerprint &&
    JSON.stringify(evidence.examples) === JSON.stringify(batch.examples) &&
    ['build:public-js', 'build:theme', 'build:nuxt', 'typecheck:nuxt', 'check:nuxt:content'].every(
      (command) => evidence.checks?.includes(command),
    )
  );
}
export async function acceptedBatch(batch) {
  try {
    const path = `docs/documentation/evidence/${batch.id}.json`;
    const evidence = await readJson(path);
    if (!evidenceIsCurrent(evidence, batch, await fingerprint(batch))) return null;
    const reportPath = `docs/documentation/evidence/${batch.id}.report.json.gz`;
    const bytes = await readFile(resolve(root, reportPath));
    if (
      sha256(bytes) !== evidence.reportSha256 ||
      !validateReport(JSON.parse(gunzipSync(bytes)), batch)
    )
      return null;
    return { path, report: reportPath, fingerprint: evidence.fingerprint };
  } catch (error) {
    if (error.code === 'ENOENT' || error instanceof SyntaxError) return null;
    throw error;
  }
}
