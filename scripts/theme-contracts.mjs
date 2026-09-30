import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Union of the original theme and packed-consumer assertions. Source import/order
// checks remain in verify-theme; both artifact locations share these CSS contracts.
const contracts = JSON.parse(
  await readFile(path.join(import.meta.dirname, 'theme-contracts.json'), 'utf8'),
);

export async function verifyThemeCss(directory) {
  const styleManifest = JSON.parse(
    await readFile(path.join(directory, 'style-dependencies.json'), 'utf8'),
  );
  const sharedAssetOwners = new Map();
  for (const [modulePath, assetPath] of Object.entries(styleManifest.shared)) {
    const previousModule = sharedAssetOwners.get(assetPath);
    if (previousModule) {
      throw new Error(`共享样式被多个 Foundation 模块复用：${previousModule}、${modulePath}`);
    }
    sharedAssetOwners.set(assetPath, modulePath);
  }

  for (const [file, selectors] of Object.entries(contracts)) {
    if (file === 'index.css') {
      const css = await readFile(path.join(directory, file), 'utf8');
      for (const selector of selectors) {
        if (!css.includes(selector)) throw new Error(`${file} 缺少样式契约：${selector}`);
      }
      continue;
    }
    const componentName = file.slice(0, -'.css'.length);
    const component = styleManifest.components[componentName];
    if (!component) throw new Error(`缺少逐组件 CSS 依赖清单：${file}`);
    if (!Array.isArray(component.imports) || component.imports[0] !== styleManifest.base) {
      throw new Error(`${file} 未先导入基础主题样式`);
    }
    const modules = new Set(component.modules);
    const expectedImports = [styleManifest.base];
    for (const modulePath of modules) {
      const asset = styleManifest.shared[modulePath];
      if (asset) expectedImports.push(asset);
      else if (modulePath === component.main) expectedImports.push(`./${file}`);
      else throw new Error(`${file} 的依赖未映射到共享样式：${modulePath}`);
    }
    if (!modules.size) expectedImports.push(`./${file}`);
    const uniqueExpectedImports = [...new Set(expectedImports)];
    if (
      JSON.stringify(component.imports) !== JSON.stringify(uniqueExpectedImports) ||
      new Set(component.imports).size !== component.imports.length
    ) {
      throw new Error(`${file} 的样式依赖顺序或去重结果与依赖清单不一致`);
    }

    const css = (
      await Promise.all(
        component.imports.map((asset) =>
          readFile(path.join(directory, asset.replace(/^\.\//, '')), 'utf8'),
        ),
      )
    ).join('\n');
    for (const selector of selectors) {
      if (!css.includes(selector)) throw new Error(`${file} 缺少样式契约：${selector}`);
    }
  }
}
