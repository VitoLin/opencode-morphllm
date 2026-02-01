import { MorphClient } from '@morphllm/morphsdk';
import { API_KEY, MORPH_MODEL_EASY, MORPH_MODEL_MEDIUM, MORPH_MODEL_HARD, MORPH_MODEL_DEFAULT, MORPH_ROUTER_PROMPT_CACHING_AWARE, MORPH_ROUTER_ENABLED, } from '../shared/config';
// Lazy initialization to allow mocking in tests
let morph = null;
const sessionsWithModelSelected = new Set();
function getMorphClient() {
    if (!morph) {
        morph = new MorphClient({ apiKey: API_KEY });
    }
    return morph;
}
function parseModel(s) {
    if (!s)
        return { providerID: '', modelID: '' };
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
            if (!MORPH_ROUTER_ENABLED) {
                return;
            }
            if (MORPH_ROUTER_PROMPT_CACHING_AWARE) {
                if (sessionsWithModelSelected.has(input.sessionID)) {
                    return;
                }
            }
            const promptText = extractPromptText(output.parts);
            const classifier = input.classify ??
                ((args) => getMorphClient().routers.raw.classify(args));
            const classification = await classifier({
                input: promptText,
            });
            const chosen = pickModelForDifficulty(classification?.difficulty);
            const finalProviderID = chosen.providerID || input.model.providerID;
            const finalModelID = chosen.modelID || input.model.modelID;
            input.model.providerID = finalProviderID;
            input.model.modelID = finalModelID;
            if (MORPH_ROUTER_ENABLED && MORPH_ROUTER_PROMPT_CACHING_AWARE) {
                sessionsWithModelSelected.add(input.sessionID);
            }
        },
    };
}
export function extractPromptText(parts) {
    return parts
        .filter((p) => p.type === 'text')
        .map((p) => p.text || '')
        .join(' ');
}
