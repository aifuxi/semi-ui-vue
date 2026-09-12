export const upstream = 'show/avatar';
export const exampleCount = { 'zh-cn': 15, 'en-us': 15 };

const react = "import React from 'react';";
const components = "import { Avatar, AvatarGroup } from '@douyinfe/semi-ui';";
const icons = "import { IconPlus } from '@douyinfe/semi-icons';";

export function adapt(code, { entry }) {
  // Both documented pages serve the local demo asset; the pinned snippets point at a CDN copy.
  code = code.replace(
    /https:\/\/lf3-static\.bytednsdoc\.com[^"']+/g,
    'http://127.0.0.1:4321/demos/photo.svg',
  );
  // The pinned English Bottom Slot example uses `content`, which the fixed Adapter ignores;
  // the documented Vue demo and the real `bottomSlot.text` contract both use `text`.
  code = code
    .replaceAll('content: "LIVE"', 'text: "LIVE"')
    .replaceAll('content: <IconPlus/>', 'text: <IconPlus/>');
  // The pinned English animation example still passes the removed `borderMotion` prop, which the
  // fixed Adapter ignores; the documented Vue demo uses the current `border={{motion:true}}` API.
  if (code.includes('borderMotion'))
    code = code
      .replaceAll('borderMotion={true}', '')
      .replaceAll('border={true}', 'border={{motion:true}}');
  // The 顶部/底部/边框/动效 snippets rely on the live evaluator's implicit component scope.
  if (!code.includes("from '@douyinfe/semi-ui'")) code = `${components}\n${code}`;
  if (code.includes('<IconPlus') && !code.includes("from '@douyinfe/semi-icons'"))
    code = `${icons}\n${code}`;
  if (!code.includes("from 'react'")) code = `${react}\n${code}`;
  // The 顶部和底部 Slot snippet is a bare JSX expression, not a function.
  const body = code.replace(/^\s*import[^\n]*\n/gm, '').trimStart();
  let demo = entry;
  if (body.startsWith('<')) code = `${code}\nconst DocumentationExample = () => (${body});`;
  else if (!demo) code = code.replace(/^\(\)\s*=>/m, 'const DocumentationExample = () =>');
  demo = demo ?? 'DocumentationExample';
  // The published pages load Inter from CSS before any demo renders, so every mount measures the
  // real metrics. This harness injects the face from JavaScript and requests the 600 weight only
  // when the Avatar label first renders — after mount — so request it before mounting instead.
  return `${code}
export default function FontReadyExample() {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    document.fonts.load('600 20px Inter').then(() => document.fonts.ready).then(() => setReady(true));
  }, []);
  return ready ? <${demo} /> : null;
}`;
}
