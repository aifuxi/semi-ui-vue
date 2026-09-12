import { adapt as adaptDescriptions } from './descriptions.mjs';

export const upstream = 'show/descriptions';
// The pinned English page only ships the horizontal "Set layout mode" snippet (block 5). The
// published English docs also render the same data with `layout="vertical"`, so this reference
// rebuilds that documented example from the same block instead of inventing a second dataset.
export const exampleCount = { 'en-us': 5 };

export function adapt(code, context) {
  return adaptDescriptions(code.replace("layout='horizontal'", "layout='vertical'"), context);
}
