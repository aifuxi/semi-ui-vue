import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import sass from 'sass';

const require = createRequire(import.meta.url);
const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));
const upstreamPackages = path.join(workspaceRoot, 'vendor/semi-design/packages');
const autoCompletePublicEntry = path.join(upstreamPackages, 'semi-ui/autoComplete/index.tsx');
const buttonPublicEntry = path.join(upstreamPackages, 'semi-ui/button/index.tsx');
const checkboxPublicEntry = path.join(upstreamPackages, 'semi-ui/checkbox/index.tsx');
const configProviderPublicEntry = path.join(upstreamPackages, 'semi-ui/configProvider/index.tsx');
const buttonGroupEntry = path.join(upstreamPackages, 'semi-ui/button/buttonGroup.tsx');
const splitButtonGroupEntry = path.join(upstreamPackages, 'semi-ui/button/splitButtonGroup.tsx');
const dividerPublicEntry = path.join(upstreamPackages, 'semi-ui/divider/index.tsx');
const floatButtonPublicEntry = path.join(upstreamPackages, 'semi-ui/floatButton/index.tsx');
const floatButtonGroupEntry = path.join(
  upstreamPackages,
  'semi-ui/floatButton/floatButtonGroup.tsx',
);
const iconPublicEntry = path.join(upstreamPackages, 'semi-ui/icons/index.tsx');
const inputPublicEntry = path.join(upstreamPackages, 'semi-ui/input/index.tsx');
const inputNumberPublicEntry = path.join(upstreamPackages, 'semi-ui/inputNumber/index.tsx');
const pinCodePublicEntry = path.join(upstreamPackages, 'semi-ui/pincode/index.tsx');
const radioPublicEntry = path.join(upstreamPackages, 'semi-ui/radio/index.tsx');
const ratingPublicEntry = path.join(upstreamPackages, 'semi-ui/rating/index.tsx');
const inputGroupEntry = path.join(upstreamPackages, 'semi-ui/input/inputGroup.tsx');
const textAreaEntry = path.join(upstreamPackages, 'semi-ui/input/textarea.tsx');
const gridPublicEntry = path.join(upstreamPackages, 'semi-ui/grid/index.tsx');
const layoutPublicEntry = path.join(upstreamPackages, 'semi-ui/layout/index.tsx');
const resizablePublicEntry = path.join(upstreamPackages, 'semi-ui/resizable/index.tsx');
const selectPublicEntry = path.join(upstreamPackages, 'semi-ui/select/index.tsx');
const spacePublicEntry = path.join(upstreamPackages, 'semi-ui/space/index.tsx');
const switchPublicEntry = path.join(upstreamPackages, 'semi-ui/switch/index.tsx');
const tooltipPublicEntry = path.join(upstreamPackages, 'semi-ui/tooltip/index.tsx');
const typographyPublicEntry = path.join(upstreamPackages, 'semi-ui/typography/index.tsx');
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
  '@douyinfe/semi-foundation/autoComplete/autoComplete.scss',
  path.join(foundationRoot, 'autoComplete/autoComplete.scss'),
  '@douyinfe/semi-foundation/button/button.scss',
  '@douyinfe/semi-foundation/button/iconButton.scss',
  path.join(foundationRoot, 'button/button.scss'),
  path.join(foundationRoot, 'button/iconButton.scss'),
  '@douyinfe/semi-foundation/checkbox/checkbox.scss',
  path.join(foundationRoot, 'checkbox/checkbox.scss'),
  '@douyinfe/semi-foundation/divider/divider.scss',
  path.join(foundationRoot, 'divider/divider.scss'),
  '@douyinfe/semi-foundation/floatButton/floatButton.scss',
  path.join(foundationRoot, 'floatButton/floatButton.scss'),
  '@douyinfe/semi-foundation/badge/badge.scss',
  path.join(foundationRoot, 'badge/badge.scss'),
  '@douyinfe/semi-foundation/space/space.scss',
  path.join(foundationRoot, 'space/space.scss'),
  '@douyinfe/semi-foundation/switch/switch.scss',
  path.join(foundationRoot, 'switch/switch.scss'),
  '@douyinfe/semi-foundation/spin/spin.scss',
  path.join(foundationRoot, 'spin/spin.scss'),
  '@douyinfe/semi-foundation/grid/grid.scss',
  path.join(foundationRoot, 'grid/grid.scss'),
  '@douyinfe/semi-foundation/layout/layout.scss',
  path.join(foundationRoot, 'layout/layout.scss'),
  '@douyinfe/semi-foundation/resizable/resizable.scss',
  path.join(foundationRoot, 'resizable/resizable.scss'),
  '@douyinfe/semi-foundation/input/input.scss',
  path.join(foundationRoot, 'input/input.scss'),
  '@douyinfe/semi-foundation/inputNumber/inputNumber.scss',
  path.join(foundationRoot, 'inputNumber/inputNumber.scss'),
  '@douyinfe/semi-foundation/pincode/pincode.scss',
  path.join(foundationRoot, 'pincode/pincode.scss'),
  '@douyinfe/semi-foundation/radio/radio.scss',
  path.join(foundationRoot, 'radio/radio.scss'),
  '@douyinfe/semi-foundation/rating/rating.scss',
  path.join(foundationRoot, 'rating/rating.scss'),
  '@douyinfe/semi-foundation/input/textarea.scss',
  path.join(foundationRoot, 'input/textarea.scss'),
  '@douyinfe/semi-foundation/form/form.scss',
  path.join(foundationRoot, 'form/form.scss'),
  '@douyinfe/semi-foundation/tag/tag.scss',
  path.join(foundationRoot, 'tag/tag.scss'),
  '@douyinfe/semi-foundation/select/select.scss',
  path.join(foundationRoot, 'select/select.scss'),
  '@douyinfe/semi-foundation/overflowList/overflowList.scss',
  path.join(foundationRoot, 'overflowList/overflowList.scss'),
  '@douyinfe/semi-foundation/highlight/highlight.scss',
  path.join(foundationRoot, 'highlight/highlight.scss'),
  '@douyinfe/semi-foundation/avatar/avatar.scss',
  path.join(foundationRoot, 'avatar/avatar.scss'),
  '@douyinfe/semi-foundation/_portal/portal.scss',
  path.join(foundationRoot, '_portal/portal.scss'),
  '@douyinfe/semi-foundation/popover/popover.scss',
  path.join(foundationRoot, 'popover/popover.scss'),
  '@douyinfe/semi-foundation/tooltip/tooltip.scss',
  path.join(foundationRoot, 'tooltip/tooltip.scss'),
  '@douyinfe/semi-foundation/typography/typography.scss',
  path.join(foundationRoot, 'typography/typography.scss'),
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
      { find: '@semi-v2.102.0/auto-complete', replacement: autoCompletePublicEntry },
      { find: '@semi-v2.102.0/button', replacement: buttonPublicEntry },
      { find: '@semi-v2.102.0/checkbox', replacement: checkboxPublicEntry },
      { find: '@semi-v2.102.0/config-provider', replacement: configProviderPublicEntry },
      { find: '@semi-v2.102.0/button-group', replacement: buttonGroupEntry },
      { find: '@semi-v2.102.0/split-button-group', replacement: splitButtonGroupEntry },
      { find: '@semi-v2.102.0/divider', replacement: dividerPublicEntry },
      { find: '@semi-v2.102.0/float-button', replacement: floatButtonPublicEntry },
      { find: '@semi-v2.102.0/float-button-group', replacement: floatButtonGroupEntry },
      { find: '@semi-v2.102.0/icon', replacement: iconPublicEntry },
      { find: '@semi-v2.102.0/input', replacement: inputPublicEntry },
      { find: '@semi-v2.102.0/input-number', replacement: inputNumberPublicEntry },
      { find: '@semi-v2.102.0/pin-code', replacement: pinCodePublicEntry },
      { find: '@semi-v2.102.0/radio', replacement: radioPublicEntry },
      { find: '@semi-v2.102.0/rating', replacement: ratingPublicEntry },
      { find: '@semi-v2.102.0/input-group', replacement: inputGroupEntry },
      { find: '@semi-v2.102.0/textarea', replacement: textAreaEntry },
      { find: '@semi-v2.102.0/grid', replacement: gridPublicEntry },
      { find: '@semi-v2.102.0/layout', replacement: layoutPublicEntry },
      { find: '@semi-v2.102.0/resizable', replacement: resizablePublicEntry },
      { find: '@semi-v2.102.0/select', replacement: selectPublicEntry },
      { find: '@semi-v2.102.0/space', replacement: spacePublicEntry },
      { find: '@semi-v2.102.0/switch', replacement: switchPublicEntry },
      { find: '@semi-v2.102.0/tooltip', replacement: tooltipPublicEntry },
      { find: '@semi-v2.102.0/typography', replacement: typographyPublicEntry },
      { find: '@semi-v2.102.0/icons', replacement: iconsEntry },
      { find: '@semi-v2.102.0/icons-lab', replacement: iconsLabEntry },
      {
        find: /^@douyinfe\/semi-foundation\/(.+)$/,
        replacement: `${foundationRoot}/$1`,
      },
      { find: '@douyinfe/semi-icons', replacement: iconsEntry },
      { find: '@douyinfe/semi-icons-lab', replacement: iconsLabEntry },
      {
        find: /^copy-text-to-clipboard$/,
        replacement: fileURLToPath(new URL('./src/runtime/copyText.ts', import.meta.url)),
      },
      {
        find: /^date-fns\/locale$/,
        replacement: fileURLToPath(new URL('./src/runtime/dateFnsLocale.ts', import.meta.url)),
      },
      { find: /^classnames$/, replacement: require.resolve('classnames') },
      { find: /^lodash$/, replacement: require.resolve('lodash') },
      { find: /^prop-types$/, replacement: require.resolve('prop-types') },
      {
        find: /^react-window$/,
        replacement: fileURLToPath(new URL('./src/runtime/reactWindow.tsx', import.meta.url)),
      },
      {
        find: /^fast-copy$/,
        replacement: fileURLToPath(new URL('./src/runtime/fastCopy.ts', import.meta.url)),
      },
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
