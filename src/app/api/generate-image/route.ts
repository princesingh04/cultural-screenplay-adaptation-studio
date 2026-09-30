import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, aspectRatio, userApiKey, togetherApiKey, seed } = body;
    const activeTogetherKey = togetherApiKey || process.env.TOGETHER_API_KEY;
    const activeGeminiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    // 1. If Together AI API key is available, use FLUX.1.1-pro ($0.04/image)
    if (activeTogetherKey) {
      try {
        const isLandscape = aspectRatio === '16:9';
        // Both dimensions must be multiples of 32 for FLUX
        const width = isLandscape ? 1024 : 768;
        const height = isLandscape ? 576 : 1024;

        const fluxPayload: Record<string, any> = {
          model: 'black-forest-labs/FLUX.1.1-pro',
          prompt,
          width,
          height,
          n: 1,
          response_format: 'b64_json',
        };
        if (typeof seed === 'number' && !isNaN(seed)) {
          fluxPayload.seed = seed;
        }

        const res = await fetch('https://api.together.xyz/v1/images/generations', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${activeTogetherKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fluxPayload),
        });

        const data = await res.json().catch(() => ({}));
        const item = data.data?.[0];
        if (res.ok && item) {
          const imageUrl = item.b64_json
            ? `data:image/jpeg;base64,${item.b64_json}`
            : item.url;
          return NextResponse.json({
            success: true,
            imageUrl,
            model: 'FLUX.1.1-pro (Together AI)',
          });
        } else if (data.error?.code === 'third_party_data_sharing_blocked') {
          return NextResponse.json({
            success: false,
            error: 'Together AI requires third-party data sharing for FLUX models. Go to api.together.ai -> Settings -> Privacy -> enable "Allow passthrough models".',
          }, { status: 403 });
        } else {
          const errMsg = data.error?.message
            || (typeof data.error === 'string' ? data.error : null)
            || data.message
            || (res.status === 401 ? 'Invalid Together AI API Key. Please verify your TOGETHER_API_KEY.' : `Together AI Error (${res.status})`);
          console.warn('Together AI response error:', errMsg);
          return NextResponse.json({
            success: false,
            error: errMsg,
          }, { status: res.status >= 400 ? res.status : 400 });
        }
      } catch (fluxErr: any) {
        console.error('Together AI generation failed:', fluxErr);
        return NextResponse.json({
          success: false,
          error: fluxErr.message || 'Together AI connection failed',
        }, { status: 500 });
      }
    }

    if (!activeGeminiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'No TOGETHER_API_KEY or GEMINI_API_KEY found. Configure your key in Settings to generate live images.',
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: activeGeminiKey });

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
