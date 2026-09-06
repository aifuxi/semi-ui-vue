declare module 'virtual:pinned-documentation-examples' {
  import type { ComponentType } from 'react';
  type Examples = Record<'zh-cn' | 'en-us', Array<() => Promise<{ default: ComponentType }>>>;
  const batches: Record<string, () => Promise<{ default: Examples }>>;
  export default batches;
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
