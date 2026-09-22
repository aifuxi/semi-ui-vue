import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRsbuild } from '@rsbuild/core';
import { build } from 'vite';

async function viteBuild(consumerRoot, entry) {
  const result = await build({
    root: consumerRoot,
    configFile: false,
    logLevel: 'silent',
    define: { 'process.env.NODE_ENV': '"production"' },
    build: {
      write: false,
      lib: { entry, formats: ['es'], cssFileName: 'style' },
      rollupOptions: { external: ['vue'] },
    },
  });
  const output = Array.isArray(result) ? result.flatMap((item) => item.output) : result.output;
  return {
    bytes: output
      .filter((file) => file.type === 'chunk')
      .reduce((sum, file) => sum + Buffer.byteLength(file.code), 0),
    css: output
      .filter((file) => file.type === 'asset' && file.fileName.endsWith('.css'))
      .map((file) => String(file.source))
      .join('\n'),
  };
}

async function rspackBuild(consumerRoot, entry, outputRoot) {
  const rsbuild = await createRsbuild({
    cwd: consumerRoot,
    config: {
      source: { entry: { index: entry } },
      tools: { htmlPlugin: false, rspack: { externals: { vue: 'vue' } } },
      output: {
        distPath: { root: outputRoot },
        filename: { js: '[name].js', css: '[name].css' },
      },
      performance: {
        buildCache: false,
        printFileSize: false,
        chunkSplit: { strategy: 'all-in-one' },
      },
    },
  });
  const result = await rsbuild.build();
  await result.close();
  const files = await readdir(outputRoot, { recursive: true });
  const javascript = files.filter((file) => file.endsWith('.js'));
  const styles = files.filter((file) => file.endsWith('.css'));
  return {
    bytes: (
      await Promise.all(javascript.map((file) => readFile(path.join(outputRoot, file))))
    ).reduce((sum, source) => sum + source.byteLength, 0),
    css: (
      await Promise.all(styles.map((file) => readFile(path.join(outputRoot, file), 'utf8')))
    ).join('\n'),
  };
}

function assertBuild(component, subpath, bundler, result, budget, selector) {
  assert(
    result.bytes > 0 && result.bytes <= budget,
    `${bundler} ${component}${subpath}: ${result.bytes} bytes exceeds ${budget}`,
  );
  assert(result.css.includes(selector), `${bundler} ${component}${subpath}: 未生成对应组件样式`);
  assert(
    !result.css.includes('.semi-table'),
    `${bundler} ${component}${subpath}: 包含无关 Table 样式`,
  );
}

// 将 Vue 设为 external，使 JavaScript 预算只衡量组件库及其内联依赖。
export async function verifyUiTreeshaking(consumerRoot) {
  const entry = path.join(consumerRoot, 'treeshaking-consumer.js');
  const outputRoot = await mkdtemp(path.join(consumerRoot, '.semi-ui-rspack-'));
  try {
    for (const [component, selector, budget] of [
      ['Button', '.semi-button', 20000],
      ['Input', '.semi-input', 125000],
      ['Select', '.semi-select', 200000],
    ]) {
      for (const [bundler, compile] of [
        ['Vite', () => viteBuild(consumerRoot, entry)],
        [
          'Rspack',
          (index) =>
            rspackBuild(
              consumerRoot,
              entry,
              path.join(outputRoot, component.toLowerCase(), String(index)),
            ),
        ],
      ]) {
        const builds = [];
        for (const [index, subpath] of ['', `/${component.toLowerCase()}`].entries()) {
          await writeFile(
            entry,
            `import { ${component} } from '@aifuxi/semi-ui-vue${subpath}'; console.log(${component});`,
          );
          const result = await compile(index);
          assertBuild(component, subpath, bundler, result, budget, selector);
          builds.push(result);
        }
        assert(
          Math.abs(builds[0].bytes - builds[1].bytes) < 1000,
          `${bundler} ${component}: 根入口保留了无关模块`,
        );
        assert.equal(
          builds[0].css,
          builds[1].css,
          `${bundler} ${component}: 根入口与子路径样式不同`,
        );
        console.log(
          `${bundler} ${component}: root ${builds[0].bytes} / subpath ${builds[1].bytes} bytes`,
        );
      }
    }
  } finally {
    await Promise.all([
      rm(entry, { force: true }),
      rm(outputRoot, { recursive: true, force: true }),
    ]);
  }
}
