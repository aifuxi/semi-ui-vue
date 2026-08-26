import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import sass from 'sass';

const require = createRequire(import.meta.url);
const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));
const upstreamPackages = path.join(workspaceRoot, 'vendor/semi-design/packages');
const buttonPublicEntry = path.join(upstreamPackages, 'semi-ui/button/index.tsx');
const buttonGroupEntry = path.join(upstreamPackages, 'semi-ui/button/buttonGroup.tsx');
const splitButtonGroupEntry = path.join(upstreamPackages, 'semi-ui/button/splitButtonGroup.tsx');
const dividerPublicEntry = path.join(upstreamPackages, 'semi-ui/divider/index.tsx');
const floatButtonPublicEntry = path.join(upstreamPackages, 'semi-ui/floatButton/index.tsx');
const floatButtonGroupEntry = path.join(
  upstreamPackages,
  'semi-ui/floatButton/floatButtonGroup.tsx',
);
const iconPublicEntry = path.join(upstreamPackages, 'semi-ui/icons/index.tsx');
const layoutPublicEntry = path.join(upstreamPackages, 'semi-ui/layout/index.tsx');
const spacePublicEntry = path.join(upstreamPackages, 'semi-ui/space/index.tsx');
const foundationRoot = path.join(upstreamPackages, 'semi-foundation');
const iconsEntry = path.join(upstreamPackages, 'semi-icons/src/index.ts');
const iconsLabEntry = path.join(upstreamPackages, 'semi-icons-lab/src/index.ts');
const referenceStyleEntry = fileURLToPath(
  new URL('./src/semi-reference-theme.scss', import.meta.url),
);
const virtualStyleId = 'virtual:semi-reference-styles.css';
const resolvedVirtualStyleId = `\0${virtualStyleId}`;
const emptyUpstreamStyleId = '\0semi-reference-upstream-style-loaded-from-entry';
const capturedUpstreamStyleImports = new Set([
  '@douyinfe/semi-foundation/button/button.scss',
  '@douyinfe/semi-foundation/button/iconButton.scss',
  path.join(foundationRoot, 'button/button.scss'),
  path.join(foundationRoot, 'button/iconButton.scss'),
  '@douyinfe/semi-foundation/divider/divider.scss',
  path.join(foundationRoot, 'divider/divider.scss'),
  '@douyinfe/semi-foundation/floatButton/floatButton.scss',
  path.join(foundationRoot, 'floatButton/floatButton.scss'),
  '@douyinfe/semi-foundation/badge/badge.scss',
  path.join(foundationRoot, 'badge/badge.scss'),
  '@douyinfe/semi-foundation/space/space.scss',
  path.join(foundationRoot, 'space/space.scss'),
  '@douyinfe/semi-foundation/layout/layout.scss',
  path.join(foundationRoot, 'layout/layout.scss'),
  '@douyinfe/semi-icons/src/styles/icons.scss',
  path.join(upstreamPackages, 'semi-icons/src/styles/icons.scss'),
  '@douyinfe/semi-icons-lab/src/styles/icons.scss',
  path.join(upstreamPackages, 'semi-icons-lab/src/styles/icons.scss'),
]);

function compilePinnedReferenceStyles(): Plugin {
  return {
    name: 'compile-pinned-semi-reference-styles',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source === virtualStyleId) return resolvedVirtualStyleId;
      if (capturedUpstreamStyleImports.has(source)) return emptyUpstreamStyleId;
      if (
        source === '../styles/icons.scss' &&
        (importer?.includes('/vendor/semi-design/packages/semi-icons/src/components/Icon.tsx') ||
          importer?.includes('/vendor/semi-design/packages/semi-icons-lab/src/components/Icon.tsx'))
      ) {
        return emptyUpstreamStyleId;
      }
      return null;
    },
    load(id) {
      if (id === emptyUpstreamStyleId) return '';
      if (id !== resolvedVirtualStyleId) return null;

      return sass
        .renderSync({
          file: referenceStyleEntry,
          outputStyle: 'expanded',
        })
        .css.toString();
    },
  };
}

export default defineConfig({
  plugins: [compilePinnedReferenceStyles(), react()],
  resolve: {
    alias: [
      { find: '@semi-v2.102.0/button', replacement: buttonPublicEntry },
      { find: '@semi-v2.102.0/button-group', replacement: buttonGroupEntry },
      { find: '@semi-v2.102.0/split-button-group', replacement: splitButtonGroupEntry },
      { find: '@semi-v2.102.0/divider', replacement: dividerPublicEntry },
      { find: '@semi-v2.102.0/float-button', replacement: floatButtonPublicEntry },
      { find: '@semi-v2.102.0/float-button-group', replacement: floatButtonGroupEntry },
      { find: '@semi-v2.102.0/icon', replacement: iconPublicEntry },
      { find: '@semi-v2.102.0/layout', replacement: layoutPublicEntry },
      { find: '@semi-v2.102.0/space', replacement: spacePublicEntry },
      { find: '@semi-v2.102.0/icons', replacement: iconsEntry },
      { find: '@semi-v2.102.0/icons-lab', replacement: iconsLabEntry },
      {
        find: /^@douyinfe\/semi-foundation\/(.+)$/,
        replacement: `${foundationRoot}/$1`,
      },
      { find: '@douyinfe/semi-icons', replacement: iconsEntry },
      { find: '@douyinfe/semi-icons-lab', replacement: iconsLabEntry },
      { find: /^classnames$/, replacement: require.resolve('classnames') },
      { find: /^lodash$/, replacement: require.resolve('lodash') },
      { find: /^prop-types$/, replacement: require.resolve('prop-types') },
    ],
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 4173,
    strictPort: true,
    fs: {
      allow: [workspaceRoot],
    },
  },
});
