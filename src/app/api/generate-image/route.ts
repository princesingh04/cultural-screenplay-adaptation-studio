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

    // Try Gemini image generation
    let imageBase64: string | undefined;

    try {
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt,
        config: {
          numberOfImages: 1,
          aspectRatio: aspectRatio || '3:4',
          outputMimeType: 'image/jpeg',
        },
      });
      imageBase64 = response.generatedImages?.[0]?.image?.imageBytes;
    } catch (modelErr: any) {
      // If enterprise imagen fails, attempt multimodal generateContent
      try {
        const genRes = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: `Generate an image: ${prompt}`,
        });
        const candidate = genRes.candidates?.[0];
        const part = candidate?.content?.parts?.find((p: any) => p.inlineData?.data);
        if (part?.inlineData?.data) {
          imageBase64 = part.inlineData.data;
        } else {
          throw modelErr;
        }
      } catch (fallbackErr: any) {
        throw modelErr;
      }
    }

    if (!imageBase64) {
      throw new Error('Image generation produced no image data');
    }

    return NextResponse.json({
      success: true,
      imageUrl: `data:image/jpeg;base64,${imageBase64}`,
    });
  } catch (err: any) {
    console.error('Image generation error:', err);
    const msg = err.message || '';
    const isQuota = msg.includes('quota') || msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('limit: 0');
    
    return NextResponse.json(
      {
        success: false,
        error: isQuota
          ? 'Google Gemini API key verified. Note: Google AI Studio requires a linked billing account to unlock image generation tokens. Using canonical visual pack asset.'
          : err.message || 'Image generation failed',
        isQuotaLimit: isQuota,
      },
      { status: 200 }
    );
  }
}
