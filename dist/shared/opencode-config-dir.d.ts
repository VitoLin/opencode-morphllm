interface OpenCodeConfigDirOptions {
  binary: 'opencode' | 'opencode-desktop';
  version?: string | null;
  checkExisting?: boolean;
}
export declare function getOpenCodeConfigDir(
  options: OpenCodeConfigDirOptions
): string;
export {};
