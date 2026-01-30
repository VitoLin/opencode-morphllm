import { MorphClient } from '@morphllm/morphsdk';
import {
  API_KEY,
  MORPH_MODEL_EASY,
  MORPH_MODEL_MEDIUM,
  MORPH_MODEL_HARD,
  MORPH_MODEL_DEFAULT,
} from './const';
const morph = new MorphClient({ apiKey: API_KEY });
function parseModel(s) {
  if (!s) return { providerID: '', modelID: '' };
  const [providerID = '', modelID = ''] = s.split('/');
  return { providerID, modelID };
}
function pickModelForDifficulty(difficulty) {
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
    'chat.message': async (input, output) => {
      input.model = input.model ?? { providerID: '', modelID: '' };
      const promptText = extractPromptText(output.parts);
      const classifier =
        input.classify ?? ((args) => morph.routers.raw.classify(args));
      const classification = await classifier({
        input: promptText,
      });
      const chosen = pickModelForDifficulty(classification?.difficulty);
      const finalProviderID = chosen.providerID || input.model.providerID;
      const finalModelID = chosen.modelID || input.model.modelID;
      console.debug(
        `[Morph Router] Prompt classified as difficulty: ${classification?.difficulty}. Routing to model: ${finalProviderID}/${finalModelID}`
      );
      input.model.providerID = finalProviderID;
      input.model.modelID = finalModelID;
    },
  };
}
export function extractPromptText(parts) {
  return parts
    .filter((p) => p.type === 'text')
    .map((p) => p.text || '')
    .join(' ');
}
