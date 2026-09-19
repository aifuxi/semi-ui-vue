import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

// Slot functions carry no reactive dependency, so a slot call cached in a computed or a watcher
// keeps handing back the VNodes of the render that first evaluated it. Reads of the `slots`
// object itself (presence checks) stay allowed; only calls are rejected. Values that must stay
// reactive use `useRenderComputed` from `packages/ui/src/_utils`, which re-evaluates per render.
const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const guardedRoots = ['packages/ui/src', 'apps/storybook-vue/src'];
const sourceExtensions = new Set(['.ts', '.vue']);
const cachingCalls = new Set([
  'computed',
  'watch',
  'watchEffect',
  'watchPostEffect',
  'watchSyncEffect',
]);
const fileAllowMarker = 'slots-render-allow-file:';
const lineAllowMarker = 'slots-render-allow:';
const ignoredFiles = /\.test\.ts$/u;

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
      continue;
    }
    if (sourceExtensions.has(path.extname(entry.name)) && !ignoredFiles.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}

function scriptRanges(source, filePath) {
  if (!filePath.endsWith('.vue')) return [{ start: 0, text: source }];
  const ranges = [];
  const pattern = /<script\b[^>]*>([\s\S]*?)<\/script>/gu;
  let match;
  while ((match = pattern.exec(source))) {
    ranges.push({ start: match.index + match[0].indexOf(match[1]), text: match[1] });
  }
  return ranges;
}

function createContext(source, filePath) {
  const violations = [];
  const slotFunctionCalls = new Map();

  for (const range of scriptRanges(source, filePath)) {
    const ast = ts.createSourceFile(
      filePath,
      range.text,
      ts.ScriptTarget.ESNext,
      true,
      ts.ScriptKind.TS,
    );
    const lineOf = (node) => source.slice(0, range.start + node.getStart(ast)).split('\n').length;

    const callsSlots = (node) => {
      let found = false;
      const visit = (candidate) => {
        if (found) return;
        if (ts.isCallExpression(candidate) && ts.isPropertyAccessExpression(candidate.expression)) {
          const target = candidate.expression.expression;
          if (ts.isIdentifier(target) && (target.text === 'slots' || target.text === '$slots')) {
            found = true;
            return;
          }
          if (
            ts.isPropertyAccessExpression(target) &&
            ts.isIdentifier(target.expression) &&
            target.expression.text === 'ctx' &&
            target.name.text === 'slots'
          ) {
            found = true;
            return;
          }
        }
        ts.forEachChild(candidate, visit);
      };
      visit(node);
      return found;
    };

    const collectIdentifiers = (node, output = new Set()) => {
      if (ts.isIdentifier(node)) output.add(node.text);
      ts.forEachChild(node, (child) => collectIdentifiers(child, output));
      return output;
    };

    const visit = (node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        cachingCalls.has(node.expression.text)
      ) {
        for (const argument of node.arguments) {
          if (callsSlots(argument)) {
            violations.push({
              kind: `${node.expression.text} 回调内调用插槽`,
              line: lineOf(node.expression),
            });
          }
          for (const identifier of collectIdentifiers(argument)) {
            if (slotFunctionCalls.has(identifier)) {
              violations.push({
                kind: `${node.expression.text} 回调引用了读取插槽的函数 ${identifier}`,
                line: lineOf(node.expression),
              });
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);

    const scanFunctions = (node) => {
      if (ts.isFunctionDeclaration(node) && node.name && node.body && callsSlots(node.body)) {
        slotFunctionCalls.set(node.name.text, lineOf(node));
      }
      if (
        ts.isVariableDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        node.initializer &&
        (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer)) &&
        callsSlots(node.initializer)
      ) {
        slotFunctionCalls.set(node.name.text, lineOf(node));
      }
      ts.forEachChild(node, scanFunctions);
    };
    scanFunctions(ast);
  }

  return { violations };
}

function allowed(source, line) {
  if (source.includes(fileAllowMarker)) return true;
  const lines = source.split('\n');
  const from = Math.max(0, line - 5);
  return lines.slice(from, line).some((entry) => entry.includes(lineAllowMarker));
}

const report = [];
for (const rootName of guardedRoots) {
  const files = await collectFiles(path.join(workspaceRoot, rootName)).catch(() => []);
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    if (!source.includes('slots')) continue;
    const { violations } = createContext(source, file);
    for (const violation of violations) {
      if (allowed(source, violation.line)) continue;
      report.push({
        file: path.relative(workspaceRoot, file),
        ...violation,
      });
    }
  }
}

if (report.length) {
  console.error('[slot-render] 插槽内容必须在渲染期求值，不得缓存进 computed/watch：');
  for (const entry of report) {
    console.error(`  ${entry.file}:${entry.line} ${entry.kind}`);
  }
  console.error(
    `\n共 ${report.length} 处。改用 packages/ui/src/_utils 的 useRenderComputed；确有例外时在同一行上方附 "${lineAllowMarker} <理由>"。`,
  );
  process.exit(1);
}

console.log('[slot-render] 未发现被缓存的插槽调用。');
