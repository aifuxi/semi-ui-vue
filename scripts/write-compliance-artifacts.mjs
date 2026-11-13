import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const packageArgument = process.argv[2];

if (!packageArgument) {
  throw new Error('缺少目标 package 目录');
}

const packageRoot = path.resolve(process.cwd(), packageArgument);
const manifestSource = await readFile(path.join(packageRoot, 'package.json'), 'utf8');
const manifest = JSON.parse(manifestSource);
const distRoot = path.join(packageRoot, 'dist');
const licenseRoot = path.join(distRoot, 'THIRD_PARTY_LICENSES');
const semiCommit = 'cdfba6e520fc83ad871b30f51f36d8af3aaa5a21';

function resolveCreationTime() {
  const sourceDateEpoch = process.env.SOURCE_DATE_EPOCH;

  if (sourceDateEpoch === undefined) return new Date().toISOString();
  if (!/^\d+$/.test(sourceDateEpoch)) {
    throw new Error('SOURCE_DATE_EPOCH 必须是非负 Unix 秒时间戳');
  }

  const milliseconds = Number(sourceDateEpoch) * 1000;
  if (!Number.isSafeInteger(milliseconds)) {
    throw new Error('SOURCE_DATE_EPOCH 超出 JavaScript 安全时间戳范围');
  }

  return new Date(milliseconds).toISOString();
}

function sortRecord(record = {}) {
  return Object.fromEntries(
    Object.entries(record).sort(([left], [right]) => left.localeCompare(right)),
  );
}

function dependencySpdxId(packageName) {
  return `SPDXRef-Package-${packageName.replace(/[^A-Za-z0-9.-]/g, '-')}`;
}

function dependencyLicenseArtifact(packageName) {
  return `${packageName.replace(/^@/, '').replaceAll('/', '--')}.txt`;
}

function publishedDependencyVersion(version) {
  if (version === 'workspace:*') return manifest.version;
  if (version === 'workspace:^') return `^${manifest.version}`;
  if (version === 'workspace:~') return `~${manifest.version}`;
  if (version.startsWith('workspace:')) return version.slice('workspace:'.length);
  return version;
}

const sourceRuntimeDependencies = {
  ...sortRecord(manifest.dependencies),
  ...sortRecord(manifest.optionalDependencies),
  ...sortRecord(manifest.peerDependencies),
};
const bundledRuntimeDependencies =
  manifest.name === '@aifuxi/semi-ui-vue' ? { 'jsonc-parser': '3.3.1' } : {};
