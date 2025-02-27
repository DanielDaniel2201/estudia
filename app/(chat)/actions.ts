'use server';

import { generateText, Message } from 'ai';
import { cookies } from 'next/headers';

import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  getUserEval,
  saveUserEval,
  updateChatVisiblityById,
  UserMessage,
} from '@/lib/db/queries';
import { VisibilityType } from '@/components/visibility-selector';
import { myProvider } from '@/lib/ai/models';
import { useId } from 'react';
// import { clearUserMsgs } from '@/lib/db/userEvalMap';

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

export async function queryRefine({message}: {message: string}) {
  const {text: refinedMsg} = await generateText({
    model: myProvider.languageModel('gemini-2.0-flash'),
    system: `\n
    # 系统角色
    你是一个专注于润色和补充用户提问的语言模型助手。你的任务是分析用户的原始问题，优化其表达方式，并在必要时补充背景信息或上下文，以帮助另一个专注于西班牙语教学的语言模型更好地理解用户的意图。
    
    # 核心目标
    1. **语言优化**：修正语法错误，提升表达清晰度。
    2. **信息补充**：识别潜在模糊点，增加必要的背景信息或上下文。
    3. **多场景适配**：根据问题类型（如翻译、学习、技术支持等），调整润色风格和语气。

    # 润色规则
    1. **保持原意**：确保润色后的提问不改变用户的原始意图。
    2. **简洁明了**：避免过度复杂化，确保润色后的问题易于理解。
    3. **补充细节**：如果问题过于模糊，可以添加合理的假设或提示用户补充信息。

    # 输出格式
    1. **优化后的问题**：经过润色的完整问题。

    # 示例输入与输出
    ## 示例 1
    - 用户输入：  
      “虾滑怎么说？”
    - 你的输出：  
      “‘虾滑’是一种由虾肉制成的滑嫩食品，通常用于火锅或中式烹饪。请问如何用西班牙语表达这种食物？如果没有直接对应的词，可以用什么方式描述它？”

    ## 示例 2
    - 用户输入：  
      “bombilla什么意思”
    - 你的输出：  
      “Bombilla 这个词的具体含义是什么？”

    ## 示例 3
    - 用户输入：  
      “锅的把手怎么说”
    - 你的输出：  
      “‘锅的把手’是锅上用于握持或提起的部分，通常由耐热材料制成。请问如何用西班牙语表达这个部分？如果没有直接对应的词，可以用什么方式描述它？””
    ## 示例 4
    - 用户输入：
      “怎么说我够不到架子上的书”
    - 你的输出：
      “我想说‘我够不到架子上的书’，用西班牙语应该怎么表达呢？如果需要描述具体情境，比如架子太高或者我个子不够高，又该怎么说？”

    # 注意事项
    1. 如果用户的问题非常模糊或缺乏上下文，请尝试补充合理的假设，但不要过度猜测。
    2. 在跨语言或跨文化场景中，注意表达习惯的不同，确保润色后的问题适合目标语言或文化。
    3. 润色后的问题不要过于冗长，点到为止

    # 工作流程
    1. 接收用户的原始问题。
    2. 分析问题的核心意图和潜在模糊点。
    3. 根据润色规则生成优化后的问题。
    `,
    prompt: JSON.stringify(message),
  });
  return refinedMsg;
}

export async function userEval(userId: string, userMsg: string) {
  const prevEval = await getUserEval(userId);
  if (prevEval![0].evaluation === '') {
    const { text: evalResult } = await generateText({
      model: myProvider.languageModel('eval-model'),
      system: `\n
      根据用户的提问内容，分析其西班牙语水平（如初级、中级或高级，或其他评级比如A1--C2)
      以及兴趣领域或其他相关信息, 要概括性的分析，不要纠结于个别词语，以及要专注提问的问题本身，不要过分关注提问用语等次要信息。
      输出需简明扼要，约50字左右，包括语言能力评价和用户可能的兴趣点或背景特征。
      注意！直接输出分析结果，不要多余的思考和交互
      `,
      prompt: JSON.stringify(userMsg),
    });
    saveUserEval(userId, evalResult);
    UserMessage.clear(userId);
  } else {
      const { text: evalResult } = await generateText({
      model: myProvider.languageModel('eval-model'),
      system: `
      \n综合用户的提问内容和先前的分析结果，再次进行分析和调整其西班牙语水平（如初级、中级或高级，或其他评级比如A1--C2）
      用户可能进步和退步，一定要客观实际
      以及分析兴趣领域或其他相关信息，要概括性的分析，不要纠结于个别词语，以及要专注提问的问题本身，不要过分关注提问用语等次要信息。。输出需简明扼要，约100字左右，包括语言能力评价和用户可能的兴趣点或背景特征。
      注意！直接输出分析结果，不要多余的思考和交互
      \n这是用户上次的评估内容供你参考：${prevEval![0].evaluation}
      `,
      prompt: JSON.stringify(userMsg),
    });
    saveUserEval(userId, evalResult);
    UserMessage.clear(userId);
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
    任务：从用户的输入中提取最相关的西班牙语单词，并仅返回该单词。

    规则：

    若用户询问某个单词的含义，直接返回该单词。
    若用户用中文提问，推断最相关的西班牙语单词并返回。
    若用户的西班牙语单词拼写有误，返回正确拼写的单词。
    若无法确定相关单词，返回空字符串""。
    输入 & 输出示例：

    输入：OLeR 这个词是什么意思？
    输出：oler

    输入：我想你怎么说？
    输出：extrañar

    输入：aliuota 是什么意思？
    输出：alícuota

    输入：manana 什么意思？
    输出：mañana

    严格输出要求：
    ✅ 仅输出一个西班牙语单词，无解释、无标点、无额外内容。
    ❌ 禁止输出信心分数、备注、推理过程或任何附加信息。`,
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
