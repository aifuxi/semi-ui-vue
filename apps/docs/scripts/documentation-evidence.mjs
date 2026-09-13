import { createHash } from 'node:crypto';
import { lstat, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
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

/** Keep preflight and coverage on the same review bytes, independently of browser evidence. */
export async function documentReview(doc, pages, mapping, workspace = root) {
  // Some pages keep their API tables inline. Preserve their signed missing-API marker;
  // deleting a previously present API module still changes the review fingerprint.
  const optionalApi = pages[0]?.slug ? `apps/docs/src/data/api/${pages[0].slug}.ts` : null;
  const files = [
    ...new Set([
      doc.zhCN.path,
      doc.enUS.path,
      ...(pages[0]?.slug ? [`apps/docs/src/data/api/${pages[0].slug}.ts`] : []),
      ...pages.map((page) => `apps/docs/content${page.path.replace(/\/$/, '')}.md`),
    ]),
  ];
  const missing = [];
  const bytes = await Promise.all(
    files.map(async (file) => {
      try {
        return Buffer.concat([Buffer.from(file + '\0'), await readFile(resolve(workspace, file))]);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        if (file !== optionalApi) missing.push(file);
        return Buffer.from(file + '\0missing');
      }
    }),
  );
  const fingerprint = sha256(Buffer.concat(bytes));
  const issues = [];
  if (
    pages.length !== 2 ||
    !['/zh-cn/', '/en-us/'].every((locale) => pages.some((page) => page.path.startsWith(locale)))
  )
    issues.push('缺少完整双语页面登记');
  if (missing.length) issues.push(`审阅输入缺失：${missing.sort().join('、')}`);
  for (const field of ['chapters', 'api', 'migration'])
    if (mapping?.review?.[field] !== true) issues.push(`${field} 尚未审阅`);
  if (mapping?.review?.fingerprint !== fingerprint) issues.push('审阅指纹缺失或已过期');
  return { fingerprint, reviewed: issues.length === 0, issues };
}

export async function loadBatchReviews(batches, workspace = root) {
  const read = async (file) => JSON.parse(await readFile(resolve(workspace, file), 'utf8'));
  const inventory = await read('docs/inventory/semi-v2.102.0.json');
  const pages = await read('apps/docs/src/data/pages.json');
  const directory = 'docs/documentation/mappings';
  const mappings = new Map();
  for (const file of await readdir(resolve(workspace, directory))) {
    if (!file.endsWith('.json')) continue;
    const mapping = await read(`${directory}/${file}`);
    if (mappings.has(mapping.upstream)) throw new Error(`Duplicate mapping: ${mapping.upstream}`);
    mappings.set(mapping.upstream, mapping);
  }
  const bySource = new Map();
  const reviews = new Map();
  for (const batch of batches) {
    if (!bySource.has(batch.upstream)) {
      const doc = inventory.documentation.find(
        (doc) => `${doc.category}/${doc.slug}` === batch.upstream,
      );
      if (!doc) throw new Error(`${batch.id}: 找不到固定文档来源 ${batch.upstream}`);
      bySource.set(
        batch.upstream,
        await documentReview(
          doc,
          pages.filter((page) => page.upstream === batch.upstream),
          mappings.get(batch.upstream),
          workspace,
        ),
      );
    }
    reviews.set(batch.id, bySource.get(batch.upstream));
  }
  return reviews;
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
export function expectedCaseTitles(batch) {
  return batch.examples.flatMap(({ name }) =>
    batch.locales.flatMap((locale) =>
      batch.themes.flatMap((theme) =>
        (batch.rtlExamples?.includes(name) ? ['ltr', 'rtl'] : ['ltr']).map(
          (direction) =>
            `${batch.title} ${name} ${locale} ${theme}${direction === 'rtl' ? ' rtl' : ''}`,
        ),
      ),
    ),
  );
}
export function validateReport(report, batch) {
  const cases = reportCases(report);
  const wanted = expectedCaseTitles(batch);
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

const evidenceDirectory = 'docs/documentation/evidence';
export const reportPartBytes = 32 * 1024 * 1024;
const digestPattern = /^[a-f0-9]{64}$/;
class InvalidReportArchive extends Error {}

function reportBase(batch) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(batch.id))
    throw new InvalidReportArchive('Invalid evidence batch id');
  return `${evidenceDirectory}/${batch.id}`;
}

function partPath(batch, digest, count, index, partDigest) {
  return `${reportBase(batch)}.report.${digest}.json.gz${count === 1 ? '' : `.part-${String(index + 1).padStart(5, '0')}-${partDigest}`}`;
}

/** Check ordered, batch-local names before reading any metadata-provided path. */
function archiveParts(evidence, batch) {
  const base = reportBase(batch);
  if (!digestPattern.test(evidence.reportSha256))
    throw new InvalidReportArchive('Invalid report digest');
  if (!Object.hasOwn(evidence, 'reportArchive'))
    return [{ path: `${base}.report.json.gz`, sha256: evidence.reportSha256 }];
  const archive = evidence.reportArchive;
  if (
    archive?.format !== 'gzip-parts-v1' ||
    !Number.isSafeInteger(archive.byteLength) ||
    archive.byteLength <= 0 ||
    !Array.isArray(archive.parts) ||
    !archive.parts.length
  )
    throw new InvalidReportArchive('Invalid report archive metadata');
  let total = 0;
  for (const [index, part] of archive.parts.entries()) {
    if (
      !part ||
      part?.path !==
        partPath(batch, evidence.reportSha256, archive.parts.length, index, part.sha256) ||
      !Number.isSafeInteger(part.byteLength) ||
      part.byteLength <= 0 ||
      part.byteLength > reportPartBytes ||
      !digestPattern.test(part.sha256)
    )
      throw new InvalidReportArchive('Invalid report part path, order, size or digest');
    total += part.byteLength;
  }
  if (total !== archive.byteLength) throw new InvalidReportArchive('Invalid report archive size');
  return archive.parts;
}

/** Reconstruct the exact original gzip stream before applying the unchanged report gate. */
export async function readEvidenceReport(evidence, batch, workspace = root) {
  try {
    const parts = archiveParts(evidence, batch);
    const buffers = [];
    for (const part of parts) {
      const file = resolve(workspace, part.path);
      if (!(await lstat(file)).isFile())
        throw new InvalidReportArchive('Report part is not a regular file');
      const bytes = await readFile(file);
      if (
        (part.byteLength !== undefined && bytes.length !== part.byteLength) ||
        sha256(bytes) !== part.sha256
      )
        throw new InvalidReportArchive('Report part size or digest mismatch');
      buffers.push(bytes);
    }
    const bytes = buffers.length === 1 ? buffers[0] : Buffer.concat(buffers);
    if (sha256(bytes) !== evidence.reportSha256)
      throw new InvalidReportArchive('Report digest mismatch');
    try {
      if (!validateReport(JSON.parse(gunzipSync(bytes)), batch)) return null;
    } catch {
      return null;
    }
    return { bytes, paths: parts.map((part) => part.path) };
  } catch (error) {
    if (error.code === 'ENOENT' || error instanceof InvalidReportArchive) return null;
    throw error;
  }
}

/** Publish a freshly validated report; keep the old generation until metadata commits. */
export async function writeEvidenceArchive(
  batch,
  compressed,
  metadata,
  { workspace = root, partBytes = reportPartBytes } = {},
) {
  const base = reportBase(batch);
  if (!Buffer.isBuffer(compressed) || !compressed.length)
    throw new InvalidReportArchive('Expected a nonempty compressed report');
  if (!Number.isSafeInteger(partBytes) || partBytes <= 0 || partBytes > reportPartBytes)
    throw new InvalidReportArchive('Invalid report part limit');
  const digest = sha256(compressed);
  const count = Math.ceil(compressed.length / partBytes);
  const parts = Array.from({ length: count }, (_, index) => {
    const bytes = compressed.subarray(index * partBytes, (index + 1) * partBytes);
    const partDigest = sha256(bytes);
    return {
      path: partPath(batch, digest, count, index, partDigest),
      byteLength: bytes.length,
      sha256: partDigest,
    };
  });
  const evidence = {
    ...metadata,
    batch: batch.id,
    reportSha256: digest,
    reportArchive: { format: 'gzip-parts-v1', byteLength: compressed.length, parts },
  };
  const directory = resolve(workspace, evidenceDirectory);
  await mkdir(directory, { recursive: true });
  const staging = await mkdtemp(resolve(directory, `.${batch.id}-archive-`));
  try {
    for (const [index, part] of parts.entries()) {
      const file = resolve(staging, basename(part.path));
      await writeFile(file, compressed.subarray(index * partBytes, (index + 1) * partBytes));
      const written = await readFile(file);
      if (written.length !== part.byteLength || sha256(written) !== part.sha256)
        throw new InvalidReportArchive('Written report part failed verification');
      await rename(file, resolve(workspace, part.path));
    }
    if (!(await readEvidenceReport(evidence, batch, workspace)))
      throw new InvalidReportArchive('Written report archive failed complete validation');
    const manifest = resolve(staging, `${batch.id}.json`);
    await writeFile(manifest, JSON.stringify(evidence, null, 2) + '\n');
    await rename(manifest, resolve(workspace, `${base}.json`));

    // Only after the new manifest is committed, remove this batch's old report
    // generations. Other batches and unrelated files are never cleanup targets.
    const keep = new Set(parts.map((part) => basename(part.path)));
    const previous = new RegExp(
      `^${batch.id}\\.report\\.[a-f0-9]{64}\\.json\\.gz(?:\\.part-\\d{5}-[a-f0-9]{64})?$`,
    );
    for (const file of await readdir(directory))
      if (!keep.has(file) && (file === `${batch.id}.report.json.gz` || previous.test(file)))
        await rm(resolve(directory, file), { force: true });
    return evidence;
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

export async function acceptedBatch(batch) {
  try {
    const path = `docs/documentation/evidence/${batch.id}.json`;
    const evidence = await readJson(path);
    if (!evidenceIsCurrent(evidence, batch, await fingerprint(batch))) return null;
    const report = await readEvidenceReport(evidence, batch);
    if (!report) return null;
    return {
      path,
      ...(report.paths.length === 1 ? { report: report.paths[0] } : { reportParts: report.paths }),
      fingerprint: evidence.fingerprint,
    };
  } catch (error) {
    if (error.code === 'ENOENT' || error instanceof SyntaxError) return null;
    throw error;
  }
}

/** Partition only known specs; never discard unexpected tests or global errors. */
export function splitBatchReport(report, batches) {
  const specs = new Set(batches.map((batch) => batch.spec));
  if (specs.size !== batches.length || report.errors?.length)
    throw new Error('批次 spec 重复或报告包含全局错误；不生成新证据。');
  const cases = reportCases(report);
  if (cases.some((test) => !specs.has(test.file)))
    throw new Error('报告包含未选择的 spec；不生成新证据。');
  return batches.map((batch) => {
    function select(suites) {
      return (suites ?? []).flatMap((suite) => {
        const specs = (suite.specs ?? []).filter((spec) => spec.file === batch.spec);
        const children = select(suite.suites);
        return specs.length || children.length ? [{ ...suite, specs, suites: children }] : [];
      });
    }
    const selected = cases.filter((test) => test.file === batch.spec);
    const result = {
      ...report,
      suites: select(report.suites),
      // The original elapsed time belongs to the shared run, not to each batch.
      sharedRunStats: report.stats,
      stats: {
        startTime: report.stats?.startTime,
        duration: selected.reduce(
          (total, test) => total + test.results.reduce((sum, run) => sum + run.duration, 0),
          0,
        ),
        expected: selected.filter((test) => test.status === 'expected').length,
        skipped: selected.filter((test) => test.status === 'skipped').length,
        unexpected: selected.filter((test) => test.status === 'unexpected').length,
        flaky: selected.filter((test) => test.status === 'flaky').length,
      },
    };
    if (!validateReport(result, batch))
      throw new Error(`${batch.id}: 报告缺少完整矩阵、附件，或存在重试/跳过/失败；不计入验收。`);
    return { batch, report: result };
  });
}
