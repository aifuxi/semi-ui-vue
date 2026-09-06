declare module 'virtual:pinned-button-docs/*.jsx' {
  import type { ComponentType } from 'react';
  const component: ComponentType;
  export default component;
}
declare module 'virtual:pinned-button-examples' {
  import type { ComponentType } from 'react';
  const examples: Record<'zh-cn' | 'en-us', Array<() => Promise<{ default: ComponentType }>>>;
  export default examples;
}
declare module 'virtual:pinned-doc-sidebar' {
  import type { ComponentType } from 'react';
  const sidebar: ComponentType<{
    location: { pathname: string };
    itemsArr: Array<{ itemKey: string; text: string; textUs: string }>;
    edges: unknown[];
  }>;
  export default sidebar;
}

declare module 'virtual:pinned-icon-examples' {
  import type { ComponentType } from 'react';
  const examples: Record<'zh-cn' | 'en-us', Array<() => Promise<{ default: ComponentType }>>>;
  export default examples;
}

declare module 'virtual:pinned-config-provider-examples' {
  import type { ComponentType } from 'react';
  const examples: Record<'zh-cn' | 'en-us', Array<() => Promise<{ default: ComponentType }>>>;
  export default examples;
}

declare module 'virtual:pinned-locale-examples' {
  import type { ComponentType } from 'react';
  const examples: Record<'zh-cn' | 'en-us', Array<() => Promise<{ default: ComponentType }>>>;
  export default examples;
}

declare module 'virtual:pinned-dark-mode-examples' {
  import type { ComponentType } from 'react';
  const examples: Record<'zh-cn' | 'en-us', Array<() => Promise<{ default: ComponentType }>>>;
  export default examples;
}

declare module 'virtual:pinned-navigation-examples' {
  const sources: Record<string, Array<() => Promise<{ default: import('react').ComponentType }>>>;
  export default sources;
}
