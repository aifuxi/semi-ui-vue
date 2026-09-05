import { describe, expect, it } from 'vitest';
import { loadCoverageExemptions } from './verify-coverage-exemptions.mjs';

const existingFileStat = async () => ({ isFile: () => true });

function manifest(exemptions) {
  return async () => JSON.stringify({ version: 1, exemptions });
}

describe('coverage exemption validation', () => {
  it('accepts precise source files with reasons', async () => {
    await expect(
      loadCoverageExemptions({
        workspaceRoot: '/workspace',
        readManifest: manifest([
          { file: 'packages/ui/src/example.ts', reason: 'Generated adapter without branches.' },
        ]),
        getFileStat: existingFileStat,
      }),
    ).resolves.toEqual(['packages/ui/src/example.ts']);
  });

  it.each([
    [
      'duplicate files',
      [
        { file: 'packages/ui/src/example.ts', reason: 'First.' },
        { file: 'packages/ui/src/example.ts', reason: 'Second.' },
      ],
      'coverage 豁免文件重复',
    ],
    [
      'files outside package source',
      [{ file: 'apps/docs/src/example.ts', reason: 'Wrong scope.' }],
      '必须位于 packages/<package>/src',
    ],
    [
      'glob entries',
      [{ file: 'packages/ui/src/**/*.ts', reason: 'Too broad.' }],
      '不允许使用 glob',
    ],
    ['missing reasons', [{ file: 'packages/ui/src/example.ts', reason: ' ' }], '缺少非空 reason'],
  ])('rejects %s', async (_name, exemptions, message) => {
    await expect(
      loadCoverageExemptions({
        workspaceRoot: '/workspace',
        readManifest: manifest(exemptions),
        getFileStat: existingFileStat,
      }),
    ).rejects.toThrow(message);
  });

  it('rejects missing files', async () => {
    await expect(
      loadCoverageExemptions({
        workspaceRoot: '/workspace',
        readManifest: manifest([
          { file: 'packages/ui/src/missing.ts', reason: 'Expected fixture.' },
        ]),
        getFileStat: async () => {
          throw new Error('missing');
        },
      }),
    ).rejects.toThrow('coverage 豁免文件不存在');
  });
});
