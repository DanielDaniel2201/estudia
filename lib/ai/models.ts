import { groq } from '@ai-sdk/groq'
import { google } from '@ai-sdk/google';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { deepseek } from '@ai-sdk/deepseek';
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
    'deepseek-r1': wrapLanguageModel({
      model: deepseek('deepseek-reasoner'),
      middleware: extractReasoningMiddleware({ tagName: 'think' })
    }),

    'deepseek-r1-distill-llama-70b': wrapLanguageModel({
      model: groq('deepseek-r1-distill-llama-70b'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    // 'deepseek-r1-distill-qwen-32b': wrapLanguageModel({
      //   model: groq('deepseek-r1-distill-qwen-32b'),
      //   middleware: extractReasoningMiddleware({ tagName: 'think' }),
      // }),
    'deepseek-r1-openrouter': wrapLanguageModel({
      model: openrouter('deepseek/deepseek-r1:free'),
      middleware: extractReasoningMiddleware({ tagName: 'think' })
    }),
    'gemini-2.0-flash-thinking-exp': wrapLanguageModel({
      model: google('gemini-2.0-flash-thinking-exp'),
      middleware: extractReasoningMiddleware({ tagName: 'think' })
    }),
    
    // chat models
    'deepseek-v3': deepseek('deepseek-chat'),
    'llama-3.3-70b-versatile': groq('llama-3.3-70b-versatile'),
    'qwen-2.5-32b': groq('qwen-2.5-32b'),
    'llama-3.1-8b-instant': groq('llama-3.1-8b-instant'),
    'mixtral-8x7b-32768': groq('mixtral-8x7b-32768'),
    
    'deepseek-v3-openrouter': openrouter('deepseek/deepseek-chat:free'),
    'gemini-2.0-flash-openrouter': openrouter('google/gemini-2.0-flash-exp:free'),

    'gemini-2.0-pro' : google('gemini-2.0-pro-exp-02-05'),
    'gemini-2.0-flash': google('gemini-2.0-flash'),
    'gemini-2.0-flash-lite': google('gemini-2.0-flash-lite-001'),
    'learnlm-1.5': google('learnlm-1.5-pro-experimental'),

    // util models
    // 'title-model': google('gemini-2.0-flash-lite-preview-02-05'),
    'title-model': groq('llama-3.1-8b-instant'),
    'block-model': groq('mixtral-8x7b-32768'),
    'identify-is-word-query': google('gemini-2.0-flash-exp'),
    'eval-model': google('gemini-2.0-flash-001'),
  },
  textEmbeddingModels: {
    'text-embedding': google.textEmbeddingModel('text-embedding-004'),
  }
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'deepseek-v3',
    name: 'Quick Q&A',
    description: 'Get straight to the point for direct questions'
  },
  {
    id: 'gemini-2.0-pro',
    name: 'Roleplay',
    description: 'Virtual life scene to practive conversation'
  },
  {
    id: 'deepseek-r1',
    name: 'Deep-Dive',
    description: 'Deep dive into grammar, literature, and linguistics',
  },
  // {
  //   id: 'learnlm-1.5',
  //   name: 'learnlm-1.5',
  //   description: 'specifically aligned with learning science principles'
  // },
  // {
  //   id: 'gemini-2.0-flash-lite',
  //   name: 'gemini-2.0-flash-lite',
  //   description: 'cost effective and low latency',
  // },
  // {
  //   id: 'deepseek-r1',
  //   name: 'deepseek-r1',
  //   description: 'flagship reasoning model, may suffer latency'
  // },
  // {
  //   id: 'gemini-2.0-flash-openrouter',
  //   name: 'gemini-2.0-flash-openrouter',
  //   description: 'gemini from google through openrouter'
  // // },
  // {
  //   id: 'qwen-2.5-32b',
  //   name: 'qwen-2.5-32b',
  //   description: 'general-purpose chat model',
  // },
  // {
  //   id: 'deepseek-v3',
  //   name: 'deepseek-v3',
  //   description: 'free version, may suffer severe latency'
  // },
  // {
  //   id: 'gemini-1206',
  //   name: 'gemini-1206',
  //   description: 'powerfull for complex tasks, may suffer from rate limit'
  // },

  // {
  //   id: 'gemini-2.0-flash-thinking-exp',
  //   name: 'gemini-2.0-flash-thinking-exp',
  //   description: 'reasoning model'
  // }
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
