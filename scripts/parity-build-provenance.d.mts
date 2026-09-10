import type { RsbuildPlugin } from '@rsbuild/core';

export function parityBuildProvenance(workspaceRoot: string): RsbuildPlugin;
export function requestedBuildSources(
  requestedUrls: readonly string[],
  baseUrl: string,
  manifest: unknown,
): string[];
