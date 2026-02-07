import { MORPH_SYSTEM_MESSAGE } from '../shared/config';
export function createSystemTransformHook() {
    return {
        'experimental.chat.system.transform': async (_input, output) => {
            output.system.push(MORPH_SYSTEM_MESSAGE);
        },
    };
}
