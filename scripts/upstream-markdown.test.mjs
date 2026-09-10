import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from '@rstest/core';
import { upstreamLiveDemos } from './upstream-markdown.mjs';

describe('固定上游 live Demo 清单', () => {
  it('保留属性顺序、fence 空格与缩进差异，并排除 HTML 注释', () => {
    const source = [
      '<!--',
      '```jsx live=true',
      'hidden()',
      '```',
      '-->',
      ' ```jsx dir="column" live=true',
      'first()',
      ' ```',
      '``` jsx live=true',
      'second()',
      '```',
      '```jsx',
      'staticExample()',
      '```',
    ].join('\n');
    expect(
      upstreamLiveDemos(source).map(({ line, code }) => ({ line, code: code.trim() })),
    ).toEqual([
      { line: 6, code: 'first()' },
      { line: 9, code: 'second()' },
    ]);
  });
  for (const [source, count] of [
    ['input/upload', 42],
    ['plus/chat', 11],
    ['show/image', 10],
    ['ai/aiChatDialogue', 13],
  ]) {
    it(`${source} 不遗漏已公开示例或计入注释占位`, async () => {
      const markdown = await readFile(
        resolve(`vendor/semi-design/content/${source}/index.md`),
        'utf8',
      );
      expect(upstreamLiveDemos(markdown)).toHaveLength(count);
      expect(upstreamLiveDemos(markdown).every((demo) => demo.code.trim())).toBe(true);
    });
  }
});
