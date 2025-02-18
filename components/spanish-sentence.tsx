'use client'
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';
import { getAudio } from '@/lib/tts/tts';

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
        onClick={async () => {
          const url = await getAudio(children as string);
          const audio = new Audio(url);
          audio.play()
            .then(() => {
              console.log('Audio is playing');
            })
            .catch((error) => {
              console.error('Failed to play audio:', error);
            });
        }}
      >
        <PlayIcon size={5} />
      </Button>
    </div>
  );
}
