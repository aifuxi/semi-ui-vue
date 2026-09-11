import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { inspectPackedRelease } from './packed-release.mjs';

// The CLI owns selection, order, access and channels. This adapter only reconnects
// its freshly queried plan to the original bytes; it never packs or publishes.
export async function prepareRecovery(
  originalDirectory,
  outputDirectory,
  cli,
  cwd,
  env = process.env,
) {
  originalDirectory = path.resolve(originalDirectory);
  outputDirectory = path.resolve(outputDirectory);
  if (
    originalDirectory === outputDirectory ||
    outputDirectory.startsWith(`${originalDirectory}${path.sep}`) ||
    originalDirectory.startsWith(`${outputDirectory}${path.sep}`)
  )
    throw new Error('Recovery output must be separate from the original artifact');
  const originals = await inspectPackedRelease(originalDirectory);
  const originalPlan = JSON.parse(
    await readFile(path.join(originalDirectory, 'publish-plan.json'), 'utf8'),
  );
  await mkdir(outputDirectory);
  const outputPlan = path.join(outputDirectory, 'publish-plan.json');
  execFileSync(process.execPath, [cli, 'publish-plan', '--output', outputPlan], {
    cwd,
    env,
    stdio: 'pipe',
  });
  const fresh = JSON.parse(await readFile(outputPlan, 'utf8'));
  if (fresh.version !== 1 || originalPlan.version !== 1)
    throw new Error('Unsupported official plan schema');
  const previous = new Map(
    originalPlan.plan.flat().map((release) => [`${release.name}@${release.version}`, release]),
  );
  for (const release of fresh.plan.flat()) {
    const original = previous.get(`${release.name}@${release.version}`);
    if (!original || !originals.has(release.name))
      throw new Error('Recovery plan differs from original candidate');
    if (release.kind === 'publish') {
      if (release.tag !== original.tag || release.access !== original.access)
        throw new Error('Recovery changed publication policy');
      release.tarball = original.tarball;
    } else if (release.kind !== 'tag-only') throw new Error('Unknown official release kind');
  }
  await cp(path.join(originalDirectory, 'packages'), path.join(outputDirectory, 'packages'), {
    recursive: true,
  });
  await writeFile(outputPlan, `${JSON.stringify(fresh, null, 2)}\n`);
}

if (process.argv[1] && path.basename(process.argv[1]) === 'prepare-release-recovery.mjs') {
  const [original, output] = process.argv.slice(2);
  if (!original || !output) throw new Error('Expected original and recovery pack directories');
  await prepareRecovery(
    path.resolve(original),
    path.resolve(output),
    path.resolve('node_modules/@changesets/cli/bin.js'),
    process.cwd(),
  );
}