const runtimeDependencies = Object.fromEntries(
  Object.entries({ ...sourceRuntimeDependencies, ...bundledRuntimeDependencies }).map(
    ([name, version]) => [name, publishedDependencyVersion(version)],
  ),
);
const dependencyEntries = Object.entries(runtimeDependencies).sort(([left], [right]) =>
  left.localeCompare(right),
);
/** 许可证文件及其安装位置；通知版本从相同位置的 package.json 获取，不重复维护版本号。 */
const licensedDependencies = [
  {
    licenseFile: 'license',
    licenseRoot: path.join(workspaceRoot, 'packages', 'ui', 'node_modules'),
    name: '@mdx-js/mdx',
    noticeName: '@mdx-js/mdx',
  },
  ...[
    '@tiptap/core',
    '@tiptap/extension-document',
    '@tiptap/extension-hard-break',
    '@tiptap/extension-image',
    '@tiptap/extension-paragraph',
    '@tiptap/extension-text',
    '@tiptap/extension-text-align',
    '@tiptap/extension-text-style',
    '@tiptap/extensions',
    '@tiptap/pm',
    '@tiptap/starter-kit',
    '@tiptap/vue-3',
  ].map(
    /** Tiptap 的包级许可证命名不同，但版本说明与其他依赖使用同一读取规则。 */
    (name) => ({
      licenseFile: name === '@tiptap/pm' ? 'LICENSE' : 'LICENSE.md',
      licenseRoot: path.join(workspaceRoot, 'packages', 'ui', 'node_modules'),
      name,
      noticeName: name,
    }),
  ),
  {
    licenseFile: 'LICENSE.md',
    name: 'async-validator',
    noticeName: 'async-validator',
  },
  {
    licenseFile: 'LICENSE',
    name: 'bezier-easing',
    noticeName: 'bezier-easing',
  },
  {
    licenseFile: 'license',
    licenseRoot: path.join(workspaceRoot, 'packages', 'ui', 'node_modules'),
    name: 'remark-gfm',
    noticeName: 'remark-gfm',
  },
  { licenseFile: 'LICENSE', name: 'classnames', noticeName: 'classnames' },
  { licenseFile: 'LICENSE.md', name: 'date-fns', noticeName: 'date-fns' },
  {
    licenseFile: 'LICENSE.md',
    name: 'date-fns-tz',
    noticeName: 'date-fns-tz',
  },
  { licenseFile: 'LICENSE', name: 'lodash', noticeName: 'Lodash' },
  {
    licenseFile: 'LICENSE',
    licenseRoot: path.join(workspaceRoot, 'packages', 'ui', 'node_modules'),
    name: 'markdown-it',
    noticeName: 'markdown-it',
  },
  {
    licenseFile: 'LICENSE.md',
    licenseRoot: path.join(workspaceRoot, 'packages', 'foundation-integration', 'node_modules'),
    name: 'jsonc-parser',
    noticeName: 'jsonc-parser',
  },
  {
    licenseFile: 'LICENSE.md',
    name: 'lottie-web',
    noticeName: 'lottie-web',
  },
  { licenseFile: 'LICENSE', name: 'prismjs', noticeName: 'PrismJS' },
  {
    licenseFile: 'LICENSE',
    name: 'scroll-into-view-if-needed',
    noticeName: 'scroll-into-view-if-needed',
  },
].filter(
  /** 各公开包只附带实际声明或内联使用的依赖许可证。 */
  ({ name }) => Object.hasOwn(runtimeDependencies, name),
);
// 通知识别实际附带许可证所属版本；SBOM 继续使用清单声明的依赖范围。
for (const dependency of licensedDependencies) {
  /** 沿用复制许可证时的解析位置，兼容根依赖与包内依赖。 */
  const dependencyRoot = dependency.licenseRoot ?? path.join(workspaceRoot, 'node_modules');
  /** 已安装清单与下方复制的许可证必须属于同一依赖实例。 */
  const installedManifest = JSON.parse(
    await readFile(path.join(dependencyRoot, dependency.name, 'package.json'), 'utf8'),
  );
  dependency.version = installedManifest.version;
}
const creationTime = resolveCreationTime();
const buildFingerprint = createHash('sha256')
  .update(
    JSON.stringify({
      name: manifest.name,
      version: manifest.version,
      runtimeDependencies,
      semiCommit,
      creationTime,
    }),
  )
  .digest('hex')
  .slice(0, 16);

await mkdir(licenseRoot, { recursive: true });
await copyFile(
  path.join(workspaceRoot, 'vendor', 'semi-design', 'LICENSE'),
  path.join(licenseRoot, 'Semi-Design.txt'),
);
for (const dependency of licensedDependencies) {
  await copyFile(
    path.join(
      dependency.licenseRoot ?? path.join(workspaceRoot, 'node_modules'),
      dependency.name,
      dependency.licenseFile,
    ),
    path.join(licenseRoot, dependencyLicenseArtifact(dependency.name)),
  );
  if (dependency.name === '@tiptap/pm') {
    const notices = await readFile(
      path.join(dependency.licenseRoot, dependency.name, 'THIRD_PARTY_LICENSES.md'),
      'utf8',
    );
    const licensePath = path.join(licenseRoot, dependencyLicenseArtifact(dependency.name));
    await writeFile(licensePath, `${await readFile(licensePath, 'utf8')}\n\n${notices}`);
  }
}

