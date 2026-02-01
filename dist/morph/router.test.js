import { describe, it, expect, vi } from 'bun:test';
vi.mock('@morphllm/morphsdk', () => ({
    MorphClient: vi.fn().mockImplementation(() => ({
        routers: {
            raw: {
                classify: vi.fn(),
            },
        },
    })),
}));
vi.mock('../shared/config', () => ({
    API_KEY: 'sk-test-api-key-123',
    MORPH_MODEL_EASY: 'easy/easy',
    MORPH_MODEL_MEDIUM: 'medium/medium',
    MORPH_MODEL_HARD: 'hard/hard',
    MORPH_MODEL_DEFAULT: 'default/default',
    MORPH_ROUTER_PROMPT_CACHING_AWARE: false,
    MORPH_ROUTER_ENABLED: true,
}));
import { createModelRouterHook, extractPromptText } from './router';
describe('router.ts', () => {
    describe('extractPromptText', () => {
        it('should extract text from parts', () => {
            const parts = [
                { type: 'text', text: 'Hello' },
                { type: 'text', text: 'World' },
            ];
            expect(extractPromptText(parts)).toBe('Hello World');
        });
        it('should handle empty parts', () => {
            const parts = [];
            expect(extractPromptText(parts)).toBe('');
        });
        it('should filter out non-text parts', () => {
            const parts = [
                { type: 'text', text: 'Hello' },
                { type: 'other', text: 'Ignore' },
                { type: 'text', text: 'World' },
            ];
            expect(extractPromptText(parts)).toBe('Hello World');
        });
        it('should handle parts with no text', () => {
            const parts = [
                { type: 'text', text: 'Hello' },
                { type: 'text' },
                { type: 'text', text: 'World' },
            ];
            expect(extractPromptText(parts)).toBe('Hello  World');
        });
        it('should handle all non-text parts', () => {
            const parts = [
                { type: 'image', data: 'base64...' },
                { type: 'tool_use', name: 'bash' },
            ];
            expect(extractPromptText(parts)).toBe('');
        });
    });
    describe('createModelRouterHook', () => {
        it('should return a chat.message hook', () => {
            const hook = createModelRouterHook();
            expect('chat.message' in hook).toBe(true);
            expect(typeof hook['chat.message']).toBe('function');
        });
        it('should call the classifier with the correct input', async () => {
            const hook = createModelRouterHook();
            const classify = vi.fn().mockResolvedValue({ difficulty: 'easy' });
            const input = {
                sessionID: '123',
                classify,
            };
            const output = {
                message: {},
                parts: [{ type: 'text', text: 'test prompt' }],
            };
            await hook['chat.message'](input, output);
            expect(classify).toHaveBeenCalledWith({ input: 'test prompt' });
        });
        it('should assign the correct model based on difficulty', async () => {
            const hook = createModelRouterHook();
            const classify = vi.fn().mockResolvedValue({ difficulty: 'hard' });
            const input = {
                sessionID: '123',
                classify,
            };
            const output = {
                message: {},
                parts: [{ type: 'text', text: 'test prompt' }],
            };
            await hook['chat.message'](input, output);
            expect(input).toHaveProperty('model');
            expect(input.model.providerID).toBe('hard');
            expect(input.model.modelID).toBe('hard');
        });
        it('should use the default model if no difficulty is returned', async () => {
            const hook = createModelRouterHook();
            const classify = vi.fn().mockResolvedValue({});
            const input = {
                sessionID: '123',
                classify,
            };
            const output = {
                message: {},
                parts: [{ type: 'text', text: 'test prompt' }],
            };
            await hook['chat.message'](input, output);
            expect(input).toHaveProperty('model');
            expect(input.model.providerID).toBe('default');
            expect(input.model.modelID).toBe('default');
        });
        it('should use default model when router returns nothing', async () => {
            const hook = createModelRouterHook();
            const classify = vi.fn().mockResolvedValue({});
            const input = {
                sessionID: '123',
                classify,
            };
            const output = {
                message: {},
                parts: [{ type: 'text', text: 'test prompt' }],
            };
            await hook['chat.message'](input, output);
            expect(input).toHaveProperty('model');
            expect(input.model.providerID).toBe('default');
            expect(input.model.modelID).toBe('default');
        });
        it('should handle classifier throwing an error gracefully', async () => {
            const hook = createModelRouterHook();
            const classify = vi.fn().mockRejectedValue(new Error('API Error'));
            const input = {
                sessionID: '123',
                classify,
            };
            const output = {
                message: {},
                parts: [{ type: 'text', text: 'test prompt' }],
            };
            await expect(hook['chat.message'](input, output)).rejects.toThrow('API Error');
        });
        it('should handle classifier returning null', async () => {
            const hook = createModelRouterHook();
            const classify = vi.fn().mockResolvedValue(null);
            const input = {
                sessionID: '123',
                classify,
            };
            const output = {
                message: {},
                parts: [{ type: 'text', text: 'test prompt' }],
            };
            await hook['chat.message'](input, output);
            expect(input.model.providerID).toBe('default');
            expect(input.model.modelID).toBe('default');
        });
        it('should handle classifier returning undefined difficulty', async () => {
            const hook = createModelRouterHook();
            const classify = vi.fn().mockResolvedValue({ difficulty: undefined });
            const input = {
                sessionID: '123',
                classify,
            };
            const output = {
                message: {},
                parts: [{ type: 'text', text: 'test prompt' }],
            };
            await hook['chat.message'](input, output);
            expect(input.model.providerID).toBe('default');
            expect(input.model.modelID).toBe('default');
        });
        it('should default to default model for invalid difficulty values', async () => {
            const hook = createModelRouterHook();
            const classify = vi.fn().mockResolvedValue({ difficulty: 'ultra-hard' });
            const input = {
                sessionID: '123',
                classify,
            };
            const output = {
                message: {},
                parts: [{ type: 'text', text: 'test prompt' }],
            };
            await hook['chat.message'](input, output);
            expect(input.model.providerID).toBe('default');
            expect(input.model.modelID).toBe('default');
        });
        it('should default to default model for empty string difficulty', async () => {
            const hook = createModelRouterHook();
            const classify = vi.fn().mockResolvedValue({ difficulty: '' });
            const input = {
                sessionID: '123',
                classify,
            };
            const output = {
                message: {},
                parts: [{ type: 'text', text: 'test prompt' }],
            };
            await hook['chat.message'](input, output);
            expect(input.model.providerID).toBe('default');
            expect(input.model.modelID).toBe('default');
        });
        it('should handle case-insensitive difficulty matching', async () => {
            const hook = createModelRouterHook();
            const classify = vi.fn().mockResolvedValue({ difficulty: 'HARD' });
            const input = {
                sessionID: '123',
                classify,
            };
            const output = {
                message: {},
                parts: [{ type: 'text', text: 'test prompt' }],
            };
            await hook['chat.message'](input, output);
            expect(input.model.providerID).toBe('hard');
            expect(input.model.modelID).toBe('hard');
        });
        it('should route all messages when MORPH_ROUTER_PROMPT_CACHING_AWARE is disabled', async () => {
            const hook = createModelRouterHook();
            const classify = vi
                .fn()
                .mockResolvedValueOnce({ difficulty: 'hard' })
                .mockResolvedValueOnce({ difficulty: 'easy' });
            const sessionID = 'session-456';
            const input1 = { sessionID, classify };
            const output1 = {
                message: {},
                parts: [{ type: 'text', text: 'first message' }],
            };
            await hook['chat.message'](input1, output1);
            expect(classify).toHaveBeenCalledTimes(1);
            expect(input1.model.providerID).toBe('hard');
            const input2 = { sessionID, classify };
            const output2 = {
                message: {},
                parts: [{ type: 'text', text: 'second message' }],
            };
            await hook['chat.message'](input2, output2);
            expect(classify).toHaveBeenCalledTimes(2);
            expect(input2.model.providerID).toBe('easy');
        });
    });
});
