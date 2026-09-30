const fs = require('fs');
const path = require('path');

// 1. Script 2 Scenes (Dowry Trunk)
const DOWRY_SCENE_1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c1917"/>
      <stop offset="60%" stop-color="#292524"/>
      <stop offset="100%" stop-color="#0c0a09"/>
    </linearGradient>
    <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#ca8a04" stop-opacity="0.05"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bgGrad)"/>
  
  <!-- Iron Grate Windows & Sunbeam -->
  <rect x="180" y="80" width="160" height="120" fill="#fef08a" opacity="0.15"/>
  <line x1="220" y1="80" x2="220" y2="200" stroke="#000" stroke-width="6"/>
  <line x1="260" y1="80" x2="260" y2="200" stroke="#000" stroke-width="6"/>
  <line x1="300" y1="80" x2="300" y2="200" stroke="#000" stroke-width="6"/>
  <polygon points="180,200 480,720 180,720 100,500" fill="url(#beamGrad)"/>

  <!-- Stacked Brass Urns in Shadows -->
  <circle cx="980" cy="540" r="45" fill="#ca8a04" opacity="0.6"/>
  <circle cx="1040" cy="550" r="40" fill="#a16207" opacity="0.5"/>
  <circle cx="1000" cy="480" r="35" fill="#eab308" opacity="0.7"/>

  <!-- Massive Sheesham Wood Dowry Trunk -->
  <rect x="420" y="440" width="440" height="200" rx="8" fill="#451a03"/>
  <rect x="410" y="420" width="460" height="40" rx="5" fill="#78350f"/>
  <line x1="500" y1="420" x2="500" y2="640" stroke="#1c1917" stroke-width="12"/>
  <line x1="780" y1="420" x2="780" y2="640" stroke="#1c1917" stroke-width="12"/>
  
  <!-- Glowing Brass Latch & Padlock -->
  <circle cx="640" cy="460" r="22" fill="#facc15"/>
  <rect x="630" y="460" width="20" height="40" rx="4" fill="#eab308"/>
  <circle cx="640" cy="475" r="5" fill="#78350f"/>

  <!-- Silk Bridal Folds spilling from lid -->
  <path d="M 460 440 Q 520 480 500 530 Q 480 580 430 560 Z" fill="#991b1b" opacity="0.9"/>
  <path d="M 470 445 Q 510 475 490 520 Z" fill="#b91c1c"/>

  <!-- Caption overlay -->
  <text x="640" y="690" font-family="monospace" font-size="14" fill="#a1a1aa" text-anchor="middle">
    INT. ANCESTRAL STORE ROOM — THE SECRET APPOINTMENT LETTER INSIDE THE DOWRY TRUNK
  </text>
</svg>`;

const DOWRY_SCENE_2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
  <defs>
    <linearGradient id="mandapSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ea580c"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#mandapSky)"/>

  <!-- Red-Yellow Shamiana Canopy Waves -->
  <path d="M 0 0 L 1280 0 L 1280 160 Q 960 120 640 160 Q 320 120 0 160 Z" fill="#991b1b"/>
  <path d="M 0 160 Q 320 120 640 160 Q 960 120 1280 160 L 1280 180 Q 960 140 640 180 Q 320 140 0 180 Z" fill="#facc15"/>

  <!-- Marigold Garlands Hanging -->
  <g stroke="#f97316" stroke-width="8" stroke-dasharray="10,14">
    <line x1="160" y1="180" x2="160" y2="420"/>
    <line x1="380" y1="180" x2="380" y2="400"/>
    <line x1="900" y1="180" x2="900" y2="400"/>
    <line x1="1120" y1="180" x2="1120" y2="420"/>
  </g>

  <!-- Courtyard Floor -->
  <rect x="0" y="500" width="1280" height="220" fill="#78350f"/>

  <!-- Festive Hookah & Bolster Charpai (Elders Sitting) -->
  <rect x="820" y="520" width="380" height="50" rx="5" fill="#451a03"/>
  <ellipse cx="940" cy="510" rx="60" ry="25" fill="#fef08a" opacity="0.9"/>
  <!-- Hookah silhouette -->
  <circle cx="750" cy="560" r="28" fill="#1c1917"/>
  <line x1="750" y1="560" x2="750" y2="460" stroke="#1c1917" stroke-width="8"/>
  <ellipse cx="750" cy="460" rx="20" ry="8" fill="#ca8a04"/>

  <!-- Tractor Silhouette in Background (50 Tolas & Tractor Dowry) -->
  <rect x="80" y="440" width="220" height="100" rx="8" fill="#1e3a8a" opacity="0.85"/>
  <circle cx="130" cy="560" r="50" fill="#1c1917"/>
  <circle cx="260" cy="570" r="35" fill="#1c1917"/>
  <rect x="180" y="380" width="10" height="70" fill="#000"/>

  <!-- Confrontation Center: Bare-necked Meera vs Rajan -->
  <circle cx="640" cy="460" r="25" fill="#fef08a"/>
  <!-- Paper held high (Red Stamp promissory note) -->
  <rect x="660" y="410" width="45" height="60" fill="#fff" transform="rotate(-15 660 410)"/>
  <circle cx="682" cy="440" r="7" fill="#dc2626"/>

  <text x="640" y="690" font-family="monospace" font-size="14" fill="#fef08a" text-anchor="middle">
    EXT. WEDDING MANDAP — MEERA CONFRONTS THE CLAN PANCHAYAT WITH THE FORGED DEBT DEED
  </text>
</svg>`;

