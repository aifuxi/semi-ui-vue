import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { distTagForVersion, NPM_REGISTRY, publicPackages } from './release-packages.mjs';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

await import('./verify-release.mjs');
await import('./release-preflight.mjs');

for (const packageInfo of publicPackages) {
  const packageRoot = path.join(workspaceRoot, 'packages', packageInfo.directory);
  const manifest = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
  const tag = distTagForVersion(manifest.version);

  process.stdout.write(`发布 ${manifest.name}@${manifest.version} -> ${tag}\n`);
  execFileSync(
    'npm',
    ['publish', packageRoot, '--access=public', `--tag=${tag}`, `--registry=${NPM_REGISTRY}`],
    { cwd: workspaceRoot, stdio: 'inherit' },
  );
}
