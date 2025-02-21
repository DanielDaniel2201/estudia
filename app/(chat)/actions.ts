'use server';

import { generateText, Message } from 'ai';
import { cookies } from 'next/headers';

import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  getUserEval,
  saveUserEval,
  updateChatVisiblityById,
} from '@/lib/db/queries';
import { VisibilityType } from '@/components/visibility-selector';
import { myProvider } from '@/lib/ai/models';
import { useId } from 'react';
import { clearUserMsgs } from '@/lib/db/userEvalMap';

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  const { text: title } = await generateText({
    model: myProvider.languageModel('title-model'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function userEval(userId: string, userMsg: string) {
  const prevEval = await getUserEval(userId);
  if (prevEval![0].evaluation === '') {
    const { text: evalResult } = await generateText({
      model: myProvider.languageModel('eval-model'),
      system: `\n
      根据用户的提问内容，分析其西班牙语水平（如初级、中级或高级，或其他评级比如A1--C2
      以及兴趣领域或其他相关信息。输出需简明扼要，约50字左右，包括语言能力评价和用户可能的兴趣点或背景特征。
      注意！直接输出分析结果，不要多余的思考和交互
      `,
      prompt: JSON.stringify(userMsg),
    });
    saveUserEval(userId, evalResult);
    clearUserMsgs(userId);
  } else {
      const { text: evalResult } = await generateText({
      model: myProvider.languageModel('eval-model'),
      system: `
      \n综合用户的提问内容和先前的分析结果，再次进行分析和调整其西班牙语水平（如初级、中级或高级，或其他评级比如A1--C2）
      用户可能进步和退步，一定要客观实际。
      以及兴趣领域或其他相关信息。输出需简明扼要，约100字左右，包括语言能力评价和用户可能的兴趣点或背景特征。
      注意！直接输出分析结果，不要多余的思考和交互
      \n这是用户上次的评估内容供你参考：${prevEval![0].evaluation}
      `,
      prompt: JSON.stringify(userMsg),
    });
    saveUserEval(userId, evalResult);
    clearUserMsgs(userId);
  }
}

export async function identifyIsWordQuery({
  message,
}: {
  message: Message
}) {
  const { text: word } = await generateText({
    model: myProvider.languageModel('identify-is-word-query'),
    system: `\n
    **任务**：从用户的输入中提取出最相关的西班牙语单词，返回该单词。  
    - 如果用户直接询问某个单词的含义，直接提取该单词并返回。  
    - 如果用户用中文描述了一个情境或问题，根据上下文推断出最相关的西班牙语单词并返回。  

    **输入输出示例**：  
    1. 输入：我想知道“OLeR”这个词是什么意思？  
      输出：oler 

    2. 输入：我想你怎么说？
      输出：extrañar

    3. 输入：aliuota什么意思。  
      输出：alícuota

    4. 输入：manana什么意思
       输出：mañana

    **输出要求**：  
    - 直接输出西班牙语单词，不带任何额外说明、符号或思考过程。  
    - 如果用户提供的西班牙语单词拼写不准确，一定要返回修改正确的单词，比如用户问buho，你要返回búho
    - 如果输入中没有明确的单词或情境无法推断出相关单词，可以返回"0"。`,
    prompt: JSON.stringify(message),
  });
  if (/^[a-záéíóúüñ\s]+$/i.test(word)) {
    const response = await fetch(`https://rae-api.com/api/words/${word.toLowerCase()}`);
    if (response.ok) {
      const data = await response.json();
      return JSON.stringify(data, null, 2);
    }
    return ''
  }
  return '';
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}
