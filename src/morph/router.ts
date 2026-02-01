import { MorphClient } from '@morphllm/morphsdk';

import {
  API_KEY,
  MORPH_MODEL_EASY,
  MORPH_MODEL_MEDIUM,
  MORPH_MODEL_HARD,
  MORPH_MODEL_DEFAULT,
  MORPH_ROUTER_PROMPT_CACHING_AWARE,
} from '../shared/config';
import type { Part, UserMessage } from '@opencode-ai/sdk';
import type {
  RouterInput,
  RawRouterResult,
  ComplexityLevel,
} from '@morphllm/morphsdk';

// Lazy initialization to allow mocking in tests
let morph: MorphClient | null = null;

const sessionsWithModelSelected = new Set<string>();

function getMorphClient(): MorphClient {
  if (!morph) {
    morph = new MorphClient({ apiKey: API_KEY });
  }
  return morph;
}

function parseModel(s?: string): { providerID: string; modelID: string } {
  if (!s) return { providerID: '', modelID: '' };
  const [providerID = '', modelID = ''] = s.split('/');
  return { providerID, modelID };
}

function pickModelForDifficulty(difficulty?: ComplexityLevel | string): {
  providerID: string;
  modelID: string;
} {
  const key = String(difficulty).toLowerCase();
  switch (key) {
    case 'easy':
      return parseModel(MORPH_MODEL_EASY);
    case 'medium':
      return parseModel(MORPH_MODEL_MEDIUM);
    case 'hard':
      return parseModel(MORPH_MODEL_HARD);
    default:
      return parseModel(MORPH_MODEL_DEFAULT);
  }
}

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

      if (MORPH_ROUTER_PROMPT_CACHING_AWARE) {
        if (sessionsWithModelSelected.has(input.sessionID)) {
          return;
        }
      }

      const promptText = extractPromptText(output.parts);

      const classifier =
        input.classify ??
        ((args: RouterInput) => getMorphClient().routers.raw.classify(args));

      const classification: RawRouterResult = await classifier({
        input: promptText,
      } as RouterInput);

      const chosen = pickModelForDifficulty(classification?.difficulty);

      const finalProviderID = chosen.providerID || input.model.providerID;
      const finalModelID = chosen.modelID || input.model.modelID;

      input.model.providerID = finalProviderID;
      input.model.modelID = finalModelID;

      if (MORPH_ROUTER_PROMPT_CACHING_AWARE) {
        sessionsWithModelSelected.add(input.sessionID);
      }
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
