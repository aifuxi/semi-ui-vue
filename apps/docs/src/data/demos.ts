import data from './demos.json';

export interface DemoDefinition {
  id: string;
  entry: string;
  files: Record<string, string>;
  dependencies: string[];
  pages: string[];
  upstream: string | null;
}

export const demoDefinitions: DemoDefinition[] = data.map((demo) => {
  const files: Record<string, string> = {};
  for (const [name, path] of Object.entries(demo.files))
    if (typeof path === 'string') files[name] = path;
  return { ...demo, files };
});
export const demoRegistry = new Map(demoDefinitions.map((demo) => [demo.id, demo]));
