/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*.vue?raw' {
  const source: string;
  export default source;
}
