'use client'
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';
import { generateSpeech } from '@/lib/tts/tts';

export function SpanishSentence({ children }: {
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full items-center">
      <span className="bg-blue-50 text-gray-800 px-2 py-1 rounded-lg">
        {children}
      </span>
      <Button
        variant="outline"
        className="order-2 md:order-1 md:px-2 py-2 md:h-fit ml-auto md:ml-0 text-lg"
        onClick={() => {
          generateSpeech(children as string)
        }}
      >
        <PlayIcon size={5} />
      </Button>
    </div>
  );
}
