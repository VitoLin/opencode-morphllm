import { describe, it, expect, vi } from 'bun:test';
import type { Part } from '@opencode-ai/sdk';

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
}));

import { createModelRouterHook, extractPromptText } from './router';

describe('router.ts', () => {
  describe('extractPromptText', () => {
    it('should extract text from parts', () => {
      const parts: Part[] = [
        { type: 'text', text: 'Hello' },
        { type: 'text', text: 'World' },
      ] as any;
      expect(extractPromptText(parts)).toBe('Hello World');
    });

    it('should handle empty parts', () => {
      const parts: Part[] = [];
      expect(extractPromptText(parts)).toBe('');
    });

    it('should filter out non-text parts', () => {
      const parts: Part[] = [
        { type: 'text', text: 'Hello' },
        { type: 'other', text: 'Ignore' },
        { type: 'text', text: 'World' },
      ] as any;
      expect(extractPromptText(parts)).toBe('Hello World');
    });

    it('should handle parts with no text', () => {
      const parts: Part[] = [
        { type: 'text', text: 'Hello' },
        { type: 'text' },
        { type: 'text', text: 'World' },
      ] as any;
      expect(extractPromptText(parts)).toBe('Hello  World');
    });

    it('should handle all non-text parts', () => {
      const parts: Part[] = [
        { type: 'image', data: 'base64...' },
        { type: 'tool_use', name: 'bash' },
      ] as any;
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
        message: {} as any,
        parts: [{ type: 'text', text: 'test prompt' }],
      } as any;
      await hook['chat.message'](input as any, output);
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
        message: {} as any,
        parts: [{ type: 'text', text: 'test prompt' }],
      } as any;
      await hook['chat.message'](input as any, output);
      expect(input).toHaveProperty('model');
      expect((input as any).model.providerID).toBe('hard');
      expect((input as any).model.modelID).toBe('hard');
    });

    it('should use the default model if no difficulty is returned', async () => {
      const hook = createModelRouterHook();
      const classify = vi.fn().mockResolvedValue({});
      const input = {
        sessionID: '123',
        classify,
      };
      const output = {
        message: {} as any,
        parts: [{ type: 'text', text: 'test prompt' }],
      } as any;
      await hook['chat.message'](input as any, output);
      expect(input).toHaveProperty('model');
      expect((input as any).model.providerID).toBe('default');
      expect((input as any).model.modelID).toBe('default');
    });

    it('should use default model when router returns nothing', async () => {
      const hook = createModelRouterHook();
      const classify = vi.fn().mockResolvedValue({});
      const input = {
        sessionID: '123',
        classify,
      };
      const output = {
        message: {} as any,
        parts: [{ type: 'text', text: 'test prompt' }],
      } as any;
      await hook['chat.message'](input as any, output);
      expect(input).toHaveProperty('model');
      expect((input as any).model.providerID).toBe('default');
      expect((input as any).model.modelID).toBe('default');
    });

    it('should handle classifier throwing an error gracefully', async () => {
      const hook = createModelRouterHook();
      const classify = vi.fn().mockRejectedValue(new Error('API Error'));
      const input = {
        sessionID: '123',
        classify,
      };
      const output = {
        message: {} as any,
        parts: [{ type: 'text', text: 'test prompt' }],
      } as any;

      await expect(hook['chat.message'](input as any, output)).rejects.toThrow(
        'API Error'
      );
    });

    it('should handle classifier returning null', async () => {
      const hook = createModelRouterHook();
      const classify = vi.fn().mockResolvedValue(null);
      const input = {
        sessionID: '123',
        classify,
      };
      const output = {
        message: {} as any,
        parts: [{ type: 'text', text: 'test prompt' }],
      } as any;
      await hook['chat.message'](input as any, output);
      expect((input as any).model.providerID).toBe('default');
      expect((input as any).model.modelID).toBe('default');
    });

    it('should handle classifier returning undefined difficulty', async () => {
      const hook = createModelRouterHook();
      const classify = vi.fn().mockResolvedValue({ difficulty: undefined });
      const input = {
        sessionID: '123',
        classify,
      };
      const output = {
        message: {} as any,
        parts: [{ type: 'text', text: 'test prompt' }],
      } as any;
      await hook['chat.message'](input as any, output);
      expect((input as any).model.providerID).toBe('default');
      expect((input as any).model.modelID).toBe('default');
    });

    it('should default to default model for invalid difficulty values', async () => {
      const hook = createModelRouterHook();
      const classify = vi.fn().mockResolvedValue({ difficulty: 'ultra-hard' });
      const input = {
        sessionID: '123',
        classify,
      };
      const output = {
        message: {} as any,
        parts: [{ type: 'text', text: 'test prompt' }],
      } as any;
      await hook['chat.message'](input as any, output);
      expect((input as any).model.providerID).toBe('default');
      expect((input as any).model.modelID).toBe('default');
    });

    it('should default to default model for empty string difficulty', async () => {
      const hook = createModelRouterHook();
      const classify = vi.fn().mockResolvedValue({ difficulty: '' });
      const input = {
        sessionID: '123',
        classify,
      };
      const output = {
        message: {} as any,
        parts: [{ type: 'text', text: 'test prompt' }],
      } as any;
      await hook['chat.message'](input as any, output);
      expect((input as any).model.providerID).toBe('default');
      expect((input as any).model.modelID).toBe('default');
    });

    it('should handle case-insensitive difficulty matching', async () => {
      const hook = createModelRouterHook();
      const classify = vi.fn().mockResolvedValue({ difficulty: 'HARD' });
      const input = {
        sessionID: '123',
        classify,
      };
      const output = {
        message: {} as any,
        parts: [{ type: 'text', text: 'test prompt' }],
      } as any;
      await hook['chat.message'](input as any, output);
      expect((input as any).model.providerID).toBe('hard');
      expect((input as any).model.modelID).toBe('hard');
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
        message: {} as any,
        parts: [{ type: 'text', text: 'first message' }],
      } as any;

      await hook['chat.message'](input1 as any, output1);
      expect(classify).toHaveBeenCalledTimes(1);
      expect((input1 as any).model.providerID).toBe('hard');

      const input2 = { sessionID, classify };
      const output2 = {
        message: {} as any,
        parts: [{ type: 'text', text: 'second message' }],
      } as any;

      await hook['chat.message'](input2 as any, output2);
      expect(classify).toHaveBeenCalledTimes(2);
      expect((input2 as any).model.providerID).toBe('easy');
    });
  });
});
