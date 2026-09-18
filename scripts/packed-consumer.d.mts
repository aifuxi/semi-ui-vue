export interface PackedConsumer {
  consumerRoot: string;
  installedPackages: Record<string, string>;
  tarballHashes: Record<string, string>;
  tarballs: Record<string, string>;
  isolated: boolean;
  dispose(): Promise<void>;
}

export function preparePackedConsumer(options?: {
  isolated?: boolean;
  packDirectory?: string;
}): Promise<PackedConsumer>;
