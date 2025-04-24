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
    'learnlm-1.5': google('learnlm-1.5-pro-experimental'),
    
    'deepseek-v3': deepseek('deepseek-chat'),
    
    // util models
    'title-model': google('gemini-2.0-flash-001'),
    'block-model': google('gemini-2.0-flash-001'),
    'identify-is-word-query': google('gemini-2.0-flash-001'),
    'eval-model': google('gemini-2.0-flash-001'),
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
    name: 'Quick Lookup',
    description: ''
  },
  {
    id: 'gemini-2.0-pro',
    name: 'Deep Dive',
    description: ''
  },
];
