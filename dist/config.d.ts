export declare function getMorphPluginConfigPath(): string;
interface MorphConfig {
  MORPH_API_KEY?: string;
  MORPH_ROUTER_ENABLED?: boolean;
  MORPH_MODEL_EASY?: string;
  MORPH_MODEL_MEDIUM?: string;
  MORPH_MODEL_HARD?: string;
  MORPH_MODEL_DEFAULT?: string;
}
export declare function loadMorphPluginConfig(): MorphConfig | null;
export declare function loadMorphPluginConfigWithProjectOverride(
  projectDir?: string
): MorphConfig;
export declare const API_KEY: string;
export declare const MORPH_MODEL_EASY: string;
export declare const MORPH_MODEL_MEDIUM: string;
export declare const MORPH_MODEL_HARD: string;
export declare const MORPH_MODEL_DEFAULT: string;
export declare const MORPH_ROUTER_ENABLED: boolean;
export {};
