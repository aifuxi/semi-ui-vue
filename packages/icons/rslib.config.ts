import { readdirSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from '@rslib/core';

const iconEntries = Object.fromEntries(
  readdirSync(fileURLToPath(new URL('./src/icons', import.meta.url)))
    .filter((fileName) => /^Icon.+\.ts$/.test(fileName))
    .map((fileName) => [
      `icons/${fileName.replace(/\.ts$/, '')}`,
      fileURLToPath(new URL(`./src/icons/${fileName}`, import.meta.url)),
    ]),
);

export default defineConfig({
  lib: [{ format: 'esm', dts: { abortOnError: true } }],
  source: {
    entry: {
      index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      'components/Icon': fileURLToPath(new URL('./src/components/Icon.ts', import.meta.url)),
      ...iconEntries,
    },
    tsconfigPath: './tsconfig.build.json',
  },
  output: { target: 'web' },
});
