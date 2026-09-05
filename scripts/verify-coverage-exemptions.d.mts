export interface CoverageExemptionOptions {
  workspaceRoot?: string;
  manifestPath?: string;
  readManifest?: (path: string, encoding: 'utf8') => Promise<string>;
  getFileStat?: (path: string) => Promise<{ isFile(): boolean }>;
}

export function loadCoverageExemptions(options?: CoverageExemptionOptions): Promise<string[]>;
