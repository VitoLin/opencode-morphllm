export declare function getMorphPluginConfigPath(): string;
interface MorphRouterConfigs {
    MORPH_ROUTER_ENABLED?: boolean;
    MORPH_ROUTER_PROMPT_CACHING_AWARE?: boolean;
    MORPH_MODEL_EASY?: string;
    MORPH_MODEL_MEDIUM?: string;
    MORPH_MODEL_HARD?: string;
    MORPH_MODEL_DEFAULT?: string;
}
interface MorphConfig {
    MORPH_API_KEY?: string;
    MORPH_ROUTER_CONFIGS?: MorphRouterConfigs;
    MORPH_ROUTER_ENABLED?: boolean;
    MORPH_ROUTER_PROMPT_CACHING_AWARE?: boolean;
    MORPH_MODEL_EASY?: string;
    MORPH_MODEL_MEDIUM?: string;
    MORPH_MODEL_HARD?: string;
    MORPH_MODEL_DEFAULT?: string;
}
export declare function loadMorphPluginConfig(): MorphConfig | null;
export declare function loadMorphPluginConfigWithProjectOverride(projectDir?: string): MorphConfig;
export declare const API_KEY: string;
export declare const MORPH_MODEL_EASY: string;
export declare const MORPH_MODEL_MEDIUM: string;
export declare const MORPH_MODEL_HARD: string;
export declare const MORPH_MODEL_DEFAULT: string;
export declare const MORPH_ROUTER_ENABLED: boolean;
export declare const MORPH_ROUTER_PROMPT_CACHING_AWARE: boolean;
export {};
