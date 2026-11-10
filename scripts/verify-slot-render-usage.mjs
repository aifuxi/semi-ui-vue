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

/** 只解析 Vue 的 script 内容，同时保留其在完整文件中的行号偏移。 */
function scriptRanges(source, filePath) {
  if (!filePath.endsWith('.vue')) return [{ start: 0, text: source }];
  /** 每段脚本独立解析，模板内容不作为 TypeScript 扫描。 */
  const ranges = [];
  /** 覆盖普通 script 与 script setup，沿用当前组件的内联脚本边界。 */
  const pattern = /<script\b[^>]*>([\s\S]*?)<\/script>/gu;
  let match;
  while ((match = pattern.exec(source))) {
    ranges.push({ start: match.index + match[0].indexOf(match[1]), text: match[1] });
  }
  return ranges;
}

/** 分析缓存回调中的插槽调用；仅跟随同文件具名函数的实际调用，不把函数值当作执行。 */
export function createContext(source, filePath) {
  /** 每条违规携带缓存入口的行号，交由 CLI 应用现有 allow 标记。 */
  const violations = [];
  /** 记录直接或经其他具名函数读取插槽的函数名。 */
  const slotFunctionCalls = new Set();

  for (const range of scriptRanges(source, filePath)) {
    /** 对当前脚本使用完整 AST，函数定义顺序不影响后续检查。 */
    const ast = ts.createSourceFile(
      filePath,
      range.text,
      ts.ScriptTarget.ESNext,
      true,
      ts.ScriptKind.TS,
    );
    /** 将脚本节点的相对位置转换为原文件的一基行号。 */
    const lineOf = (node) => source.slice(0, range.start + node.getStart(ast)).split('\n').length;

    /** 保存为对象属性或返回值的函数在以后执行，不能归因于当前缓存回调。 */
    const isDeferredFunction = (candidate, root) =>
      candidate !== root &&
      ts.isFunctionLike(candidate) &&
      !(ts.isCallExpression(candidate.parent) && candidate.parent.arguments.includes(candidate));

    /** 判断子树是否直接调用已有约定中的 slots、$slots 或 ctx.slots。 */
    const callsSlots = (node) => {
      /** 找到首个直接调用即可结束这次存在性检查。 */
      let found = false;
      /** 遍历调用表达式，插槽存在性读取不会被当作调用。 */
      const visit = (candidate) => {
        if (found || isDeferredFunction(candidate, node)) return;
        if (ts.isCallExpression(candidate) && ts.isPropertyAccessExpression(candidate.expression)) {
          /** 区分 slots.default() 与 ctx.slots.default() 的接收对象。 */
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

    /** 只收集 CallExpression 的具名被调用方，不收集作为值返回或传递的标识符。 */
    const collectCalls = (node, output = new Set()) => {
      /** 保留 map 等直接传给调用表达式的 callback，跳过仅保存的延后函数体。 */
      const visitCall = (candidate) => {
        if (isDeferredFunction(candidate, node)) return;
        if (ts.isCallExpression(candidate) && ts.isIdentifier(candidate.expression)) {
          output.add(candidate.expression.text);
        }
        // forEachChild 遇到 truthy 返回值会停止遍历，visitor 不能返回收集结果 Set。
        ts.forEachChild(candidate, visitCall);
      };
      visitCall(node);
      return output;
    };

    /** 函数体先全部收集，再解析调用关系，支持声明前后及多层辅助调用。 */
    const functions = new Map();
    /** 同时收集函数声明、箭头函数与具名变量中的函数表达式。 */
    const scanFunctions = (node) => {
      if (ts.isFunctionDeclaration(node) && node.name && node.body) {
        functions.set(node.name.text, node.body);
      }
      if (
        ts.isVariableDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        node.initializer &&
        (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
      ) {
        functions.set(node.name.text, node.initializer);
      }
      ts.forEachChild(node, scanFunctions);
    };
    scanFunctions(ast);

    /** 不断传播已确认的插槽读取；集合只增不减，递归或互相调用也会有限结束。 */
    let changed = true;
    while (changed) {
      changed = false;
      for (const [name, body] of functions) {
        if (slotFunctionCalls.has(name)) continue;
        if (
          callsSlots(body) ||
          [...collectCalls(body)].some(
            /** 只有实际调用已知插槽函数，才把当前函数标记为传递读取。 */
            (called) => slotFunctionCalls.has(called),
          )
        ) {
          slotFunctionCalls.add(name);
          changed = true;
        }
      }
    }

    /** 最后检查缓存入口，此时辅助函数与传递调用均已完成收集。 */
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
          /** 回调体内只看实际调用；直接作为缓存回调传入的函数也会执行。 */
          const calls = collectCalls(argument);
          if (ts.isIdentifier(argument)) calls.add(argument.text);
          for (const identifier of calls) {
            if (slotFunctionCalls.has(identifier)) {
              violations.push({
                kind: `${node.expression.text} 回调调用了读取插槽的函数 ${identifier}`,
                line: lineOf(node.expression),
              });
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }

  return { violations };
}

function allowed(source, line) {
  if (source.includes(fileAllowMarker)) return true;
  const lines = source.split('\n');
  const from = Math.max(0, line - 5);
  return lines.slice(from, line).some((entry) => entry.includes(lineAllowMarker));
}

// 导入分析函数时不扫描仓库，fixture 可直接验证同一实现；CLI 行为仍从真实文件收集违规。
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  /** 汇总整轮违规后统一失败，避免只报告首个文件。 */
  const report = [];
  for (const rootName of guardedRoots) {
    /** 保留现有可选源码根目录行为。 */
    const files = await collectFiles(path.join(workspaceRoot, rootName)).catch(
      /** 当前脚本沿用缺少可选根目录时的空列表处理。 */
      () => [],
    );
    for (const file of files) {
      /** 保留原始全文，Vue 偏移及 allow 标记均据此计算。 */
      const source = await readFile(file, 'utf8');
      if (!source.includes('slots')) continue;
      /** 使用与 fixture 相同的分析入口，避免测试复制检查器实现。 */
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
}
