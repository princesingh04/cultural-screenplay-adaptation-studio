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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nHere is the Screenplay to adapt:\n${scriptText}` }] },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const responseText = response.text || '';
    const parsedData = JSON.parse(responseText);

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
