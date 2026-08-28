import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const animationEntry = fileURLToPath(
  new URL('../../vendor/semi-design/packages/semi-animation/index.ts', import.meta.url),
);
const bezierEasingEntry = fileURLToPath(
  new URL('./node_modules/bezier-easing/src/index.js', import.meta.url),
);

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src'],
      exclude: [
        'src/calendar/CalendarDayColumn.vue',
        'src/calendar/calendar-context.ts',
        'src/calendar/use-calendar-foundation.ts',
      ],
    }),
    {
      name: 'strip-private-source-region-paths',
      renderChunk(code) {
        return {
          code: code.replace(
            /\/\/#region [^\n]*vendor\/semi-design[^\n]*\n/g,
            '//#region bundled-foundation\n',
          ),
          map: null,
        };
      },
    },
  ],
  resolve: {
    alias: [
      { find: '@douyinfe/semi-animation', replacement: animationEntry },
      { find: 'bezier-easing', replacement: bezierEasingEntry },
      {
        find: /^date-fns$/,
        replacement: fileURLToPath(
          new URL('./node_modules/date-fns/esm/index.js', import.meta.url),
        ),
      },
      {
        find: /^date-fns\/locale$/,
        replacement: fileURLToPath(
          new URL('./node_modules/date-fns/esm/locale/index.js', import.meta.url),
        ),
      },
      {
        find: /^date-fns-tz$/,
        replacement: fileURLToPath(
          new URL('./node_modules/date-fns-tz/esm/index.js', import.meta.url),
        ),
      },
      {
        find: /^lodash$/,
        replacement: fileURLToPath(
          new URL('../foundation-integration/src/resizable-lodash.js', import.meta.url),
        ),
      },
    ],
    dedupe: ['vue'],
  },
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        'anchor/index': fileURLToPath(new URL('./src/anchor/index.ts', import.meta.url)),
        'avatar/index': fileURLToPath(new URL('./src/avatar/index.ts', import.meta.url)),
        'badge/index': fileURLToPath(new URL('./src/badge/index.ts', import.meta.url)),
        'calendar/index': fileURLToPath(new URL('./src/calendar/index.ts', import.meta.url)),
        'card/index': fileURLToPath(new URL('./src/card/index.ts', import.meta.url)),
        'carousel/index': fileURLToPath(new URL('./src/carousel/index.ts', import.meta.url)),
        'collapsible/index': fileURLToPath(new URL('./src/collapsible/index.ts', import.meta.url)),
        'descriptions/index': fileURLToPath(
          new URL('./src/descriptions/index.ts', import.meta.url),
        ),
        'dropdown/index': fileURLToPath(new URL('./src/dropdown/index.ts', import.meta.url)),
        'empty/index': fileURLToPath(new URL('./src/empty/index.ts', import.meta.url)),
        'highlight/index': fileURLToPath(new URL('./src/highlight/index.ts', import.meta.url)),
        'back-top/index': fileURLToPath(new URL('./src/back-top/index.ts', import.meta.url)),
        'breadcrumb/index': fileURLToPath(new URL('./src/breadcrumb/index.ts', import.meta.url)),
        'auto-complete/index': fileURLToPath(
          new URL('./src/auto-complete/index.ts', import.meta.url),
        ),
        'button/index': fileURLToPath(new URL('./src/button/index.ts', import.meta.url)),
        'checkbox/index': fileURLToPath(new URL('./src/checkbox/index.ts', import.meta.url)),
        'config-provider/index': fileURLToPath(
          new URL('./src/config-provider/index.ts', import.meta.url),
        ),
        'divider/index': fileURLToPath(new URL('./src/divider/index.ts', import.meta.url)),
        'float-button/index': fileURLToPath(
          new URL('./src/float-button/index.ts', import.meta.url),
        ),
        'grid/index': fileURLToPath(new URL('./src/grid/index.ts', import.meta.url)),
        'icon/index': fileURLToPath(new URL('./src/icon/index.ts', import.meta.url)),
        'input/index': fileURLToPath(new URL('./src/input/index.ts', import.meta.url)),
        'input-number/index': fileURLToPath(
          new URL('./src/input-number/index.ts', import.meta.url),
        ),
        'layout/index': fileURLToPath(new URL('./src/layout/index.ts', import.meta.url)),
        'pin-code/index': fileURLToPath(new URL('./src/pin-code/index.ts', import.meta.url)),
        'pagination/index': fileURLToPath(new URL('./src/pagination/index.ts', import.meta.url)),
        'radio/index': fileURLToPath(new URL('./src/radio/index.ts', import.meta.url)),
        'rating/index': fileURLToPath(new URL('./src/rating/index.ts', import.meta.url)),
        'resizable/index': fileURLToPath(new URL('./src/resizable/index.ts', import.meta.url)),
        'select/index': fileURLToPath(new URL('./src/select/index.ts', import.meta.url)),
        'slider/index': fileURLToPath(new URL('./src/slider/index.ts', import.meta.url)),
        'space/index': fileURLToPath(new URL('./src/space/index.ts', import.meta.url)),
        'steps/index': fileURLToPath(new URL('./src/steps/index.ts', import.meta.url)),
        'tabs/index': fileURLToPath(new URL('./src/tabs/index.ts', import.meta.url)),
        'tree/index': fileURLToPath(new URL('./src/tree/index.ts', import.meta.url)),
        'switch/index': fileURLToPath(new URL('./src/switch/index.ts', import.meta.url)),
        'tag-input/index': fileURLToPath(new URL('./src/tag-input/index.ts', import.meta.url)),
        'time-picker/index': fileURLToPath(new URL('./src/time-picker/index.ts', import.meta.url)),
        'tooltip/index': fileURLToPath(new URL('./src/tooltip/index.ts', import.meta.url)),
        'typography/index': fileURLToPath(new URL('./src/typography/index.ts', import.meta.url)),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@workspace/icons'],
    },
  },
});
