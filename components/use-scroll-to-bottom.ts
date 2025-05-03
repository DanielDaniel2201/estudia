import { useEffect, useRef, type RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      // 记录旧的 scrollHeight，用于判断内容是否真正增加
      let prevScrollHeight = container.scrollHeight;

      const observer = new MutationObserver(() => {
        // --- 添加这里的条件判断 ---
        const currentScrollHeight = container.scrollHeight;
        const scrollTop = container.scrollTop;
        const clientHeight = container.clientHeight;

        // 判断用户是否已经在底部附近 (例如，距离底部小于 20px)
        const isAtBottom = currentScrollHeight - scrollTop - clientHeight < 20;

        // 判断内容高度是否真正增加了 (避免 Tooltip 等非内容变化的触发)
        const contentIncreased = currentScrollHeight > prevScrollHeight;

        // 如果用户已经在底部附近，或者内容高度增加了（比如来了新消息），才滚动
        if (isAtBottom || contentIncreased) {
           // 注意：这里使用了 instant，所以不会有平滑滚动动画
           end.scrollIntoView({ behavior: 'instant', block: 'end' });
        }

        // 更新旧的 scrollHeight
        prevScrollHeight = currentScrollHeight;
        // --- 条件判断结束 ---
      });

      // 仍然监听各种变化，但处理逻辑内部加上了判断
      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      // 初始渲染时也滚动到底部 (可选，取决于你的需求，但对于聊天应用常见)
      // 可以在这里或者 Messages 组件的 useEffect 里加一个初始滚动
       end.scrollIntoView({ behavior: 'instant', block: 'end' });


      return () => observer.disconnect();
    }
     // 初始渲染时如果容器和endRef存在，执行一次滚动
     if (container && end) {
        end.scrollIntoView({ behavior: 'instant', block: 'end' });
     }

  }, []); // effect 只运行一次

  return [containerRef, endRef];
}