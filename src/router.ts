import { MorphClient } from '@morphllm/morphsdk';

import { API_KEY } from './const';
import type { Part, UserMessage } from '@opencode-ai/sdk';
import type {
  RouterInput,
  RawRouterResult,
  ComplexityLevel,
} from '@morphllm/morphsdk';

const morph = new MorphClient({ apiKey: API_KEY });

export function createModelRouterHook() {
  return {
    'chat.message': async (
      input: {
        sessionID: string;
        agent?: string;
        model?: { providerID: string; modelID: string };
        messageID?: string;
        variant?: string;
        classify?: (args: RouterInput) => Promise<RawRouterResult>;
      },
      output: { message: UserMessage; parts: Part[] }
    ): Promise<void> => {
      input.model = input.model ?? { providerID: '', modelID: '' };

      const promptText = extractPromptText(output.parts);

      const classifier =
        input.classify ??
        ((args: RouterInput) => morph.routers.raw.classify(args));

      const classification: RawRouterResult = await classifier({
        input: promptText,
      } as RouterInput);

      // TODO: allow for user config
      const pickModelForDifficulty = (
        difficulty?: ComplexityLevel | string
      ): { providerID: string; modelID: string } => {
        switch (String(difficulty).toLowerCase()) {
          case 'easy':
            return { providerID: 'github-copilot', modelID: 'gpt-4.1' };
          case 'medium':
            return { providerID: 'github-copilot', modelID: 'gpt-4o' };
          case 'hard':
            return { providerID: 'github-copilot', modelID: 'gpt-5-mini' };
          default:
            return { providerID: 'github-copilot', modelID: 'gpt-4o' };
        }
      };

      const chosen = pickModelForDifficulty(classification?.difficulty);

      input.model.providerID = chosen.providerID;
      input.model.modelID = chosen.modelID;
    },
  };
}

export function extractPromptText(
  parts: Array<{ type: string; text?: string }>
): string {
  return parts
    .filter((p) => p.type === 'text')
    .map((p) => p.text || '')
    .join(' ');
}
