import { readdirSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from '@rslib/core';

const illustrationEntries = Object.fromEntries(
  readdirSync(fileURLToPath(new URL('./src/illustrations', import.meta.url)))
    .filter((fileName) => /^Illustration.+\.ts$/.test(fileName))
    .map((fileName) => [
      `illustrations/${fileName.replace(/\.ts$/, '')}`,
      fileURLToPath(new URL(`./src/illustrations/${fileName}`, import.meta.url)),
    ]),
);

export default defineConfig({
  lib: [{ format: 'esm', dts: { abortOnError: true } }],
  source: {
    entry: {
      index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      'components/Illustration': fileURLToPath(
        new URL('./src/components/Illustration.ts', import.meta.url),
      ),
      ...illustrationEntries,
    },
    tsconfigPath: './tsconfig.build.json',
  },
  output: { target: 'web' },
});
