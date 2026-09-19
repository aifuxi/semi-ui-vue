/**
 * 示例清单契约：后续接入 @vue/repl 时，DemoBlock 只依赖这里的结构与 loader，
 * Markdown 里的 `<DemoBlock />` 不需要改写。
 */
export interface ExampleManifest {
  id: string;
  title: string;
  entry: string;
  files: Record<string, string>;
  dependencies: Record<string, string>;
  cssUrls: string[];
  preview: {
    minHeight?: number;
    clientOnly?: boolean;
  };
}

export type DemoSourceLoader = (id: string) => Promise<ExampleManifest | null>;

/** 首版不呈现示例代码，loader 恒定返回空；接 REPL 时替换实现即可。 */
export const loadExampleManifest: DemoSourceLoader = async () => null;
