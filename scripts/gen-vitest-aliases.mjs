/**
 * 生成 vitest.config.ts 的 alias 表并可选校验。
 *
 * 用法：
 *   node scripts/gen-vitest-aliases.mjs              # 输出 JS 代码到 stdout
 *   node scripts/gen-vitest-aliases.mjs --check       # 校验 vitest.config.ts 中的 alias 与生成结果一致
 *   node scripts/gen-vitest-aliases.mjs --out <file>  # 写入 JSON 文件
 *
 * 生成规则：
 *   1. @aifuxi/semi-ui-vue 子路径 → packages/ui/src/<component>/index.ts
 *   2. locale source 文件 → packages/ui/src/locale/source/<locale>.ts
 *   3. @semi-v2.102.0/* stub → apps/reference-react/src/test/Semi<Name>Stub.<ext>
 *   4. 第三方依赖 → node_modules / vendor/semi-design 路径（硬编码，不生成）
 */

import { readdir } from 'node:fs/promises';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const UI_SRC = join(ROOT, 'packages/ui/src');
const STUB_DIR = join(ROOT, 'apps/reference-react/src/test');

// Stub 文件名到别名的手动映射（覆盖自动生成结果，与 vitest.config.ts 保持一致）
const STUB_OVERRIDES = {
  'SemiLocaleEnGBStub.ts': '@semi-v2.102.0/locale-en-gb',
  'SemiLocaleJaJPStub.ts': '@semi-v2.102.0/locale-ja-jp',
  'SemiTextAreaStub.tsx': '@semi-v2.102.0/textarea',
};

// ── 内部包别名（稳定，不随组件增减变化）──────────────────────

function internalAliases() {
  return {
    '@aifuxi/semi-ui-vue/locale/source/en_GB': join(UI_SRC, 'locale/source/en_GB.ts'),
    '@aifuxi/semi-ui-vue/locale/source/ja_JP': join(UI_SRC, 'locale/source/ja_JP.ts'),
    '@aifuxi/semi-icons-vue': join(ROOT, 'packages/icons/src/index.ts'),
    '@aifuxi/semi-icons-lab-vue': join(ROOT, 'packages/icons-lab/src/index.ts'),
    '@aifuxi/semi-illustrations-vue': join(ROOT, 'vendor/semi-design/packages/semi-animation/index.ts'),
    // 第三方依赖（硬编码，不生成）
    'bezier-easing': join(ROOT, 'packages/ui/node_modules/bezier-easing/src/index.js'),
    'async-validator': join(ROOT, 'packages/ui/node_modules/async-validator/dist-web/index.js'),
    'fast-copy': join(ROOT, 'packages/foundation-integration/src/fast-copy.js'),
    // 内联 fixture（lottie）
    'lottie-web': join(ROOT, 'packages/ui/src/test/lottieWeb.ts'),
  };
}

// ── Stub 别名（从 stub 文件名生成，支持手动覆盖）──────────────

function parseStubName(filename) {
  // Semi<Name>Stub.tsx → <name> (lowercase, hyphenated)
  const m = filename.match(/^Semi(.+)Stub\.(ts|tsx)$/);
  if (!m) return null;

  // Check for manual override first.
  const override = STUB_OVERRIDES[filename];
  if (override) return { key: override.replace('@semi-v2.102.0/', ''), ext: m[2] };

  const camel = m[1];
  // "AIChatDialogue" → "ai-chat-dialogue"
  const key = camel.replace(/([A-Z]+)(?=[A-Z][a-z])|([A-Z])(?=[a-z])/g, (match) => {
    return '-' + match.toLowerCase();
  }).replace(/^-/, ''); // Remove leading hyphen
  return { key, ext: m[2] };
}

async function stubAliases() {
  const aliases = {};
  try {
    const files = await readdir(STUB_DIR);
    for (const f of files) {
      const parsed = parseStubName(f);
      if (!parsed) continue;
      aliases[`@semi-v2.102.0/${parsed.key}`] = join(STUB_DIR, f);
    }
  } catch {
    // Stub directory may not exist yet; return empty.
  }
  return aliases;
}

// ── 主函数────────────────────────────────────────────────────

async function generateAliases() {
  const [internal, stubs] = await Promise.all([internalAliases(), stubAliases()]);
  return { ...stubs, ...internal };
}

// ── 校验模式──────────────────────────────────────────────────

