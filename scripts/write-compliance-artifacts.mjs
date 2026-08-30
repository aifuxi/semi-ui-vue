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

const runtimeDependencies = {
  ...sortRecord(manifest.dependencies),
  ...sortRecord(manifest.optionalDependencies),
  ...sortRecord(manifest.peerDependencies),
};
const dependencyEntries = Object.entries(runtimeDependencies).sort(([left], [right]) =>
  left.localeCompare(right),
);
const licensedDependencies = [
  {
    licenseFile: 'LICENSE.md',
    name: 'async-validator',
    noticeName: 'async-validator',
    version: '3.5.2',
  },
  {
    licenseFile: 'LICENSE',
    name: 'bezier-easing',
    noticeName: 'bezier-easing',
    version: '2.1.0',
  },
  { licenseFile: 'LICENSE.md', name: 'date-fns', noticeName: 'date-fns', version: '2.30.0' },
  {
    licenseFile: 'LICENSE.md',
    name: 'date-fns-tz',
    noticeName: 'date-fns-tz',
    version: '1.3.8',
  },
  { licenseFile: 'LICENSE', name: 'lodash', noticeName: 'Lodash', version: '4.17.21' },
  {
    licenseFile: 'LICENSE',
    name: 'scroll-into-view-if-needed',
    noticeName: 'scroll-into-view-if-needed',
    version: '2.2.31',
  },
].filter(({ name }) => Object.hasOwn(runtimeDependencies, name));
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
    path.join(workspaceRoot, 'node_modules', dependency.name, dependency.licenseFile),
    path.join(licenseRoot, `${dependency.name}.txt`),
  );
}

await writeFile(
  path.join(distRoot, 'THIRD_PARTY_NOTICES.md'),
  `# Third-Party Notices

This package is derived from or interoperates with Semi Design v2.102.0.

- Project: Semi Design
- Copyright: Copyright (c) 2021 DouyinFE
- License: MIT, including the upstream third-party notices
- Source: https://github.com/DouyinFE/semi-design
- Reference commit: ${semiCommit}

The complete upstream license and notices are included at \`THIRD_PARTY_LICENSES/Semi-Design.txt\`.${licensedDependencies
    .map(
      ({ name, noticeName, version }) =>
        `\n\nThis package also uses ${noticeName} ${version} under the MIT License. Its license is included at \`THIRD_PARTY_LICENSES/${name}.txt\`.`,
    )
    .join('')}
`,
);

const sbom = {
  spdxVersion: 'SPDX-2.3',
  dataLicense: 'CC0-1.0',
  SPDXID: 'SPDXRef-DOCUMENT',
  name: `${manifest.name}-${manifest.version}`,
  documentNamespace: `https://semi-ui-vue.invalid/spdx/${encodeURIComponent(manifest.name)}/${manifest.version}/${semiCommit}/${buildFingerprint}`,
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
      downloadLocation: 'NOASSERTION',
      filesAnalyzed: false,
      licenseConcluded: 'NOASSERTION',
      licenseDeclared: 'NOASSERTION',
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
