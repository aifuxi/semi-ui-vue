export const STUB_OVERRIDES: Readonly<Record<string, string>>;

export function aliasKeyForStub(
  filename: string,
  overrides?: Readonly<Record<string, string>>,
): string | null;

export function buildStubAliases(
  filenames: readonly string[],
  stubDirectory: string,
  overrides?: Readonly<Record<string, string>>,
): Record<string, string>;

export interface VitestAliasOptions {
  workspaceRoot?: string;
  readDirectory?: (directory: string) => Promise<string[]>;
  checkAccess?: (target: string) => Promise<void>;
}

export function generateVitestAliases(
  options?: VitestAliasOptions,
): Promise<Record<string, string>>;

export function validateVitestAliases(
  aliases: Readonly<Record<string, string>>,
  options?: VitestAliasOptions,
): Promise<void>;

export function checkVitestAliases(options?: VitestAliasOptions): Promise<Record<string, string>>;
