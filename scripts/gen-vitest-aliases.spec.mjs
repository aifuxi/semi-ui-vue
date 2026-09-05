import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildStubAliases,
  generateVitestAliases,
  validateVitestAliases,
} from './gen-vitest-aliases.mjs';

const workspaceRoot = process.cwd();
const temporaryRoots = [];

async function createTemporaryRoot() {
  const root = await mkdtemp(path.join(tmpdir(), 'semi-ui-vue-aliases-'));
  temporaryRoots.push(root);
  return root;
}

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true })));
});

describe('Vitest alias generator', () => {
  it('keeps illustrations and upstream animation as independent aliases', async () => {
    const aliases = await generateVitestAliases();

    expect(aliases['@aifuxi/semi-illustrations-vue']).toBe(
      path.join(workspaceRoot, 'packages/illustrations/src/index.ts'),
    );
    expect(aliases['@douyinfe/semi-animation']).toBe(
      path.join(workspaceRoot, 'vendor/semi-design/packages/semi-animation/index.ts'),
    );
  });

  it('rejects two stub files that resolve to the same alias', () => {
    expect(() =>
      buildStubAliases(['SemiFooBarStub.ts', 'SemiFooBarStub.tsx'], '/tmp/stubs'),
    ).toThrow('别名冲突：@semi-v2.102.0/foo-bar');
  });

  it('rejects a missing alias target', async () => {
    const root = await createTemporaryRoot();
    const illustrationTarget = path.join(root, 'packages/illustrations/src/index.ts');
    const animationTarget = path.join(root, 'vendor/semi-design/packages/semi-animation/index.ts');
    await mkdir(path.dirname(illustrationTarget), { recursive: true });
    await mkdir(path.dirname(animationTarget), { recursive: true });
    await writeFile(illustrationTarget, '', 'utf8');

    await expect(
      validateVitestAliases(
        {
          '@aifuxi/semi-ui-vue/locale/source/en_GB': path.join(
            root,
            'packages/ui/src/locale/source/en_GB.ts',
          ),
          '@aifuxi/semi-ui-vue/locale/source/ja_JP': path.join(
            root,
            'packages/ui/src/locale/source/ja_JP.ts',
          ),
          '@aifuxi/semi-icons-vue': path.join(root, 'packages/icons/src/index.ts'),
          '@aifuxi/semi-icons-lab-vue': path.join(root, 'packages/icons-lab/src/index.ts'),
          '@aifuxi/semi-illustrations-vue': illustrationTarget,
          '@douyinfe/semi-animation': animationTarget,
          'bezier-easing': path.join(root, 'packages/ui/node_modules/bezier-easing/src/index.js'),
          'async-validator': path.join(
            root,
            'packages/ui/node_modules/async-validator/dist-web/index.js',
          ),
          'fast-copy': path.join(root, 'packages/foundation-integration/src/fast-copy.js'),
          'lottie-web': path.join(root, 'packages/ui/src/test/lottieWeb.ts'),
        },
        {
          workspaceRoot: root,
          checkAccess: async (target) => {
            if (target === animationTarget) throw new Error('missing');
          },
        },
      ),
    ).rejects.toThrow(`别名目标不存在：@douyinfe/semi-animation → ${animationTarget}`);
  });

  it('passes the repository CLI check', () => {
    expect(
      execFileSync(process.execPath, ['scripts/gen-vitest-aliases.mjs', '--check'], {
        cwd: workspaceRoot,
        encoding: 'utf8',
      }),
    ).toMatch(/校验通过：\d+ 个别名有效/);
  });
});
