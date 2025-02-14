import { groq } from '@ai-sdk/groq'
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

export const DEFAULT_CHAT_MODEL: string = 'deepseek-r1-distill-qwen-32b';

export const myProvider = customProvider({
  languageModels: {
    // reasoning models:
    'deepseek-r1-distill-llama-70b': wrapLanguageModel({
      model: groq('deepseek-r1-distill-llama-70b'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'deepseek-r1-distill-qwen-32b': wrapLanguageModel({
      model: groq('deepseek-r1-distill-qwen-32b'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),

    // chat models
    'llama-3.3-70b-versatile': groq('llama-3.3-70b-versatile'),
    'qwen-2.5-32b': groq('qwen-2.5-32b'),
    'llama-3.1-8b-instant': groq('llama-3.1-8b-instant'),
    'mixtral-8x7b-32768': groq('mixtral-8x7b-32768'),

    // util models
    'title-model': groq('qwen-2.5-32b'),
    'block-model': groq('mixtral-8x7b-32768'),
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  // {
  //   id: 'llama-3.3-70b-versatile',
  //   name: 'llama-3.3-70b-versatile',
  //   description: 'Versatile model for fast, general-purpose tasks.',
  // },
  {
    id: 'deepseek-r1-distill-qwen-32b',
    name: 'deepseek-r1-distill-qwen-32b',
    description: 'For communication in Chinese',
  },
  {
    id: 'deepseek-r1-distill-llama-70b',
    name: 'deepseek-r1-distill-llama-70b',
    description: 'For communication in languages other than Chinese',
  },
  // {
  //   id: 'qwen-2.5-32b',
  //   name: 'qwen-2.5-32b',
  //   description: 'Optimized for chat and dialogue tasks',
  // },
  // {
  //   id: 'llama-3.1-8b-instant',
  //   name: 'llama-3.1-8b-instant',
  //   description: 'Fast and efficient 8B parameter model',
  // },
  // {
  //   id: 'mixtral-8x7b-32768',
  //   name: 'mixtral-8x7b-32768',
  //   description: 'Powerful mixture of experts model',
  // },
];
