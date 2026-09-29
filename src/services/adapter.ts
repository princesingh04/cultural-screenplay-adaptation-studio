import { getCulturalProfile } from '@/data/culturalProfiles';
import { ExtractedScene, ScriptDialogueLine } from '@/types';

export function adaptScreenplayLines(
  scenes: ExtractedScene[],
  cultureId: string,
  outputScript: 'romanized' | 'gurmukhi' | 'devanagari' | 'original-script'
): ExtractedScene[] {
  const profile = getCulturalProfile(cultureId);

  return scenes.map(scene => {
    const adaptedDialogue: ScriptDialogueLine[] = scene.adaptedScreenplayLines.map(line => {
      let adaptedText = line.adaptedText;
      let phonetic = line.phoneticTransliteration;
      let rationale = line.culturalRationale;
      let toneMarker = line.toneMarker;

      if (cultureId === 'marwari_rajasthan') {
        if (line.characterId === 'CHAR_POSTMAN') {
          adaptedText = 'Ram Ram Sa Amar Singh ji! Late Thakur Harjit Singh ji ke naam se Kachehri ka taqeeda aayo hai... Dastakhat chahiye sa.';
          phonetic = 'Ram Ram Sa Amar Singh ji! Late Thakur Harjit Singh ji ke naam se Kachehri ka taqeeda aayo hai... Dastakhat chahiye sa.';
          rationale = 'Uses polite Marwari greeting "Ram Ram Sa" and substitutes eviction notice with "Kachehri ka taqeeda".';
          toneMarker = 'Deferential Formal Service';
        } else if (line.characterId === 'CHAR_AMAR' && line.id === 'DIA_01_02') {
          adaptedText = 'Awaaz mat karo Postman ji... Ahi dyo. Maaji aangan mein jag rahi hain.';
          phonetic = 'Awaaz mat karo Postman ji... Ahi dyo. Maaji aangan mein jag rahi hain.';
          rationale = 'Replaces Bebe with "Maaji" and courtyard with "aangan", preserving veiled discretion.';
        } else if (line.characterId === 'CHAR_BEBE' && line.id === 'DIA_01_03') {
          adaptedText = 'Banna... Eni bhor mein deori pe kaun thyo? Ram Lal ji ri cycle thami kaay?';
          phonetic = 'Banna... Eni bhor mein deori pe kaun thyo? Ram Lal ji ri cycle thami kaay?';
          rationale = 'Maternal address shifts to "Banna" (son of the lineage) and gate becomes "deori".';
        } else if (line.characterId === 'CHAR_KABIR' && line.id === 'DIA_02_01') {
          adaptedText = 'Ghani der lagayi Hukum! Shaam ri paanch baje ri bus jodhpur rawana howegi... Mhaare kanhe time koni.';
          phonetic = 'Ghani der lagayi Hukum! Shaam ri paanch baje ri bus Jodhpur rawana howegi... Mhaare kanhe time koni.';
          rationale = 'Uses "Hukum" with sarcastic tension, anchoring the journey toward Jodhpur.';
        } else if (line.characterId === 'CHAR_BEBE' && line.id === 'DIA_02_04') {
          adaptedText = 'Kabir Banna! Purab ri zameen thaare Daata ri kripa thaki seencheedi hai... Mhaare jeete-ji ek dhool ro kann koni bikan doon!';
          phonetic = 'Kabir Banna! Purab ri zameen thaare Daata ri kripa thaki seencheedi hai... Mhaare jeete-ji ek dhool ro kann koni bikan doon!';
          rationale = 'Anchors the land defense in the sacred memory of "Daata" (father/grandfather) and lineage honor.';
        }
      } else if (cultureId === 'bangru_haryana') {
        if (line.characterId === 'CHAR_POSTMAN') {
          adaptedText = 'Ram Ram bhai Amar! Sarkari notice aaya sai Late Harjit Singh ke naam... Angutha tek de ibbe.';
          phonetic = 'Ram Ram bhai Amar! Sarkari notice aaya sai Late Harjit Singh ke naam... Angutha tek de ibbe.';
          rationale = 'Crisp, unvarnished Haryanvi Bangru address with "sai" and "ibbe" (right now).';
          toneMarker = 'Earthy Directness';
        } else if (line.characterId === 'CHAR_BEBE' && line.id === 'DIA_01_03') {
          adaptedText = 'Ke baat re chhore? Tadhke-tadhke kiska aana ho gaya buhe pe?';
          phonetic = 'Ke baat re chhore? Tadhke-tadhke kiska aana ho gaya buhe pe?';
          rationale = 'Bangru opening "Ke baat re chhore" with matriarchal inquisitiveness.';
        } else if (line.characterId === 'CHAR_KABIR' && line.id === 'DIA_02_01') {
          adaptedText = 'Bhai, ghana time laga diya! Paanch baje aali bus nikal jyagi... Yo khet ka chakkad chhod, batwaare ka bata!';
          phonetic = 'Bhai, ghana time laga diya! Paanch baje aali bus nikal jyagi... Yo khet ka chakkad chhod, batwaare ka bata!';
          rationale = 'Punchy Haryanvi confrontation demanding division directly without pretense.';
        }
      }

      // Output script conversion demonstration (Devanagari / Gurmukhi representation if selected)
      let displayedText = adaptedText;
      if (outputScript === 'devanagari' && cultureId.includes('rajasthan')) {
        // Sample devanagari rendering
        if (line.characterId === 'CHAR_POSTMAN') {
          displayedText = 'राम राम सा अमर सिंह जी! लेट ठाकुर हरजीत सिंह जी के नाम से कचहरी का ताकीदा आयो है...';
        }
      } else if (outputScript === 'gurmukhi' && cultureId.includes('punjab')) {
        if (line.characterId === 'CHAR_POSTMAN') {
          displayedText = 'ਓਏ ਅਮਰਜੀਤ ਸਿੰਘਾ! ਸਰਕਾਰ ਦਾ ਦਸਤਾਵੇਜ਼ ਹੈ... ਸਵਰਗੀ ਸਰਦਾਰ ਹਰਜੀਤ ਸਿੰਘ ਜੀ ਦੇ ਨਾਮ ਤੇ।';
        }
      }

      return {
        ...line,
        adaptedText: displayedText,
        phoneticTransliteration: phonetic,
        culturalRationale: rationale,
        toneMarker: toneMarker,
      };
    });

    return {
      ...scene,
      adaptedScreenplayLines: adaptedDialogue,
    };
  });
}
