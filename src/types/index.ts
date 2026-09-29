export type SettingType = 'rural' | 'semi-urban' | 'urban';

export type OutputScript = 'romanized' | 'gurmukhi' | 'devanagari' | 'original-script';

export interface CulturalProfile {
  id: string;
  name: string;
  dialect: string;
  state: string;
  subRegion: string;
  dominantTone: string;
  kinshipTerms: Record<string, string>; // e.g. "elder brother" -> "Bhau" or "Baisa"
  honorificRules: {
    elderGreeting: string;
    peerGreeting: string;
    respectSuffix: string;
    humorStyle: string;
    taboos: string[];
  };
  visualAesthetics: {
    architecturalStyle: string;
    interiors: string;
    colorPalette: string[];
    traditionalFabrics: string[];
    headwearAndJewelry: string;
    landscape: string;
    signatureProps: string[];
    cuisineAndHospitality: string;
  };
  audioCadence: {
    speechRhythm: string;
    vocalPitch: number;
    speechRate: number;
    phoneticMarkers: string[];
    pitchModulation: string;
  };
  adaptationGuidance: string;
}

export interface CanonicalCharacter {
  id: string; // e.g. "CHAR_AMAR"
  canonicalName: string;
  aliases: string[];
  originalName: string;
  gender: 'male' | 'female' | 'non-binary';
  age: number;
  socialRole: string; // e.g. "Eldest Son / Landless Farmer"
  personality: string;
  emotionalArc: string;
  dialectId: string;
  assignedCostumeIds: string[];
  visualSpec: {
    facialFeatures: string;
    grooming: string;
    bodyLanguage: string;
    apparentAge: string;
    lockedSeed: number;
    promptText: string;
    imageUrl?: string;
  };
}

export interface CanonicalCostume {
  id: string; // e.g. "COST_AMAR_01"
  characterId: string;
  name: string;
  variantNumber: number;
  garments: string; // e.g. "Handloom Khadi Kurta with embroidered border"
  fabrics: string; // e.g. "Coarse unbleached cotton"
  colors: string[];
  footwear: string;
  headwear: string;
  jewelry: string;
  grooming: string;
  scenesAppearing: string[]; // ['SC01', 'SC02']
  storyReasonForChange?: string;
  visualSpec: {
    promptText: string;
    lockedSeed: number;
    imageUrl?: string;
  };
}

export interface CanonicalProp {
  id: string; // e.g. "PROP_DEED_LETTER"
  name: string;
  description: string;
  culturalEquivalent: string; // e.g. "Stamped Patwari Bahi / Urdu stamp paper"
  currentHolderCharacterId?: string;
  scenesInvolved: string[];
}

export interface CanonicalLocation {
  id: string; // e.g. "LOC_COURTYARD"
  name: string;
  type: 'INT' | 'EXT';
  originalName: string;
  culturalSetting: string; // e.g. "Sunken brick Haveli aangan with neem shade"
  architectureDetails: string;
  lightingAndAtmosphere: string;
}

export interface ScriptDialogueLine {
  id: string;
  characterId: string;
  characterName: string;
  parenthetical?: string;
  originalText: string;
  adaptedText: string;
  phoneticTransliteration: string;
  toneMarker: string; // e.g. "Strained Reverence", "Biting Irony", "Affectionate Reprimand"
  culturalRationale: string; // Why this word / idiom / gesture was chosen
  gestureOrAction?: string;
}

export interface ExtractedScene {
  sceneId: string; // "SC01"
  sceneNumber: number;
  heading: string; // "EXT. COURTYARD - EARLY MORNING"
  intExt: 'INT' | 'EXT';
  locationId: string;
  timeOfDay: string;
  weatherAndAtmosphere: string;
  mood: string;
  dramaticPurpose: string;
  charactersPresent: string[]; // character IDs
  costumesActive: Record<string, string>; // charId -> costumeId
  propsIn: string[]; // props brought into scene
  propsOut: string[]; // props taken away
  propsCreatedOrConsumed: string[];
  emotionalChange: string;
  stateTransitions: {
    characterId: string;
    beforeState: string;
    afterState: string;
    injuryOrStatus?: string;
  }[];
  originalScreenplaySnippet: string;
  adaptedScreenplayLines: ScriptDialogueLine[];
  stageDirections: {
    original: string;
    adapted: string;
    culturalDetails: string;
  }[];
  keyframeSpec: {
    cameraFraming: string;
    characterBlocking: string;
    lightingTime: string;
    culturalAtmosphere: string;
    promptText: string;
    lockedSeed: number;
    imageUrl?: string;
  };
  continuityWarnings: ContinuityContradiction[];
}

export interface ContinuityContradiction {
  id: string;
  severity: 'high' | 'medium' | 'low';
  category: 'prop_disappearance' | 'unearned_costume_change' | 'alias_duplication' | 'emotional_whiplash' | 'cultural_anachronism';
  sceneId: string;
  description: string;
  entitiesInvolved: string[];
  suggestedFix: string;
  isResolved: boolean;
}

export interface ScreenplayProject {
  id: string;
  title: string;
  sourceScreenplayText: string;
  selectedCultureId: string;
  selectedSetting: SettingType;
  outputScript: OutputScript;
  scenes: ExtractedScene[];
  characters: CanonicalCharacter[];
  costumes: CanonicalCostume[];
  props: CanonicalProp[];
  locations: CanonicalLocation[];
  approvalStatus: {
    entitiesApproved: boolean;
    culturalPlanApproved: boolean;
    costumesApproved: boolean;
    visualGenerationUnlocked: boolean;
  };
  contradictions: ContinuityContradiction[];
  createdAt: string;
  updatedAt: string;
}
