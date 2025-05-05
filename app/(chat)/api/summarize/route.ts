import { myProvider } from "@/lib/ai/models";
import { generateText } from "ai";

export async function POST(request: Request) {
  const { response, }: {response: string} = await request.json();
  try {
    const result = await generateText({
      model: myProvider.languageModel("summarize-model"),
      system: `
      你将收到一个关于西班牙语教学的文字内容，格式多为词汇定义、例句、记忆技巧等。你的任务是：
      1. 压缩精炼内容，保留最重要的教学信息。
      2. 输出格式要简洁、清晰，适合直接复制进个人笔记。
      3. 用中文解释概念，但保留核心的西班牙语词汇和表达。
      4. 输出结构如下：
      <原型单词/短语>
      定义: <中文定义，简洁明了>
      短语: <常见搭配用法>
      记忆: <词根、联想或构词技巧，帮助记忆>
      
      示例1：
        输入：
        **Querellarse** 是一个反身动词，意思是**“提出控告”**或**“提起诉讼”**，通常用于法律或正式场合。
        
        <spanish-sentence>El empresario decidió querellarse contra el periódico por difamación.</spanish-sentence> (这位企业家决定以诽谤罪起诉该报纸。)  
        <spanish-sentence>La víctima se querelló ante el juzgado.</spanish-sentence> (受害者向法院提起了诉讼。)  
        
        记忆技巧：  
        - 词根 **querella** 本身指“诉讼”或“控告”，加上反身代词 **-se** 表示动作由主语主动发起。  
        - 联想英语单词 **"quarrel"**（争吵），但 **querellarse** 更正式，专指法律行为。
      
        注意：非法律语境中，类似情绪可用 **quejarse**（抱怨）。

        输出:
        querellarse
        定义: 提出控告/起诉（法律场合）
        短语: querellarse contra alguien (起诉某人)
        记忆: querella(诉讼)+se; 似英语"quarrel",但正式; 日常用quejarse

      示例2：
        输入：
        Concuerda 是动词 concordar 的第三人称单数现在时变位，意思是**一致**、**符合**或**同意**。

        <spanish-sentence>Su versión de los hechos no concuerda con la mía.</spanish-sentence> (他对事实的说法和我的不一致。)
        <spanish-sentence>El resultado del experimento concuerda con la teoría.</spanish-sentence> (实验结果与理论相符。)

        记忆技巧：Concordar 听起来像英语的 "concord" (和谐、一致)，所以意思是**一致**、**符合**。

        输出：
        concordar
        定义: 一致，符合，同意
        短语: concordar con (与...一致)
        记忆: 类似英语 "concord" (和谐、一致)

      `,
      prompt: response,
    });

    return new Response(result.text );
  } catch (error) {
    return new Response("Failed to summarize content", {status: 500});
  }
  
}