await writeFile(
  path.join(distRoot, 'THIRD_PARTY_NOTICES.md'),
  `# Third-Party Notices

This package is part of an independent Vue implementation derived from or interoperating with Semi Design v2.102.0. It is not an official Semi Design Vue package and does not imply authorization, partnership, or endorsement by DouyinFE.

- Project: Semi Design
- Copyright: Copyright (c) 2021 DouyinFE
- License: MIT, including the upstream third-party notices
- Source: https://github.com/DouyinFE/semi-design
- Reference commit: ${semiCommit}

The complete upstream license and notices are included at \`THIRD_PARTY_LICENSES/Semi-Design.txt\`.${licensedDependencies
    .map(
      ({ name, noticeName, version }) =>
        `\n\nThis package also uses ${noticeName} ${version} under the MIT License. Its license is included at \`THIRD_PARTY_LICENSES/${dependencyLicenseArtifact(name)}\`.`,
    )
    .join('')}
`,
);

const sbom = {
  spdxVersion: 'SPDX-2.3',
  dataLicense: 'CC0-1.0',
  SPDXID: 'SPDXRef-DOCUMENT',
  name: `${manifest.name}-${manifest.version}`,
  documentNamespace: `https://github.com/aifuxi/semi-ui-vue/spdx/${encodeURIComponent(manifest.name)}/${manifest.version}/${semiCommit}/${buildFingerprint}`,
  documentDescribes: ['SPDXRef-Package-Workspace'],
  creationInfo: {
    created: creationTime,
    creators: ['Tool: semi-ui-vue-workspace'],
  },
  packages: [
    {
      SPDXID: 'SPDXRef-Package-Workspace',
      name: manifest.name,
      versionInfo: manifest.version,
      supplier: 'Person: aifuxi',
      downloadLocation: 'https://github.com/aifuxi/semi-ui-vue',
      filesAnalyzed: false,
      licenseConcluded: 'MIT',
      licenseDeclared: 'MIT',
      primaryPackagePurpose: 'LIBRARY',
    },
    {
      SPDXID: 'SPDXRef-Package-Semi-Design',
      name: '@douyinfe/semi-design',
      versionInfo: '2.102.0',
      supplier: 'Organization: DouyinFE',
      downloadLocation: 'https://github.com/DouyinFE/semi-design',
      filesAnalyzed: false,
      licenseConcluded: 'MIT',
      licenseDeclared: 'MIT',
      externalRefs: [
        {
          referenceCategory: 'PACKAGE-MANAGER',
          referenceType: 'purl',
          referenceLocator: `pkg:github/DouyinFE/semi-design@${semiCommit}`,
        },
      ],
    },
    ...dependencyEntries.map(([packageName, version]) => ({
      SPDXID: dependencySpdxId(packageName),
      name: packageName,
      versionInfo: version,
      downloadLocation: 'NOASSERTION',
      filesAnalyzed: false,
      licenseConcluded: licensedDependencies.some(({ name }) => name === packageName)
        ? 'MIT'
        : 'NOASSERTION',
      licenseDeclared: licensedDependencies.some(({ name }) => name === packageName)
        ? 'MIT'
        : 'NOASSERTION',
    })),
  ],
  relationships: [
    {
      spdxElementId: 'SPDXRef-Package-Workspace',
      relationshipType: 'DERIVED_FROM',
      relatedSpdxElement: 'SPDXRef-Package-Semi-Design',
    },
    ...dependencyEntries.map(([packageName]) => ({
      spdxElementId: 'SPDXRef-Package-Workspace',
      relationshipType: 'DEPENDS_ON',
      relatedSpdxElement: dependencySpdxId(packageName),
    })),
  ],
};

await writeFile(path.join(distRoot, 'SBOM.spdx.json'), `${JSON.stringify(sbom, null, 2)}\n`);
