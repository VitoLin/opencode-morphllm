import { MorphClient } from '@morphllm/morphsdk';
import { API_KEY } from './const';
const morph = new MorphClient({ apiKey: API_KEY });
export function morphModelRouter(userQuery) {
  return morph.routers.raw.classify({
    input: userQuery,
  });
}
export function createModelRouterHook() {
  return {
    'chat.message': async (input, output) => {
      input.model = input.model ?? { providerID: '', modelID: '' };
      const promptText = extractPromptText(output.parts);
      const classifier =
        input.classify ?? ((args) => morph.routers.raw.classify(args));
      const classification = await classifier({
        input: promptText,
      });
      // TODO: allow for user config
      const pickModelForDifficulty = (difficulty) => {
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
export function extractPromptText(parts) {
  return parts
    .filter((p) => p.type === 'text')
    .map((p) => p.text || '')
    .join(' ');
}
