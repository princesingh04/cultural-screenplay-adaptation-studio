const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const scenesDir = path.join(__dirname, '..', 'public', 'images', 'scenes');
const charDir = path.join(__dirname, '..', 'public', 'images', 'characters');

if (!fs.existsSync(scenesDir)) {
  fs.mkdirSync(scenesDir, { recursive: true });
}

// Convert image file to base64 data URI
function getBase64Image(filePath) {
  const ext = path.extname(filePath).slice(1);
  const mime = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg';
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${data}`;
}

async function createCinematicScenes() {
  console.log('Generating cinematic 16:9 scene stills using real AI character portraits...');

  const meeraBase64 = getBase64Image(path.join(charDir, 'meera.jpg'));
  const vikramBase64 = getBase64Image(path.join(charDir, 'vikram.jpg'));
  const rajanBase64 = getBase64Image(path.join(charDir, 'rajan.jpg'));

  const amarBase64 = getBase64Image(path.join(charDir, 'amar.webp'));
  const motherBase64 = getBase64Image(path.join(charDir, 'mother.webp'));
  const kabirBase64 = getBase64Image(path.join(charDir, 'kabir.webp'));

  // -------------------------------------------------------------
  // DOWRY TRUNK - SCENE 1: INT. ANCESTRAL STORE ROOM - MORNING
  // -------------------------------------------------------------
  const dowryScene1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
    <defs>
      <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#181310"/>
        <stop offset="50%" stop-color="#2a1f18"/>
        <stop offset="100%" stop-color="#0e0a08"/>
      </linearGradient>
      <linearGradient id="sunbeam" x1="0%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color="#fef08a" stop-opacity="0.55"/>
        <stop offset="40%" stop-color="#f59e0b" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#78350f" stop-opacity="0"/>
      </linearGradient>
      <clipPath id="clipMeera">
        <rect x="180" y="160" width="340" height="460" rx="16"/>
      </clipPath>
      <clipPath id="clipVikram">
        <rect x="760" y="140" width="340" height="460" rx="16"/>
      </clipPath>
      <filter id="cinematicGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    <!-- Background: Deep Chiaroscuro Storeroom -->
    <rect width="1280" height="720" fill="url(#bgGrad1)"/>

    <!-- High Iron-Barred Window with Morning Sunbeam -->
    <rect x="80" y="40" width="180" height="120" fill="#fef08a" opacity="0.3"/>
    <line x1="120" y1="40" x2="120" y2="160" stroke="#000" stroke-width="8"/>
    <line x1="160" y1="40" x2="160" y2="160" stroke="#000" stroke-width="8"/>
    <line x1="200" y1="40" x2="200" y2="160" stroke="#000" stroke-width="8"/>
    <polygon points="80,160 620,720 180,720 40,460" fill="url(#sunbeam)"/>

    <!-- Sheesham Wooden Floor with Shadows -->
    <rect x="0" y="560" width="1280" height="160" fill="#1c110a"/>

    <!-- Massive Antique Brass-Bound Dowry Trunk (Center Foreground) -->
    <rect x="420" y="460" width="440" height="180" rx="10" fill="#451a03" stroke="#b45309" stroke-width="4"/>
    <rect x="410" y="440" width="460" height="35" rx="6" fill="#78350f" stroke="#ca8a04" stroke-width="3"/>
    <rect x="490" y="440" width="16" height="200" fill="#291307"/>
    <rect x="774" y="440" width="16" height="200" fill="#291307"/>
    <!-- Glowing Brass Padlock & Secret Compartment -->
    <circle cx="640" cy="475" r="22" fill="#facc15" filter="url(#cinematicGlow)"/>
    <rect x="632" y="475" width="16" height="36" rx="4" fill="#eab308"/>
    <circle cx="640" cy="490" r="5" fill="#451a03"/>
    <!-- Rich Bridal Red Dupatta drape -->
    <path d="M 450 460 C 510 500, 480 570, 420 590 Z" fill="#991b1b" opacity="0.95"/>
    <path d="M 460 465 C 500 495, 475 550, 430 570 Z" fill="#dc2626" opacity="0.8"/>

    <!-- CHARACTER 1: MEERA (Kneeling Defiant by Dowry Trunk) -->
    <g transform="translate(0, 0)">
      <!-- Frame & Ambient Shadow -->
      <rect x="175" y="155" width="350" height="470" rx="18" fill="#000" opacity="0.6"/>
      <image href="${meeraBase64}" x="180" y="160" width="340" height="460" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipMeera)"/>
      <!-- Soft vignette on portrait -->
      <rect x="180" y="160" width="340" height="460" rx="16" fill="url(#sunbeam)" opacity="0.3" pointer-events="none"/>
      <!-- Badge -->
      <rect x="195" y="580" width="160" height="28" rx="6" fill="#000000" opacity="0.85"/>
      <text x="275" y="598" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#fef08a" text-anchor="middle">MEERA (Bride)</text>
    </g>

    <!-- CHARACTER 2: VIKRAM (Holding Open Jewelry Box in moral hesitation) -->
    <g transform="translate(0, 0)">
      <!-- Frame & Ambient Shadow -->
      <rect x="755" y="135" width="350" height="470" rx="18" fill="#000" opacity="0.6"/>
      <image href="${vikramBase64}" x="760" y="140" width="340" height="460" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipVikram)"/>
      <rect x="760" y="140" width="340" height="460" rx="16" fill="#000" opacity="0.15" pointer-events="none"/>
      <!-- Badge -->
      <rect x="775" y="560" width="170" height="28" rx="6" fill="#000000" opacity="0.85"/>
      <text x="860" y="578" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#86efac" text-anchor="middle">VIKRAM (Brother)</text>
    </g>

    <!-- Cinematic 35mm Letterbox Banner -->
    <rect x="0" y="0" width="1280" height="32" fill="#0a0a0a"/>
    <rect x="0" y="688" width="1280" height="32" fill="#0a0a0a"/>
    <text x="640" y="708" font-family="monospace" font-size="13" fill="#fbbf24" letter-spacing="1" text-anchor="middle">
      SC01 • INT. ANCESTRAL STORE ROOM — MEERA SAFEGUARDS THE APPOINTMENT LETTER IN THE DOWRY TRUNK
    </text>
  </svg>`;

  // -------------------------------------------------------------
  // DOWRY TRUNK - SCENE 2: EXT. WEDDING MANDAP & COURTYARD - AFTERNOON
  // -------------------------------------------------------------
  const dowryScene2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
    <defs>
      <linearGradient id="skyGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#b45309"/>
        <stop offset="40%" stop-color="#d97706"/>
        <stop offset="80%" stop-color="#fde047"/>
      </linearGradient>
      <clipPath id="clipRajan2">
        <rect x="850" y="130" width="330" height="450" rx="16"/>
      </clipPath>
      <clipPath id="clipMeera2">
        <rect x="475" y="150" width="330" height="450" rx="16"/>
      </clipPath>
      <clipPath id="clipVikram2">
        <rect x="100" y="160" width="310" height="430" rx="16"/>
      </clipPath>
    </defs>

    <!-- Background: Sunlit Haryana Wedding Courtyard -->
    <rect width="1280" height="720" fill="url(#skyGrad2)"/>

    <!-- Marigold Shamiana Awning Waves -->
    <path d="M 0 0 L 1280 0 L 1280 130 Q 960 90 640 130 Q 320 90 0 130 Z" fill="#991b1b"/>
    <path d="M 0 130 Q 320 90 640 130 Q 960 90 1280 130 L 1280 150 Q 960 110 640 150 Q 320 110 0 150 Z" fill="#facc15"/>

    <!-- Hanging Marigold Garlands -->
    <g stroke="#f97316" stroke-width="7" stroke-dasharray="8,12">
      <line x1="80" y1="150" x2="80" y2="440"/>
      <line x1="430" y1="150" x2="430" y2="400"/>
      <line x1="820" y1="150" x2="820" y2="400"/>
      <line x1="1200" y1="150" x2="1200" y2="440"/>
    </g>

    <!-- Courtyard Ground & Blue Tractor Silhouette (Dowry Pride) -->
    <rect x="0" y="560" width="1280" height="160" fill="#78350f"/>
    <rect x="40" y="470" width="180" height="90" rx="8" fill="#1e3a8a" opacity="0.7"/>
    <circle cx="80" cy="560" r="40" fill="#1c1917"/>
    <circle cx="180" cy="560" r="28" fill="#1c1917"/>

    <!-- CHARACTER 1: VIKRAM (Left - Conflicted Brother) -->
    <g>
      <rect x="95" y="155" width="320" height="440" rx="18" fill="#000" opacity="0.6"/>
      <image href="${vikramBase64}" x="100" y="160" width="310" height="430" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipVikram2)"/>
      <rect x="115" y="555" width="160" height="26" rx="5" fill="#000000" opacity="0.85"/>
      <text x="195" y="572" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#86efac" text-anchor="middle">VIKRAM</text>
    </g>

    <!-- CHARACTER 2: MEERA (Center - Bare-Necked, Resolute, Exposing Debt Deed) -->
    <g>
      <rect x="470" y="145" width="340" height="460" rx="18" fill="#000" opacity="0.7"/>
      <image href="${meeraBase64}" x="475" y="150" width="330" height="450" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipMeera2)"/>
      <!-- Held High: Promissory Note / Debt Deed with Red Seal -->
      <g transform="translate(680, 240) rotate(-12)">
        <rect width="90" height="120" rx="4" fill="#fefce8" stroke="#ca8a04" stroke-width="2"/>
        <line x1="15" y1="25" x2="75" y2="25" stroke="#78350f" stroke-width="2"/>
        <line x1="15" y1="45" x2="75" y2="45" stroke="#78350f" stroke-width="2"/>
        <line x1="15" y1="65" x2="60" y2="65" stroke="#78350f" stroke-width="2"/>
        <circle cx="50" cy="90" r="14" fill="#dc2626"/>
        <text x="50" y="94" font-size="9" font-family="sans-serif" fill="#fff" text-anchor="middle">DEED</text>
      </g>
      <rect x="495" y="565" width="220" height="28" rx="6" fill="#000000" opacity="0.9"/>
      <text x="605" y="583" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#fef08a" text-anchor="middle">MEERA (Bare-Necked Confrontation)</text>
    </g>

    <!-- CHARACTER 3: CHAUDHARY RAJAN (Right - Boasting Feudal Headman) -->
    <g>
      <rect x="845" y="125" width="340" height="460" rx="18" fill="#000" opacity="0.6"/>
      <image href="${rajanBase64}" x="850" y="130" width="330" height="450" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipRajan2)"/>
      <!-- Tractor Keys in Hand -->
      <rect x="865" y="545" width="210" height="28" rx="6" fill="#000000" opacity="0.9"/>
      <text x="970" y="563" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#fdba74" text-anchor="middle">CHAUDHARY RAJAN (Patriarch)</text>
    </g>

    <!-- Cinematic 35mm Letterbox Banner -->
    <rect x="0" y="0" width="1280" height="32" fill="#0a0a0a"/>
    <rect x="0" y="688" width="1280" height="32" fill="#0a0a0a"/>
    <text x="640" y="708" font-family="monospace" font-size="13" fill="#fbbf24" letter-spacing="1" text-anchor="middle">
      SC02 • EXT. WEDDING MANDAP — MEERA CONFRONTS RAJAN IN THE PANCHAYAT WITH THE FORGED DEBT DEED
    </text>
  </svg>`;

  // -------------------------------------------------------------
  // DOWRY TRUNK - SCENE 3: INT. INNER CEREMONIAL BAITHAK - SUNSET
  // -------------------------------------------------------------
  const dowryScene3Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
    <defs>
      <linearGradient id="sunsetGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#450a0a"/>
        <stop offset="40%" stop-color="#7c2d12"/>
        <stop offset="80%" stop-color="#1c1917"/>
      </linearGradient>
      <linearGradient id="warmLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fed7aa" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#ea580c" stop-opacity="0"/>
      </linearGradient>
      <clipPath id="clipMeera3">
        <rect x="140" y="140" width="330" height="450" rx="16"/>
      </clipPath>
      <clipPath id="clipVikram3">
        <rect x="495" y="160" width="290" height="430" rx="16"/>
      </clipPath>
      <clipPath id="clipRajan3">
        <rect x="810" y="140" width="330" height="450" rx="16"/>
      </clipPath>
    </defs>

    <!-- Background: Amber Haveli Baithak Architecture -->
    <rect width="1280" height="720" fill="url(#sunsetGrad3)"/>

    <!-- Carved Architectural Arches -->
    <path d="M 60 720 L 60 300 Q 240 160 420 300 L 420 720 Z" fill="#271109" opacity="0.6"/>
    <path d="M 860 720 L 860 300 Q 1040 160 1220 300 L 1220 720 Z" fill="#271109" opacity="0.6"/>

    <!-- Heavy Sheesham Council Desk across Foreground -->
    <rect x="0" y="570" width="1280" height="150" fill="#2d1810"/>
    <rect x="0" y="555" width="1280" height="25" fill="#4a2511"/>

    <!-- Glowing Brass Lantern on Desk -->
    <ellipse cx="640" cy="540" rx="40" ry="15" fill="#f59e0b" opacity="0.4"/>
    <circle cx="640" cy="510" r="24" fill="#fbbf24" opacity="0.9"/>
    <circle cx="640" cy="510" r="14" fill="#fef08a"/>

    <!-- Burning Debt Paper in Brass Bowl -->
    <ellipse cx="730" cy="550" rx="35" ry="12" fill="#78350f"/>
    <path d="M 720 545 Q 730 515 735 530 Q 745 510 740 545 Z" fill="#f97316"/>
    <path d="M 725 545 Q 732 525 735 545 Z" fill="#fef08a"/>

    <!-- CHARACTER 1: MEERA (Triumphant, Holding Appointment Letter) -->
    <g>
      <rect x="135" y="135" width="340" height="460" rx="18" fill="#000" opacity="0.6"/>
      <image href="${meeraBase64}" x="140" y="140" width="330" height="450" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipMeera3)"/>
      <!-- Sealed Appointment Order folder -->
      <rect x="160" y="555" width="220" height="28" rx="6" fill="#000000" opacity="0.9"/>
      <text x="270" y="573" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#fef08a" text-anchor="middle">MEERA (Civil Servant)</text>
    </g>

    <!-- CHARACTER 2: VIKRAM (Loyal Brother) -->
    <g>
      <rect x="490" y="155" width="300" height="440" rx="18" fill="#000" opacity="0.6"/>
      <image href="${vikramBase64}" x="495" y="160" width="290" height="430" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipVikram3)"/>
      <rect x="510" y="555" width="140" height="26" rx="5" fill="#000000" opacity="0.85"/>
      <text x="580" y="572" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#86efac" text-anchor="middle">VIKRAM</text>
    </g>

    <!-- CHARACTER 3: CHAUDHARY RAJAN (Conceded Patriarch at Desk) -->
    <g>
      <rect x="805" y="135" width="340" height="460" rx="18" fill="#000" opacity="0.6"/>
      <image href="${rajanBase64}" x="810" y="140" width="330" height="450" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipRajan3)"/>
      <rect x="830" y="555" width="240" height="28" rx="6" fill="#000000" opacity="0.9"/>
      <text x="950" y="573" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#fdba74" text-anchor="middle">CHAUDHARY RAJAN (Burning Deed)</text>
    </g>

    <!-- Cinematic 35mm Letterbox Banner -->
    <rect x="0" y="0" width="1280" height="32" fill="#0a0a0a"/>
    <rect x="0" y="688" width="1280" height="32" fill="#0a0a0a"/>
    <text x="640" y="708" font-family="monospace" font-size="13" fill="#fbbf24" letter-spacing="1" text-anchor="middle">
      SC03 • INT. INNER CEREMONIAL BAITHAK — THE FORGED DEED IS DESTROYED IN THE EMBERS
    </text>
  </svg>`;

  // -------------------------------------------------------------
  // ANCESTRAL DEED - SCENE 1: EXT. ANCESTRAL COURTYARD - MORNING
  // -------------------------------------------------------------
  const ancestralScene1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
    <defs>
      <linearGradient id="ancSky1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="50%" stop-color="#475569"/>
        <stop offset="100%" stop-color="#94a3b8"/>
      </linearGradient>
      <clipPath id="clipAmar1">
        <rect x="140" y="140" width="330" height="450" rx="16"/>
      </clipPath>
      <clipPath id="clipMother1">
        <rect x="495" y="140" width="330" height="450" rx="16"/>
      </clipPath>
      <clipPath id="clipKabir1">
        <rect x="850" y="150" width="310" height="440" rx="16"/>
      </clipPath>
    </defs>

    <rect width="1280" height="720" fill="url(#ancSky1)"/>

    <!-- Neem Tree Foliage & Courtyard Brick Wall -->
    <ellipse cx="640" cy="40" rx="600" ry="120" fill="#14532d" opacity="0.6"/>
    <rect x="0" y="560" width="1280" height="160" fill="#451a03"/>

    <!-- CHARACTER 1: AMAR (Holding Legal Notice) -->
    <g>
      <rect x="135" y="135" width="340" height="460" rx="18" fill="#000" opacity="0.6"/>
      <image href="${amarBase64}" x="140" y="140" width="330" height="450" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipAmar1)"/>
      <rect x="160" y="555" width="180" height="28" rx="6" fill="#000000" opacity="0.9"/>
      <text x="250" y="573" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#93c5fd" text-anchor="middle">AMAR (Elder Son)</text>
    </g>

    <!-- CHARACTER 2: BEBE / MOTHER (Anxious Matriarch) -->
    <g>
      <rect x="490" y="135" width="340" height="460" rx="18" fill="#000" opacity="0.6"/>
      <image href="${motherBase64}" x="495" y="140" width="330" height="450" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipMother1)"/>
      <rect x="520" y="555" width="180" height="28" rx="6" fill="#000000" opacity="0.9"/>
      <text x="610" y="573" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#fbcfe8" text-anchor="middle">BEBE (Mother)</text>
    </g>

    <!-- CHARACTER 3: KABIR (Younger Brother, Defensive) -->
    <g>
      <rect x="845" y="145" width="320" height="450" rx="18" fill="#000" opacity="0.6"/>
      <image href="${kabirBase64}" x="850" y="150" width="310" height="440" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipKabir1)"/>
      <rect x="870" y="555" width="180" height="28" rx="6" fill="#000000" opacity="0.9"/>
      <text x="960" y="573" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#fed7aa" text-anchor="middle">KABIR (Younger Son)</text>
    </g>

    <!-- Letterbox -->
    <rect x="0" y="0" width="1280" height="32" fill="#0a0a0a"/>
    <rect x="0" y="688" width="1280" height="32" fill="#0a0a0a"/>
    <text x="640" y="708" font-family="monospace" font-size="13" fill="#fbbf24" letter-spacing="1" text-anchor="middle">
      SC01 • EXT. ANCESTRAL COURTYARD — AMAR RECEIVES THE ANCESTRAL DEED FROM THE POSTMAN
    </text>
  </svg>`;

  // -------------------------------------------------------------
  // ANCESTRAL DEED - SCENE 2: INT. HEARTH & KITCHEN - NOON
  // -------------------------------------------------------------
  const ancestralScene2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
    <defs>
      <linearGradient id="ancSky2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#451a03"/>
        <stop offset="50%" stop-color="#78350f"/>
        <stop offset="100%" stop-color="#1c1917"/>
      </linearGradient>
      <clipPath id="clipMother2">
        <rect x="140" y="140" width="330" height="450" rx="16"/>
      </clipPath>
      <clipPath id="clipAmar2">
        <rect x="495" y="140" width="330" height="450" rx="16"/>
      </clipPath>
      <clipPath id="clipKabir2">
        <rect x="850" y="150" width="310" height="440" rx="16"/>
      </clipPath>
    </defs>

    <rect width="1280" height="720" fill="url(#ancSky2)"/>

    <!-- Traditional Earthen Hearth / Chulha -->
    <ellipse cx="640" cy="580" rx="200" ry="40" fill="#291307"/>
    <path d="M 610 570 Q 640 520 670 570 Z" fill="#ea580c"/>

    <!-- Characters -->
    <g>
      <rect x="135" y="135" width="340" height="460" rx="18" fill="#000" opacity="0.6"/>
      <image href="${motherBase64}" x="140" y="140" width="330" height="450" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipMother2)"/>
      <rect x="160" y="555" width="180" height="28" rx="6" fill="#000000" opacity="0.9"/>
      <text x="250" y="573" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#fbcfe8" text-anchor="middle">BEBE (At Chulha)</text>
    </g>

    <g>
      <rect x="490" y="135" width="340" height="460" rx="18" fill="#000" opacity="0.6"/>
      <image href="${amarBase64}" x="495" y="140" width="330" height="450" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipAmar2)"/>
      <rect x="520" y="555" width="180" height="28" rx="6" fill="#000000" opacity="0.9"/>
      <text x="610" y="573" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#93c5fd" text-anchor="middle">AMAR (Explaining Terms)</text>
    </g>

    <g>
      <rect x="845" y="145" width="320" height="450" rx="18" fill="#000" opacity="0.6"/>
      <image href="${kabirBase64}" x="850" y="150" width="310" height="440" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipKabir2)"/>
      <rect x="870" y="555" width="180" height="28" rx="6" fill="#000000" opacity="0.9"/>
      <text x="960" y="573" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#fed7aa" text-anchor="middle">KABIR (Resisting Sale)</text>
    </g>

    <!-- Letterbox -->
    <rect x="0" y="0" width="1280" height="32" fill="#0a0a0a"/>
    <rect x="0" y="688" width="1280" height="32" fill="#0a0a0a"/>
    <text x="640" y="708" font-family="monospace" font-size="13" fill="#fbbf24" letter-spacing="1" text-anchor="middle">
      SC02 • INT. HEARTH &amp; KITCHEN — BEBE KNEADS DOUGH AS THE BROTHERS DEBATE THE LAND PARTITION
    </text>
  </svg>`;

  // -------------------------------------------------------------
  // ANCESTRAL DEED - SCENE 3: EXT. CANAL EMBANKMENT - SUNSET
  // -------------------------------------------------------------
  const ancestralScene3Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
    <defs>
      <linearGradient id="ancSky3" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#b45309"/>
        <stop offset="40%" stop-color="#ea580c"/>
        <stop offset="80%" stop-color="#fef08a"/>
      </linearGradient>
      <clipPath id="clipAmar3">
        <rect x="140" y="140" width="330" height="450" rx="16"/>
      </clipPath>
      <clipPath id="clipKabir3">
        <rect x="495" y="140" width="330" height="450" rx="16"/>
      </clipPath>
      <clipPath id="clipMother3">
        <rect x="850" y="140" width="330" height="450" rx="16"/>
      </clipPath>
    </defs>

    <rect width="1280" height="720" fill="url(#ancSky3)"/>

    <!-- Green Punjab Wheat Fields & Running Canal Water -->
    <rect x="0" y="540" width="1280" height="180" fill="#15803d"/>
    <path d="M 0 620 Q 640 590 1280 620 L 1280 720 L 0 720 Z" fill="#0284c7" opacity="0.8"/>

    <!-- Characters Reunited at Sunset -->
    <g>
      <rect x="135" y="135" width="340" height="460" rx="18" fill="#000" opacity="0.6"/>
      <image href="${amarBase64}" x="140" y="140" width="330" height="450" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipAmar3)"/>
      <rect x="160" y="555" width="180" height="28" rx="6" fill="#000000" opacity="0.9"/>
      <text x="250" y="573" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#93c5fd" text-anchor="middle">AMAR</text>
    </g>

    <g>
      <rect x="490" y="135" width="340" height="460" rx="18" fill="#000" opacity="0.6"/>
      <image href="${kabirBase64}" x="495" y="140" width="330" height="450" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipKabir3)"/>
      <rect x="520" y="555" width="180" height="28" rx="6" fill="#000000" opacity="0.9"/>
      <text x="610" y="573" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#fed7aa" text-anchor="middle">KABIR</text>
    </g>

    <g>
      <rect x="845" y="135" width="340" height="460" rx="18" fill="#000" opacity="0.6"/>
      <image href="${motherBase64}" x="850" y="140" width="330" height="450" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipMother3)"/>
      <rect x="870" y="555" width="180" height="28" rx="6" fill="#000000" opacity="0.9"/>
      <text x="960" y="573" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#fbcfe8" text-anchor="middle">BEBE</text>
    </g>

    <!-- Letterbox -->
    <rect x="0" y="0" width="1280" height="32" fill="#0a0a0a"/>
    <rect x="0" y="688" width="1280" height="32" fill="#0a0a0a"/>
    <text x="640" y="708" font-family="monospace" font-size="13" fill="#fbbf24" letter-spacing="1" text-anchor="middle">
      SC03 • EXT. CANAL EMBANKMENT — RECONCILIATION OVER THE SACRED ANCESTRAL ACRES AT SUNSET
    </text>
  </svg>`;

  // Write SVGs
  fs.writeFileSync(path.join(scenesDir, 'scene_dowry_01.svg'), dowryScene1Svg, 'utf8');
  fs.writeFileSync(path.join(scenesDir, 'scene_dowry_02.svg'), dowryScene2Svg, 'utf8');
  fs.writeFileSync(path.join(scenesDir, 'scene_dowry_03.svg'), dowryScene3Svg, 'utf8');

  fs.writeFileSync(path.join(scenesDir, 'scene_01.svg'), ancestralScene1Svg, 'utf8');
  fs.writeFileSync(path.join(scenesDir, 'scene_02.svg'), ancestralScene2Svg, 'utf8');
  fs.writeFileSync(path.join(scenesDir, 'scene_03.svg'), ancestralScene3Svg, 'utf8');

  // Convert SVGs to High-Res 1280x720 JPGs as well using Sharp!
  await sharp(Buffer.from(dowryScene1Svg)).jpeg({ quality: 92 }).toFile(path.join(scenesDir, 'scene_dowry_01.jpg'));
  await sharp(Buffer.from(dowryScene2Svg)).jpeg({ quality: 92 }).toFile(path.join(scenesDir, 'scene_dowry_02.jpg'));
  await sharp(Buffer.from(dowryScene3Svg)).jpeg({ quality: 92 }).toFile(path.join(scenesDir, 'scene_dowry_03.jpg'));

  await sharp(Buffer.from(ancestralScene1Svg)).jpeg({ quality: 92 }).toFile(path.join(scenesDir, 'scene_01.jpg'));
  await sharp(Buffer.from(ancestralScene2Svg)).jpeg({ quality: 92 }).toFile(path.join(scenesDir, 'scene_02.jpg'));
  await sharp(Buffer.from(ancestralScene3Svg)).jpeg({ quality: 92 }).toFile(path.join(scenesDir, 'scene_03.jpg'));

  console.log('✅ Successfully generated cinematic scene keyframes (SVG & JPG) with AI characters embedded!');
}

createCinematicScenes().catch(err => {
  console.error('Failed to create cinematic scenes:', err);
  process.exit(1);
});
