// ChatFooter.tsx
import React from 'react';

interface ChatFooterProps {
  email: string;
}

const ChatFooter: React.FC<ChatFooterProps> = ({ email }) => {
  return (
    <div className="text-xs text-gray-500 flex flex-col items-center justify-center py-2">
      <p>AI-generated content may contain inaccuracies.
        Contact: {' '}
        <a
          href={`mailto:${email}`}
          className="text-gray-600 hover:text-gray-800 underline transition-colors duration-300"
        >
          {email}
        </a>
      </p>
    </div>

  );
};

export default ChatFooter;