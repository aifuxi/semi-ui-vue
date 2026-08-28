import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';
import ts from 'typescript';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const sourceRoot = path.join(
  workspaceRoot,
  'vendor/semi-design/packages/semi-illustrations/src/illustrations',
);
const targetRoot = path.join(workspaceRoot, 'packages/illustrations/src/illustrations');
const checkOnly = process.argv.includes('--check');

const SVG_ATTRIBUTE_NAMES = new Map([
  ['className', 'class'],
  ['clipPath', 'clip-path'],
  ['clipRule', 'clip-rule'],
  ['fillOpacity', 'fill-opacity'],
  ['fillRule', 'fill-rule'],
  ['floodColor', 'flood-color'],
  ['floodOpacity', 'flood-opacity'],
  ['gradientTransform', 'gradientTransform'],
  ['gradientUnits', 'gradientUnits'],
  ['maskType', 'mask-type'],
  ['stopColor', 'stop-color'],
  ['stopOpacity', 'stop-opacity'],
  ['strokeDasharray', 'stroke-dasharray'],
  ['strokeLinecap', 'stroke-linecap'],
  ['strokeLinejoin', 'stroke-linejoin'],
  ['strokeMiterlimit', 'stroke-miterlimit'],
  ['strokeOpacity', 'stroke-opacity'],
  ['strokeWidth', 'stroke-width'],
  ['xlinkHref', 'xlink:href'],
]);

function expressionText(expression) {
  return expression ? expression.getText() : 'undefined';
}

function attributeEntry(attribute) {
  if (ts.isJsxSpreadAttribute(attribute)) return `...(${expressionText(attribute.expression)})`;

  const rawName = attribute.name.getText();
  const name = SVG_ATTRIBUTE_NAMES.get(rawName) ?? rawName;
  if (!attribute.initializer) return `${JSON.stringify(name)}: true`;
  if (ts.isStringLiteral(attribute.initializer)) {
    return `${JSON.stringify(name)}: ${JSON.stringify(attribute.initializer.text)}`;
  }
  if (ts.isJsxExpression(attribute.initializer)) {
    return `${JSON.stringify(name)}: ${expressionText(attribute.initializer.expression)}`;
  }
  throw new Error(`Unsupported JSX attribute: ${attribute.getText()}`);
}

function jsxChildren(children) {
  const rendered = children.flatMap((child) => {
    if (ts.isJsxText(child)) {
      const text = child.getText().replace(/\s+/g, ' ').trim();
      return text ? [JSON.stringify(text)] : [];
    }
    if (ts.isJsxExpression(child)) {
      return child.expression ? [expressionText(child.expression)] : [];
    }
    if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) return [jsxNode(child)];
    throw new Error(`Unsupported JSX child: ${child.getText()}`);
  });
  return rendered.length === 0 ? 'undefined' : `[${rendered.join(', ')}]`;
}

function jsxNode(node) {
  const opening = ts.isJsxElement(node) ? node.openingElement : node;
  const attributes = opening.attributes.properties.map(attributeEntry);
  const props = attributes.length === 0 ? 'null' : `{ ${attributes.join(', ')} }`;
  const children = ts.isJsxElement(node) ? jsxChildren(node.children) : 'undefined';
  return `h(${JSON.stringify(opening.tagName.getText())}, ${props}, ${children})`;
}

function findSvgFunction(sourceFile) {
  return sourceFile.statements.find(
    (statement) => ts.isFunctionDeclaration(statement) && statement.name?.text === 'SvgComponent',
  );
}

async function formatTypeScript(source) {
  return format(source, {
    parser: 'typescript',
    printWidth: 100,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
  });
}

async function generateIllustrationSource(source, filePath, componentName) {
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const svgFunction = findSvgFunction(sourceFile);
  if (!svgFunction?.body) throw new Error(`SvgComponent not found in ${filePath}`);
  const returnStatement = svgFunction.body.statements.find(ts.isReturnStatement);
  if (!returnStatement?.expression || !ts.isParenthesizedExpression(returnStatement.expression)) {
    throw new Error(`JSX return not found in ${filePath}`);
  }
  const jsx = returnStatement.expression.expression;
  if (!ts.isJsxElement(jsx) && !ts.isJsxSelfClosingElement(jsx)) {
    throw new Error(`Unsupported SVG return in ${filePath}`);
  }

  return formatTypeScript(
    `// Generated from the pinned Semi Design v2.102.0 source. Do not edit directly.\nimport { h, type VNode } from 'vue';\nimport { convertIllustration, type IllustrationSvgProps } from '../components/Illustration';\n\nfunction renderSvg(props: IllustrationSvgProps): VNode {\n  return ${jsxNode(jsx)};\n}\n\nexport default convertIllustration(renderSvg, ${JSON.stringify(componentName)});\n`,
  );
}

async function assertOrWrite(filePath, content) {
  if (checkOnly) {
    let current;
    try {
      current = await readFile(filePath, 'utf8');
    } catch {
      throw new Error(`Generated illustration missing: ${path.relative(workspaceRoot, filePath)}`);
    }
    if (current !== content) {
      throw new Error(`Generated illustration drift: ${path.relative(workspaceRoot, filePath)}`);
    }
    return;
  }
  await writeFile(filePath, content);
}

await mkdir(targetRoot, { recursive: true });
const sourceFiles = (await readdir(sourceRoot))
  .filter((fileName) => /^Illustration.+\.tsx$/.test(fileName) && fileName !== 'index.tsx')
  .sort();
const targetFiles = (await readdir(targetRoot)).filter((fileName) =>
  /^Illustration.+\.ts$/.test(fileName),
);
const expectedTargets = new Set(sourceFiles.map((fileName) => fileName.replace(/\.tsx$/, '.ts')));
const extraTargets = targetFiles.filter((fileName) => !expectedTargets.has(fileName));
if (extraTargets.length > 0) {
  throw new Error(`Generated illustrations contain stale files: ${extraTargets.join(', ')}`);
}

for (const fileName of sourceFiles) {
  const sourcePath = path.join(sourceRoot, fileName);
  const componentName = fileName.replace(/\.tsx$/, '');
  const targetPath = path.join(targetRoot, `${componentName}.ts`);
  const source = await readFile(sourcePath, 'utf8');
  await assertOrWrite(
    targetPath,
    await generateIllustrationSource(source, sourcePath, componentName),
  );
}

const exportsSource = await formatTypeScript(
  `${sourceFiles
    .map((fileName) => {
      const componentName = fileName.replace(/\.tsx$/, '');
      return `export { default as ${componentName} } from './${componentName}';`;
    })
    .join('\n')}\n`,
);
await assertOrWrite(path.join(targetRoot, 'index.ts'), exportsSource);
process.stdout.write(
  `illustrations ${checkOnly ? 'verified' : 'generated'}: ${sourceFiles.length}\n`,
);
