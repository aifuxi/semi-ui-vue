import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { publicJavaScriptEntries } from './public-export-entries.mjs';
import { publicPackages } from './release-packages.mjs';
import assert from 'node:assert/strict';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const forbiddenPatterns = [
  ['vendor 源码路径', /vendor\/semi-design/],
  ['workspace 占位包名', /@workspace\//],
  [
    'React 运行时导入',
    /(?:from\s+['"]react(?:\/[^'"]*)?['"]|import\s*(?:\(\s*)?['"]react(?:\/[^'"]*)?['"])/,
  ],
];

async function collectArtifacts(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const artifacts = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      artifacts.push(...(await collectArtifacts(entryPath)));
    } else if (/\.(?:css|d\.ts|js|map|mjs)$/.test(entry.name)) {
      artifacts.push(entryPath);
    }
  }

  return artifacts;
}

for (const { directory: packageName } of publicPackages.filter(
  (entry) => entry.type === 'javascript',
)) {
  const distPath = path.join(workspaceRoot, 'packages', packageName, 'dist');
  const packageRoot = path.dirname(distPath);

  for (const artifactPath of await collectArtifacts(distPath)) {
    const source = await readFile(artifactPath, 'utf8');

    for (const [label, pattern] of forbiddenPatterns) {
      if (pattern.test(source)) {
        const relativePath = path.relative(workspaceRoot, artifactPath);
        throw new Error(`${relativePath} 包含禁止依赖：${label}`);
      }
    }
  }

  const entries = await publicJavaScriptEntries(packageRoot);
  for (const entry of entries) await import(pathToFileURL(path.join(packageRoot, entry)).href);
  process.stdout.write(`SSR import 通过：${packageName} 的 ${entries.length} 个公开入口\n`);
}

// Namespace getters can import successfully but fail only when Markdown invokes them.
const { Chat } = await import('../packages/ui/dist/chat/index.js');
const chatHtml = await renderToString(
  createSSRApp(() =>
    h(Chat, {
      chats: [
        {
          id: 'ssr-markdown',
          role: 'assistant',
          content: '[link](https://example.com "title") and **bold**\n\nwww.example.com',
        },
      ],
      roleConfig: { assistant: { name: 'Assistant' } },
    }),
  ),
);
assert.match(chatHtml, /<a href="https:\/\/example\.com" title="title">link<\/a>/);
assert.match(chatHtml, /<strong>bold<\/strong>/);
assert.match(chatHtml, /<a href="http:\/\/www\.example\.com">www\.example\.com<\/a>/);
process.stdout.write('SSR Chat Markdown 的链接、格式与自动链接渲染通过\n');