const DOWRY_SCENE_3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
  <defs>
    <linearGradient id="twilightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4c0519"/>
      <stop offset="50%" stop-color="#881337"/>
      <stop offset="100%" stop-color="#18181b"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#twilightGrad)"/>

  <!-- Stained Glass Haveli Archway -->
  <path d="M 280 720 L 280 320 Q 640 120 1000 320 L 1000 720 Z" fill="#27272a" opacity="0.4"/>
  <path d="M 320 720 L 320 340 Q 640 160 960 340 L 960 720 Z" fill="#991b1b" opacity="0.25"/>

  <!-- Open Dowry Trunk on Carpet with Scattered Silks -->
  <rect x="480" y="520" width="320" height="120" rx="6" fill="#451a03"/>
  <polygon points="460,520 820,520 850,420 430,420" fill="#78350f"/>
  <circle cx="640" cy="540" r="16" fill="#facc15"/>

  <!-- Climax Dramatic Silhouette: Vikram catching Rajan's descending arm -->
  <!-- Rajan (Left Patriarch) with raised arm -->
  <circle cx="480" cy="300" r="30" fill="#f97316"/>
  <rect x="440" y="330" width="80" height="220" rx="10" fill="#ea580c"/>
  <line x1="490" y1="360" x2="580" y2="280" stroke="#ea580c" stroke-width="26" stroke-linecap="round"/>

  <!-- Vikram (Center Interceptor) Gripping Rajan's Wrist -->
  <circle cx="640" cy="310" r="28" fill="#fde047"/>
  <rect x="600" y="340" width="80" height="240" rx="10" fill="#365314"/>
  <line x1="630" y1="370" x2="580" y2="280" stroke="#365314" stroke-width="24" stroke-linecap="round"/>
  <!-- Impact glow at wrist lock -->
  <circle cx="580" cy="280" r="18" fill="#fef08a" opacity="0.8"/>

  <!-- Meera (Right Heroine) holding high the State Medical Appointment Order -->
  <circle cx="820" cy="320" r="26" fill="#fbcfe8"/>
  <rect x="780" y="350" width="80" height="240" rx="10" fill="#991b1b"/>
  <!-- Extended Arm holding Gazette Document -->
  <line x1="820" y1="370" x2="880" y2="260" stroke="#991b1b" stroke-width="20" stroke-linecap="round"/>
  <!-- Glowing Document with Ashoka Lion Seal -->
  <rect x="860" y="210" width="60" height="85" fill="#f8fafc" stroke="#ca8a04" stroke-width="3" transform="rotate(8 860 210)"/>
  <circle cx="890" cy="245" r="12" fill="#2563eb"/>

  <text x="640" y="690" font-family="monospace" font-size="14" fill="#fbcfe8" text-anchor="middle">
    INT. INNER BAITHAK — VIKRAM BLOCKS RAJAN'S STRIKE AS DR. MEERA RECLAIMS HER DESTINY
  </text>
