import { groq } from '@ai-sdk/groq'
import { google } from '@ai-sdk/google';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { wrap } from 'module';

export const DEFAULT_CHAT_MODEL: string = 'gemini-2.0-flash';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
})

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
    'deepseek-r1': wrapLanguageModel({
      model: openrouter('deepseek/deepseek-r1:free'),
      middleware: extractReasoningMiddleware({ tagName: 'think' })
    }),
    // 'gemini-2.0-flash-thinking-exp': wrapLanguageModel({
      // middleware: extractReasoningMiddleware({ tagName: 'think' })
      // }),
      
      // chat models
      'llama-3.3-70b-versatile': groq('llama-3.3-70b-versatile'),
      'qwen-2.5-32b': groq('qwen-2.5-32b'),
      'llama-3.1-8b-instant': groq('llama-3.1-8b-instant'),
      'mixtral-8x7b-32768': groq('mixtral-8x7b-32768'),
      
      'deepseek-v3': openrouter('deepseek/deepseek-chat:free'),
      'gemini-2.0-flash-openrouter': openrouter('google/gemini-2.0-flash-exp:free'),

      'gemini-2.0-pro' : google('gemini-2.0-pro-exp-02-05'),
      'gemini-2.0-flash': google('gemini-2.0-flash'),


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
  //   id: 'deepseek-r1',
  //   name: 'deepseek-r1',
  //   description: 'flagship reasoning model, may suffer latency'
  // },
  // {
  //   id: 'gemini-2.0-flash-openrouter',
  //   name: 'gemini-2.0-flash-openrouter',
  //   description: 'gemini from google through openrouter'
  // },
  {
    id: 'gemini-2.0-flash',
    name: 'gemini-2.0-flash',
    description: ''
  },
  // {
  //   id: 'deepseek-v3',
  //   name: 'deepseek-v3',
  //   description: 'powerful chat model, may suffer latency'
  // },
  {
    id: 'gemini-2.0-pro',
    name: 'gemini-2.0-pro',
    description: 'may suffer from rate limit'
  },
  // {
  //   id: 'llama-3.3-70b-versatile',
  //   name: 'llama-3.3-70b-versatile',
  //   description: 'Versatile model for fast, general-purpose tasks.',
  // },
  // {
  //   id: 'deepseek-r1-distill-qwen-32b',
  //   name: 'deepseek-r1-distill-qwen-32b',
  //   description: 'For communication in Chinese, little latency',
  // },
  // {
  //   id: 'deepseek-r1-distill-llama-70b',
  //   name: 'deepseek-r1-distill-llama-70b',
  //   description: 'For communication in languages other than Chinese',
  // },
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
