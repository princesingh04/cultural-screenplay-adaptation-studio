import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getCulturalProfile } from '@/data/culturalProfiles';
import { extractScreenplayToProject } from '@/services/extractor';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scriptText, cultureId, setting, outputScript, userApiKey } = body;

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!scriptText || !scriptText.trim()) {
      return NextResponse.json({ error: 'No screenplay text provided' }, { status: 400 });
    }

    const profile = getCulturalProfile(cultureId || 'majhi_punjab');

    // If no API key is provided, use our high-fidelity deterministic engine
    if (!apiKey) {
      const fallbackProject = extractScreenplayToProject(
        scriptText,
        'Culturally Adapted Screenplay',
        cultureId || 'majhi_punjab',
        setting || 'rural',
        outputScript || 'romanized'
      );
      return NextResponse.json({
        success: true,
        project: fallbackProject,
        isAIGenerated: false,
        note: 'Generated via deterministic engine. Configure GEMINI_API_KEY for dynamic LLM generation.',
      });
    }

    // Call Google Gemini API
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are an elite Cultural Adaptation and Continuity Director for an Indian OTT platform.
Your task is to take a screenplay and recreate it inside the exact culture and dialect of "${profile.name}" (${profile.dialect}, ${profile.state} - ${profile.subRegion}).
Setting: ${setting || 'rural'}. Writing script: ${outputScript || 'romanized'}.

Target Cultural Profile:
- Dominant Tone: ${profile.dominantTone}
- Kinship Terms: ${JSON.stringify(profile.kinshipTerms)}
- Honorifics: ${JSON.stringify(profile.honorificRules)}
- Visual Aesthetics: ${JSON.stringify(profile.visualAesthetics)}
- Guidance: ${profile.adaptationGuidance}

Instructions:
1. Extract every scene preserving scene order.
2. Canonicalize Characters: Merge aliases (e.g. "elder son", "Amar", "A. Singh" -> single canonical ID).
3. Track Props: Follow physical props from scene to scene (e.g., an envelope pocketed in Scene 1 must exist in Scene 2).
4. Deep Adaptation: Do not do a word-for-word translation. Rewrite dialogue for regional rhythm, honorifics, kinship, and humor. For every dialogue line provide a "culturalRationale" and a "toneMarker".
5. Return strictly valid JSON matching this schema:
{
  "title": string,
  "characters": [
    {
      "id": string,
      "canonicalName": string,
      "originalName": string,
      "aliases": string[],
      "gender": "male" | "female" | "non-binary",
      "age": number,
      "socialRole": string,
      "personality": string,
      "emotionalArc": string,
      "visualSpec": {
        "facialFeatures": string,
        "grooming": string,
        "bodyLanguage": string,
        "apparentAge": string,
        "lockedSeed": number,
        "promptText": string
      }
    }
  ],
  "costumes": [
    {
      "id": string,
      "characterId": string,
      "name": string,
      "variantNumber": number,
      "garments": string,
      "fabrics": string,
      "colors": string[],
      "footwear": string,
      "headwear": string,
      "jewelry": string,
      "scenesAppearing": string[],
      "visualSpec": {
        "promptText": string,
        "lockedSeed": number
      }
    }
  ],
  "props": [
    {
      "id": string,
      "name": string,
      "description": string,
      "culturalEquivalent": string,
      "scenesInvolved": string[]
    }
  ],
  "scenes": [
    {
      "sceneId": string,
      "sceneNumber": number,
      "heading": string,
      "intExt": "INT" | "EXT",
      "locationId": string,
      "timeOfDay": string,
      "weatherAndAtmosphere": string,
      "mood": string,
      "dramaticPurpose": string,
      "charactersPresent": string[],
      "costumesActive": { [charId: string]: string },
      "propsIn": string[],
      "propsOut": string[],
      "emotionalChange": string,
      "stageDirections": [
        {
          "original": string,
          "adapted": string,
          "culturalDetails": string
        }
      ],
      "adaptedScreenplayLines": [
        {
          "id": string,
          "characterId": string,
          "characterName": string,
          "parenthetical": string,
          "originalText": string,
          "adaptedText": string,
          "phoneticTransliteration": string,
          "toneMarker": string,
          "culturalRationale": string,
          "gestureOrAction": string
        }
      ],
      "keyframeSpec": {
        "cameraFraming": string,
        "characterBlocking": string,
        "lightingTime": string,
        "culturalAtmosphere": string,
        "promptText": string,
        "lockedSeed": number
      }
    }
  ]
}`;

    let responseText = '';
    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.8-flash'];
    let lastErr: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nHere is the Screenplay to adapt:\n${scriptText}` }] },
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
            maxOutputTokens: 8192,
          },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed, trying fallback:`, err.message);
        lastErr = err;
      }
    }

    if (!responseText && process.env.TOGETHER_API_KEY) {
      try {
        console.log('Gemini busy/unavailable. Falling back to Together AI Llama-3.3-70B for adaptation...');
        const togetherRes = await fetch('https://api.together.xyz/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Here is the Screenplay to adapt:\n${scriptText}` }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3,
            max_tokens: 8192,
          }),
        });
        const togetherData = await togetherRes.json();
        if (togetherRes.ok && togetherData.choices?.[0]?.message?.content) {
          responseText = togetherData.choices[0].message.content;
        }
      } catch (tErr: any) {
        console.warn('Together AI fallback also failed:', tErr.message);
      }
    }

    if (!responseText) {
      throw lastErr || new Error('No response generated by AI models');
    }

    let parsedData: any;
    try {
      let cleaned = responseText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      parsedData = JSON.parse(cleaned);
    } catch {
      // Repair truncated JSON if model reached token limit
      let repair = responseText.trim();
      repair = repair.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      // Remove trailing incomplete key-value or dangling comma
      repair = repair.replace(/,\s*"[^"]*":?\s*("[^"]*)?$/, '');
      repair = repair.replace(/,\s*$/, '');
      // Close open string if unclosed
      const quoteCount = (repair.match(/(?<!\\)"/g) || []).length;
      if (quoteCount % 2 !== 0) repair += '"';
      // Close open brackets and braces
      const openBraces = (repair.match(/\{/g) || []).length;
      const closeBraces = (repair.match(/\}/g) || []).length;
      const openBrackets = (repair.match(/\[/g) || []).length;
      const closeBrackets = (repair.match(/\]/g) || []).length;
      for (let i = 0; i < openBrackets - closeBrackets; i++) repair += ']';
      for (let i = 0; i < openBraces - closeBraces; i++) repair += '}';
      parsedData = JSON.parse(repair);
    }

    const fullProject = {
      id: `proj_${Date.now()}`,
      title: parsedData.title || 'The Ancestral Deed',
      sourceScreenplayText: scriptText,
      selectedCultureId: cultureId,
      selectedSetting: setting || 'rural',
      outputScript: outputScript || 'romanized',
      scenes: parsedData.scenes || [],
      characters: parsedData.characters || [],
      costumes: parsedData.costumes || [],
      props: parsedData.props || [],
      locations: [],
      approvalStatus: {
        entitiesApproved: true,
        culturalPlanApproved: true,
        costumesApproved: true,
        visualGenerationUnlocked: true,
      },
      contradictions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      project: fullProject,
      isAIGenerated: true,
    });
  } catch (error: any) {
    console.error('Adaptation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Screenplay adaptation failed' },
      { status: 500 }
    );
  }
}
