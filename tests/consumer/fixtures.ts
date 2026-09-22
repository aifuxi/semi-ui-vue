import assert from 'node:assert/strict';
import { copyFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test as base } from '@playwright/test';
import { build } from 'vite';
import { preparePackedConsumer } from '../../scripts/packed-consumer.mjs';

interface PackedConsumer {
  url: string;
  provenance: {
    isolated: boolean;
    installedPackages: Record<string, string>;
    tarballHashes: Record<string, string>;
    tarballs: Record<string, string>;
    bundledPackageModules: string[];
  };
}

const workspaceRoot = fileURLToPath(new URL('../../', import.meta.url));

export const test = base.extend<object, { packedConsumer: PackedConsumer }>({
  packedConsumer: [
    async ({ browserName }, use) => {
      assert.equal(browserName, 'chromium', '真实包消费使用 Chromium 项目');
      const consumer = await preparePackedConsumer();
      const server = createServer();
      try {
        const entry = path.join(consumer.consumerRoot, 'consumer-entry.js');
        await copyFile(
          fileURLToPath(new URL('./fixtures/consumer-entry.js', import.meta.url)),
          entry,
        );
        const bundledPackageModules: string[] = [];
        const result = await build({
          root: consumer.consumerRoot,
          configFile: false,
          logLevel: 'silent',
          define: { 'process.env.NODE_ENV': '"production"' },
          plugins: [
            {
              name: 'assert-packed-consumer-origin',
              generateBundle() {
                const moduleIds = [...this.getModuleIds()];
                for (const id of moduleIds) {
                  assert(
                    !id.includes(path.join(workspaceRoot, 'packages') + path.sep) &&
                      !id.includes(path.join(workspaceRoot, 'vendor') + path.sep),
                    'Consumer bundle unexpectedly includes workspace source: ' + id,
                  );
                }
                for (const name of ['@aifuxi/semi-ui-vue', '@aifuxi/semi-theme-default']) {
                  const installedRoot = consumer.installedPackages[name];
                  const matches = moduleIds.filter((id) => id.startsWith(installedRoot + path.sep));
                  assert(matches.length > 0, name + ' was not bundled from its installed tarball');
                  bundledPackageModules.push(...matches);
                }
              },
            },
          ],
          build: {
            write: false,
            lib: {
              entry,
              formats: ['es'],
              fileName: () => 'consumer.js',
              cssFileName: 'consumer',
            },
          },
        });
        const files = new Map<string, string | Uint8Array>();
        for (const output of Array.isArray(result) ? result : [result]) {
          assert('output' in output, 'Consumer build unexpectedly started a watcher');
          for (const file of output.output) {
            files.set('/' + file.fileName, file.type === 'chunk' ? file.code : file.source);
          }
        }
        assert(files.has('/consumer.js') && files.has('/consumer.css'));
        const css = String(files.get('/consumer.css'));
        for (const selector of [
          '.semi-button',
          '.semi-input',
          '.semi-select',
          '.semi-codeHighlight',
          '.semi-json-viewer',
        ]) {
          assert(css.includes(selector), 'Consumer bundle is missing ' + selector);
        }
        server.on('request', (request, response) => {
          const pathname = new URL(request.url ?? '/', 'http://consumer.local').pathname;
          if (pathname === '/') {
            response.setHeader('content-type', 'text/html; charset=utf-8');
            response.end(
              '<!doctype html><html><head><link rel="icon" href="data:,">' +
                '<link rel="stylesheet" href="/consumer.css"></head><body><div id="app"></div>' +
                '<script type="module" src="/consumer.js"></script></body></html>',
            );
            return;
          }
          const content = files.get(pathname);
          response.statusCode = content === undefined ? 404 : 200;
          response.setHeader(
            'content-type',
            pathname.endsWith('.css') ? 'text/css' : 'text/javascript',
          );
          response.end(content ?? '');
        });
        await new Promise<void>((resolve, reject) => {
          server.once('error', reject);
          server.listen(0, '127.0.0.1', resolve);
        });
        await use({
          url: 'http://127.0.0.1:' + (server.address() as AddressInfo).port + '/',
          provenance: {
            isolated: consumer.isolated,
            installedPackages: consumer.installedPackages,
            tarballHashes: consumer.tarballHashes,
            tarballs: consumer.tarballs,
            bundledPackageModules,
          },
        });
      } finally {
        if (server.listening) {
          server.closeAllConnections();
          await new Promise<void>((resolve, reject) =>
            server.close((error) => (error ? reject(error) : resolve())),
          );
        }
        await consumer.dispose();
      }
    },
    { scope: 'worker', timeout: 300_000 },
  ],
});

export { expect } from '@playwright/test';
