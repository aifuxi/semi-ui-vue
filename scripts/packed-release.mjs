import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { publicPackages } from './public-packages.mjs';

export const integrity = (bytes) => `sha512-${createHash('sha512').update(bytes).digest('base64')}`;

// Inspect the official pack output without generating replacement tarballs or interpreting its plan.
export async function inspectPackedRelease(packDirectory) {
  const directory = path.resolve(packDirectory, 'packages');
  const entries = await readdir(directory);
  const tarballs = new Map();
  for (const filename of entries) {
    if (!filename.endsWith('.tgz')) throw new Error(`Unexpected packed file: ${filename}`);
    const tarball = path.join(directory, filename);
    const files = execFileSync('tar', ['-tzf', tarball], { encoding: 'utf8' }).trim().split('\n');
    if (files.some((file) => !file.startsWith('package/') || file.split('/').includes('..'))) {
      throw new Error(`Unsafe tarball path: ${filename}`);
    }
    const manifest = JSON.parse(
      execFileSync('tar', ['-xOf', tarball, 'package/package.json'], { encoding: 'utf8' }),
    );
    if (!publicPackages.some(({ name }) => name === manifest.name) || tarballs.has(manifest.name)) {
      throw new Error(`Unexpected or duplicate package: ${manifest.name}`);
    }
    tarballs.set(manifest.name, {
      filename: tarball,
      files: files.map((file) => ({ path: file.slice('package/'.length) })),
      manifest,
      integrity: integrity(await readFile(tarball)),
    });
  }
  if (tarballs.size !== publicPackages.length)
    throw new Error(
      'Expected all five original tarballs; partial or missing artifacts cannot be rebuilt during recovery',
    );
  return tarballs;
}
