import { readFileSync } from 'node:fs';

// Pitch before Vue/CSS loaders: the editor needs the original source, not compiled JS.
export function pitch() {
  this.addDependency(this.resourcePath);
  return `export default ${JSON.stringify(readFileSync(this.resourcePath, 'utf8'))};`;
}

export default function rawSource(source) {
  return source;
}