</svg>`;

// 2. Script 3 Scenes (The Drought Well)
const DROUGHT_SCENE_1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
  <defs>
    <linearGradient id="blindingSun" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="25%" stop-color="#fef08a"/>
      <stop offset="70%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#7c2d12"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#blindingSun)"/>

  <!-- Cracked Chalk Earth Horizon -->
  <rect x="0" y="440" width="1280" height="280" fill="#78350f"/>
  <path d="M 0 520 L 240 500 L 460 540 L 720 490 L 1020 530 L 1280 500 L 1280 720 L 0 720 Z" fill="#451a03"/>

  <!-- The Padlocked Borewell Iron Cage -->
  <rect x="480" y="260" width="320" height="260" fill="none" stroke="#000" stroke-width="12"/>
  <g stroke="#000" stroke-width="6">
    <line x1="520" y1="260" x2="520" y2="520"/>
    <line x1="560" y1="260" x2="560" y2="520"/>
    <line x1="600" y1="260" x2="600" y2="520"/>
    <line x1="640" y1="260" x2="640" y2="520"/>
    <line x1="680" y1="260" x2="680" y2="520"/>
    <line x1="720" y1="260" x2="720" y2="520"/>
    <line x1="760" y1="260" x2="760" y2="520"/>
  </g>

  <!-- Heavy Brass Padlock & Chain on Valve -->
  <circle cx="640" cy="380" r="32" fill="#ca8a04"/>
  <rect x="625" y="380" width="30" height="40" rx="4" fill="#a16207"/>
  <circle cx="640" cy="400" r="6" fill="#000"/>

  <!-- Balwant's Luxury SUV Under Dead Babool Tree -->
  <rect x="880" y="380" width="320" height="120" rx="16" fill="#09090b"/>
  <circle cx="940" cy="500" r="38" fill="#27272a"/>
  <circle cx="1120" cy="500" r="38" fill="#27272a"/>

  <!-- Stacked Empty Brass Lotas in Dust -->
  <circle cx="320" cy="560" r="26" fill="#eab308"/>
  <circle cx="370" cy="570" r="22" fill="#ca8a04"/>
  <circle cx="340" cy="530" r="20" fill="#facc15"/>

  <!-- 36-Inch Pipe Wrench on Ground -->
  <rect x="420" y="580" width="140" height="16" rx="4" fill="#ea580c" transform="rotate(-15 420 580)"/>
  <rect x="520" y="540" width="40" height="30" rx="5" fill="#3f3f46" transform="rotate(-15 420 580)"/>

  <text x="640" y="690" font-family="monospace" font-size="14" fill="#fef08a" text-anchor="middle">
    EXT. DRY COMMONS WELL — CHAUDHARY BALWANT CHAINS THE AQUIFER VALVE FOR PRIVATE TANKERS
  </text>
</svg>`;

const DROUGHT_SCENE_2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
  <defs>
    <linearGradient id="clinicGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#042f2e"/>
      <stop offset="50%" stop-color="#115e59"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#clinicGrad)"/>

  <!-- Fluorescent Light Fixture at Ceiling -->
  <rect x="440" y="30" width="400" height="18" fill="#fef08a" opacity="0.95"/>
  <polygon points="440,48 840,48 980,480 300,480" fill="#ffffff" opacity="0.08"/>

  <!-- Hospital Cots with Saline Stands -->
  <rect x="80" y="440" width="280" height="60" rx="4" fill="#334155"/>
  <line x1="160" y1="440" x2="160" y2="200" stroke="#94a3b8" stroke-width="4"/>
  <circle cx="160" cy="220" r="16" fill="#38bdf8" opacity="0.7"/>

  <rect x="920" y="440" width="280" height="60" rx="4" fill="#334155"/>
  <line x1="1020" y1="440" x2="1020" y2="200" stroke="#94a3b8" stroke-width="4"/>
  <circle cx="1020" cy="220" r="16" fill="#38bdf8" opacity="0.7"/>

  <!-- Center Stage: Dr. Ananya Holding Contaminated Water Vials before Dev -->
  <!-- Ananya in White Lab Coat -->
  <circle cx="520" cy="300" r="28" fill="#ccfbf1"/>
  <rect x="480" y="330" width="80" height="260" rx="8" fill="#f8fafc"/>
  <!-- Extended Hand with 3 Test Tubes -->
  <line x1="520" y1="360" x2="620" y2="340" stroke="#f8fafc" stroke-width="16" stroke-linecap="round"/>
  <!-- Glowing Test Tubes holding Murky Arsenic Water -->
  <rect x="620" y="310" width="12" height="60" rx="6" fill="#78350f" stroke="#38bdf8" stroke-width="2"/>
  <rect x="640" y="310" width="12" height="60" rx="6" fill="#78350f" stroke="#38bdf8" stroke-width="2"/>
  <rect x="660" y="310" width="12" height="60" rx="6" fill="#78350f" stroke="#38bdf8" stroke-width="2"/>

  <!-- Dev (Mechanic in Indigo Shirt with wrench in hand) -->
  <circle cx="760" cy="320" r="28" fill="#fdba74"/>
  <rect x="720" y="350" width="80" height="260" rx="8" fill="#1e3a8a"/>
  <!-- Red Gamchha around neck -->
  <path d="M 730 350 Q 760 380 790 350 Z" fill="#dc2626"/>
  <!-- Wrench tightly gripped at his hip -->
  <line x1="770" y1="420" x2="810" y2="560" stroke="#ea580c" stroke-width="14" stroke-linecap="round"/>

  <text x="640" y="690" font-family="monospace" font-size="14" fill="#ccfbf1" text-anchor="middle">
    INT. COMMUNITY CLINIC — DR. ANANYA REVEALS ARSENIC POISONING AND CHALLENGES DEV'S CONSCIENCE
  </text>
