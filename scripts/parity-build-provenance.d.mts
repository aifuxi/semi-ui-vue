import type { Plugin } from 'vite';

export function parityBuildProvenance(workspaceRoot: string): Plugin;
export function requestedBuildSources(
  requestedUrls: readonly string[],
  baseUrl: string,
  manifest: unknown,
): string[];
