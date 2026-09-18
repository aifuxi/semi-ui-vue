import assert from 'node:assert/strict';
import { writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'vite';

// A consumer bundler must both retain CJS factories and remove unrelated UI code.
// Vue is external here so these budgets measure this library and its inlined deps.
export async function verifyUiTreeshaking(consumerRoot) {
  const entry = path.join(consumerRoot, 'treeshaking-consumer.js');
  try {
    for (const [component, budget] of [
      ['Button', 20000],
      ['Input', 125000],
      ['Select', 200000],
    ]) {
      const sizes = [];
      for (const subpath of ['', `/${component.toLowerCase()}`]) {
        await writeFile(
          entry,
          `import { ${component} } from '@aifuxi/semi-ui-vue${subpath}'; console.log(${component});`,
        );
        const result = await build({
          root: consumerRoot,
          configFile: false,
          logLevel: 'silent',
          define: { 'process.env.NODE_ENV': '"production"' },
          build: {
            write: false,
            lib: { entry, formats: ['es'] },
            rollupOptions: { external: ['vue'] },
          },
        });
        const output = Array.isArray(result)
          ? result.flatMap((item) => item.output)
          : result.output;
        const bytes = output
          .filter((file) => file.type === 'chunk')
          .reduce((sum, file) => sum + Buffer.byteLength(file.code), 0);
        assert(
          bytes > 0 && bytes <= budget,
          `${component}${subpath}: ${bytes} bytes exceeds ${budget}`,
        );
        sizes.push(bytes);
      }
      assert(
        Math.abs(sizes[0] - sizes[1]) < 1000,
        `${component}: root import retains unrelated modules`,
      );
      console.log(`Tree-shaking ${component}: root ${sizes[0]} / subpath ${sizes[1]} bytes`);
    }
  } finally {
    await rm(entry, { force: true });
  }
}
