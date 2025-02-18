'use server';
import { getAudioUrl, saveAudioUrl } from '../db/queries';

async function generateAudio(content: string): Promise<string> {
  const data = JSON.stringify({
    voiceId: "es-ES-carmen",
    style: "Conversational",
    text: content,
    rate: -11,
    pitch: -13,
    sampleRate: 48000,
    format: "MP3",
    channelType: "MONO",
    pronunciationDictionary: {},
    encodeAsBase64: false,
    variation: 1,
    audioDuration: 0,
    modelVersion: "GEN2",
    multiNativeLocale: "es-ES"
  });
  
  try {
    const response = await fetch('https://api.murf.ai/v1/speech/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': process.env.MURF_API_KEY as string,
      },
      body: data,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const resultUrl = await response.json();
    return resultUrl.audioFile;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
}


export async function getAudio(content: string): Promise<string> {
  // try to find if the url has been stored in the database to avoid regeneration
  const audioUrl = getAudioUrl(content);
  const data = await audioUrl;
  
  // pre-generated url
  if (data.length > 0) {
    const url = data[0].audio_url
    return url;
    // generating the audio for the 1st time and storing it
  } else {
    const url = await generateAudio(content);
    console.log(url);
    saveAudioUrl({content: content, audio_url: url})
    return url as string;
  }
}
