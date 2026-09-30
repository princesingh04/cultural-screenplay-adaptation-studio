import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, aspectRatio, userApiKey } = body;
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'No GEMINI_API_KEY found. Configure your key in Settings to generate live images.',
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: aspectRatio || '3:4',
        outputMimeType: 'image/jpeg',
      },
    });

    const imageBase64 = response.generatedImages?.[0]?.image?.imageBytes;
    if (!imageBase64) {
      throw new Error('Image generation produced no image data');
    }

    return NextResponse.json({
      success: true,
      imageUrl: `data:image/jpeg;base64,${imageBase64}`,
    });
  } catch (err: any) {
    console.error('Image generation error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Image generation failed',
      },
      { status: 500 }
    );
  }
}