</svg>`;

const DROUGHT_SCENE_3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
  <defs>
    <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="waterTorrent" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#nightSky)"/>

  <!-- Monolithic Water Silo & Silver Moon -->
  <circle cx="1080" cy="120" r="45" fill="#f8fafc"/>
  <rect x="180" y="160" width="280" height="420" rx="10" fill="#1e293b" stroke="#334155" stroke-width="6"/>

  <!-- Stadium Floodlight Beams cutting through night -->
  <polygon points="1000,240 1050,240 700,600 500,600" fill="#ffffff" opacity="0.18"/>

  <!-- Broken Padlock Shackle on Sluice Lever -->
  <rect x="520" y="380" width="16" height="50" rx="4" fill="#eab308" transform="rotate(45 520 380)"/>
  <rect x="560" y="420" width="16" height="40" rx="4" fill="#ca8a04" transform="rotate(-30 560 420)"/>

  <!-- Roaring Torrent of Pressurized Cold Water Gushing Down Channel -->
  <path d="M 540 400 Q 560 440 600 500 Q 640 580 620 720 L 460 720 Q 480 600 500 500 Z" fill="url(#waterTorrent)"/>
  <ellipse cx="540" cy="680" rx="180" ry="40" fill="#38bdf8" opacity="0.8"/>

  <!-- Dev Heroic Stance Soaked in Torrents with Pipe Wrench on Shoulder -->
  <circle cx="540" cy="340" r="30" fill="#fed7aa"/>
  <rect x="500" y="370" width="80" height="230" rx="8" fill="#1e3a8a"/>
  <!-- 36-Inch Pipe Wrench held high across shoulder -->
  <line x1="490" y1="360" x2="630" y2="270" stroke="#ea580c" stroke-width="16" stroke-linecap="round"/>
  <rect x="620" y="250" width="40" height="30" rx="4" fill="#71717a" transform="rotate(30 620 250)"/>

  <!-- Balwant & Thugs Stepping Back in Defeat Background -->
  <circle cx="940" cy="420" r="22" fill="#f8fafc"/>
  <rect x="915" y="445" width="50" height="160" rx="6" fill="#f8fafc"/>
  <line x1="910" y1="480" x2="880" y2="580" stroke="#e2e8f0" stroke-width="6"/>

  <text x="640" y="690" font-family="monospace" font-size="14" fill="#38bdf8" text-anchor="middle">
    EXT. RESERVOIR AT MIDNIGHT — DEV SNAPS THE PADLOCK AND LIBERATES THE COMMONS WATER
  </text>
</svg>`;

// Write all scene keyframe files
const scenesDir = path.join(__dirname, '..', 'public', 'images', 'scenes');
fs.writeFileSync(path.join(scenesDir, 'scene_dowry_01.svg'), DOWRY_SCENE_1, 'utf8');
fs.writeFileSync(path.join(scenesDir, 'scene_dowry_02.svg'), DOWRY_SCENE_2, 'utf8');
fs.writeFileSync(path.join(scenesDir, 'scene_dowry_03.svg'), DOWRY_SCENE_3, 'utf8');

fs.writeFileSync(path.join(scenesDir, 'scene_drought_01.svg'), DROUGHT_SCENE_1, 'utf8');
fs.writeFileSync(path.join(scenesDir, 'scene_drought_02.svg'), DROUGHT_SCENE_2, 'utf8');
fs.writeFileSync(path.join(scenesDir, 'scene_drought_03.svg'), DROUGHT_SCENE_3, 'utf8');

console.log('✓ Successfully created 6 custom keyframe SVGs for Dowry Trunk and Drought Well!');
