import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import path from 'path';
import { createWriteStream, createReadStream, existsSync, unlinkSync } from 'fs';
import { mkdir } from 'fs/promises';
import { Groq } from 'groq-sdk';

const DOWNLOAD_DIR = path.join(process.cwd(), 'downloads');

async function download_video_url(videoUrl: string) {
  try {
    if (!ytdl.validateURL(videoUrl)) {
      return NextResponse.json({ error: '无效的 Video URL' }, { status: 400 });
    }

    await mkdir(DOWNLOAD_DIR, { recursive: true });

    // 获取视频信息
    const info = await ytdl.getInfo(videoUrl);
    const videoId = info.videoDetails.videoId;
    const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '') || 'audio';
    console.log(videoTitle);

    // 文件路径
    const fileName = `${videoId}.mp3`;
    const filePath = path.join(DOWNLOAD_DIR, fileName);

    // 选择最佳音频格式
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
    if (!audioFormat) {
      return NextResponse.json({ error: '无法找到合适的音频格式' }, { status: 400 });
    }

    const fileStream = createWriteStream(filePath);
    ytdl(videoUrl, { format: audioFormat }).pipe(fileStream);

    // 等待文件下载完成
    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    return {
      success: true,
      filePath,
      fileName,
      videoId,
      title: info.videoDetails.title,
      alreadyExists: false,
    };
  } catch (error: any) {
    console.error('下载过程中发生错误:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();
    const result = await download_video_url(videoUrl);
    const data = result as {
      success: boolean;
      filePath: string;
      fileName: string;
      videoId: string;
      title: string;
      alreadyExists: boolean;
    };

    const groq = new Groq();

    const transcription = await groq.audio.transcriptions.create({
      file: createReadStream(data.filePath),
      model: 'whisper-large-v3-turbo',
      response_format: 'json',
      language: 'es',
      temperature: 0.0,
    });
    
    const tr_download_dir = path.join(process.cwd(), 'tmp');

    const origianlFileName = data.fileName;
    const transcriptionFileName = origianlFileName.replace('.mp3', '.txt');
    const transcriptionFilePath = path.join(tr_download_dir, transcriptionFileName);

    
    
    // 创建写流并将转录文本写入文件
    const fileStream = createWriteStream(transcriptionFilePath);
    fileStream.write(transcription.text);
    fileStream.end();
    
    // 等待文件写入完成
    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    const origianlFilePath = path.join(process.cwd(), 'downloads', origianlFileName);
    if (existsSync(origianlFilePath)) {
      unlinkSync(origianlFilePath);
      console.log(`已删除文件: ${origianlFilePath}`);
    } else {
      console.log('文件不存在:', origianlFilePath);
    }

    return NextResponse.json({
      success: true,
      transcriptionFilePath: transcriptionFilePath,
    });
  } catch (error) {
    console.error('Error processing YouTube link:', error);
    return new Response('Error processing YouTube link', { status: 500 });
  }
}
