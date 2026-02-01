import type { Part, UserMessage } from '@opencode-ai/sdk';
import type { RouterInput, RawRouterResult } from '@morphllm/morphsdk';
export declare function createModelRouterHook(): {
    'chat.message': (input: {
        sessionID: string;
        agent?: string;
        model?: {
            providerID: string;
            modelID: string;
        };
        messageID?: string;
        variant?: string;
        classify?: (args: RouterInput) => Promise<RawRouterResult>;
    }, output: {
        message: UserMessage;
        parts: Part[];
    }) => Promise<void>;
};
export declare function extractPromptText(parts: Array<{
    type: string;
    text?: string;
}>): string;
