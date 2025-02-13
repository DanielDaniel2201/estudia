import { openai } from '@ai-sdk/openai';
import { fireworks } from '@ai-sdk/fireworks';
import { groq } from '@ai-sdk/groq'
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

export const DEFAULT_CHAT_MODEL: string = 'Deepseek-R1-Distilled-Llama-70B';

export const myProvider = customProvider({
  languageModels: {
    // 'chat-model-small': openai('gpt-4o-mini'),
    // 'chat-model-large': openai('gpt-4o'),
    // 'chat-model-reasoning': wrapLanguageModel({
    //   model: fireworks('accounts/fireworks/models/deepseek-r1'),
    //   middleware: extractReasoningMiddleware({ tagName: 'think' }),
    // }),
    // 'title-model': openai('gpt-4-turbo'),
    // 'block-model': openai('gpt-4o-mini'),
    'chat-model-reasoning': wrapLanguageModel({
      model: groq('deepseek-r1-distill-llama-70b'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': groq('llama-3.3-70b-versatile'),
    'block-model': groq('llama-3.3-70b-versatile'),
    'llama-3.3-70b-versatile': groq('llama-3.3-70b-versatile'),
  },
  // imageModels: {
  //   'small-model': openai.image('dall-e-2'),
  //   'large-model': openai.image('dall-e-3'),
  // },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'llama-3.3-70b-versatile',
    name: 'llama-3.3-70b-versatile',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
];
