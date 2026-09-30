import { ScreenplayProject, SettingType, OutputScript } from '@/types';
import { getAncestralDeedProject } from '@/data/screenplayProjects/ancestralDeed';
import { getDowryTrunkProject } from '@/data/screenplayProjects/dowryTrunk';
import { getDroughtWellProject } from '@/data/screenplayProjects/droughtWell';
import { getHeirloomLedgerProject } from '@/data/screenplayProjects/heirloomLedger';

export function extractScreenplayToProject(
  rawText: string,
  title: string = 'Culturally Adapted Screenplay',
  cultureId: string = 'majhi_punjab',
  setting: SettingType = 'rural',
  outputScript: OutputScript = 'romanized'
): ScreenplayProject {
  const lowerText = (rawText || '').toLowerCase();
  const lowerTitle = (title || '').toLowerCase();

  // 1. Script 4: The Heirloom Ledger (Baldev, Simran, Munshi Ram, Kiln, Pottery)
  if (
    lowerText.includes('baldev') ||
    lowerText.includes('simran') ||
    lowerText.includes('heirloom') ||
    lowerText.includes('potter') ||
    lowerText.includes('kiln') ||
    lowerTitle.includes('heirloom') ||
    lowerTitle.includes('ledger')
  ) {
    return getHeirloomLedgerProject(rawText, cultureId, setting, outputScript);
  }

  // 2. Script 2: The Stolen Dowry Trunk (Meera, Vikram, Rajan, dowry, trunk)
  if (
    lowerText.includes('dowry') ||
    lowerText.includes('meera') ||
    lowerText.includes('uncle rajan') ||
    lowerText.includes('lehenga') ||
    lowerTitle.includes('dowry') ||
    lowerTitle.includes('runaway')
  ) {
    const targetCulture = cultureId === 'majhi_punjab' ? 'haryanvi' : cultureId;
    return getDowryTrunkProject(rawText, targetCulture, setting, outputScript);
  }

  // 3. Script 3: The Drought Well (Dev, Balwant, Chaudhary, Ananya, borewell, aquifer)
  if (
    lowerText.includes('balwant') ||
    lowerText.includes('chaudhary') ||
    lowerText.includes('drought') ||
    lowerText.includes('aquifer') ||
    lowerText.includes('ananya') ||
    lowerText.includes('wrench') ||
    lowerTitle.includes('drought') ||
    lowerTitle.includes('well')
  ) {
    const targetCulture = cultureId === 'majhi_punjab' ? 'bhojpuri_bihar' : cultureId;
    return getDroughtWellProject(rawText, targetCulture, setting, outputScript);
  }

  // 4. Script 1: The Ancestral Deed (Amar, Kabir, Mother, Harjit, etc.)
  return getAncestralDeedProject(rawText, cultureId, setting, outputScript);
}
