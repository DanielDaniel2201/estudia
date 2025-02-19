'use client'
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';
import { getAudio } from '@/lib/tts/tts';

export function SpanishSentence({ children }: {
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex w-full items-center">
      <span className="bg-blue-50 text-gray-800 px-2 py-2.5 rounded-lg scale-y-90 mr-4">
        {children}
      </span>
      <Button
        variant="outline"
        className="order-2 md:order-1 px-3 py-2.5 ml-auto md:ml-0 text-base 
              rounded-3xl shadow-md hover:shadow-lg 
              bg-gradient-to-r from-blue-200 to-purple-200 
              hover:scale-105 hover:brightness-110 
              text-white font-medium transition-all duration-300 ease-in-out"
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
    </span>
  );
}
