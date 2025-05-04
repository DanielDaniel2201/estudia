import { google } from '@ai-sdk/google';
import { deepseek } from '@ai-sdk/deepseek';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

export const DEFAULT_CHAT_MODEL: string = 'gemini-2.5-flash';

export const myProvider = customProvider({
  languageModels: {
    // reasoning models:
    'deepseek-r1': wrapLanguageModel({
      model: deepseek('deepseek-reasoner'),
      middleware: extractReasoningMiddleware({ tagName: 'think' })
    }),

    // chat models
    'gemini-2.0-pro' : google('gemini-2.0-pro-exp-02-05'),
    'gemini-2.0-flash': google('gemini-2.0-flash'),
    'gemini-2.0-flash-lite': google('gemini-2.0-flash-lite-001'),
    'gemini-2.5-flash': google('gemini-2.5-flash-preview-04-17'),
    
    'deepseek-v3': deepseek('deepseek-chat'),
    
    // util models
    'block-model': google('gemini-2.0-flash'),
    'title-model': google('gemini-2.0-flash'),
    'identify-is-word-query': google('gemini-2.0-flash'),
    'eval-model': google('gemini-2.0-flash'),
    'summarize-model': google('gemini-2.0-flash'),
  }
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'gemini-2.5-flash',
    name: '快问快答',
    description: ''
  },
    {
    id: 'gemini-2.0-pro',
    name: '深入探讨',
    description: ''
  },
];