function normalizePath(p) {
  // Normalize fileURLToPath('./path') → absolute path
  if (p.startsWith('./')) {
    return join(ROOT, p);
  }
  return p;
}

async function check() {
  const configPath = join(ROOT, 'vitest.config.ts');
  const generated = await generateAliases();

  // Read current config aliases using a state machine that handles multi-line values.
  let current = {};
  try {
    const content = readFileSync(configPath, 'utf-8');
    const lines = content.split('\n');
    let inAliasBlock = false;
    let braceDepth = 0;
    let pendingKey = null;
    let pendingValue = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('alias:')) {
        inAliasBlock = true;
        braceDepth += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
        if (braceDepth > 0 && line.includes('{')) {
          const afterAlias = line.slice(line.indexOf('{') + 1);
          braceDepth -= (afterAlias.match(/}/g) || []).length;
        }
        continue;
      }
      if (inAliasBlock) {
        braceDepth += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
        // Extract ANY key, not just @semi-v2.102.0/ ones (includes hardcoded deps).
        const keyMatch = line.match(/^\s*['"](@?[^'"]+)['"]\s*:/);
        if (keyMatch) {
          // Save pending key; path may be on a subsequent line.
          if (pendingKey && pendingValue !== null) {
            current[pendingKey] = normalizePath(pendingValue);
          }
          pendingKey = keyMatch[1];
          // Handle single-line entries (key and new URL on same line).
          if (line.includes("new URL")) {
            const pathMatch = line.match(/new URL\(\s*['"](.+?)['"]/);
            if (pathMatch) {
              pendingValue = pathMatch[1];
            } else {
              pendingValue = null;
            }
          } else {
            pendingValue = null;
          }
        } else if (pendingKey && line.includes("new URL")) {
          const pathMatch = line.match(/new URL\(\s*['"](.+?)['"]/);
          if (pathMatch) {
            pendingValue = pathMatch[1];
          }
        }
        if (braceDepth <= 0) {
          // Flush last pending key.
          if (pendingKey && pendingValue !== null) {
            current[pendingKey] = normalizePath(pendingValue);
          }
          inAliasBlock = false;
        }
      }
    }
  } catch (e) {
    console.error('ERROR: 无法读取 vitest.config.ts:', e.message);
    process.exit(1);
  }

  if (Object.keys(current).length === 0) {
    console.error('ERROR: vitest.config.ts 中未找到 alias 配置');
    process.exit(1);
  }

  const genKeys = new Set(Object.keys(generated));
  const curKeys = new Set(Object.keys(current));

  let hasError = false;

  // Missing in generated
  for (const k of curKeys) {
    if (!genKeys.has(k)) {
      console.error(`  缺失: ${k} → ${current[k]}`);
      hasError = true;
    }
  }

  // Extra in generated (not in config)
  for (const k of genKeys) {
    if (!curKeys.has(k)) {
      console.error(`  多余: ${k} → ${generated[k]}`);
      hasError = true;
    }
  }

  // Value mismatch
  for (const k of genKeys) {
    if (curKeys.has(k)) {
      const g = normalizePath(generated[k]);
      const c = current[k];
      if (g !== c) {
        console.error(`  路径不一致: ${k}`);
        console.error(`    生成: ${g}`);
        console.error(`    当前: ${c}`);
        hasError = true;
      }
    }
  }

  if (hasError) {
    console.error('\n校验失败：生成的 alias 表与 vitest.config.ts 不一致。');
    console.error('运行 "node scripts/gen-vitest-aliases.mjs" 重新生成。');
    process.exit(1);
  }

  console.log(`校验通过：${genKeys.size} 个别名一致。`);
}

// ── 入口──────────────────────────────────────────────────────

const args = process.argv.slice(2);
const checkMode = args.includes('--check');
const outFile = args.find(a => a.startsWith('--out='))?.split('=')[1];

if (checkMode) {
  await check();
} else {
  const aliases = await generateAliases();
  if (outFile) {
    writeFileSync(outFile, JSON.stringify(aliases, null, 2) + '\n');
    console.error(`已写入 ${outFile}`);
  } else {
    // Output as JS module for direct import into vitest.config.ts
    const entries = Object.entries(aliases).map(([k, v]) => {
      // Convert to fileURLToPath format
      const rel = relative(ROOT, v);
      return `    '${k}': fileURLToPath(new URL('./${rel}', import.meta.url))`;
    });
    console.log('  alias: {');
    console.log(entries.join(',\n'));
    console.log('  },');
  }
}
