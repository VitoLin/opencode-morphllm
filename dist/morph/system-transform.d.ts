export declare function createSystemTransformHook(): {
    'experimental.chat.system.transform': (_input: unknown, output: {
        system: string[];
    }) => Promise<void>;
};
